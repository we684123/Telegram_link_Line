function base() {
  //前期準備，不懂看README
  var sheet_key = ""; //你的sheet ID
  var doc_key = ""; //你的doc ID
  var Telegram_bot_key = ""; //Telegram bot的token
  var Telegram_id = ""; //你的Telegram帳號ID(要通知你)
  var Line_id = ""; //你的line ID
  var CHANNEL_ACCESS_TOKEN = ''; //你的Line token
  var email = "@gmail.com" //你的email
  //前期準備完成!==============================================================
  var base_json = {
    "sheet_key": sheet_key,
    "doc_key": doc_key,
    "Telegram_bot_key": Telegram_bot_key,
    "Telegram_id": Telegram_id,
    "Line_id": Line_id,
    "CHANNEL_ACCESS_TOKEN": CHANNEL_ACCESS_TOKEN,
    "email": email
  }
  return base_json
}
//============================================================================
function doPost(e) {
  // debug用(要debug記得把33、34行註解掉)
  //以下模擬Telegram發訊息(調整text)
  //var e = '{"update_id":9104623,"message":{"message_id":336,"from":{"id":2001460,"first_name":"Wx","last_name":"Ex","username":"we684124"},"chat":{"id":207014603,"first_name":"Wx","last_name":"Ex","username":"we684124","type":"private"},"date":149086785,"text":"/delete"}}'
  //var estringa = JSON.parse(e);

  //以下模擬Line發訊息(調整text)
  //var e = '{"events":[{"type":"message","replyToken":"a215829a32474a749fad411cc6315566","source":{"roomId":"R578f0ca78ce9972bd679c1f86589f979","type":"room"},"timestamp":1490864585838,"message":{"type":"text","id":"5861041407629","text":"030//"}}]}'
  //var estringa = JSON.parse(e);
  //
  var estringa = JSON.parse(e.postData.contents);
  var ee = JSON.stringify(estringa);
  var text = "";
  var base_json = base();
  var sheet_key = base_json.sheet_key
  var doc_key = base_json.doc_key
  var email = base_json.email
  var Telegram_bot_key = base_json.Telegram_bot_key
  var Telegram_id = base_json.Telegram_id
  var Line_id = base_json.Line_id
  var CHANNEL_ACCESS_TOKEN = base_json.CHANNEL_ACCESS_TOKEN;

  /*/ debug用
  var SpreadSheet = SpreadsheetApp.openById(sheet_key);
  var SheetD = SpreadSheet.getSheetByName("Debug");
  var LastRowD = SheetD.getLastRow();
  //SheetD.getRange(LastRowD + 1, 2).setValue("ggggggggggg LastRowD= " + );
  //Logger.log("這裡被執行了! ");
  //*/

  //資料崩潰檢查修復=============================================================
  var doc = DocumentApp.openById(doc_key)
  var f = doc.getText()
  try {
    var ALL = JSON.parse(f);
  } catch (d) {
    var Dlen = f.search('}{"');
    var ff = f.substring(0, Dlen + 1)
    var r = ff;
    doc.setText(r); //寫入
  }
  //以下正式開始================================================================
  if (estringa.update_id) { //利用兩方json不同來判別
    //以下來自telegram
    var from = 'telegram';
    Log(estringa, from, sheet_key, email); //log
    var doc = DocumentApp.openById(doc_key)
    var f = doc.getText();
    var ALL = JSON.parse(f); //獲取資料//轉成JSON物件
    var mode = ALL.mode;
    var Stext = estringa.message.text; //前期準備完成

    //所有人檢查==================================================================
    if (Telegram_id != estringa.message.chat.id) { //如果不是 發一段話即結束
      var text = "您好!這是私人用的bot，不對他人開放\
      \n若您想要一個自己的 Telegram_link_Line 機器人，請至 \n" +
        "https://github.com/we684123/Telegram_link_Line "
      var payload = {
        "method": "sendMessage",
        'chat_id': estringa.message.from.id,
        'text': text
      }
      start(payload);
      return 0;
    }

    if (mode == "🚀 發送訊息" && Stext != "/exit") {
      //以下準備接收telegram資訊並發到line
      text = Stext;
      var Line_id = ALL.opposite.RoomId;
      var url = 'https://api.line.me/v2/bot/message/push';
      //--------------------------------------------------
      var retMsg = [{
        'type': 'text',
        'text': text
      }];
      var header = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
      }
      var payload = {
        'to': Line_id,
        'messages': retMsg
      }
      var options = {
        'headers': header,
        'method': 'post',
        'payload': JSON.stringify(payload)
      }
      //--------------------------------------------------
      UrlFetchApp.fetch(url, options);
      ALL.mode = 0;
      text = "已傳送至 " + date.opposite.Name;
      var notification = true
      sendtext(text, notification);
      //================================================================
    } else if (mode == "🔖 重新命名") {
      if (ALL.FastMatch[Stext] != undefined) {
        text = "名子不可重複，請重新輸入一個!";
        var notification = true
        sendtext(text, notification);
      } else if (In(Stext)) {
        text = "名子不可跟命令重複，請重新輸入一個!";
        var notification = true
        sendtext(text, notification);
      } else {
        var OName = ALL.opposite.Name
        var FM = ALL.FastMatch[OName]
        ALL.data[FM].Name = Stext + "✅"
        var y = JSON.parse((String(JSON.stringify(ALL.FastMatch)).replace(OName, Stext)).replace(Stext, Stext + "✅"));
        //var yy = JSON.parse(String(JSON.stringify(ALL.FastMatch)).replace(Stext, Stext + "✅"));
        ALL.FastMatch = y;

        ALL.mode = 0
        var r = JSON.stringify(ALL);
        doc.setText(r); //寫入

        //以下處理RoomKeyboard==================================================
        REST_keyboard(doc_key) //重新編排keyborad
        //=====================================================================
        var text = "🔖 重新命名完成~\n" + OName + " \n->\n " + Stext + "\n🔮 開啟主選單"
        keyboard_main(text, doc_key)
      }
      //================================================================
    } else if (mode == "🔥 刪除聊天室" & Stext == "/delete") {
      REST_FastMatch1and2();
      var aims = ALL.opposite.RoomId
      var number = ALL.FastMatch2[aims]

      //doc處理
      ALL.data.splice(number, 1) //刪除目標
      ALL.mode = 0
      var r = JSON.stringify(ALL);
      doc.setText(r); //重新寫入

      //sheet處理
      var SpreadSheet = SpreadsheetApp.openById(sheet_key);
      var Sheet = SpreadSheet.getSheetByName("Line訊息區");
      Sheet.deleteColumn(number + 1);

      REST_keyboard(); //重製快速鍵盤
      REST_FastMatch1and2(); //重製快速索引

      text = "已刪除此聊天室";
      keyboard_main(text, doc_key)
      return 0;
    } else {
      //以下指令分流
      switch (Stext) {
        case '/main':
        case '🔃  重新整理':
          var text = "🔮 開啟主選單"
          keyboard_main(text, doc_key)
          break;
        case '🔙 返回房間':
          var keyboard = ALL.RoomKeyboard;
          var resize_keyboard = true
          var one_time_keyboard = false
          var text = "請選擇聊天室"
          ReplyKeyboardMakeup(keyboard, resize_keyboard, one_time_keyboard, text)

          break;
        case '🔭 訊息狀態':
          data_len = ALL.data.length;
          text = ""
          for (var i = 0; i < data_len; i++) {
            if (ALL.data[i].Amount == 0)
              continue;
            text = text + ALL.data[i].Name + '\n' + '未讀：' + ALL.data[i].Amount + '\n' + '-------------\n'
          }

          if (text == "") {
            text = "沒有任何未讀。"
          }
          var notification = true
          sendtext(text, notification);
          break;
        case '✔ 關閉鍵盤':
          var text = "已關閉鍵盤，如欲再次開啟請按 /main"
          ReplyKeyboardRemove(text)
          break;
        case '🚀 發送訊息':
          ALL.mode = "🚀 發送訊息"
          var r = JSON.stringify(ALL);
          doc.setText(r); //寫入
          text = "將對 " + ALL.opposite.Name + "發送訊息\n" + "如欲離開請輸入 /exit \n請輸入訊息："
          ReplyKeyboardRemove(text)
          break;
        case '/exit':
          ALL.mode = 0
          var r = JSON.stringify(ALL);
          doc.setText(r); //寫入
          text = "======已停止對話!======"
          keyboard_main(text, doc_key)
          break;
        case '📬 讀取留言':
          if (ALL.data[ALL.FastMatch2[ALL.opposite.RoomId]].Amount == 0) {
            text = "這個房間並沒有未讀的通知喔~ ";
            var notification = true
            sendtext(text, notification);
          } else {
            var SpreadSheet = SpreadsheetApp.openById(sheet_key);
            var SheetM = SpreadSheet.getSheetByName("Line訊息區");
            var col = ALL.FastMatch2[ALL.opposite.RoomId] + 1;

            var Amount = parseInt(SheetM.getRange(1, col).getDisplayValue());
            for (var i = 2; i <= (Amount + 1); i++) {
              text = SheetM.getRange(i, col).getDisplayValue()
              var notification = false
              sendtext(text, notification);
              SheetM.getRange(i, col).setValue("")
            }
            ALL.data[ALL.FastMatch2[ALL.opposite.RoomId]].Amount = 0;
            var r = JSON.stringify(ALL);
            doc.setText(r); //寫入
            SheetM.getRange(1, col).setValue(0)

            text = "=======讀取完畢======="
            var notification = true
            sendtext(text, notification);
          }

          break;
        case '🔖 重新命名':
          ALL.mode = "🔖 重新命名"
          var r = JSON.stringify(ALL);
          doc.setText(r); //寫入
          text = "將對 " + ALL.opposite.Name + " 重新命名!!!\n" + "請輸入新名子："
          ReplyKeyboardRemove(text)
          break;
        case '🔥 刪除聊天室':
          ALL.mode = "🔥 刪除聊天室"
          var r = JSON.stringify(ALL);
          doc.setText(r); //寫入
          text = "你確定要刪除 " + ALL.opposite.Name + " 嗎?\n" + "若是請按一下 /delete\n" +
            "若沒按下則不會刪除!!!"
          var notification = false
          sendtext(text, notification);
          break;
        case '🐳 開啟通知':
          var OName = ALL.opposite.Name
          var FM = ALL.FastMatch[OName]
          ALL.data[FM].Notice = true;
          var u = ALL.data[FM].Name.replace("❎", "✅");
          ALL.data[FM].Name = u;
          var y = JSON.parse(String(JSON.stringify(ALL.FastMatch)).replace(OName, OName.slice(0, OName.length - 1) + "✅"));
          ALL.FastMatch = y;
          ALL.opposite.Name = u;
          var r = JSON.stringify(ALL);
          doc.setText(r); //寫入
          text = "已開啟 " + OName + " 的通知"
          var notification = false
          sendtext(text, notification);
          //以下處理RoomKeyboard==================================================
          REST_keyboard(doc_key) //重新編排keyborad
          break;
        case '🔰 暫停通知':
          var OName = ALL.opposite.Name
          var FM = ALL.FastMatch[OName]
          ALL.data[FM].Notice = false
          var u = ALL.data[FM].Name.replace("✅", "❎");
          ALL.data[FM].Name = u;
          var y = JSON.parse(String(JSON.stringify(ALL.FastMatch)).replace(OName, OName.slice(0, OName.length - 1) + "❎"));
          ALL.FastMatch = y;
          ALL.opposite.Name = u;
          var r = JSON.stringify(ALL);
          doc.setText(r); //寫入
          text = "已暫停 " + OName + " 的通知"
          var notification = false
          sendtext(text, notification);
          //以下處理RoomKeyboard==================================================
          REST_keyboard(doc_key) //重新編排keyborad
          break;
        case '/debug':
          REST_FastMatch1and2();
          REST_keyboard();
          text = "已debug"
          var notification = false
          sendtext(text, notification);
          break;
        case '/AllRead':
        case '/allread':
          AllRead();
          text = "已全已讀"
          var notification = true
          sendtext(text, notification);
          break;
        default:
          if (ALL.FastMatch[Stext] != undefined) {
            var FM = ALL.FastMatch[Stext]
            var OAmount = ALL.data[FM].Amount
            var OName = ALL.data[FM].Name
            var ORoomId = ALL.data[FM].RoomId
            ALL.opposite.RoomId = ORoomId;
            ALL.opposite.Name = OName;
            var r = JSON.stringify(ALL);
            doc.setText(r); //寫入
            var Notice = ALL.data[FM].Notice

            text = "您選擇了 " + OName + " 聊天室\n" + "未讀數量：" + OAmount + "\n聊天室通知：" + Notice + "\n請問你要?"
            keyboard = [
              [{
                'text': '🚀 發送訊息'
              }, {
                'text': '📬 讀取留言'
              }, {
                'text': '🔖 重新命名'
              }],
              [{
                'text': '🐳 開啟通知'
              }, {
                'text': '🔰 暫停通知'
              }],
              [{
                'text': "🔥 刪除聊天室"
              }, {
                'text': "🔙 返回房間"
              }]
            ]
            var resize_keyboard = false
            var one_time_keyboard = false
            ReplyKeyboardMakeup(keyboard, resize_keyboard, one_time_keyboard, text)
          } else if (Stext.substr(0, 2) == "/d") {
            var s_len = Stext.length - 1;
            var number = Stext.substr(2, s_len)

            var FM = number;
            var OAmount = ALL.data[FM].Amount
            var OName = ALL.data[FM].Name
            var ORoomId = ALL.data[FM].RoomId
            ALL.opposite.RoomId = ORoomId;
            ALL.opposite.Name = OName;
            var r = JSON.stringify(ALL);
            doc.setText(r); //寫入
            var Notice = ALL.data[FM].Notice

            text = "您選擇了 " + OName + " 聊天室\n" + "未讀數量：" + OAmount + "\n聊天室通知：" + Notice + "\n請問你要?"
            keyboard = [
              [{
                'text': '🚀 發送訊息'
              }, {
                'text': '📬 讀取留言'
              }, {
                'text': '🔖 重新命名'
              }],
              [{
                'text': '🐳 開啟通知'
              }, {
                'text': '🔰 暫停通知'
              }],
              [{
                'text': "🔥 刪除聊天室"
              }, {
                'text': "🔙 返回房間"
              }]
            ]
            var resize_keyboard = false
            var one_time_keyboard = false
            ReplyKeyboardMakeup(keyboard, resize_keyboard, one_time_keyboard, text)
          } else {
            text = "錯誤的操作喔（ ・∀・），請檢查環境是否錯誤"
            var notification = false
            sendtext(text, notification);
          }
      }
    }
    //=====================================================================================================
  } else if (estringa.events[0].timestamp) {
    //以下來自line
    var from = 'line';
    Log(estringa, from, sheet_key, email); //log

    if (estringa.events[0].source.type == "user") {
      var Room_text = estringa.events[0].source.userId;
      var userId = estringa.events[0].source.userId
    } else if (estringa.events[0].source.type == "room") {
      var Room_text = estringa.events[0].source.roomId;
      if (estringa.events[0].source.userId) {
        var userId = estringa.events[0].source.userId
      }
    } else {
      var Room_text = estringa.events[0].source.groupId;
      if (estringa.events[0].source.userId) {
        var userId = estringa.events[0].source.userId
      }
    } //強制轉ID

    if (estringa.events[0].source.userId)
      var userName = getUserName(estringa.events[0].source.userId); //如果有則用

    if (estringa.events[0].message.text) {
      if (userName) {
        text = userName + ":" + String(estringa.events[0].message.text); //取得訊息
      } else {
        text = String(estringa.events[0].message.text); //取得訊息
      }
    } else if (estringa.events[0].message.type == "image") {
      text = String("照片(" + estringa.events[0].message.id + ")") //取得照片
    } else if (estringa.events[0].message.type == "sticker") {
      var id = estringa.events[0].message.id
      var stickerId = estringa.events[0].message.stickerId
      var packageId = estringa.events[0].message.packageId
      text = "貼圖(" + id + ")\n" + "[" + stickerId + "," + packageId + "]"; //取得貼圖
    } else if (estringa.events[0].message.type == "audio") {
      text = String("錄音(" + estringa.events[0].message.id + ")") //取得錄音
    } else if (estringa.events[0].message.type == "location") {
      var id = estringa.events[0].message.id
      var address = estringa.events[0].message.address
      var latitude = estringa.events[0].message.latitude
      var longitude = estringa.events[0].message.longitude
      text = "ID:" + id + "\n地址：" + address + "\n經度：" + latitude + "\n緯度：" + longitude; //取得位置
    } else if (estringa.events[0].message.type == "video") {
      text = String("影片(" + estringa.events[0].message.id + ")") //取得影片
    } else if (estringa.events[0].message.type == "file") {
      text = String("檔案(" + estringa.events[0].message.id + ")") //取得影片
    }

    var SpreadSheet = SpreadsheetApp.openById(sheet_key);
    var SheetM = SpreadSheet.getSheetByName("Line訊息區");

    var doc = DocumentApp.openById(doc_key)
    var f = doc.getText();
    var ALL = JSON.parse(f);
    //================================================================
    if (ALL.FastMatch2[Room_text] != undefined) { //以下處理已登記的
      if (ALL.mode == "🚀 發送訊息" && Room_text == ALL.opposite.RoomId) {
        text = text; //雖然沒意義但還是寫一下
        var notification = false
        sendtext(text, notification);
      } else {
        //以下處理sheet========================================================
        var col = ALL.FastMatch2[Room_text] + 1; //找欄位
        var LastRowM = parseInt(SheetM.getRange(1, col).getDisplayValue());
        SheetM.getRange(LastRowM + 2, col).setValue(String(text)) //更新內容
        SheetM.getRange(1, col).setValue(LastRowM + 1) //更新數量
        //以下處理doc==========================================================
        ALL.data[col - 1].Amount = ALL.data[col - 1].Amount + 1 //!!!!!!!!!!!!!!!!!!!!!!
        var r = JSON.stringify(ALL);
        doc.setText(r); //寫入
        //以下處理通知=========================================================
        var Notice = ALL.data[col - 1].Notice //通知 true or false
        if (Notice) {
          text = "你有新訊息!\n來自：" + ALL.data[col - 1].Name + "\n點擊以快速切換至該房間 /d" + (col - 1);
          var notification = false
          sendtext(text, notification);
        }
      }

    } else { //以下處理未登記的(新資料)=======================
      var newcol = Object.keys(ALL.FastMatch2).length;
      //以下處理FastMatch2==================================
      var R = ',"' + Room_text + '":' + newcol + "}"
      var y1 = JSON.stringify(ALL.FastMatch2)
      var y2 = String(y1)
      var y3 = y2.replace("}", R)
      var r = JSON.parse(y3);
      ALL.FastMatch2 = r; //打包好塞回去
      //以下處理data========================================
      var data_len = ALL.data.length;

      if (userName) {
        var U = userName
      } else {
        var U = Room_text
      }

      var N = {
        "RoomId": Room_text,
        "Name": (U + "✅"),
        "status": "normal",
        "Amount": 0,
        "Notice": true
      }
      ALL.data.splice(data_len, 0, N)
      //以下處理FastMatch===================================
      var data_len = ALL.data.length
      var Room_Name = ALL.data[data_len - 1].Name //這個已經有✅了!
      if (userName) {
        var U = userName
      } else {
        var U = Room_text
      }
      var R = ',"' + U + '✅":' + newcol + "}"
      var r = JSON.parse(String(JSON.stringify(ALL.FastMatch)).replace("}", R));
      ALL.FastMatch = r; //打包好塞回去

      var r = JSON.stringify(ALL);
      doc.setText(r); //寫入
      //以下處理sheetM的數值===================================================
      SheetM.getRange(1, newcol + 1).setValue(1)
      //以下處理sheet(寫入訊息)========================================================
      var col = ALL.FastMatch2[Room_text] + 1; //找欄位
      var LastRowM = parseInt(SheetM.getRange(1, col).getDisplayValue());

      if (userName) { //取得名子
        text = userName + ":" + String(estringa.events[0].message.text); //取得訊息
      } else {
        text = String(estringa.events[0].message.text); //取得訊息
      }

      SheetM.getRange(2, col).setValue(String(text)) //更新內容
      SheetM.getRange(1, col).setValue(1) //更新數量
      //以下處理doc(寫入訊息)==========================================================
      ALL.data[col - 1].Amount = ALL.data[col - 1].Amount + 1 //!!!!!!!!!!!!!!!!!!!!!!
      var r = JSON.stringify(ALL);
      doc.setText(r); //寫入
      //以下處理RoomKeyboard==================================================
      REST_keyboard()
      //以下通知有新的ID進來===================================================
      if (userName) {
        var U = userName
      } else {
        var U = Room_text
      }
      text = "已有新ID登入!!! id =\n" + U + "\n請盡快重新命名。"
      var notification = false
      sendtext(text, notification);
    }
  } else {
    GmailApp.sendEmail("email", "telegram-line出事啦", d + "\n" + ee);
  }
}

//以下各類函式支援
//=====================================================================================================
function Log(estringa, from, sheet_key, email) {
  var ee = JSON.stringify(estringa);
  var d = new Date();
  var SpreadSheet = SpreadsheetApp.openById(sheet_key);
  var Sheet = SpreadSheet.getSheetByName("Log");
  var SheetLastRow = Sheet.getLastRow();
  switch (from) {
    case 'telegram':
      Sheet.getRange(SheetLastRow + 1, 1).setValue(d);
      Sheet.getRange(SheetLastRow + 1, 2).setValue("Telegram");
      Sheet.getRange(SheetLastRow + 1, 3).setValue(ee);
      break;
    case 'line':
      Sheet.getRange(SheetLastRow + 1, 1).setValue(d);
      Sheet.getRange(SheetLastRow + 1, 2).setValue("Line");
      Sheet.getRange(SheetLastRow + 1, 3).setValue(ee);
      break;
    default:
      GmailApp.sendEmail(email, "telegram-line出事啦", d + " " + ee);
  }
}
//=================================================================================
function sendtext(text, notification) {
  var payload = {
    "method": "sendMessage",
    'chat_id': "Telegram_id",
    'text': text,
    'disable_notification': notification
  } //上面的Telegram_id因為最後發送隊對象都相同，所以在start()中補。
  start(payload);
}
//=================================================================
function ReplyKeyboardRemove(text) {
  var ReplyKeyboardRemove = {
    'remove_keyboard': true,
    'selective': false
  }
  var payload = {
    "method": "sendMessage",
    'chat_id': "Telegram_id",
    'text': text,
    'reply_markup': JSON.stringify(ReplyKeyboardRemove)
  }
  start(payload);
}
//=================================================================================
function ReplyKeyboardMakeup(keyboard, resize_keyboard, one_time_keyboard, text) {
  var ReplyKeyboardMakeup = {
    'keyboard': keyboard,
    'resize_keyboard': resize_keyboard,
    'one_time_keyboard': one_time_keyboard,
  }
  var payload = {
    "method": "sendMessage",
    'chat_id': "Telegram_id",
    'text': text,
    'reply_markup': JSON.stringify(ReplyKeyboardMakeup)
  }
  start(payload);
}
//=================================================================================
function keyboard_main(text, doc_key) {
  var doc = DocumentApp.openById(doc_key)
  var f = doc.getText();
  var ALL = JSON.parse(f); //獲取資料//轉成JSON物件
  var keyboard_main = ALL.RoomKeyboard
  var resize_keyboard = false
  var one_time_keyboard = false
  ReplyKeyboardMakeup(keyboard_main, resize_keyboard, one_time_keyboard, text)
}
//=================================================================================
function start(payload) {
  var base_json = base()
  var sheet_key = base_json.sheet_key
  var Telegram_bot_key = base_json.Telegram_bot_key
  var Telegram_id = base_json.Telegram_id
  payload.chat_id = Telegram_id //補上Telegram_id
  var data = {
    "method": "post",
    "payload": payload
  }
  var d = new Date();
  var SpreadSheet = SpreadsheetApp.openById(sheet_key);
  var Sheet = SpreadSheet.getSheetByName("紀錄發送的訊息");
  var LastRow = Sheet.getLastRow();
  Sheet.getRange(LastRow + 1, 1).setValue(d);
  Sheet.getRange(LastRow + 1, 3).setValue(data);
  var returned = UrlFetchApp.fetch("https://api.telegram.org/bot" + Telegram_bot_key + "/", data);
  Sheet.getRange(LastRow + 1, 2).setValue(returned); //確認有發成功
}
//=================================================================================
function In(name) {
  var arr = ["/main", "🔙 返回房間", "🔭 訊息狀態", "✔️ 關閉鍵盤", "🚀 發送訊息", "/exit", "📬 讀取留言",
    "🔖 重新命名", "🐳 開啟通知", "🔰 暫停通知", "🔃  重新整理", "🔥 刪除聊天室", "/delete"
  ];

  var flag = arr.some(function(value, index, array) {

    return value == name ? true : false;

  });
  return flag
}
//=================================================================================
function REST_keyboard() {
  var base_json = base()
  var doc = DocumentApp.openById(base_json.doc_key)
  var f = doc.getText();
  var ALL = JSON.parse(f); //獲取資料//轉成JSON物件
  var keyboard = [];
  var data_len = ALL.data.length;
  var T = data_len - 2 //因為要分兩欄故-2

  for (var i = 0; i <= T;) {

    if (ALL.data[i].Name) { //讓ND=暱稱，沒有就=Roomid
      var ND1 = ALL.data[i].Name
    } else {
      var ND1 = ALL.data[i].RoomId
    }
    if (ALL.data[i + 1].Name) { //讓ND=暱稱，沒有就=Roomid
      var ND2 = ALL.data[i + 1].Name
    } else {
      var ND2 = ALL.data[i + 1].RoomId
    }

    var A = [{
      'text': ND1
    }, {
      'text': ND2
    }]

    keyboard.splice(i, 0, A)
    i = i + 2;
  }
  if (data_len % 2) {
    var data_len2 = ALL.data.length - 1;
    var keyboard_len = keyboard.length

    if (ALL.data[data_len2].Name) { //讓ND=暱稱，沒有就=Roomid
      ND1 = ALL.data[data_len2].Name
    } else {
      ND1 = ALL.data[data_len2].RoomId
    }

    keyboard.splice(keyboard_len, 0, [{
      'text': ND1
    }])
  }

  keyboard.splice(0, 0, [{
    'text': "🔃  重新整理"
  }, {
    'text': "🔭 訊息狀態"
  }]) //加入返回鍵
  //=================================================
  ALL.RoomKeyboard = keyboard //寫回RoomKeynoard
  var r = JSON.stringify(ALL);
  doc.setText(r); //寫入
}
//=================================================================================
function REST_FastMatch1and2() { //重製快速索引
  var base_json = base()
  var doc_key = base_json.doc_key
  var doc = DocumentApp.openById(doc_key)
  var f = doc.getText();
  var ALL = JSON.parse(f); //獲取資料//轉成JSON物件

  var data_len = ALL.data.length
  ALL.FastMatch = {}
  ALL.FastMatch2 = {}
  for (var i = 0; i < data_len; i++) {
    var Name = ALL.data[i].Name
    ALL.FastMatch[Name] = i
  }
  for (var i = 0; i < data_len; i++) {
    var RoomId = ALL.data[i].RoomId
    ALL.FastMatch2[RoomId] = i
  }

  var r = JSON.stringify(ALL);
  doc.setText(r); //寫入
}
//=================================================================================
function AllRead() {
  var base_json = base()
  var sheet_key = base_json.sheet_key
  var doc_key = base_json.doc_key
  var doc = DocumentApp.openById(doc_key)
  var SpreadSheet = SpreadsheetApp.openById(sheet_key);
  var Sheet = SpreadSheet.getSheetByName("Line訊息區");

  var doc = DocumentApp.openById(doc_key)
  var f = doc.getText();
  var ALL = JSON.parse(f);
  var data_len = ALL.data.length
  var row1 = []
  for (var i = 0; i < data_len; i++) {
    ALL.data[i].Amount = 0
    row1.splice(i, 0, 0)
  }
  var LastCol = Sheet.getLastColumn();
  Sheet.clear();
  Sheet.appendRow(row1)

  var r = JSON.stringify(ALL);
  doc.setText(r); //寫入
}
//=================================================================================
function getUserName(userId) {
  var base_json = base()
  var CHANNEL_ACCESS_TOKEN = base_json.CHANNEL_ACCESS_TOKEN
  var header = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
  }
  var options = {
    'headers': header,
    'method': 'get'
  }
  try{
    var profile = JSON.parse(UrlFetchApp.fetch("https://api.line.me/v2/bot/profile/" + userId, options))
    var userName = profile.displayName
  }catch (r) {
    var userName = 0
  }


  return userName
}
//=================================================================================
function CP() {
  var base_json = base()
  var sheet_key = base_json.sheet_key
  var doc_key = base_json.doc_key
  var SpreadSheet = SpreadsheetApp.openById(sheet_key);
  var Sheet = SpreadSheet.getSheetByName("JSON備份");
  var LastRow = Sheet.getLastRow();

  var doc = DocumentApp.openById(doc_key)
  var f = doc.getText();
  var d = new Date();
  Sheet.getRange(LastRow + 1, 1).setValue(d);
  Sheet.getRange(LastRow + 1, 2).setValue(f);
}
//=================================================================================
function TTTTTTTT() {
  var base_json = base()
  var sheet_key = base_json.sheet_key
  var SpreadSheet = SpreadsheetApp.openById(sheet_key);
  var Sheet = SpreadSheet.getSheetByName("Line訊息區");

  Sheet.deleteColumn(1);

}
//=================================================================================
