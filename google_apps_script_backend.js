// Dieses Skript verbindet deine PWA mit einem Google Sheet als Familien-Datenbank.

// GET-Anfrage: Liest die Einkaufsliste aus dem Google Sheet
function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  // Wenn die Tabelle leer ist oder nur die Kopfzeile hat
  if (data.length <= 1) {
    return ContentService
      .createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Kopfzeile überspringen und Daten in Objekte umwandeln
  var items = [];
  for (var i = 1; i < data.length; i++) {
    items.push({
      id: data[i][0],
      name: data[i][1],
      kategorie: data[i][2],
      menge: data[i][3],
      erledigt: data[i][4] === true || data[i][4] === 'true'
    });
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(items))
    .setMimeType(ContentService.MimeType.JSON);
}

// POST-Anfrage: Überschreibt das Sheet mit der aktualisierten Einkaufsliste
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var contents = JSON.parse(e.postData.contents);
    
    // Tabelle leeren
    sheet.clear();
    
    // Kopfzeile schreiben
    sheet.appendRow(["ID", "Name", "Kategorie", "Menge", "Erledigt"]);
    
    // Alle Artikel aus der App eintragen
    contents.forEach(function(item) {
      sheet.appendRow([
        item.id,
        item.name,
        item.kategorie,
        item.menge,
        item.erledigt
      ]);
    });
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}