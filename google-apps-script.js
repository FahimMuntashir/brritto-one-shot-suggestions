/**
 * Paste this entire file into Google Apps Script.
 * Writes form submissions into the "User Data" sheet.
 *
 * Expected sheet columns (must already exist as headers in row 1):
 *  A: Name  |  B: Phone Number  |  C: Class (Batch)  |  D: Timestamp
 *
 * SETUP STEPS (one-time):
 *  1. Open the business team's Google Sheet → Extensions → Apps Script
 *  2. Delete any existing code, paste this entire file, save (Ctrl+S)
 *  3. Click "Deploy" → "New deployment"
 *  4. Type: Web app  |  Execute as: Me  |  Who has access: Anyone
 *  5. Click "Deploy" → copy the Web App URL
 *  6. Paste that URL into js/app.js  →  const SHEET_ENDPOINT = 'PASTE_HERE'
 *
 * NOTE: Add "Timestamp" as the header in column D of your "User Data" sheet.
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('User Data');

    sheet.appendRow([
      e.parameter.name    || '',
      e.parameter.mobile  || '',
      e.parameter.hscYear || '',
      new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' }),
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
