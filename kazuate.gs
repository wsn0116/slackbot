
var MODE_KAZUATE = "kzat";
var KAZUATE_DEFAULT_COUNT = 0;
var KAZUATE_MIN = 1;
var KAZUATE_MAX = 100;

(function(exports) {

  var Kazuate = {};

  Kazuate.getKazuateResponse = function(e, mode) {

    if (e.parameter.text.indexOf(BOT_NAME) == -1) {
      return false;
    }
  
    var response = is_kazuate_target(e);
    if (response) {
      return response;
    }
  
    if (mode == MODE_KAZUATE) {
      return createKazuateResponse(e);
    }
  
    return false;
  };

  function is_kazuate_target(e) {
    if (e.parameter.text.indexOf("数当て") == -1 && e.parameter.text.indexOf("数あて") == -1) {
      return false;
    }
    if (e.parameter.text.indexOf("しよう") == -1 && e.parameter.text.indexOf("しましょう") == -1) {
      return false;
    }
  
    var props = PropertiesService.getScriptProperties();
    var mode = props.getProperty(getModeId(e));
    if (mode == MODE_KAZUATE) {
      return "いま、" + e.parameter.user_name + "さんと数当てしているつもりなのですが。";
    }
  
    props.setProperty(getModeId(e), MODE_KAZUATE);
    props.setProperty(getKazuateId(e), Math.ceil(Math.random() * KAZUATE_MAX));
    props.setProperty(getKazuateCountId(e), KAZUATE_DEFAULT_COUNT);
    
    return "はい、" + e.parameter.user_name + "さん。数当てしましょう。" + KAZUATE_MIN + " から " + KAZUATE_MAX + " までの整数を言ってください。";
  }
  
  function createKazuateResponse(e) {
    var props = PropertiesService.getScriptProperties();
    var valid_answer = parseInt(props.getProperty(getKazuateId(e)));
  
    var user_answer = e.parameter.text;
    user_answer = user_answer.replace(BOT_NAME, "");
    user_answer = user_answer.replace(" ", "");
    user_answer = user_answer.replace("　", "");
    user_answer = parseInt(user_answer);
  
    var kazuate_cnt = parseInt(props.getProperty(getKazuateCountId(e)));
    if (isNaN(kazuate_cnt)) {
      kazuate_cnt = KAZUATE_DEFAULT_COUNT;
    }  
  
    if (!isNaN(valid_answer) && !isNaN(user_answer)) {
      if (user_answer < KAZUATE_MIN) {
        return e.parameter.user_name + "さん、もっと小さいですｗ 真面目にやる気ありますか？";
      }
  
      if (user_answer > KAZUATE_MAX) {
        return e.parameter.user_name + "さん、もっと大きいですｗ 真面目にやる気ありますか？";
      }
  
      if (user_answer < valid_answer) {
        kazuate_cnt = kazuate_cnt + 1;
        props.setProperty(getKazuateCountId(e), kazuate_cnt);
        return e.parameter.user_name + "さん、" + user_answer + " より大きいです。" + getKazuateMessage(kazuate_cnt);
      }
      
      if (user_answer > valid_answer) {
        kazuate_cnt = kazuate_cnt + 1;
        props.setProperty(getKazuateCountId(e), kazuate_cnt);
        return e.parameter.user_name + "さん、" + user_answer + " より小さいです。" + getKazuateMessage(kazuate_cnt);
      }
    }  
  
    props.setProperty(getModeId(e), "");
    if (user_answer == valid_answer) {
      return e.parameter.user_name + "さん、正解です！" + getKazuateFinishMessage(kazuate_cnt) + " 数当てを終了します。";
    }  
  
    if (isNaN(user_answer)) {
      return e.parameter.user_name + "さん、私の名前と数字以外は言わないでください。数当てやめますね。";
    }
  
    if (isNaN(valid_answer)) {
      return e.parameter.user_name + "さん、正解が分からなくなりました。数当てやめましょう。";
    }
    
    return e.parameter.user_name + "さん、数当てを終了します。";
  }
  
  function getKazuateId (e) {
    var now = new Date();
    return MODE_KAZUATE + "-" + e.parameter.user_name + "-" + now.getDay();
  }
  
  function getKazuateCountId (e) {
    var now = new Date();
    return MODE_KAZUATE + "cnt" + "-" + e.parameter.user_name + "-" + now.getDay();
  }
  
  function getKazuateMessage (cnt) {
    if (cnt == 1) {
      return "ふふふ。";
    } else if (cnt == 2) {
      return "さあ、わかりますか？";
    } else if (cnt == 3) {
      return "絞り込めてきました？"; 
    } else if (cnt == 4) {
      return "そろそろアタリがついてきたんじゃないですか？"; 
    } else if (cnt == 5) {
      return "まだ分かりませんか？"; 
    } else if (cnt == 6) {
      return "次で正解ですね。"; 
    } else if (cnt == 7) {
      return "え、まだ分からないんですか？"; 
    } else if (cnt == 8) {
      return "やる気ありますか・・・？"; 
    } else if (cnt == 9) {
      return "もういやになってきました。"; 
    }
    
    return "";
  }
  
  function getKazuateFinishMessage (cnt) {
    if (cnt == 0) {
      return "神ですか？";
    } else if (cnt == 1) {
      return "え、エスパーですか？";
    } else if (cnt == 2) {
      return "運がいいですね。";
    } else if (cnt == 3) {
      return "なかなか優秀ですね。";
    } else if (cnt == 4) {
      return "まあ、こんなもんでしょう。";
    } else if (cnt == 5) {
      return "ちょっと引きが悪かったですね。";
    } else if (cnt == 6) {
      return "だいぶ引きが悪いですね。";
    } else if (cnt == 7) {
      return "これだけ訊けば誰でも分かるでしょう。";
    }
  
    return "真面目にやる気なかったでしょう。";
  }

  exports.Kazuate = Kazuate;

})(this);
