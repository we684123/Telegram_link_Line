function doPost(e) {
  // Get a script lock, because we're about to modify a shared resource.
  //var lock = LockService.getScriptLock();
  // Wait for up to 30 seconds for other processes to finish.
  //lock.waitLock(30000);
  var base_json = base();
  var debug = 0; // 0=沒有要debug、1=模擬Telegram、2=模擬Line
  //模擬Telegram的話記得把要模擬的東西複製到分頁debug中的B1
  //模擬Line的話記得把要模擬的東西複製到分頁debug中的B2

  if (debug == 1) { //模擬Telegram
    var sheet_key = base_json.sheet_key
    var SpreadSheet = SpreadsheetApp.openById(sheet_key);
    var SheetD = SpreadSheet.getSheetByName("Debug");
    var e = SheetD.getRange(1, 2).getDisplayValue(); //讀取debug分頁中的模擬資訊
    var estringa = JSON.parse(e);
  } else if (debug == 2) { //模擬Line
    var sheet_key = base_json.sheet_key
    var SpreadSheet = SpreadsheetApp.openById(sheet_key);
    var SheetD = SpreadSheet.getSheetByName("Debug");
    var e = SheetD.getRange(2, 2).getDisplayValue(); //讀取debug分頁中的模擬資訊
    var estringa = JSON.parse(e);
  } else {
    var estringa = JSON.parse(e.postData.contents);
    var ee = JSON.stringify(estringa);
  }

  var text = "";
  var sheet_key = base_json.sheet_key
  var doc_key = base_json.doc_key
  var email = base_json.email
  var Telegram_bot_key = base_json.Telegram_bot_key
  var Telegram_id = base_json.Telegram_id
  var Line_id = base_json.Line_id
  var CHANNEL_ACCESS_TOKEN = base_json.CHANNEL_ACCESS_TOKEN;
  var FolderId = base_json.FolderId
  var gsURL = base_json.gsURL

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

    //以下檢查是否為群組================================================================
    if (estringa.message.chat.id < 0)
      return 0;
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
      var data = {
        "method": "post",
        "payload": payload
      }
      UrlFetchApp.fetch("https://api.telegram.org/bot" + Telegram_bot_key + "/", data);
      return 0;
    }
    //來源bot檢查==================================================================
    try {
      var confirm1 = ALL.TG_bot_updateID_array.length
      var TG_bot_updateID_array = JSON.stringify(ALL.TG_bot_updateID_array)
      var confirm2 = JSON.parse(TG_bot_updateID_array); //如果非json則會error 代表沒有
    } catch (e) { //新增 TG_bot_updateID_array
      CP();
      text = "已備份舊資料，更新doc資料庫中..."
      sendtext(text);
      var doc = DocumentApp.openById(doc_key)
      var f = doc.getText()
      var ALL = JSON.parse(f);
      ALL.TG_control_bot_updateID = estringa.update_id //存放主控bot的updateID
      ALL.TG_bot_updateID_array = [] //新增存放處
      var r = JSON.stringify(ALL);
      doc.setText(r); //寫入
      var TG_bot_updateID_array = ALL.TG_bot_updateID_array //再次轉型態
      text = "doc資料庫更新完畢!，如之後有問題可以手動還原\n#doc備份點"
      sendtext(text, notification);
      text = "請重新執行上一個指令_(:з」∠)_"
      sendtext(text, notification);
    }
    var now_updateID = estringa.update_id
    var TG_control_bot_updateID = ALL.TG_control_bot_updateID
    var TG_bot_updateID_array = JSON.parse(TG_bot_updateID_array)
    var opposite_RoomId = "主控bot"

    if (Math.abs(TG_control_bot_updateID - now_updateID) > 100) {
      for (var i = 0; i < TG_bot_updateID_array.length; i++) {
        var value = Math.abs(now_updateID - TG_bot_updateID_array[i].update_id)
        if (value < 100) { //治標不治本我也很絕望阿 (T口T)
          opposite_RoomId = TG_bot_updateID_array[i].line_roomID //找到指定bot了
          var TG_token = TG_bot_updateID_array[i].TG_token
          ALL.TG_bot_updateID_array[i].update_id = now_updateID

          var r = JSON.stringify(ALL);
          doc.setText(r); //寫入
          break;
        }
      }
    } else {
      ALL.TG_control_bot_updateID = now_updateID
      var r = JSON.stringify(ALL);
      doc.setText(r); //寫入
    }
    //來源bot檢查完成!================================================================
    if (opposite_RoomId != "主控bot") { //找到opposite_RoomID的話才會進來直接發
      var Line_id = opposite_RoomId
      if (estringa.message.text) {
        try {
          if (estringa.message.reply_to_message.text) {
            var rt = estringa.message.reply_to_message.text
            text = rt + "\n^針對此回復^\n" + Stext
          } else {
            text = Stext;
          }
        } catch (e) {
          text = Stext;
        }
        TG_Send_text_To_Line(Line_id, text)
      } else if (estringa.message.photo) { //如果是照片
        //以下選擇telegram照片並發到line
        var p = estringa.message.photo
        var max = p.length - 1;
        var photo_id = p[max].file_id
        TG_Send_Photo_To_Line(Line_id, photo_id)

        text = "(圖片已發送!)"
        chkey(TG_token);
        sendtext(text);
      } else if (estringa.message.video) {
        //以下選擇telegram video並發到line
        var video_id = estringa.message.video.file_id
        TG_Send_video_To_Line(Line_id, video_id, TG_token) //就你最特別,多吃一個TGtoken

        text = "(影片已發送!)"
        chkey(TG_token);
        sendtext(text);
      } else if (estringa.message.sticker) {
        text = "(暫時不支援貼圖傳送喔!)"
        chkey(TG_token);
        sendtext(text);
      } else if (estringa.message.audio) {
        text = "(暫時不支援audio傳送喔!)"
        var duration = estringa.message.audio.duration
        //var audio_id = estringa.message.audio.file_id
        chkey(TG_token);
        sendtext(text);
      } else if (estringa.message.voice) {
        text = "(暫時不支援voice傳送喔!)"
        //var duration = estringa.message.voice.duration
        chkey(TG_token);
        sendtext(text, notification);
      } else if (estringa.message.location) {

        var latitude = estringa.message.location.latitude
        var longitude = estringa.message.location.longitude
        var key = ""
        var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=" + key + "&language=zh-tw"
        var t = UrlFetchApp.fetch(url)
        var t2 = JSON.parse(t)
        var t3 = JSON.stringify(t2.results)
        var t4 = JSON.parse(t3) //這麼多t我也很無奈...
        var formatted_address = t4[0]["formatted_address"]
        //感謝 思考要在空白頁 http://blog.yslin.tw/2013/02/google-map-api.html
        TG_Send_location_To_Line(Line_id, latitude, longitude, formatted_address)
      }
      return 0;
    }
    //============================================================================
    if (estringa.message.text) { //如果是文字訊息
      if (mode == "🚀 發送訊息" && Stext != "/exit") {
        //以下準備接收telegram資訊並發到line
        if (In(Stext) || Stext.substr(0, 2) == "/d") {
          text = "請先按下 /exit 離開後再下指令喔!"
          sendtext(text);
          return 0;
        }
        try {
          if (estringa.message.reply_to_message.text) {
            var rt = estringa.message.reply_to_message.text
            text = rt + "\n^針對此回復^\n" + Stext
          } else {
            text = Stext;
          }
        } catch (e) {
          text = Stext;
        }
        var Line_id = ALL.opposite.RoomId;
        TG_Send_text_To_Line(Line_id, text)

        //================================================================
      } else if (mode == "🔖 重新命名") {
        if (ALL.FastMatch[Stext] != undefined) { //排除重名
          text = "名子不可重複，請重新輸入一個!";
          var notification = true
          sendtext(text, notification);
        } else if (In(Stext)) { //排除與指令重複
          text = "名子不可跟命令重複，請重新輸入一個!";
          var notification = true
          sendtext(text, notification);
        } else {
          var OName = ALL.opposite.Name
          var FM = ALL.FastMatch[OName]
          ALL.data[FM].Name = Stext + "✅"
          var y = JSON.parse((String(JSON.stringify(ALL.FastMatch)).replace(OName, Stext)).replace(Stext, Stext + "✅"));
          //var yy = JSON.parse(String(JSON.stringify(ALL.FastMatch)).replace(Stext, Stext + "✅"));
          //上面是取代  看了頭暈  當初怎麼寫出來的
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
      } else if (mode == "🔥 刪除房間" & Stext == "/delete") {
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
      } else if (mode == "⭐ 升級房間" & Stext == "/uproom") {
        ALL.mode = "/uproom"
        var r = JSON.stringify(ALL);
        doc.setText(r); //寫入

        text = "請輸入botToken"
        var notification = true
        sendtext(text, notification);
      } else if (mode == "/uproom") {
        if (Stext == "/unsetbot") {
          ALL.mode = 0
          var r = JSON.stringify(ALL);
          doc.setText(r); //寫入

          text = "已取消設定bot"
          var notification = false
          sendtext(text, notification);
          return 0
        }
        if (In(Stext) || Stext.substr(0, 2) == "/d") { //先檢查不會跟指令重複後再在下一步
          text = "請輸入token 而非指令!\n若要取消升級步驟請 /unsetbot"
          var notification = true
          sendtext(text, notification);
          return 0;
        }
        CP();
        try {
          var response = UrlFetchApp.fetch("https://api.telegram.org/bot" + Stext + "/setWebhook?url=" + gsURL + "&max_connections=1")
          var responseCode = response.getResponseCode()
          var responseBody = response.getContentText()
          var responseCode_json = JSON.parse(responseBody)
          var n = 0; //嘗試用類似chmod的方式判斷狀況

          if (responseCode === 200)
            n = n + 1
          if (responseCode_json.description == "Webhook was set")
            n = n + 2
          if (responseCode_json.description == "Webhook is already set")
            n = n + 2
          if (n == 3) {
            var aims = ALL.opposite.RoomId
            var number = ALL.FastMatch2[aims]
            ALL.mode = "/uproom_2" //切mode
            var line_roomID = ALL.data[number].RoomId
            var Room_Name = ALL.data[number].Name
            var array = {
              "update_id": 0, //下一個步驟補
              "TG_token": Stext,
              "line_roomID": line_roomID,
              "Room_Name": Room_Name
            }
            ALL.TG_bot_updateID_array.splice(ALL.TG_bot_updateID_array.length, 0, array)

            var r = JSON.stringify(ALL);
            doc.setText(r); //寫入

            text = "Webhook已連結!\n進入最後一個步驟了! \n請至新機器人聊天室那任意輸入文字以進行綁定。"
            sendtext(text);
          } else {
            text = "看來發生了一點錯誤.....\n請稍候再試....."
            sendtext(text);
          }
        } catch (e) {
          text = "看來發生了一點錯誤>_<\n請輸入正確token!"
          sendtext(text);
          text = e
          sendtext(text);
        }
      } else if (mode == "/uproom_2") {
        if (Math.abs(ALL.TG_control_bot_updateID - now_updateID) > 100) {
          var opposite_RoomId = "沒找到"
          var mais_i = "X"
          for (var i = 0; i < ALL.TG_bot_updateID_array.length; i++) {
            var value = Math.abs(ALL.now_updateID - ALL.TG_bot_updateID_array[i].update_id)
            if (value < 100) {
              opposite_RoomId = TG_bot_updateID_array[i].line_roomID //找到指定bot了
              ALL.TG_bot_updateID_array[i].update_id = now_updateID

              var r = JSON.stringify(ALL);
              doc.setText(r); //寫入
              break;
            }
            if (ALL.TG_bot_updateID_array[i].update_id == 0)
              aims_i = i
          }
          if (opposite_RoomId != "沒找到") {
            text = "這個 '聊天室' 已被其他bot佔用了!\n請至新的bot聊天室留言。"
            sendtext(text);
            return 0;
          }
          var aims = ALL.opposite.RoomId
          var number = ALL.FastMatch2[aims]
          ALL.data[number].botToken = ALL.TG_bot_updateID_array[aims_i].TG_token
          ALL.data[number].status = "已升級房間"
          ALL.mode = 0
          ALL.TG_bot_updateID_array[aims_i].update_id = now_updateID //寫入id
          var r = JSON.stringify(ALL);
          doc.setText(r); //寫入

          text = "已升級成功(๑•̀ㅂ•́)و✧\n\n" + "房間狀態:\n" + JSON.stringify(ALL.data[number])
          keyboard_main(text, doc_key)
        } else {
          text = "請至__新機器人聊天室__!!!那任意輸入文字以進行綁定。\n不是這裡喔!"
          sendtext(text);
        }
      } else if (mode == "💫 降級房間" & Stext == "/droproom") {
        var aims = ALL.opposite.RoomId
        var number = ALL.FastMatch2[aims]
        var D_token = ALL.data[number].botToken
        try {
          var response = UrlFetchApp.fetch("https://api.telegram.org/bot" + D_token + "/deleteWebhook");
          var responseCode = response.getResponseCode()
        } catch (e) {
          text = "降級失敗! 詳情如下：\n" + "responseCode：" + responseCode + "\nerror：\n" + e
          sendtext(text);
          return 0;
        }


        delete ALL.data[number].botToken
        ALL.data[number].status = "normal"
        ALL.mode = 0 //讓mode回復正常

        var k = "沒有找到"
        for (var j = 0; j < ALL.TG_bot_updateID_array.length; j++) {
          if (TG_bot_updateID_array[j].line_roomID == ALL.opposite.RoomId) {
            k = j
            break
          }
        }
        if (k = "沒有找到") {
          var d = new Date();
          GmailApp.sendEmail(email, "telegram-line出事啦(沒有找到)", d + "\n\n" + ee + "\n\n" + e + "\n\n" + k);
        } else {
          ALL.TG_bot_updateID_array.splice(k, 1)

        }

        var r = JSON.stringify(ALL);
        doc.setText(r); //寫入

        text = "已降級成功(๑•̀ㅂ•́)و✧\n\n" + "房間狀態:\n" + JSON.stringify(ALL.data[number])
        keyboard_main(text, doc_key)
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

              var Amount = SheetM.getRange(1, col).getDisplayValue();
              Amount = JSON.parse(Amount)
              var st = Amount[1] + 2
              var ed = Amount[0] + 1
              Logger.log("ststst = ", st)
              Logger.log("ededed = ", ed)

              function upMessageData(i, col, ed) {
                SheetM.getRange(i, col).setValue("")
                var t = "[" + (ed - 1) + "," + (i - 1) + "]"
                SheetM.getRange(1, col).setValue(t);
                //SheetM.getRange(1, col).setValue(Amount);
              }

              for (var i = st; i <= ed; i++) {
                text = SheetM.getRange(i, col).getDisplayValue()
                Logger.log("text = ", text)
                var message_json = JSON.parse(text);

                if (message_json.type == "text") {
                  var p = message_json.userName + "：\n" + message_json.text
                  //Logger.log("ppp = ", p)
                  var notification = true
                  sendtext(p, notification);
                  //{"type":"text","message_id":"6481485539588","userName":"永格天@李孟哲",
                  //"text":"51"}
                  upMessageData(i, col, ed)
                } else if (message_json.type == "image") {
                  var url = message_json.DURL
                  var notification = true
                  var caption = "來自: " + message_json.userName
                  sendPhoto(url, notification, caption)
                  //sendPhoto(url, notification)
                  //{"type":"image","message_id":"6548749837597","userName":"永格天@李孟哲",
                  //"DURL":"https://drive.google.com/uc?export=download&id=0B-0JNsk9kLZktWQ1U"}
                  upMessageData(i, col, ed)
                } else if (message_json.type == "sticker") {
                  var sticker_png_url = "https://stickershop.line-scdn.net/stickershop/v1/sticker/" + message_json.stickerId + "/android/sticker.png;compress=true"
                  var notification = true
                  var caption = "來自: " + message_json.userName
                  sendPhoto(sticker_png_url, notification, caption)
                  //https://stickershop.line-scdn.net/stickershop/v1/sticker/3214753/android/sticker.png;compress=true
                  /*
                  //下面是舊的方式 現在最近去爬line發現line的東西很好爬，異常好爬(怕.png
                  //是有方法可以直接發貼圖啦，但這樣速度會變慢 乾脆直接發圖。
                  text = "[" + message_json.type + "]\nstickerId:" + message_json.stickerId + "\npackageId:" + message_json.packageId
                  var notification = true
                  sendtext(text, notification);
                  */
                  //{"type":"sticker","message_id":"6548799151539","userName":"永格天@李孟哲",
                  //"stickerId":"502","packageId":"2"}
                  upMessageData(i, col, ed)
                } else if (message_json.type == "audio") {
                  var url = "抱歉!請至該連結下載或聆聽!\n" + message_json.DURL + "\n\n來自: " + message_json.userName
                  var notification = true
                  sendtext(url, notification)
                  //{"type":"audio","message_id":"6548810000783","userName":"永格天@李孟哲",
                  //"DURL":"https://drive.google.com/uc?export=download&id=0B-0JNsk91ZKakE5Q1U"}
                  upMessageData(i, col, ed)
                } else if (message_json.type == "location") {
                  var notification = true
                  if (message_json.address) {
                    var text = message_json.address
                    sendtext(text, notification);
                  }
                  var latitude = message_json.latitude
                  var longitude = message_json.longitude
                  sendLocation(latitude, longitude, notification)
                  var text = "以上來自: " + message_json.userName
                  sendtext(text, notification);
                  //{"type":"location","message_id":"6548803214227","userName":"永格天@李孟哲",
                  //"address":"260台灣宜蘭縣宜蘭市舊城西路107號",
                  //"latitude":24.759711,"longitude":121.750114}
                  upMessageData(i, col, ed)
                } else if (message_json.type == "video") {
                  var url = message_json.DURL
                  var notification = true
                  var caption = "來自: " + message_json.userName
                  sendVoice(url, notification, caption)
                  //{"type":"video","message_id":"6548802053751","userName":"永格天@李孟哲",
                  //"DURL":"https://drive.google.com/uc?export=download&id=0B-0JNsk9kL8vc1WQ1U"}
                  upMessageData(i, col, ed)
                } else if (message_json.type == "file") {
                  var url = message_json.DURL + "\n\n來自:  " + message_json.userName
                  var notification = true
                  sendtext(text, notification);
                  //senddocument(url)
                  upMessageData(i, col, ed)
                }
              }

              ALL.data[ALL.FastMatch2[ALL.opposite.RoomId]].Amount = 0;
              var r = JSON.stringify(ALL);
              doc.setText(r); //寫入
              SheetM.getRange(1, col).setValue("[0,0]")

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
          case '🔥 刪除房間':
            ALL.mode = "🔥 刪除房間"
            var r = JSON.stringify(ALL);
            doc.setText(r); //寫入
            text = "你確定要刪除 " + ALL.opposite.Name + " 嗎?\n" + "若是請按一下 /delete\n" +
              "若沒按下則不會刪除!!!"
            sendtext(text);
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
            sendtext(text);
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
            sendtext(text);
            //以下處理RoomKeyboard==================================================
            REST_keyboard(doc_key) //重新編排keyborad
            break;
          case '⭐ 升級房間':
            ALL.mode = "⭐ 升級房間"
            var r = JSON.stringify(ALL);
            doc.setText(r); //寫入

            text = "⭐ 升級房間功能介紹：\n升級房間後，以後來自該對象(Line)的訊息皆會及時傳到新的bot聊天室，而不會傳到這個bot聊天室中，這個功能是可以回來這裡取消的。"
            sendtext(text);

            text = "您確定要升級 " + ALL.opposite.Name + " 嗎?\n若是請按一下 /uproom \n" +
              "若沒按下則不會升級!!!"
            sendtext(text);
            break;
          case '💫 降級房間':
            ALL.mode = "💫 降級房間"
            var r = JSON.stringify(ALL);
            doc.setText(r); //寫入

            text = "您確定要降級 " + ALL.opposite.Name + " 嗎?\n若是請按一下 /droproom \n" +
              "若沒按下則不會降級!!!"
            sendtext(text);
            break;
          case '/debug':
            REST_FastMatch1and2();
            REST_keyboard();
            //還有sheet那邊的訊息區處理還未 (Amount)
            ALL.mode = 0
            var r = JSON.stringify(ALL);
            doc.setText(r); //寫入
            text = "已debug"
            sendtext(text);
            break;
          case '/AllRead':
          case '/Allread':
          case '/allRead':
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
              var keyboard = [
                [{
                  'text': '🚀 發送訊息'
                }, {
                  'text': '📬 讀取留言'
                }, {
                  'text': '🔖 重新命名'
                }],
                [{
                  'text': '⭐ 升級房間'
                }, {
                  'text': '🐳 開啟通知'
                }, {
                  'text': '🔰 暫停通知'
                }],
                [{
                  'text': "🔥 刪除房間"
                }, {
                  'text': "🔙 返回房間"
                }]
              ]
              var keyboard2 = [
                [{
                  'text': '💫 降級房間'
                }, {
                  'text': "🔙 返回房間"
                }]
              ]

              if (ALL.data[FM].botToken) { //如果遇到已升級的則改"降級"
                keyboard = keyboard2
              }
              var resize_keyboard = true
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
                  'text': '⭐ 升級房間'
                }, {
                  'text': '🐳 開啟通知'
                }, {
                  'text': '🔰 暫停通知'
                }],
                [{
                  'text': "🔥 刪除房間"
                }, {
                  'text': "🔙 返回房間"
                }]
              ]
              var keyboard2 = [
                [{
                  'text': '💫 降級房間'
                }, {
                  'text': "🔙 返回房間"
                }]
              ]

              if (ALL.data[FM].botToken) { //如果遇到已升級的則改"降級"
                keyboard = keyboard2
              }
              var resize_keyboard = true
              var one_time_keyboard = false
              ReplyKeyboardMakeup(keyboard, resize_keyboard, one_time_keyboard, text)
            } else {
              text = "錯誤的操作喔（ ・∀・），請檢查環境是否錯誤"
              sendtext(text);
            }
        }
      }
    } else if (estringa.message.photo) { //如果是照片
      if (mode == "🚀 發送訊息") {
        //以下選擇telegram照片並發到line
        var p = estringa.message.photo
        var max = p.length - 1;

        var photo_id = p[max].file_id
        var Line_id = ALL.opposite.RoomId;
        TG_Send_Photo_To_Line(Line_id, photo_id)
        text = "(圖片已發送!)"
        sendtext(text);
      } else {
        text = "錯誤的操作喔（ ・∀・），請檢查環境是否錯誤"
        sendtext(text)
      }
    } else if (estringa.message.video) {
      if (mode == "🚀 發送訊息") {
        //以下選擇telegram video並發到line
        var video_id = estringa.message.video.file_id
        var Line_id = ALL.opposite.RoomId;
        TG_Send_video_To_Line(Line_id, video_id)
        text = "(影片已發送!)"
        sendtext(text);
      } else {
        text = "錯誤的操作喔（ ・∀・），請檢查環境是否錯誤"
        sendtext(text);
      }
    } else if (estringa.message.sticker) {
      if (mode == "🚀 發送訊息") {
        text = "(暫時不支援貼圖傳送喔!)"
        sendtext(text);
      } else {
        text = "錯誤的操作喔（ ・∀・），請檢查環境是否錯誤"
        sendtext(text);
      }
    } else if (estringa.message.audio) {
      if (mode == "🚀 發送訊息") {
        text = "(暫時不支援audio傳送喔!)"
        var duration = estringa.message.audio.duration
        //var audio_id = estringa.message.audio.file_id
        //TG_Send_audio_To_Line(Line_id, audio_id, duration)
        sendtext(text, notification);
      } else {
        text = "錯誤的操作喔（ ・∀・），請檢查環境是否錯誤"
        var notification = false
        sendtext(text, notification);
      }
    } else if (estringa.message.voice) {
      if (mode == "🚀 發送訊息") {
        text = "(暫時不支援voice傳送喔!)"
        //var duration = estringa.message.voice.duration
        //TG_Send_audio_To_Line(Line_id, audio_id, duration)
        sendtext(text, notification);
      } else {
        text = "錯誤的操作喔（ ・∀・），請檢查環境是否錯誤"
        sendtext(text);
      }
    } else if (estringa.message.location) {
      if (mode == "🚀 發送訊息") {
        var latitude = estringa.message.location.latitude
        var longitude = estringa.message.location.longitude
        var key = ""
        var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=" + key + "&language=zh-tw"
        var t = UrlFetchApp.fetch(url)
        var t2 = JSON.parse(t)
        var t3 = JSON.stringify(t2.results)
        var t4 = JSON.parse(t3) //這麼多t我也很無奈...
        var formatted_address = t4[0]["formatted_address"]
        //感謝 思考要在空白頁 http://blog.yslin.tw/2013/02/google-map-api.html
        TG_Send_location_To_Line(Line_id, latitude, longitude, formatted_address)
      } else {
        text = "錯誤的操作喔（ ・∀・），請檢查環境是否錯誤"
        sendtext(text);
      }
    }

    //=====================================================================================================
  } else if (estringa.events[0].timestamp) {
    //以下來自line
    var from = 'line';
    Log(estringa, from, sheet_key, email); //log

    var cutSource = estringa.events[0].source; //好長 看的我都花了 縮減個
    if (cutSource.type == "user") { //舊格式整理
      var Room_text = cutSource.userId; //Room_text = 要發送的地址
      var userId = cutSource.userId
    } else if (cutSource.type == "room") {
      var Room_text = cutSource.roomId;
      if (cutSource.userId) {
        var userId = cutSource.userId
      }
    } else {
      var Room_text = cutSource.groupId;
      if (cutSource.userId) {
        var userId = cutSource.userId
      }
    } //強制轉ID

    if (cutSource.userId) { //嘗試取得發話人名稱
      var u = cutSource.userId
      if (cutSource.groupId) { //看是group or room 再取出對應數值
        var g = cutSource.groupId
      } else {
        var g = cutSource.roomId
      }
      if (cutSource.type == "user") {
        var userName = getUserName(u); //如果有則用
      } else {
        var userName = newGetUserName(u, g);
      }
    }

    if (!userName)
      userName = "";
    var cutMessage = estringa.events[0].message; //好長 看的我都花了 縮減個

    var message_json = { //前面先寫 後面補充
      "type": "type",
      "message_id": cutMessage.id,
      "userName": userName
    }

    if (cutMessage.type == "text") { //文字
      message_json.type = "text"
      message_json.text = String(cutMessage.text)
    } else if (cutMessage.type == "image") { //圖片
      message_json.type = "image"
      downloadFromLine(cutMessage.id)
      message_json.DURL = getGdriveFileDownloadURL()
    } else if (cutMessage.type == "sticker") { //貼圖
      message_json.type = "sticker"
      message_json.stickerId = cutMessage.stickerId
      message_json.packageId = cutMessage.packageId
    } else if (cutMessage.type == "audio") { //錄音
      message_json.type = "audio"
      downloadFromLine(cutMessage.id)
      message_json.DURL = getGdriveFileDownloadURL()
    } else if (cutMessage.type == "location") { //位置
      message_json.type = "location"
      message_json.address = cutMessage.address
      message_json.latitude = cutMessage.latitude
      message_json.longitude = cutMessage.longitude
    } else if (cutMessage.type == "video") { //影片
      message_json.type = "video"
      downloadFromLine(cutMessage.id)
      message_json.DURL = getGdriveFileDownloadURL()
    } else if (cutMessage.type == "file") { //Line現在居然不能傳送文件 這應該沒用了(?
      message_json.type = "file"
      downloadFromLine(cutMessage.id)
      message_json.DURL = getGdriveFileDownloadURL()
    }
    var text = JSON.stringify(message_json)

    var SpreadSheet = SpreadsheetApp.openById(sheet_key);
    var SheetM = SpreadSheet.getSheetByName("Line訊息區");
    var doc = DocumentApp.openById(doc_key)
    var f = doc.getText();
    var ALL = JSON.parse(f);
    //================================================================
    if (ALL.FastMatch2[Room_text] != undefined) { //以下處理已登記的
      if (ALL.data[ALL.FastMatch2[Room_text]].status == "已升級房間") {
        chkey(ALL.data[ALL.FastMatch2[Room_text]].botToken)
        try {
          if (message_json.type == "text") {
            var p = message_json.userName + "：\n" + message_json.text
            //Logger.log("ppp = ", p)
            sendtext(p);
            //{"type":"text","message_id":"6481485539588","userName":"永格天@李孟哲",
            //"text":"51"}
          } else if (message_json.type == "image") {
            var url = message_json.DURL
            var notification = false
            var caption = "來自: " + message_json.userName
            sendPhoto(url, notification, caption)
            //sendPhoto(url, notification)
            //{"type":"image","message_id":"6548749837597","userName":"永格天@李孟哲",
            //"DURL":"https://drive.google.com/uc?export=download&id=0B-0JNsk9kLZktWQ1U"}
          } else if (message_json.type == "sticker") {
            var sticker_png_url = "https://stickershop.line-scdn.net/stickershop/v1/sticker/" + message_json.stickerId + "/android/sticker.png;compress=true"
            var notification = false
            var caption = "來自: " + message_json.userName
            sendPhoto(sticker_png_url, notification, caption)
            //https://stickershop.line-scdn.net/stickershop/v1/sticker/3214753/android/sticker.png;compress=true
            /*
            //下面是舊的方式 現在最近去爬line發現line的東西很好爬，異常好爬(怕.png
            //是有方法可以直接發貼圖啦，但這樣速度會變慢 乾脆直接發圖。
            text = "[" + message_json.type + "]\nstickerId:" + message_json.stickerId + "\npackageId:" + message_json.packageId
            var notification = true
            sendtext(text, notification);
            */
            //{"type":"sticker","message_id":"6548799151539","userName":"永格天@李孟哲",
            //"stickerId":"502","packageId":"2"}
          } else if (message_json.type == "audio") {
            var url = "抱歉!請至該連結下載或聆聽!\n" + message_json.DURL + "\n\n來自: " + message_json.userName
            sendtext(url)
            //{"type":"audio","message_id":"6548810000783","userName":"永格天@李孟哲",
            //"DURL":"https://drive.google.com/uc?export=download&id=0B-0JNsk91ZKakE5Q1U"}
          } else if (message_json.type == "location") {
            var notification = false
            if (message_json.address) {
              var text = message_json.address
              sendtext(text, notification);
            }
            var latitude = message_json.latitude
            var longitude = message_json.longitude
            sendLocation(latitude, longitude, notification)
            var text = "以上來自: " + message_json.userName
            sendtext(text, notification);
            //{"type":"location","message_id":"6548803214227","userName":"永格天@李孟哲",
            //"address":"260台灣宜蘭縣宜蘭市舊城西路107號",
            //"latitude":24.759711,"longitude":121.750114}
          } else if (message_json.type == "video") {
            var url = message_json.DURL
            var notification = false
            var caption = "來自: " + message_json.userName
            sendVoice(url, notification, caption)
            //{"type":"video","message_id":"6548802053751","userName":"永格天@李孟哲",
            //"DURL":"https://drive.google.com/uc?export=download&id=0B-0JNsk9kL8vc1WQ1U"}
          } else if (message_json.type == "file") {
            var url = message_json.DURL + "\n\n來自:  " + message_json.userName
            sendtext(text);
            //senddocument(url)
          }
        } catch (e) {
          chkey(Telegram_bot_key)
          text = "030....你是否忘記先跟新辦的bot說過話呢?\n請看下列錯誤回報以debug!"
          sendtext(text);
          text = e;
          sendtext(text);
        }
      } else if (ALL.mode == "🚀 發送訊息" && Room_text == ALL.opposite.RoomId) {
        if (message_json.type == "text") {
          var p = message_json.userName + "：\n" + message_json.text
          //Logger.log("ppp = ", p)
          sendtext(p);
          //{"type":"text","message_id":"6481485539588","userName":"永格天@李孟哲",
          //"text":"51"}
        } else if (message_json.type == "image") {
          var url = message_json.DURL
          var notification = true
          var caption = "來自: " + message_json.userName
          sendtext("(正在傳送圖片，請稍後...)", notification);
          sendPhoto(url, notification, caption)
          //sendPhoto(url, notification)
          //{"type":"image","message_id":"6548749837597","userName":"永格天@李孟哲",
          //"DURL":"https://drive.google.com/uc?export=download&id=0B-0JNsk9kLZktWQ1U"}
        } else if (message_json.type == "sticker") {
          var sticker_png_url = "https://stickershop.line-scdn.net/stickershop/v1/sticker/" + message_json.stickerId + "/android/sticker.png;compress=true"
          var notification = true
          var caption = "來自: " + message_json.
          sendtext("(正在傳送貼圖，請稍後...)", notification);
          sendPhoto(sticker_png_url, notification, caption)
          //https://stickershop.line-scdn.net/stickershop/v1/sticker/3214753/android/sticker.png;compress=true
          /*
          //下面是舊的方式 現在最近去爬line發現line的東西很好爬，異常好爬(怕.png
          //是有方法可以直接發貼圖啦，但這樣速度會變慢 乾脆直接發圖。
          text = "[" + message_json.type + "]\nstickerId:" + message_json.stickerId + "\npackageId:" + message_json.packageId
          var notification = true
          sendtext(text, notification);
          */
          //{"type":"sticker","message_id":"6548799151539","userName":"永格天@李孟哲",
          //"stickerId":"502","packageId":"2"}
        } else if (message_json.type == "audio") {
          var url = "抱歉!請至該連結下載或聆聽!\n" + message_json.DURL + "\n\n來自: " + message_json.userName
          var notification = true
          sendtext(url, notification)
          //{"type":"audio","message_id":"6548810000783","userName":"永格天@李孟哲",
          //"DURL":"https://drive.google.com/uc?export=download&id=0B-0JNsk91ZKakE5Q1U"}
        } else if (message_json.type == "location") {
          var notification = true
          if (message_json.address) {
            var text = message_json.address
            sendtext(text, notification);
          }
          var latitude = message_json.latitude
          var longitude = message_json.longitude
          sendLocation(latitude, longitude, notification)
          var text = "以上來自: " + message_json.userName
          sendtext(text, notification);
          //{"type":"location","message_id":"6548803214227","userName":"永格天@李孟哲",
          //"address":"260台灣宜蘭縣宜蘭市舊城西路107號",
          //"latitude":24.759711,"longitude":121.750114}
        } else if (message_json.type == "video") {
          var url = message_json.DURL
          var notification = true
          var caption = "來自: " + message_json.userName
          sendVoice(url, notification, caption)
          //{"type":"video","message_id":"6548802053751","userName":"永格天@李孟哲",
          //"DURL":"https://drive.google.com/uc?export=download&id=0B-0JNsk9kL8vc1WQ1U"}
        } else if (message_json.type == "file") {
          var url = message_json.DURL + "\n\n來自:  " + message_json.userName
          var notification = true
          sendtext(text, notification);
          //senddocument(url)
        }
      } else {
        //以下處理sheet========================================================
        var col = ALL.FastMatch2[Room_text] + 1; //找欄位
        var LastRowM = SheetM.getRange(1, col).getDisplayValue();
        LastRowM = JSON.parse(LastRowM)
        SheetM.getRange(LastRowM[0] + 2, col).setValue(String(text)) //更新內容
        LastRowM[0] = LastRowM[0] + 1;
        SheetM.getRange(1, col).setValue(JSON.stringify(LastRowM)) //更新數量
        //以下處理doc==========================================================
        ALL.data[col - 1].Amount = ALL.data[col - 1].Amount + 1 //!!!!!!!!!!!!!!!!!!!!!!
        var r = JSON.stringify(ALL);
        doc.setText(r); //寫入
        //以下處理通知=========================================================
        var Notice = ALL.data[col - 1].Notice //通知 true or false
        if (Notice) {
          text = "你有新訊息!\n來自：" + ALL.data[col - 1].Name + "\n點擊以快速切換至該房間 /d" + (col - 1);
          sendtext(text);
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
      SheetM.getRange(1, newcol + 1).setValue("[1,0]")
      //以下處理sheet(寫入訊息)========================================================
      var col = ALL.FastMatch2[Room_text] + 1; //找欄位
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
  //lock.releaseLock();
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
function In(name) {
  var arr = ["/main", "🔙 返回房間", "🔭 訊息狀態", "✔️ 關閉鍵盤", "🚀 發送訊息", "/exit", "📬 讀取留言",
    "🔖 重新命名", "🐳 開啟通知", "🔰 暫停通知", "🔃  重新整理", "🔥 刪除房間", "/delete", "/debug",
    "/AllRead", "/allread", "Allread", "allRead", "⭐️ 升級房間", "💫 降級房間", "/uproom", "droproom"
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
  var FolderId = base_json.FolderId
  var doc = DocumentApp.openById(doc_key)
  var SpreadSheet = SpreadsheetApp.openById(sheet_key);
  var Sheet = SpreadSheet.getSheetByName("Line訊息區");
  var Folder = DriveApp.getFolderById(FolderId); //download_from_line

  var doc = DocumentApp.openById(doc_key)
  var f = doc.getText();
  var ALL = JSON.parse(f);
  var data_len = ALL.data.length
  var row1 = []
  for (var i = 0; i < data_len; i++) {
    ALL.data[i].Amount = 0
    row1.splice(i, 0, "[0,0]")
  }
  var LastCol = Sheet.getLastColumn();
  Sheet.clear();
  Sheet.appendRow(row1)

  var r = JSON.stringify(ALL);
  doc.setText(r); //寫入

  var files = Folder.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    file.setTrashed(true)
  }
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
  try {
    var profile = JSON.parse(UrlFetchApp.fetch("https://api.line.me/v2/bot/profile/" + userId, options))
    var userName = profile.displayName
  } catch (r) {
    var userName = "未知姓名"
  }
  return userName
}
//=================================================================================
function newGetUserName(userId, groupId) {
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
  try {
    var profile = UrlFetchApp.fetch("https://api.line.me/v2/bot/group/" + groupId + "/member/" + userId, options)
    profile = JSON.parse(profile)
    var userName = profile.displayName
  } catch (r) {
    var userName = "未知姓名"
  }
  //Logger.log("TTTTTT = ",userName)
  //var notification = false
  //sendtext(profile, notification);
  //sendtext(userName, notification);

  return userName
}
//=================================================================================
function TG_Send_text_To_Line(Line_id, text) {
  var base_json = base()
  var CHANNEL_ACCESS_TOKEN = base_json.CHANNEL_ACCESS_TOKEN;

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
}
//=================================================================================
function TG_Send_Photo_To_Line(Line_id, photo_id) {
  var base_json = base()
  var CHANNEL_ACCESS_TOKEN = base_json.CHANNEL_ACCESS_TOKEN;
  var G = TGdownloadURL(getpath(photo_id))

  var url = 'https://api.line.me/v2/bot/message/push';
  //--------------------------------------------------
  var retMsg = [{
    "type": "image",
    "originalContentUrl": G,
    "previewImageUrl": G
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
}
//=================================================================================
function TG_Send_video_To_Line(Line_id, video_id, Telegram_bot_key) {
  //為什麼就跟錄音跟影片要原本的TG_token?? 是說不用原本的就是TG出bug了吧?
  var base_json = base()
  var CHANNEL_ACCESS_TOKEN = base_json.CHANNEL_ACCESS_TOKEN;
  var G = TGdownloadURL(getpath(video_id, Telegram_bot_key), Telegram_bot_key)

  var url = 'https://api.line.me/v2/bot/message/push';
  //--------------------------------------------------
  var retMsg = [{
    "type": "video",
    "originalContentUrl": G,
    "previewImageUrl": G
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
}
//=================================================================================
function TG_Send_audio_To_Line(Line_id, audio_id, duration, Telegram_bot_key) {
  //為什麼就跟錄音跟影片要原本的TG_token?? 是說不用原本的就是TG出bug了吧?
  var base_json = base()
  var CHANNEL_ACCESS_TOKEN = base_json.CHANNEL_ACCESS_TOKEN;
  var G = TGdownloadURL(getpath(audio_id, Telegram_bot_key), Telegram_bot_key)

  var url = 'https://api.line.me/v2/bot/message/push';
  //--------------------------------------------------
  var retMsg = [{
    "type": "audio",
    "originalContentUrl": G,
    "duration": duration
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
}
//=================================================================================
function TG_Send_location_To_Line(Line_id, latitude, longitude, formatted_address) {
  var base_json = base()
  var CHANNEL_ACCESS_TOKEN = base_json.CHANNEL_ACCESS_TOKEN;

  var url = 'https://api.line.me/v2/bot/message/push';
  //--------------------------------------------------
  var retMsg = [{
    "type": "location",
    "title": "位置訊息",
    "address": formatted_address,
    "latitude": latitude,
    "longitude": longitude
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
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  }
  //--------------------------------------------------
  try {
    var f = UrlFetchApp.fetch(url, options);
    var e = f
    var base_json = base()
    var sheet_key = base_json.sheet_key
    var SpreadSheet = SpreadsheetApp.openById(sheet_key);
    var SheetD = SpreadSheet.getSheetByName("Debug");
    var LastRowD = SheetD.getLastRow();
    SheetD.getRange(LastRowD + 1, 2).setValue(e);
    Logger.log("FFFFFFFFFFFF = ", e)
  } catch (e) {
    var base_json = base()
    var sheet_key = base_json.sheet_key
    var SpreadSheet = SpreadsheetApp.openById(sheet_key);
    var SheetD = SpreadSheet.getSheetByName("Debug");
    var LastRowD = SheetD.getLastRow();
    SheetD.getRange(LastRowD + 1, 2).setValue(e);
    Logger.log("FFFFFFFFFFFF = ", e)
  }
}
//=================================================================================
function getpath(id, Telegram_bot_key) {
  var base_json = base()
  var Telegram_bot_key = Telegram_bot_key || base_json.Telegram_bot_key
  url = "https://api.telegram.org/bot" + Telegram_bot_key + "/getFile?file_id=" + id
  var html = UrlFetchApp.fetch(url);
  html = JSON.parse(html);
  //Logger.log("TTTTTT = ",html);
  var path = html.result.file_path
  return path;
}
//=================================================================================
function TGdownloadURL(path, Telegram_bot_key) {
  var base_json = base()
  var Telegram_bot_key = Telegram_bot_key || base_json.Telegram_bot_key
  var TGDurl = "https://api.telegram.org/file/bot" + Telegram_bot_key + "/" + path
  return TGDurl;
}
//=================================================================================
function list2() { //顯示指定資料夾資料
  var base_json = base()
  var FolderId = base_json.FolderId

  var Folder = DriveApp.getFolderById(FolderId); //download_from_line
  var files = Folder.getFiles();
  var file_array = "[]";
  var file_array_json = JSON.parse(file_array)
  while (files.hasNext()) {
    var file = files.next();
    var file_data = {
      "fileName": file.getName(),
      "fileId": file.getId(),
      "fileDownloadURL": ("https://drive.google.com/uc?export=download&id=" + file.getId()),
      "fileSize": file.getSize(),
      "fileDateCreated": file.getDateCreated(),
      "fileTimeStamp": file.getDescription()
    }
    var i = file_array_json.length;
    file_array_json.splice(i, 0, file_data)

  }
  var k = JSON.stringify(file_array_json)
  return k
}
//==========================================================================
function getGdriveFileDownloadURL() {
  var y = list2()
  var list = JSON.parse(y)
  var g = list.sort(function(a, b) {
    if (parseInt(a.fileTimeStamp) > parseInt(b.fileTimeStamp)) {
      return 1;
    }
    if (parseInt(a.fileTimeStamp) < parseInt(b.fileTimeStamp)) {
      return -1;
    }
    return 0;
  });
  var g_len = g.length - 1
  //Logger.log("len = ",g_len)
  //Logger.log("FDDDDD = ",g[g_len].fileDownloadURL)
  return g[g_len].fileDownloadURL
}
//=================================================================================
function downloadFromLine(linkId) {
  //讓我們感謝河馬大大!m(_ _)m
  //https://riverhippo.blogspot.tw/2016/02/google-drive-direct-link.html
  var base_json = base()
  var CHANNEL_ACCESS_TOKEN = base_json.CHANNEL_ACCESS_TOKEN;
  var FolderId = base_json.FolderId;
  var Folder = DriveApp.getFolderById(FolderId); //download_from_line

  var id = linkId;
  var url = 'https://api.line.me/v2/bot/message/' + id + '/content';
  //--------------------------------------------------
  var header = {
    'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN
  }
  var options = {
    'headers': header,
    'method': 'get'
  }
  //--------------------------------------------------
  var blob = UrlFetchApp.fetch(url, options);
  Folder.createFile(blob)
  ch_Name_and_Description()
}
//=================================================================================
function ch_Name_and_Description() {
  var base_json = base()
  var FolderId = base_json.FolderId
  var Folder = DriveApp.getFolderById(FolderId); //download_from_line
  var files = Folder.getFiles();

  while (files.hasNext()) {
    var file = files.next();
    if (file.getName() == 'content.jpg' || file.getName() == 'content.mp4') {
      var d = new Date();
      var getFullYear = d.getFullYear(); // 2016 年
      var getMonth = d.getMonth(); // 12 月
      var getDate = d.getDate(); // 22 日(號)
      var getHours = d.getHours(); // 16 時(0~23.0)
      var getMinutes = d.getMinutes(); // 29 分
      var getSeconds = d.getSeconds(); // 17 秒
      var getMilliseconds = d.getMilliseconds(); // 234 毫秒
      file.setName(getFullYear + "_" + getMonth + "_" + getDate + "_" + getHours + "_" + getMinutes + "_" + getSeconds + "_" + getMilliseconds)
      file.setDescription(d.getTime());
      //Logger.log("NNNNNNN = ", file.getName())
      break;
    }
    if (file.getName() == 'content') {
      var d = new Date();
      var getFullYear = d.getFullYear(); // 2016 年
      var getMonth = d.getMonth(); // 12 月
      var getDate = d.getDate(); // 22 日(號)
      var getHours = d.getHours(); // 16 時(0~23.0)
      var getMinutes = d.getMinutes(); // 29 分
      var getSeconds = d.getSeconds(); // 17 秒
      var getMilliseconds = d.getMilliseconds(); // 234 毫秒
      file.setName(getFullYear + "_" + getMonth + "_" + getDate + "_" + getHours + "_" + getMinutes + "_" + getSeconds + "_" + getMilliseconds + ".mp3")
      file.setDescription(d.getTime());
      //Logger.log("NNNNNNN = ", file.getName())
      break;
    }
  }
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
function sendPhoto(url, notification, caption) {
  caption = caption || ""
  var payload = {
    "method": "sendPhoto",
    'chat_id': "",
    'photo': url,
    'disable_notification': notification,
    'caption': caption
  } //上面的Telegram_id因為最後發送隊對象都相同，所以在start()中補。
  start(payload);
}
//=================================================================================
function sendAudio(url, notification, caption) {
  caption = caption || ""
  var payload = {
    "method": "sendAudio",
    'chat_id': "",
    'audio': url,
    'disable_notification': notification,
    'caption': caption
  } //上面的Telegram_id因為最後發送隊對象都相同，所以在start()中補。
  start(payload);
}
//=================================================================
function sendVoice(url, notification, caption) {
  caption = caption || ""
  var payload = {
    "method": "sendVoice",
    'chat_id': "",
    'voice': url,
    'disable_notification': notification,
    'caption': caption
  } //上面的Telegram_id因為最後發送隊對象都相同，所以在start()中補。
  start(payload);
}
//=================================================================
function senddocument(url, notification, caption) {
  caption = caption || ""
  var payload = {
    "method": "senddocument",
    'chat_id': "",
    'document': url,
    'disable_notification': notification,
    'caption': caption
  } //上面的Telegram_id因為最後發送隊對象都相同，所以在start()中補。
  start(payload);
}
//=================================================================
function sendLocation(latitude, longitude, notification) {
  var payload = {
    "method": "sendLocation",
    "chat_id": "",
    "latitude": latitude,
    "longitude": longitude,
    'disable_notification': notification
  } //上面的Telegram_id因為最後發送隊對象都相同，所以在start()中補。
  start(payload);
}
//=================================================================
function chkey(number) {
  number = number || 0
  if (number) {
    var base_json = base()
    var sheet_key = base_json.sheet_key
    var SpreadSheet = SpreadsheetApp.openById(sheet_key);
    var SheetD = SpreadSheet.getSheetByName("Debug");
    SheetD.getRange(3, 2).setValue(number)
    Logger.log("chid完成!")
    return 0
  } else {
    var base_json = base()
    var sheet_key = base_json.sheet_key
    var SpreadSheet = SpreadsheetApp.openById(sheet_key);
    var SheetD = SpreadSheet.getSheetByName("Debug");
    var id = SheetD.getRange(3, 2).getDisplayValue();
    SheetD.getRange(3, 2).setValue("") //清空
    return id
  }

}
//=================================================================================
function start(payload) {
  var base_json = base()
  var Telegram_bot_key = base_json.Telegram_bot_key
  var Telegram_id = base_json.Telegram_id
  var ch = chkey()
  if (ch !== "") {
    var Telegram_bot_key = ch
  } else {
    var Telegram_bot_key = base_json.Telegram_bot_key
  }
  payload.chat_id = Telegram_id //補上Telegram_id
  var data = {
    "method": "post",
    "payload": payload
  }
  UrlFetchApp.fetch("https://api.telegram.org/bot" + Telegram_bot_key + "/", data);
  /*/  為了速度和穩定 不必要就算了
  var sheet_key = base_json.sheet_key
  var d = new Date();
  var SpreadSheet = SpreadsheetApp.openById(sheet_key);
  var Sheet = SpreadSheet.getSheetByName("紀錄發送的訊息");
  var LastRow = Sheet.getLastRow();
  Sheet.getRange(LastRow + 1, 1).setValue(d);
  Sheet.getRange(LastRow + 1, 3).setValue(data);
  var returned = UrlFetchApp.fetch("https://api.telegram.org/bot" + Telegram_bot_key + "/", data);
  Sheet.getRange(LastRow + 1, 2).setValue(returned); //確認有發成功
  //*/
}
//=================================================================================
