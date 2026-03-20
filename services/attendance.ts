const API_URL = "http://localhost:3000";
export async function registerAttendance(qrData: string) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      codigoQR: qrData,
      usuarioId: "usuario-demo", 
    }),
  });

  if (!response.ok) {
    throw new Error("Error al registrar asistencia");
  }

  return await response.json();
}
