(function(exports) {
  
  var URL_BOOK     = "";  
  var SHEET_NAME   = "dictionary";
  
  var Spreadsheet = {};

  Spreadsheet.getSpreadsheetResponse = function (e) {

    var book  = SpreadsheetApp.openByUrl(URL_BOOK);
    var sheet = book.getSheetByName(SHEET_NAME);
    var data  = sheet.getDataRange().getValues();
  
    for(var i = 1; i < data.length; i++) {
      var keyword = data[i][0];
      if (keyword != "" && e.parameter.text.indexOf(keyword) != -1) {
        var row = i + 1;
        return get_response_from_spreadsheet(sheet, row, e);
      }
    }
  
    return false;
  };
  
  function get_response_from_spreadsheet(sheet, row, e) {
  
    var dice = Math.ceil(Math.random() * 100);
    var response = sheet.getRange(row, 2).getValue();
  
    if (dice >= 50 && sheet.getRange(row, 3).getValue() != "") {
      response = sheet.getRange(row, 3).getValue();
    }
  
    response = response.replace("{username}", e.parameter.user_name);
    response = response.replace("{user_name}", e.parameter.user_name);
  
    return response;
  }

  exports.Spreadsheet = Spreadsheet;

})(this);
