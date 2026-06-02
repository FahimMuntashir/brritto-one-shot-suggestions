/**
 * Paste this entire file into Google Apps Script.
 * It receives form submissions and appends rows to the active sheet.
 *
 * SETUP STEPS (one-time):
 *  1. Open your Google Sheet → Extensions → Apps Script
 *  2. Delete any existing code, paste this entire file, save (Ctrl+S)
 *  3. Click "Deploy" → "New deployment"
 *  4. Type: Web app
 *  5. Execute as: Me
 *  6. Who has access: Anyone
 *  7. Click "Deploy" → copy the Web App URL
 *  8. Paste that URL into js/app.js  →  const SHEET_ENDPOINT = 'PASTE_HERE'
 *
 * Sheet columns (auto-created on first submission):
 *  A: Timestamp  |  B: Name  |  C: Mobile  |  D: HSC Year
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('User Data');

    /* add header row if this is the very first entry */
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Mobile', 'HSC Year']);
      sheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#2563EB').setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' }),
      e.parameter.name    || '',
      e.parameter.mobile  || '',
      e.parameter.hscYear || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/* optional: visit the web app URL in a browser to confirm it's live */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Brritto sheet endpoint is active ✅' }))
    .setMimeType(ContentService.MimeType.JSON);
}
