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

  // Modo demo (sin backend): solo en desarrollo. En producción, una variable olvidada
  // NO debe mostrar inscripciones "exitosas" que nunca se guardaron.
  if (!apiUrl && process.env.NODE_ENV === 'production') {
    console.error('NEXT_PUBLIC_API_URL no está definida en producción');
    return { success: false, error: "El servicio de inscripción no está disponible, intenta más tarde" };
  }
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

    // Un proxy o un error 5xx pueden devolver HTML: no asumir que la respuesta es JSON.
    let data: Record<string, unknown> = {};
    try {
      const parsed = await response.json();
      if (parsed && typeof parsed === 'object') data = parsed as Record<string, unknown>;
    } catch {
      /* cuerpo vacío o no JSON */
    }
    const str = (v: unknown) => (typeof v === 'string' ? v : undefined);

    if (response.status === 201) {
      return { success: true, nombreUsuario: str(data.nombreUsuario), mensaje: str(data.mensaje) };
    }

    if (response.status === 409) {
      return { success: false, error: str(data.error) || "Ya existe una inscripción con estos datos" };
    }

    if (response.status === 400 && Array.isArray(data.detalles)) {
      // El backend devuelve { error: "...", detalles: ["campo: mensaje", ...] }
      // Parseamos a un mapa campo → mensaje para marcar cada campo en el form
      const validationErrors: ErrorValidacion = {};
      for (const detalle of data.detalles) {
        if (typeof detalle !== 'string') continue;
        const idx = detalle.indexOf(': ');
        if (idx !== -1) {
          const campo = detalle.substring(0, idx);
          const msg = detalle.substring(idx + 2);
          validationErrors[campo] = msg;
        }
      }
      return { success: false, error: str(data.error), validationErrors };
    }

    if (response.status === 400) {
      return { success: false, error: str(data.error) || "Datos inválidos" };
    }

    if (response.status === 429) {
      return { success: false, error: "Demasiados intentos. Espera un minuto e intenta de nuevo" };
    }

    // Cualquier otro error (413, 415, 500, etc.)
    return { success: false, error: "No se pudo completar la inscripción, intenta de nuevo" };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { success: false, error: "Solicitud cancelada" };
    }
    return { success: false, error: "No se pudo conectar con el servidor, intenta de nuevo" };
  }
}
