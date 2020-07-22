const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

/**
* An HTTP endpoint that acts as a webhook for HTTP(S) request event
* @returns {object} result Your return value
*/
module.exports = async () => {
  let result = {};

  // Fetch all rows from Google Sheet
  let sheetRows = await lib.googlesheets.values['@0.1.3'].retrieve({
    spreadsheetId: `<INSERT YOUR SPREADSHEET ID HERE>`,
    range: `Sheet1`,
    majorDimension: 'ROWS'
  });

  // Loop through all Sheet Rows (except the first) and create Records in Airtable with their values
  for (let i = 1; i < sheetRows.values.length; i++) {
    let rowValues = sheetRows.values[i];
    let r = await lib.airtable.records['@0.2.1'].create({
      table: `Birthdays`,
      fields: {
        'Name': rowValues[0],
        'Birthday Month': rowValues[1],
        'Birthday Day': rowValues[2]
      }
    });
  }

  return result;
};