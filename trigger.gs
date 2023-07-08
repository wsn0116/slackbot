
var TWEET_TO_CHANNEL = "#random";
var NO_RESPONSE = "";
var MY_TWEET_COUNT = "my_tweet_count";

var MONDAY = 1;
var TUESDAY = 2;
var WEDNESDAY = 3;
var THURSDAY = 4;
var FRIDAY = 5;

function resetProperties() {
  var props = PropertiesService.getScriptProperties();
  props.deleteAllProperties();
}

function tweet() {
  var now = new Date;
  var text = NO_RESPONSE;

  if (now.getDay() == MONDAY) {
    text = tweet_for_monday(now.getHours());
  } else if (now.getDay() == TUESDAY) {
    text = tweet_for_tuesday(now.getHours());
  } else if (now.getDay() == WEDNESDAY) {
    text = tweet_for_wednesday(now.getHours());
  } else if (now.getDay() == THURSDAY) {
    text = tweet_for_thursday(now.getHours());
  } else if (now.getDay() == FRIDAY) {
    text = tweet_for_friday(now.getHours());
  }

  var props = PropertiesService.getScriptProperties();
  var my_tweet_count = parseInt(props.getProperty(MY_TWEET_COUNT));
  if (isNaN(my_tweet_count)) {
    my_tweet_count = 0;
  }
  if (my_tweet_count == 3) {
    text = "なんだか私ばかり喋っていますね。ちょっと黙っていますね。";
  } else if (my_tweet_count >= 4) {
    text = NO_RESPONSE;
  }

  if (text != NO_RESPONSE) {
    Slack.sendToSlack(TWEET_TO_CHANNEL, BOT_NAME, text, ICON_EMOJI);
    props.setProperty(MY_TWEET_COUNT, (my_tweet_count + 1));
  }

  return true;
}

function get_weather_xml() {
  var response = UrlFetchApp.fetch("http://www.drk7.jp/weather/xml/14.xml");
  var xml = XmlService.parse(response.getContentText());
  return xml;
}

function get_rainfallchance_today(i) {

  var xml = get_weather_xml();
  if (xml == null) {
    return "";
  }

  var pref = xml.getRootElement().getChild("pref").getAttribute("id").getValue();
  var area = xml.getRootElement().getChild("pref").getChildren("area")[0].getAttribute("id").getValue();
  var pref_area = xml.getRootElement().getChild("pref").getChildren("area")[0]; 
  var rainfallchance = pref_area.getChildren("info")[0].getChild("rainfallchance").getChildren("period");
  var unit = pref_area.getChildren("info")[0].getChild("rainfallchance").getAttribute("unit").getValue();
  var timezone = rainfallchance[i].getAttribute("hour").getValue();

  return pref + area + "の今日 " + timezone.replace("-", "時～") + "時" + "の降水確率は " + rainfallchance[i].getText() + " " + unit + "らしいです。\n";
}

function get_weather_tomorrow() {

  var xml = get_weather_xml();
  if (xml == null) {
    return "";
  }

  var pref = xml.getRootElement().getChild("pref").getAttribute("id").getValue();
  var area = xml.getRootElement().getChild("pref").getChildren("area")[0].getAttribute("id").getValue();
  var pref_area = xml.getRootElement().getChild("pref").getChildren("area")[0];
  var weather = pref_area.getChildren("info")[1].getChildText("weather");

  return pref + area + " の明日の天気は " + weather + "らしいですよ。";
}

function get_temperature() {

  var xml = get_weather_xml();
  if (xml == null) {
    return "";
  }

  var pref = xml.getRootElement().getChild("pref").getAttribute("id").getValue();
  var area = xml.getRootElement().getChild("pref").getChildren("area")[0].getAttribute("id").getValue();
  var pref_area = xml.getRootElement().getChild("pref").getChildren("area")[0]; 
  var temperature = pref_area.getChildren("info")[0].getChild("temperature").getChildren("range");

  var max_temp = temperature[0].getText();
  var min_temp = temperature[1].getText();

  var message = "";
  if (max_temp <= 3) {
    message = "まじ寒くて凍えますね。";
  } else if (max_temp <= 7) {
    message = "寒いですね。";
  } else if (max_temp <= 14) {
    message = "ちょっと肌寒いですね。";
  } else if (max_temp >= 30) {
    message = "暑いですね。";
  } else if (max_temp >= 40) {
    message = "死にますね。";  
  }

  return pref + area + "の今日の最高気温は " + max_temp + " 度らしいですよ。" + message;
}

function tweet_for_monday(hours) {

  Logger.log(get_temperature());

  if (hours == 10) {
    return get_rainfallchance_today(1);
  } else if(hours == 11) {
    return get_temperature();
  } else if(hours == 12) { 
    return get_rainfallchance_today(2);
  } else if(hours == 13) {
    return "午後もがんばりましょう。早く帰りたい。";
  } else if(hours == 14) {
    return "眠くなる時間ですね。Ｚｚｚ";
  } else if(hours == 15) {
    return "15時ですよ、ちょっと休みましょう。";
  } else if(hours == 16) {
    return get_rainfallchance_today(3);
  } else if(hours == 17) {
    return get_weather_tomorrow();
  }

  return NO_RESPONSE;
}

function tweet_for_tuesday(hours) {

  if (hours == 10) {
    return get_rainfallchance_today(1);
  } else if(hours == 11) {
    return get_temperature();
  } else if(hours == 12) { 
    return get_rainfallchance_today(2);
  } else if(hours == 13) {
    return "いつも静かですね。みんな生きているんですかね。";
  } else if(hours == 14) {
    return "眠くなる時間ですね。私がひつじを数えてあげましょう。";
  } else if(hours == 15) {
    return "そろそろおやつでも食べながら休憩しませんか。";
  } else if(hours == 16) {
    return get_rainfallchance_today(3);
  } else if(hours == 17) {
    return get_weather_tomorrow();
  }

  return NO_RESPONSE;
}

function tweet_for_wednesday(hours) {

  if (hours == 10) {
    return get_rainfallchance_today(1);
  } else if(hours == 11) {
    return get_temperature();
  } else if(hours == 12) { 
    return get_rainfallchance_today(2);
  } else if(hours == 13) {
    return "いつも静かですね。ここはみんな見てないんですかね。";
  } else if(hours == 14) {
    return "眠くなる時間ですね。私が騒いであげましょうか。";
  } else if(hours == 15) {
    return "そろそろおやつでも食べながら休憩しませんか。";
  } else if(hours == 16) {
    return get_rainfallchance_today(3);
  } else if(hours == 17) {
    return get_weather_tomorrow();
  }

  return NO_RESPONSE;
}

function tweet_for_thursday(hours) {

  if (hours == 10) {
    return get_rainfallchance_today(1);
  } else if(hours == 11) {
    return get_temperature();
  } else if(hours == 12) { 
    return get_rainfallchance_today(2);
  } else if(hours == 13) {
    return "いつも静かですね。誰か遊んでください。";
  } else if(hours == 14) {
    return "眠くなる時間ですね。私が呪文を唱えてあげましょう。";
  } else if(hours == 15) {
    return "そろそろおやつでも食べながら休憩しませんか。";
  } else if(hours == 16) {
    return get_rainfallchance_today(3);
  } else if(hours == 17) {
    return get_weather_tomorrow();
  }

  return NO_RESPONSE;
}

function tweet_for_friday(hours) {

  if (hours == 10) {
    return get_rainfallchance_today(1);
  } else if(hours == 11) {
    return get_temperature();
  } else if(hours == 12) { 
    return get_rainfallchance_today(2);
  } else if(hours == 13) {
    return "あと半日ですね・・・！";
  } else if(hours == 14) {
    return "眠くなってる場合じゃないですよ。早く仕事を終わらせましょう！";
  } else if(hours == 15) {
    return "休憩してる場合じゃないですよ。早く仕事を終わらせましょう！";
  } else if(hours == 16) {
    return get_rainfallchance_today(3);
  } else if(hours == 17) {
    return get_weather_tomorrow();
  }

  return NO_RESPONSE;
}
