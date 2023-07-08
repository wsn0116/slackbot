
var TOKEN_SLACK  = "";

(function(exports) {

  var URL_SLACK    = "";
  var TOKEN_USER   = "slackbot";

  var Slack = {};

  Slack.is_valid_request = function (e) {
    if (e.parameter.token != TOKEN_SLACK) {
      send_alert_mail("received invalid token. token is " + e.parameter.token + "."); 
      return false;
    }
    if (e.parameter.user_name == TOKEN_USER) {
      return false;
    }
    
    return true;
  };
  
  Slack.sendToSlack = function (channel, username, text, icon_emoji) {
    var json = JSON.stringify({channel : channel, username : username, text : text, icon_emoji: icon_emoji});
    var options = {"method" : "POST", "payload" : "payload=" + encodeURI(json), "muteHttpExceptions": true}  
    var response = UrlFetchApp.fetch(URL_SLACK, options);
    var content = response.getContentText("UTF-8");
    if (response.getResponseCode() != 200) {
      send_alert_mail(content); 
      return response.getResponseCode();
    }
   
    return content;
  };

  exports.Slack = Slack;

})(this);
