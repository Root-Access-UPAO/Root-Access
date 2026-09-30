export interface InscripcionPayload {
  nombreUsuario: string;
  carrera: string;
  idEstudiante: string;
  correo: string;
  asistenciaJornada: 'AMBOS_DIAS' | 'SOLO_DIA_1' | 'SOLO_DIA_2';
  equipoDia2: 'MI_LAPTOP' | 'SIN_LAPTOP' | 'NO_IRE';
  sitioWeb?: string; // honeypot
}

export interface ErrorValidacion {
  [campo: string]: string;
}

export interface InscripcionResponse {
  success: boolean;
  nombreUsuario?: string;
  mensaje?: string;
  error?: string;
  validationErrors?: ErrorValidacion;
}

export async function enviarInscripcion(payload: InscripcionPayload, signal?: AbortSignal): Promise<InscripcionResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Modo demo (sin backend)
  if (!apiUrl) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (payload.correo === '409@demo.com') {
          resolve({ success: false, error: "Ya existe una inscripción con estos datos" });
        }
        else if (payload.correo === '400@demo.com') {
          resolve({ success: false, validationErrors: { correo: "El formato del correo es inválido", idEstudiante: "El ID de estudiante debe tener exactamente 9 dígitos" } });
        }
        else if (payload.correo === '500@demo.com') {
          resolve({ success: false, error: "No se pudo conectar con el servidor, intenta de nuevo" });
        }
        else {
          resolve({ success: true, nombreUsuario: payload.nombreUsuario, mensaje: "Inscripción realizada con éxito" });
        }
      }, 1200);
    });
  }

  try {
    const response = await fetch(`${apiUrl}/inscripciones`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal,
    });

    const data = await response.json();

    if (response.status === 201) {
      return { success: true, nombreUsuario: data.nombreUsuario, mensaje: data.mensaje };
    }

    if (response.status === 409) {
      return { success: false, error: data.error || "Ya existe una inscripción con estos datos" };
    }

    if (response.status === 400 && data.detalles) {
      // El backend devuelve { error: "...", detalles: ["campo: mensaje", ...] }
      // Parseamos a un mapa campo → mensaje para marcar cada campo en el form
      const validationErrors: ErrorValidacion = {};
      for (const detalle of data.detalles) {
        const idx = detalle.indexOf(': ');
        if (idx !== -1) {
          const campo = detalle.substring(0, idx);
          const msg = detalle.substring(idx + 2);
          validationErrors[campo] = msg;
        }
      }
      return { success: false, error: data.error, validationErrors };
    }

    if (response.status === 400) {
      return { success: false, error: data.error || "Datos inválidos" };
    }

    // Cualquier otro error (413, 415, 500, etc.)
    return { success: false, error: "No se pudo completar la inscripción, intenta de nuevo" };
  } catch {
    return { success: false, error: "No se pudo conectar con el servidor, intenta de nuevo" };
  }
}
