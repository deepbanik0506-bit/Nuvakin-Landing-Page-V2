/**
 * Nuvakin waitlist — Google Apps Script web app.
 *
 * Receives POSTs from the website's /api/waitlist route and appends one row per
 * unique email to the "Waitlist" sheet: Timestamp | Name | Email | Phone | Source.
 *
 * Setup: see docs/GOOGLE_SHEETS_SETUP.md. The shared secret lives in Script
 * Properties (WAITLIST_SECRET) and must match WAITLIST_SHARED_SECRET on the site.
 */

var SHEET_NAME = 'Waitlist';
var HEADERS = ['Timestamp', 'Name', 'Email', 'Phone', 'Source'];
var EMAIL_COLUMN = 3;

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    var expected = PropertiesService.getScriptProperties().getProperty('WAITLIST_SECRET');
    if (!expected || body.secret !== expected) return json_({ ok: false, code: 'unauthorized' });

    var entry = {
      name: clean_(body.name, 100),
      email: clean_(body.email, 254).toLowerCase(),
      phone: clean_(body.phone, 24),
      source: clean_(body.source, 60) || 'Nuvakin Website'
    };
    if (!isValid_(entry)) return json_({ ok: false, code: 'invalid' });

    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var sheet = getSheet_();
      if (emailExists_(sheet, entry.email)) return json_({ ok: false, code: 'duplicate' });

      // Phone is always stored as text so leading "+" or zeros survive.
      sheet.appendRow([new Date(), text_(entry.name), text_(entry.email), "'" + entry.phone, text_(entry.source)]);
      SpreadsheetApp.flush();
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, code: 'error' });
  }
}

/** Health check: open the web app URL in a browser to confirm it is deployed. */
function doGet() {
  return json_({ ok: true, service: 'nuvakin-waitlist' });
}

function getSheet_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  }
  return sheet;
}

function emailExists_(sheet, email) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;
  return !!sheet
    .getRange(2, EMAIL_COLUMN, lastRow - 1, 1)
    .createTextFinder(email)
    .matchEntireCell(true)
    .matchCase(false)
    .findNext();
}

function isValid_(entry) {
  var digits = entry.phone.replace(/\D/g, '');
  return (
    entry.name.length >= 2 &&
    /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(entry.email) &&
    /^\+?\d+$/.test(entry.phone) &&
    digits.length >= 7 &&
    digits.length <= 15
  );
}

function clean_(value, max) {
  return String(value == null ? '' : value).trim().slice(0, max);
}

/** Stops values such as "=HYPERLINK(…)" being read as formulas. */
function text_(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
