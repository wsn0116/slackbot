
var BOT_NAME     = "slackbot";
var ICON_EMOJI   = ":logo:";
var MAIL_TO      = "";
var MAIL_SUBJECT = "slackbot alert";

function doPost(e) {
  if (!Slack.is_valid_request(e)) {
    return false;
  }

  var props = PropertiesService.getScriptProperties();
  var mode = props.getProperty(getModeId(e));

  var response = getResponse(e, mode);
  if (!response) {
    return false;
  }

  var result = Slack.sendToSlack(e.parameter.channel, create_bot_name(), response, ICON_EMOJI);
  props.setProperty(MY_TWEET_COUNT, 0);

  return ContentService.createTextOutput(JSON.stringify({text: response})).setMimeType(ContentService.MimeType.JSON);
}

function getResponse(e, mode) {
  var kazuate_response = Kazuate.getKazuateResponse(e, mode);
  if (kazuate_response) {
    return kazuate_response;
  }
  var docomo_response = Docomo.getDocomoResponse(e, mode);
  if (docomo_response) {
    return docomo_response;
  }
  var spreadsheet_response = Spreadsheet.getSpreadsheetResponse(e);
  if (spreadsheet_response) {
    return spreadsheet_response;
  }

  return false;
}

function getModeId(e) {
  return "mode" + "-" + e.parameter.user_name;
}

function send_alert_mail(text) {
  MailApp.sendEmail(MAIL_TO, MAIL_SUBJECT, text); 
}

function create_bot_name() {

  var bot_name = "";

  for(var i = 0; i < BOT_NAME.length; i++) {
    var dice = Math.ceil(Math.random() * 100);
    var chr = BOT_NAME.charAt(i);
    if (dice > 50) {
      if (chr == "b") {
          chr = new String(chr).toUpperCase();
      } else if (chr == "o") {
          chr = "0";        
      }
    }
    bot_name = bot_name + chr;
  }

  if (bot_name == BOT_NAME) {
    bot_name = create_bot_name();
  }

  return bot_name;
}
