
var DEBUG_CHANNEL = "";
var DEBUG_USER    = "";
var DEBUG_TEXT    = "slackbot てすと";

function init() {
  doPost({parameter: {"token" : TOKEN_SLACK, "channel" : DEBUG_CHANNEL, "user_name" : DEBUG_USER, "text" : DEBUG_TEXT}});
}

function show_tweet_count() {
  var props = PropertiesService.getScriptProperties();
  var my_tweet_count = parseInt(props.getProperty(MY_TWEET_COUNT));
  var text = "現在の連続発言回数は " + my_tweet_count + " 回です。";
  Slack.sendToSlack(DEBUG_CHANNEL, DEBUG_USER, text, ICON_EMOJI);
}

function increment_tweet_count() {
  var props = PropertiesService.getScriptProperties();
  var my_tweet_count = parseInt(props.getProperty(MY_TWEET_COUNT));
  if (isNaN(my_tweet_count)) {
    my_tweet_count = 0;
  }
  props.setProperty(MY_TWEET_COUNT, (my_tweet_count + 1));
  var text = "現在の連続発言回数は " + my_tweet_count + " 回になりました。";
  Slack.sendToSlack(DEBUG_CHANNEL, DEBUG_USER, text, ICON_EMOJI);
}

