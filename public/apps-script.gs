// REGISTRO DE CONFIRMACIONES EN GOOGLE SHEETS
// 1) Crea una hoja de Google con encabezados en la fila 1: Fecha | Personas | Nombres | Teléfono | Mensaje
// 2) Extensiones > Apps Script > pega este código.
// 3) Implementar > Nueva implementación > Aplicación web > Acceso: "Cualquier usuario".
// 4) Copia la URL y pégala en URL_REGISTRO_SHEET dentro de script.js.
function doPost(e) {
  var d = JSON.parse(e.postData.contents);
  SpreadsheetApp.getActiveSheet().appendRow([new Date(), d.personas, d.nombres, d.telefono, d.mensaje || '']);
  return ContentService.createTextOutput('ok');
}
