(function(exports) {

  var DOCOMO_API_KEY = "";
  var URL_DOCOMO_DIALOGUE_API =  "https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue?APIKEY=" + DOCOMO_API_KEY;
  var URL_DOCOMO_KNOWLEDGE_API = "https://api.apigw.smt.docomo.ne.jp/knowledgeQA/v1/ask?APIKEY=" + DOCOMO_API_KEY + "&q=";
  var MODE_SIRITORI = "srtr";
  var MSG_API_BUSY = "おや、私の脳みそが混雑しているようです。";

  var CHARACTER_DEFAULT = "";
  var CHARACTER_KANSAI  = "20";
  var CHARACTER_BABY    = "30";

  var Docomo = {};

  Docomo.getDocomoResponse = function (e, mode) {
  
    if (e.parameter.text.indexOf(BOT_NAME) == -1) {
      return false;
    }
  
    var response = "";
    if (mode != MODE_SIRITORI) {
      response = loadDocomoKnowledgeApi(e);
      if (response) {
        return response;
      }
    }
  
    response = loadDocomoDialogueApi(e);
    if (response) {
      return response;
    }
  
    return MSG_API_BUSY;
  };

  function loadDocomoKnowledgeApi(e) {
  
    var q = encodeURI(e.parameter.text.replace(BOT_NAME, ""));
    var response = UrlFetchApp.fetch((URL_DOCOMO_KNOWLEDGE_API + q), {"method" : "GET"});
    var content = response.getContentText("UTF-8");
    if (response.getResponseCode() != 200) {
      send_alert_mail(content); 
      return false;
    }
  
    var json_parsed_content = JSON.parse(content);
    if (json_parsed_content.code.indexOf("E") != -1) {
      return false; 
    }
    if (json_parsed_content.code.indexOf("S02001") != -1) {
      return false; 
    }
    if (!json_parsed_content.message.textForDisplay) {
      return false; 
    }
  
    return json_parsed_content.message.textForDisplay;
  }
  
  function loadDocomoDialogueApi(e) {
  
    var payload = {utt: e.parameter.text.replace(BOT_NAME, ""), nickname: e.parameter.user_name};
    var props = PropertiesService.getScriptProperties();
    var mode = props.getProperty(getModeId(e));
    if (mode && mode != MODE_KAZUATE) {
      payload.mode = mode;
    }
    var context = props.getProperty(getContextId(e));
    if (context) {
      payload.context = context;
    }
    payload.t = getCharacterType(e);

    var options = {"method" : "POST", "contentType": "text/json", "payload" : JSON.stringify(payload), "muteHttpExceptions": true}  
    var response = UrlFetchApp.fetch(URL_DOCOMO_DIALOGUE_API, options);
    var content = response.getContentText("UTF-8");
    if (response.getResponseCode() != 200) {
      send_alert_mail(content); 
      return false;
    }
  
    var json_parsed_content = JSON.parse(content);
    props.setProperty(getModeId(e), json_parsed_content.mode);
    props.setProperty(getContextId(e), json_parsed_content.context);
    if (!json_parsed_content.utt) {
      return false; 
    }
  
    return json_parsed_content.utt;
  }

  function getCharacterType(e) {

    var props = PropertiesService.getScriptProperties();

    if (e.parameter.text.indexOf("関西") != -1) {
      props.setProperty(getCharacterId(e), CHARACTER_KANSAI);
    } else if (e.parameter.text.indexOf("赤ちゃん") != -1) {
      props.setProperty(getCharacterId(e), CHARACTER_BABY);
    }

    var character = props.getProperty(getCharacterId(e));
    if (character == CHARACTER_KANSAI || character == CHARACTER_BABY) {
      return character;
    }

    return CHARACTER_DEFAULT;
  }

  function getContextId(e) {
    var now = new Date();
    return "context" + "-" + e.parameter.user_name + "-" + now.getDay() + "-" + now.getHours();
  }

  function getCharacterId(e) {
    var now = new Date();
    return "character" + "-" + now.getDay() + "-" + now.getHours();
  }

  exports.Docomo = Docomo;

})(this);
