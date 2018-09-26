function doPost(e) {
  //嘗試lock
  var lock = LockService.getScriptLock();
  var success = lock.tryLock(10000);

  var base_json = base();
  var debug = 0 ; // 0=沒有要debug、1=模擬Telegram、2=模擬Line
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
  var GMT = base_json.GMT
  var ct = language()["correspond_text"] //語言載入

  /*/ debug用
  var SpreadSheet = SpreadsheetApp.openById(sheet_key);
  var SheetD = SpreadSheet.getSheetByName("Debug");
  var LastRowD = SheetD.getLastRow();
  //SheetD.getRange(LastRowD + 1, 2).setValue("ggggggggggg LastRowD= " + );
  //Logger.log("這裡被執行了! ");
  //*/

  //資料崩潰檢查修復(歷史遺物，在使用lock後很少崩了，但還是當保險)===================
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
    var Stext = estringa.message.text;
    var chat_id = estringa.message.chat.id
    var chat_type = estringa.message.chat.type
    //前期準備完成


    //擁有者檢查=================================================================
    if (Telegram_id != chat_id && chat_type == "private") {
      //如果不是 發一段話即結束
      var text = "您好!這是私人用的bot，不對他人開放\
      \n若您想要一個自己的 Telegram_link_Line 機器人，請至 \n" +
        "https://github.com/we684123/Telegram_link_Line "
      sendtext(chat_id, text)
      lock.releaseLock();
      return 0;
    }

    //以下為了簡化程式複雜度(不想一直try_error)，故先行檢查、修復ALL物件的完整性=====
    if (ALL.FastMatch3 == undefined) {
      ALL.FastMatch3 = {}
    }
    if (ALL['TG_temporary_docking'] == undefined) {
      ALL['TG_temporary_docking'] = {}
    }
    if (ALL['wait_to_Bind'] == undefined) {
      ALL['wait_to_Bind'] = {}
    }

    //來源檢查==================================================================
    if (chat_type == "supergroup" || chat_type == "group") { //現在只剩 群組、超級群組 的可能
      var number = ALL.FastMatch3[chat_id]
      if (number == undefined) { //當莫名被邀入群組時
        if (ALL['TG_temporary_docking'][chat_id] == 3) { //容忍3句廢話(#
          delete ALL['TG_temporary_docking'][chat_id]
          TG_leaveChat(chat_id)
          var r = JSON.stringify(ALL);
          doc.setText(r); //寫入
          lock.releaseLock();
          return 0;
        } else if (ALL['TG_temporary_docking'][chat_id] == undefined) {
          if (estringa.message.left_chat_member) {
            lock.releaseLock();
            return 0;
          }
          ALL['TG_temporary_docking'][chat_id] = 0
          var r = JSON.stringify(ALL);
          doc.setText(r); //寫入
          Logger.log("chat_id = ",chat_id)
          sendtext(chat_id,ct['not_registered'])
          // ^ 您好!此群似乎還沒有與資料庫綁定，等主人綁定後我才能在此服務。...
          lock.releaseLock();
          return 0;
        } else {
          if (ALL['wait_to_Bind'][Stext] != undefined) {
            CP();
            sendtext(Telegram_id,ct["backed_up_ing"])
            // ^ "已備份舊資料，更新doc資料庫中..."
            var n = ALL['wait_to_Bind'][Stext] //Stext是驗證碼
            var chat_title = estringa.message.chat.chat_title
            ALL.data[n]["Bind_groud_chat_id"] = chat_id
            ALL.data[n]["Bind_groud_chat_title"] = chat_title
            ALL.data[n]["Bind_groud_chat_type"] = chat_type
            ALL.data[n].status = "已升級房間2"
            ALL.data[n]["Display_name"] = false
            ALL.FastMatch3[chat_id] = n //快速存取3寫入
            //下面收拾善後
            delete ALL.data[n]["Binding_number"]
            delete ALL['TG_temporary_docking'][chat_id]
            ALL['wait_to_Bind'] = {}
            ALL.mode = 0
            var r = JSON.stringify(ALL);
            doc.setText(r); //寫入
            text = ct["bing_success"]['text'].format(ALL.data[n]["Name"])
            keyboard_main(Telegram_id, text, doc_key)
            // ^ {0} 綁定成功!\n\n提醒您! 如果這群不只主人你一個人的話\n
            //   請記得去主控bot選擇這個房間並開啟"🐬 顯示發送者"，
            //   以免Line端眾不知何人發送。
            lock.releaseLock();
            return 0;
          }else {
            ALL['TG_temporary_docking'][chat_id] += 1
            var r = JSON.stringify(ALL);
            doc.setText(r); //寫入
            lock.releaseLock();
            return 0;
          }
        }
      } else { //已綁定群組中發話
        var n = number
        var Line_id = ALL.data[n]['RoomId'] //目標LINE房間ID
        if (ALL.data[n]["Display_name"]) {
          var last_name =''
          var first_name = estringa.message.from.first_name
          if (estringa.message.from.last_name) {
            last_name = estringa.message.from.last_name
          }
          var by_name = last_name + first_name +'：\n'
        }else {
          var by_name = ''
        }
        //以下處理發話
        if (estringa.message.text) {
          try {
            if (estringa.message.reply_to_message) {
              var rt = estringa.message.reply_to_message.text
              text = ct["For_this_reply"]["text"].format(rt, Stext);
              // ^ {0}\n^針對此回復^\n{1}
            } else {
              text = Stext;
            }
          } catch (e) {
            text = Stext;
          }
          if (ALL.data[n]["Display_name"]) {
            text = by_name + text
          }
          TG_Send_text_To_Line(Line_id, text)
        } else if (estringa.message.photo) { //如果是照片
          //以下選擇telegram照片並發到line
          var p = estringa.message.photo
          var max = p.length - 1;
          var photo_id = p[max].file_id
          TG_Send_Photo_To_Line(Line_id, photo_id)
          if (ALL.data[n]["Display_name"]) {
            TG_Send_text_To_Line(Line_id,(ct["caption_der_form"]['text'].format(by_name)))
          }
          if (estringa.message.caption){//如有簡介則一同發出
            if (ALL.data[n]["Display_name"]) {
              TG_Send_text_To_Line(Line_id,(ct["caption_der_form"]['text'].format(by_name)))
            }else {
              var text = by_name + estringa.message.caption
              TG_Send_text_To_Line(Line_id, text)
            }
          }
          sendtext(chat_id, ct["sendPhoto_ed"]);
          // ^ "(圖片已發送!)"
        } else if (estringa.message.video) {
          //以下選擇telegram video並發到line
          var video_id = estringa.message.video.file_id
          TG_Send_video_To_Line(Line_id, video_id) //就你最特別,多吃一個TGtoken
          if (estringa.message.caption){//如有簡介則一同發出
            if (ALL.data[n]["Display_name"]) {
              TG_Send_text_To_Line(Line_id,(ct["caption_der_form"]['text'].format(by_name)))
            }else {
              var text = by_name + estringa.message.caption
              TG_Send_text_To_Line(Line_id, text)
            }
          }
          sendtext(chat_id, ct["sendVideo_ed"]);
          // ^ "(影片已發送!)"
        } else if (estringa.message.sticker) {
          sendtext(chat_id, ct["not_support_sticker"]);
          // ^ "(暫時不支援貼圖傳送喔!)"
        } else if (estringa.message.audio) {
          var duration = estringa.message.audio.duration
          //var audio_id = estringa.message.audio.file_id
          sendtext(chat_id, ct["not_support_audio"]);
          // ^ "(暫時不支援audio傳送喔!)"
        } else if (estringa.message.voice) {
          //var duration = estringa.message.voice.duration
          sendtext(chat_id, ct["not_support_voice"]);
          // ^  "(暫時不支援voice傳送喔!)"
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
          if (ALL.data[n]["Display_name"]) {
            TG_Send_text_To_Line(Line_id,(ct["caption_der_form"]['text'].format(by_name)))
          }
        }
      }
      lock.releaseLock();
      return 0;
  }
  //============================================================================
  if (estringa.message.text) { //如果是文字訊息
    if (mode == "🚀 發送訊息" && Stext != "/exit") {
      //以下準備接收telegram資訊並發到line
      if (In(Stext) || Stext.substr(0, 2) == "/d") {
        sendtext(chat_id, ct["plz_exit_and_resend"]);
        // ^ "請先按下 /exit 離開後再下指令喔!"
        lock.releaseLock();
        return 0;
      }
      try {
        if (estringa.message.reply_to_message.text) {
          var rt = estringa.message.reply_to_message.text
          text = ct["For_this_reply"]["text"].format(rt, Stext);
          // ^ {0}\n^針對此回復^\n{1}
        } else {
          text = Stext;
        }
      } catch (e) {
        text = Stext;
      }
      var Line_id = ALL.opposite.RoomId;
      TG_Send_text_To_Line(Line_id, text)
      lock.releaseLock();
      return 0;

      //================================================================
    } else if (mode == "🔖 重新命名" && Stext != "/main") {
      if (ALL.FastMatch[Stext] != undefined) { //排除重名
        sendtext(chat_id, ct["duplicate_name"]);
        // ^ "名子不可重複，請重新輸入一個!"
      } else if (In(Stext)) { //排除與指令重複
        sendtext(chat_id, ct["duplicate_command"]);
        // ^ "名子不可跟命令重複，請重新輸入一個!"
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
        //var text = "🔖 重新命名完成~\n" + OName + " \n->\n " + Stext + "\n🔮 開啟主選單"
        ct["rename_success"]["text"] = ct["rename_success"]["text"].format(ct["🔖 重新命名"]["text"], OName, Stext, ct["🔮 開啟主選單"]["text"]);
        text = ct["rename_success"]
        keyboard_main(chat_id, text, doc_key)
      }
      lock.releaseLock();
      return 0;
      //================================================================
    } else if (mode == "🔥 刪除房間" && Stext == "/delete") {
      REST_FastMatch1and2();
      var aims = ALL.opposite.RoomId
      var number = ALL.FastMatch2[aims]

      //doc處理
      ALL.data.splice(number, 1) //刪除目標
      for (var x = 0; x++; x < len(ALL.TG_bot_updateID_array)) {
        if (ALL.TG_bot_updateID_array[x] == aims)
          ALL.data.splice(x, 1)
      }
      ALL.mode = 0
      var r = JSON.stringify(ALL);
      doc.setText(r); //重新寫入

      //sheet處理
      var SpreadSheet = SpreadsheetApp.openById(sheet_key);
      var Sheet = SpreadSheet.getSheetByName("Line訊息區");
      Sheet.deleteColumn(number + 1);

      //從Line中離開
      var a1 = Line_leave(room_or_groupID)

      var a2 = REST_keyboard(); //重製快速鍵盤
      var a3 = REST_FastMatch1and2(); //重製快速索引

      text = ct["delete_room_success"].format(a1, a2, a3)
      // ^ "Line_leave：{0}\nREST_keyboard：{1}\n{2}\n已刪除此聊天室"
      keyboard_main(text, doc_key)
      lock.releaseLock();
      return 0;
    } else if (mode == "⭐ 升級房間" && Stext == "/uproom") {
      ALL.mode = "/uproom"
      var FastMatch2_number = ALL.FastMatch2[ALL.opposite.RoomId]
      var Binding_number = String(Random_text())
      ALL.data[FastMatch2_number]['Binding_number'] = Binding_number //有點多餘但可確保
      ALL['wait_to_Bind'][Binding_number] = FastMatch2_number
      var r = JSON.stringify(ALL);
      doc.setText(r); //寫入
      sendtext(chat_id, Binding_number)
      sendtext(chat_id, ct["plz_forward_verification_code"]);
      // ^ "請確認我在要綁定的群組中後，再轉發上方的驗證碼到那以進行綁定! \
      //   \n或按下 /unsetroom 取消升級"
      lock.releaseLock();
      return 0;
    } else if (mode == "/uproom" && Stext != "/main" && Stext != "/debug") {
      if (Stext == "/unsetroom") {
        delete ALL.FastMatch2[ALL.opposite.RoomId].Binding_number
        ALL.mode = 0
        var r = JSON.stringify(ALL);
        doc.setText(r); //寫入

        sendtext(chat_id, ct["unsetroom_ed"]);
        // ^ "已取消設定bot"
        lock.releaseLock();
        return 0;
      }
    } else if (mode == "💫 降級房間" && Stext == "/droproom") {
      var aims = ALL.opposite.RoomId
      var number = ALL.FastMatch2[aims]
      var oppid = ALL.data[number]["Bind_groud_chat_id"]

      delete ALL.data[number].botToken
      delete ALL.data[number]["Bind_groud_chat_id"]
      delete ALL.data[number]["Bind_groud_chat_title"]
      delete ALL.data[number]["Bind_groud_chat_type"]
      delete ALL.data[number]["Display_name"]
      delete ALL.FastMatch3[oppid]
      ALL.data[number].status = "normal"
      ALL.mode = 0 //讓mode回復正常

      var r = JSON.stringify(ALL);
      doc.setText(r); //寫入

      keyboard_main(chat_id, ct["droproom_success"]["text"].format(JSON.stringify(ALL.data[number])), doc_key)
      // ^ "已降級成功(๑•̀ㅂ•́)و✧\n\n" + "房間狀態:\n" + JSON.stringify(ALL.data[number])
      lock.releaseLock();
      return 0;
    } else if ((mode == "♻ 移除關鍵字" || mode == "📎 新增關鍵字") && Stext == "/lookkeyword") {
      text = ct["lookkeyword_result"]['text'].format( get_all_keyword(ALL))
      sendtext(chat_id, text);
      lock.releaseLock();
      return 0;
    } else if (mode == "📎 新增關鍵字" && Stext != "/main") {
      try {
        var addwkey = String(Stext)
        var tt = addwkey.replace(/，/g, ',')
        var addwkey_array = tt.split(',')

        if (addwkey.search(",") == -1 && addwkey.search("，") == -1) {
          ALL.keyword.push(addwkey)
        } else {
          for (var i = 0; i < addwkey_array.length; i++) {
            if (addwkey_array[i] == "") {
              continue
            }
            ALL.keyword.push(addwkey_array[i])
          } //新增關鍵字
        }

        write_ALL(ALL, doc)
        var li = get_all_keyword(ALL)
        sendtext(chat_id, ct["add_keyword_success"]["text"].format(li));
        // ^ "已成功新增\n\n{0}\n\n如遇離開請按 /main\n或者繼續輸入新增",
      } catch (e) {
        ct["add_keyword_success"]["text"] = ct["add_keyword_success"]["text"].format(String(e))
        sendtext(chat_id, ct["add_keyword_success"]);
        // ^ "新增失敗，原因如下：\n" + String(e)
      }
      lock.releaseLock();
      return 0;
    } else if (mode == "♻ 移除關鍵字" && Stext != "/main") {
      try { //移除關鍵字
        var rmwkey = String(Stext)
        var tt = rmwkey.replace(/，/g, ',')
        var re = /\d+/g
        var rmwkey_array = tt.match(re)
        rmwkey_array.sort(function(a, b) {
          return b - a;
        })
        for (var i = 0; i < rmwkey_array.length; i++) {
          if (isNaN(parseInt(rmwkey_array[i]))) {
            continue
          }
          //Logger.log("TTTEEEE = ", i)
          var index = parseInt(rmwkey_array[i]) - 1
          //Logger.log("TTTindex = ", index)
          ALL.keyword.splice(index, 1)
          //Logger.log("TTTT222 = ", ALL.keyword)
        }

        write_ALL(ALL, doc)
        var li = get_all_keyword(ALL)
        sendtext(chat_id, ct["delete_keyword_success"]["text"].format(li));
        // ^ "已成功移除\n\n{0}\n\n如遇離開請按 /main\n或者繼續輸入移除",
      } catch (e) {
        ct["delete_keyword_fail"]["text"] = ct["delete_keyword_fail"]["text"].format(String(e))
        sendtext(chat_id, ct["delete_keyword_success"]);
        // ^ "移除失敗，如遇重新移除請先再次看過關鍵字名單再操作\n
        //    按下 /lookkeyword 可顯示名單\n
        //    移除失敗原因如下：\n{0}"
      }
      lock.releaseLock();
      return 0;
    } else if (mode == "⏰訊息時間啟用?") {
      function mixT(chat_id) {
        keyboard_main(chat_id, ct["change_message_time_func"]["text"].format(String(Stext)), doc_key)
        // ^ "已成功 " + Stext + " 訊息時間!"
      }
      if (Stext == ct["開啟"]["text"]) {
        ALL.massage_time = true
        ALL.mode = 0
        var e = write_ALL(ALL, doc)
        if (e) {
          mixT(chat_id)
        } else {
          sendtext(chat_id, ct["w_error_status"]);
          // ^ 寫入失敗，詳情如下：
        }

      } else if (Stext == ct["關閉"]["text"]) {
        ALL.massage_time = false
        ALL.mode = 0
        var e = write_ALL(ALL, doc)
        if (e) {
          mixT(chat_id)
        } else {
          sendtext(chat_id, ct["w_error_status"]);
          // ^ 寫入失敗，詳情如下：
        }
      } else {
        var text = ""
        sendtext(chat_id, ct["not_eat_this"]);
        // ^ 030...\n請不要給我吃怪怪的東西...
      }
      lock.releaseLock();
      return 0;
    } else {
      //以下指令分流
      switch (Stext) {
        case '/main':
        case ct['🔃 重新整理']["text"]:
          if (ALL.mode != 0) {
            ALL.mode = 0
            var r = JSON.stringify(ALL);
            doc.setText(r); //寫入
          }
          keyboard_main(chat_id, ct["🔮 開啟主選單"], doc_key)
          break;
        case ct['🔙 返回房間']["text"]:
        if (ALL.mode != 0) {
          ALL.mode = 0
          var r = JSON.stringify(ALL);
          doc.setText(r); //寫入
        }
          var keyboard = ALL.RoomKeyboard;
          var resize_keyboard = true
          var one_time_keyboard = false
          var text = ct["請選擇聊天室"]
          ReplyKeyboardMakeup(chat_id, keyboard, resize_keyboard, one_time_keyboard, text)

          break;
        case ct['🔭 訊息狀態']["text"]:
          data_len = ALL.data.length;
          text = ""
          //Logger.log('HHHHH1111 = ',ct["unread_number"]["text"])
          for (var i = 0; i < data_len; i++) {
            if (ALL.data[i].Amount == 0) {
              //Logger.log("IIIIII = ",i)
              continue;
            }
            //Logger.log("TTTTTT = ",text)
            //Logger.log("BBBBBBBB = ",ALL.data[i].Name)
            //Logger.log("BBBBB2222 = ",ALL.data[i].Amount)
            ct["unread_number"]["text"] = ct["unread_number"]["text"].format(text, ALL.data[i].Name, ALL.data[i].Amount)
            // ^ text + ALL.data[i].Name + '\n' + '未讀：' + ALL.data[i].Amount + '\n' + '-------------\n'
            //Logger.log('HHHHH2222 = ',ct["unread_number"]["text"])
            //Logger.log("TTTTTT22222 = ",text)
          }

          if (ct["unread_number"]["text"] == "{0}{1}\n未讀： {2}\n-------------\n") {
            ct["unread_number"]["text"] = ct["unread_number"]["text"] = "沒有任何未讀。"
          }
          //Logger.log('HHHHHH22222 = ',ct["unread_number"]["text"])
          sendtext(chat_id, ct["unread_number"]);
          break;
        case ct['✔ 關閉鍵盤']["text"]:
          var text = ct['colse_Keyboard_ed']
          ReplyKeyboardRemove(chat_id, text)
          // ^ "已關閉鍵盤，如欲再次開啟請按 /main"
          break;
        case ct['🚀 發送訊息']["text"]:
          ALL.mode = "🚀 發送訊息"
          var r = JSON.stringify(ALL);
          doc.setText(r); //寫入
          ReplyKeyboardRemove(chat_id, ct["sendtext_to_XXX"]["text"].format(ALL.opposite.Name))
          // ^  "將對 {0} 發送訊息\n如欲離開請輸入 /exit \n請輸入訊息："
          break;
        case '/exit':
          ALL.mode = 0
          var r = JSON.stringify(ALL);
          doc.setText(r); //寫入
          keyboard_main(chat_id, ct["exit_room_ed"], doc_key)
          // ^ "======已停止對話!======"
          break;
        case ct['📬 讀取留言']["text"]:
          if (ALL.data[ALL.FastMatch2[ALL.opposite.RoomId]].Amount == 0) {
            sendtext(chat_id, ct["not_need_read"], notification);
            // ^ "這個房間並沒有未讀的通知喔~ "
          } else {

            var SpreadSheet = SpreadsheetApp.openById(sheet_key);
            var SheetM = SpreadSheet.getSheetByName("Line訊息區");
            var col = ALL.FastMatch2[ALL.opposite.RoomId] + 1;

            var Amount = SheetM.getRange(1, col).getDisplayValue();
            Amount = JSON.parse(Amount)
            var st = Amount[1] + 2
            var ed = Amount[0] + 1
            //Logger.log("ststst = ", st)
            //Logger.log("ededed = ", ed)

            function upMessageData(i, col, ed) {
              SheetM.getRange(i, col).setValue("")
              var t = "[" + (ed - 1) + "," + (i - 1) + "]"
              SheetM.getRange(1, col).setValue(t);
              //SheetM.getRange(1, col).setValue(Amount);
            }

            function get_time_txt(timestamp) {
              var formattedDate = Utilities.formatDate(new Date(timestamp), GMT, "yyyy-MM-dd' 'HH:mm:ss");
              return formattedDate;
            }

            for (var i = st; i <= ed; i++) {
              text = SheetM.getRange(i, col).getDisplayValue()
              //Logger.log("text = ", text)
              var message_json = JSON.parse(text);

              if (message_json.type == "text") {
                var p = message_json.userName + "：\n" + message_json.text
                //Logger.log("ppp = ", p)
                if (ALL.massage_time) {
                  t = get_time_txt(message_json.timestamp)
                  p += "\n" + t
                }
                sendtext(chat_id, p);
                //{"type":"text","message_id":"6481485539588","userName":"永格天@李孟哲",
                //"text":"51"}
                upMessageData(i, col, ed)
              } else if (message_json.type == "image") {
                var url = message_json.DURL
                var caption = ct["is_from"]["text"].format(message_json.userName)
                if (ALL.massage_time) {
                  t = get_time_txt(message_json.timestamp)
                  caption += "\n" + t
                }
                sendPhoto(chat_id, url, notification, caption)
                //sendPhoto(url, notification)
                //{"type":"image","message_id":"6548749837597","userName":"永格天@李孟哲",
                //"DURL":"https://drive.google.com/uc?export=download&id=0B-0JNsk9kLZktWQ1U"}
                upMessageData(i, col, ed)
              } else if (message_json.type == "sticker") {
                var sticker_png_url = "https://stickershop.line-scdn.net/stickershop/v1/sticker/" + message_json.stickerId + "/android/sticker.png;compress=true"
                var caption = ct["is_from"]["text"].format(message_json.userName)
                if (ALL.massage_time) {
                  t = get_time_txt(message_json.timestamp)
                  caption += "\n" + t
                }
                sendPhoto(chat_id, sticker_png_url, notification, caption)
                //https://stickershop.line-scdn.net/stickershop/v1/sticker/3214753/android/sticker.png;compress=true
                //{"type":"sticker","message_id":"6548799151539","userName":"永格天@李孟哲",
                //"stickerId":"502","packageId":"2"}
                upMessageData(i, col, ed)
              } else if (message_json.type == "audio") {
                var url = ct["sorry_plz_go_to_url"]["text"].format(message_json.DURL, message_json.userName)
                if (ALL.massage_time) {
                  t = get_time_txt(message_json.timestamp)
                  url += "\n" + t
                }
                sendtext(chat_id, url)
                // ^ "抱歉!請至該連結下載或聆聽!\n" + message_json.DURL + "\n\n來自: " + message_json.userName
                //{"type":"audio","message_id":"6548810000783","userName":"永格天@李孟哲",
                //"DURL":"https://drive.google.com/uc?export=download&id=0B-0JNsk91ZKakE5Q1U"}
                upMessageData(i, col, ed)
              } else if (message_json.type == "location") {
                var latitude = message_json.latitude
                var longitude = message_json.longitude
                sendLocation(chat_id, latitude, longitude, notification)
                var text = ct["is_from"]["text"].format(message_json.userName)
                if (ALL.massage_time) {
                  t = get_time_txt(message_json.timestamp)
                  text += "\n" + t
                }
                if (message_json.address) {
                  text = message_json.address + '\n'+text
                }
                sendtext(chat_id, text);
                //{"type":"location","message_id":"6548803214227","userName":"永格天@李孟哲",
                //"address":"260台灣宜蘭縣宜蘭市舊城西路107號",
                //"latitude":24.759711,"longitude":121.750114}
                upMessageData(i, col, ed)
              } else if (message_json.type == "video") {
                var url = message_json.DURL
                var caption = ct["is_from"]["text"].format(message_json.userName)
                if (ALL.massage_time) {
                  t = get_time_txt(message_json.timestamp)
                  caption += "\n" + t
                }
                sendVoice(chat_id, url, notification, caption)
                //{"type":"video","message_id":"6548802053751","userName":"永格天@李孟哲",
                //"DURL":"https://drive.google.com/uc?export=download&id=0B-0JNsk9kL8vc1WQ1U"}
                upMessageData(i, col, ed)
              } else if (message_json.type == "file") {
                var url = ct["sorry_plz_go_to_url"]["text"].format(message_json.DURL, message_json.userName)
                if (ALL.massage_time) {
                  t = get_time_txt(message_json.timestamp)
                  text += "\n" + t
                }
                sendtext(chat_id, text);
                //senddocument(url)
                upMessageData(i, col, ed)
              }
            }

            ALL.data[ALL.FastMatch2[ALL.opposite.RoomId]].Amount = 0;
            var r = JSON.stringify(ALL);
            doc.setText(r); //寫入
            SheetM.getRange(1, col).setValue("[0,0]")

            sendtext(chat_id, ct["read_massage_ed"]);
            // ^ =======讀取完畢=======
          }
          break;
        case ct['🔖 重新命名']["text"]:
          var OName = ALL.opposite.Name
          ALL.mode = "🔖 重新命名"
          var r = JSON.stringify(ALL);
          doc.setText(r); //寫入
          ReplyKeyboardRemove(chat_id, ct["rename_room_text"]['text'].format(OName))
          // ^ "將對 {0} 重新命名!!!\n如要取消命名請按 /main 取消\n請輸入新名子："
          break;
        case ct['🔥 刪除房間']["text"]:
          ALL.mode = "🔥 刪除房間"
          var r = JSON.stringify(ALL);
          doc.setText(r); //寫入
          sendtext(chat_id, ct["sure_delete_room?"]["text"].format(ALL.opposite.Name));
          // ^ 你確定要刪除 {0} 嗎?\n若是請按一下 /delete\n若沒按下則不會刪除!!!"
          break;
        case ct['🐳 開啟通知']["text"]:
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
          sendtext(chat_id, ct["enabled_notification_ed"]["text"].format(OName));
          // ^ "已開啟 {0} 的通知"
          //以下處理RoomKeyboard==================================================
          REST_keyboard(doc_key) //重新編排keyborad
          break;
        case ct['🔰 暫停通知']["text"]:
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
          sendtext(chat_id, ct["disabled_notification_ed"]["text"].format(OName));
          // ^ "已暫停 {0} 的通知"
          //以下處理RoomKeyboard==================================================
          REST_keyboard(doc_key) //重新編排keyborad
          break;
        case ct['⭐ 升級房間']["text"]:
          if (!ALL.ctrl_bot_id) {
            var t = ct["not_find_ctrl_id"]['text']
            var payload = {
              "method": "sendMessage",
              'chat_id': chat_id,
              'text': t,
              'disable_notification': ct["not_find_ctrl_id"]['notification']
            }
            var data = {
              "method": "post",
              "payload": payload
            }
            var ans = UrlFetchApp.fetch("https://api.telegram.org/bot" + Telegram_bot_key + "/", data);
            var ans_json = JSON.parse(ans)
            var ctrl_bot_id = ans_json['result'].from.id
            if (ctrl_bot_id == undefined) {
              sendtext(chat_id, ct["get_ctrl_id_error"].format(ans))
              return 0
            }
            ALL.ctrl_bot_id = ctrl_bot_id
            var r = JSON.stringify(ALL);
            doc.setText(r); //寫入
          }

          ALL.mode = "⭐ 升級房間"
          var r = JSON.stringify(ALL);
          doc.setText(r); //寫入

          sendtext(chat_id, ct["uproom_Introduction"]);
          // ^ "⭐ 升級房間功能介紹：\n升級房間後，以後來自該對象(Line)的訊息
          //皆會及時傳到 **新的"群組"聊天室** ，而不會傳到這個"bot"聊天室中，
          //這個功能是可以回來這裡取消的。
          sendtext(chat_id, ct['uproom_sure?']["text"].format(ALL.opposite.Name));
          // ^ "您確定要升級 {0} 嗎?\n若是請按一下 /uproom \n若沒按下則不會進入升級!!!"
          break;
        case ct['💫 降級房間']["text"]:
          ALL.mode = "💫 降級房間"
          var r = JSON.stringify(ALL);
          doc.setText(r); //寫入

          sendtext(chat_id, ct["droproom_sure?"]["text"].format(ALL.opposite.Name));
          // ^ "您確定要降級 {0} 嗎?\n若是請按一下 /droproom \n若沒按下則不會降級!!!"
          break;
        case '/debug':
          var xfjhxgfh = REST_FastMatch1and2(); //強制等待，不知道為什麼有時候不會執行
          var ydjdyf = REST_keyboard(); //強制等待，不知道為什麼有時候不會執行
          //還有sheet那邊的訊息區處理還未 (Amount)
          ALL.mode = 0
          ALL.wait_to_Bind = {}
          var r = JSON.stringify(ALL);
          doc.setText(r); //寫入
          sendtext(chat_id, ct["debug_ed"]["text"].format(xfjhxgfh, ydjdyf));
          // ^ "已debug\nREST_FastMatch1and2() : {0}\nREST_keyboard() : {1}",
          break;
        case '/AllRead':
        case '/Allread':
        case '/allRead':
        case '/allread':
          AllRead();
          sendtext(chat_id, ct["allRead_ed"]["text"]);
          // ^ "已全已讀"
          break;
        case ct['🔧 更多設定']["text"]:
          var more_keyboard = [
            [{
              'text': ct["🔑設定關鍵字提醒"]["text"]
            }, {
              'text': ct['⏰訊息時間啟用?']["text"]
            }],
            [{
              'text': ct["🔙 返回房間"]["text"]
            }]
          ]
          if (ALL.keyword_notice == undefined) {
            ALL.keyword_notice = false
            var istrue = true
          }
          if (ALL.massage_time == undefined) {
            ALL.massage_time = false
            var istrue = true
          }
          if (istrue) {
            var r = JSON.stringify(ALL);
            doc.setText(r); //寫入
          }
          text = ct["more_setting_status"]['text'].format(ALL.keyword_notice, ALL.massage_time)
          // ^ '設定狀態：\n● 關鍵字提醒：{0}\n● 訊息時間啟用： {1}\n'
          var resize_keyboard = true
          var one_time_keyboard = false
          ReplyKeyboardMakeup(chat_id, more_keyboard, resize_keyboard, one_time_keyboard, text)
          break;
        case ct['⏰訊息時間啟用?']["text"]:
          ALL.mode = "⏰訊息時間啟用?"
          var r = JSON.stringify(ALL);
          doc.setText(r); //寫入

          var massage_time_q_keyboard = [
            [{
              'text': ct["開啟"]["text"]
            }, {
              'text': ct["關閉"]["text"]
            }]
          ]
          text = ct["plz_select_on_off"]
          // ^  "請選擇開啟或關閉"
          var resize_keyboard = true
          var one_time_keyboard = false
          ReplyKeyboardMakeup(chat_id, massage_time_q_keyboard, resize_keyboard, one_time_keyboard, text)
          break;
        case ct["🔑設定關鍵字提醒"]["text"]:
          if (ALL.keyword_notice == undefined) { //這一次啟動時的重製
            ALL.keyword_notice = false
            var r = JSON.stringify(ALL);
            doc.setText(r); //寫入
            sendtext(chat_id, ct["first_use_keyword_text"]);
            // ^ 提醒您，如要啟用關鍵字提醒，請記得按下方按鈕開啟！\n預設為'關閉提醒'"
          }

          var keyword_keyboard1 = [
            [{
              'text': ct['📎 新增關鍵字']["text"]
            }, {
              'text': ct["♻ 移除關鍵字"]["text"]
            }],
            [{
              'text': ct["暫停關鍵字提醒"]["text"]
            }, {
              'text': ct["🔙 返回房間"]["text"]
            }]
          ]
          var keyword_keyboard2 = [
            [{
              'text': ct['📎 新增關鍵字']["text"]
            }, {
              'text': ct["♻ 移除關鍵字"]["text"]
            }],
            [{
              'text': ct["啟動關鍵字提醒"]["text"]
            }, {
              'text': ct["🔙 返回房間"]["text"]
            }]
          ]
          if (ALL.keyword_notice) {
            var keyword_keyboard = keyword_keyboard1
          } else {
            var keyword_keyboard = keyword_keyboard2
          }

          var all_word = get_all_keyword(ALL)
          var resize_keyboard = true
          var one_time_keyboard = false
          ReplyKeyboardMakeup(chat_id, keyword_keyboard, resize_keyboard, one_time_keyboard, all_word)
          break;
        case ct['📎 新增關鍵字']["text"]:
          ALL.mode = "📎 新增關鍵字"
          ReplyKeyboardRemove(chat_id,ct["add_keyword_ing"])
          // ^ "請輸入欲新增關鍵字\n新增多組關鍵字請用 ',' 或 '，' 號隔開\n如欲離開請按 /main"
          write_ALL(ALL, doc)
          break;
        case ct['♻ 移除關鍵字']["text"]:
          ALL.mode = "♻ 移除關鍵字"
          AllRead();
          ReplyKeyboardRemove(chat_id,ct["delete_keyword_ing"])
          // ^ '請輸入欲移除關鍵字的**前方編號!!!**\n刪除多組關鍵字請用 "任意符號" 隔開(推薦用","或"，")\n如遇離開請按 /main'
          write_ALL(ALL, doc)
          break;
        case ct['啟動關鍵字提醒']["text"]:
          ALL.keyword_notice = true
          write_ALL(ALL, doc) //寫入
          text = ct["turn_on_keyword_ed"]
          var keyboard = [
            [{
              'text': ct['📎 新增關鍵字']["text"]
            }, {
              'text': ct["♻ 移除關鍵字"]["text"]
            }],
            [{
              'text': ct["暫停關鍵字提醒"]["text"]
            }, {
              'text': ct["🔙 返回房間"]["text"]
            }]
          ]
          var resize_keyboard = true
          var one_time_keyboard = false
          ReplyKeyboardMakeup(chat_id, keyboard, resize_keyboard, one_time_keyboard, text)
          break;
        case ct['暫停關鍵字提醒']["text"]:
          ALL.keyword_notice = false
          write_ALL(ALL, doc) //寫入
          text = ct["turn_off_keyword_ed"]
          var keyboard = [
            [{
              'text': ct['📎 新增關鍵字']["text"]
            }, {
              'text': ct["♻ 移除關鍵字"]["text"]
            }],
            [{
              'text': ct["啟動關鍵字提醒"]["text"]
            }, {
              'text': ct["🔙 返回房間"]["text"]
            }]
          ]
          var resize_keyboard = true
          var one_time_keyboard = false
          ReplyKeyboardMakeup(chat_id, keyboard, resize_keyboard, one_time_keyboard, text)
          break;
        case '/lookkeyword':
          text = ct["lookkeyword_result"]['text'].format( get_all_keyword(ALL))
          sendtext(chat_id, text);
          break;
          //-------------------------------------------------------------------
        default:
          var st = Stext.substr(0, 2)
          if (ALL.FastMatch[Stext] != undefined || st == "/d") {

            if (ALL.FastMatch[Stext] != undefined) { //一種間接抓，一種直接
              var FM = ALL.FastMatch[Stext]
            } else {
              var s_len = Stext.length - 1;
              var number = Stext.substr(2, s_len)
              var FM = number;
            }

            var OAmount = ALL.data[FM].Amount
            var OName = ALL.data[FM].Name
            var ORoomId = ALL.data[FM].RoomId
            ALL.opposite.RoomId = ORoomId;
            ALL.opposite.Name = OName;
            var r = JSON.stringify(ALL);
            doc.setText(r); //寫入
            var Notice = ALL.data[FM].Notice

            text = ct["select_room_text"]["text"].format(OName, OAmount, Notice)
            // ^ "您選擇了 {0} 聊天室\n未讀數量：{1}\n聊天室通知：{2}\n請問你要?"
            //Logger.log("select_room_text = ", text)
            var keyboard = [
              [{
                'text': ct['🚀 發送訊息']["text"]
              }, {
                'text': ct['📬 讀取留言']["text"]
              }, {
                'text': ct['🔖 重新命名']["text"]
              }],
              [{
                'text': ct['⭐ 升級房間']["text"]
              }, {
                'text': ct['🐳 開啟通知']["text"]
              }, {
                'text': ct['🔰 暫停通知']["text"]
              }],
              [{
                'text': ct["🔥 刪除房間"]["text"]
              }, {
                'text': ct["🔙 返回房間"]["text"]
              }]
            ]

            if (ALL.data[FM].["Bind_groud_chat_id"]) { //如果遇到已升級的則改"降級"
              var keyboard2 = [
                [{
                  'text': ct['💫 降級房間']["text"]
                }, {
                  'text': ct["🐬 顯示發送者"]["text"]
                }],
                [{'text': ct["🔙 返回房間"]["text"]
              }]
              ]
              keyboard = keyboard2
            }
            var resize_keyboard = true
            var one_time_keyboard = false
            ReplyKeyboardMakeup(chat_id, keyboard, resize_keyboard, one_time_keyboard, text)

          } else {
            sendtext(chat_id, ct["incorrect_operation"]);
            // ^ "錯誤的操作喔（ ・∀・），請檢查環境是否錯誤"
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
      if (estringa.message.caption)
        TG_Send_text_To_Line(Line_id, estringa.message.caption)
      //如有簡介則一同發出
      sendtext(chat_id, ct["sendPhoto_ed"]);
      // ^ "(圖片已發送!)"
    } else {
      sendtext(chat_id, ct["incorrect_operation"]);
      // ^ "錯誤的操作喔（ ・∀・），請檢查環境是否錯誤"
    }
  } else if (estringa.message.video) {
    if (mode == "🚀 發送訊息") {
      //以下選擇telegram video並發到line
      var video_id = estringa.message.video.file_id
      var Line_id = ALL.opposite.RoomId;
      TG_Send_video_To_Line(Line_id, video_id)
      if (estringa.message.caption)
        TG_Send_text_To_Line(Line_id, estringa.message.caption)
      sendtext(chat_id, ct["sendVideo_ed"]);
      // ^ "(影片已發送!)"
    } else {
      sendtext(chat_id, ct["incorrect_operation"]);
      // ^ "錯誤的操作喔（ ・∀・），請檢查環境是否錯誤"
    }
  } else if (estringa.message.sticker) {
    if (mode == "🚀 發送訊息") {
      sendtext(chat_id, ct["not_support_sticker"]);
      // ^ "(暫時不支援貼圖傳送喔!)"
    } else {
      sendtext(chat_id, ct["incorrect_operation"]);
      // ^ "錯誤的操作喔（ ・∀・），請檢查環境是否錯誤"
    }
  } else if (estringa.message.audio) {
    if (mode == "🚀 發送訊息") {
      var duration = estringa.message.audio.duration
      //var audio_id = estringa.message.audio.file_id
      //TG_Send_audio_To_Line(Line_id, audio_id, duration)
      sendtext(chat_id, ct["not_support_audio"]);
      // ^ "(暫時不支援audio傳送喔!)"
    } else {
      sendtext(chat_id, ct["incorrect_operation"]);
      // ^ "錯誤的操作喔（ ・∀・），請檢查環境是否錯誤"
    }
  } else if (estringa.message.voice) {
    if (mode == "🚀 發送訊息") {
      //var duration = estringa.message.voice.duration
      //TG_Send_audio_To_Line(Line_id, audio_id, duration)
      sendtext(chat_id, ct["not_support_voice"]);
      // ^  "(暫時不支援voice傳送喔!)"
    } else {
      sendtext(chat_id, ct["incorrect_operation"]);
      // ^ "錯誤的操作喔（ ・∀・），請檢查環境是否錯誤"
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
      try {
        var formatted_address = t4[0]["formatted_address"]
      } catch (e) {
        var formatted_address = ct["not_find_location_name"]["text"]
      }
      //感謝 思考要在空白頁 http://blog.yslin.tw/2013/02/google-map-api.html
      TG_Send_location_To_Line(Line_id, latitude, longitude, formatted_address)
    } else {
      sendtext(chat_id, ct["incorrect_operation"]);
      // ^ "錯誤的操作喔（ ・∀・），請檢查環境是否錯誤"
    }
  } else if (estringa.message.document) {
    if (mode == "🚀 發送訊息") {
      //var duration = estringa.message.voice.duration
      //TG_Send_audio_To_Line(Line_id, audio_id, duration)
      sendtext(chat_id, ct["not_support_document"]);
      // "(暫時不支援document傳送喔!)"
    } else {
      sendtext(chat_id, ct["incorrect_operation"]);
      // ^ "錯誤的操作喔（ ・∀・），請檢查環境是否錯誤"
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

  var message_json = { //前面先寫 後面替換
    "type": "type",
    "message_id": cutMessage.id,
    "userName": userName,
    "timestamp": parseInt(estringa.events[0].timestamp)
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
  } else if (cutMessage.type == "file") { //文件
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
  var chat_id = Telegram_id
  //================================================================
  if (ALL.FastMatch2[Room_text] != undefined) { //以下處理已登記的
    if (ALL.data[ALL.FastMatch2[Room_text]].status == "已升級房間2" || (ALL.mode == "🚀 發送訊息" && Room_text == ALL.opposite.RoomId)) {
      if (ALL.data[ALL.FastMatch2[Room_text]].status == "已升級房間2") {
        //切換成綁訂房間的chat_id
        chat_id = ALL.data[ALL.FastMatch2[Room_text]].Bind_groud_chat_id
      }
      try {
        if (message_json.type == "text") {
          text = ct['text_format']['text'].format(message_json.userName,message_json.text)
          sendtext(chat_id, text);
          //{"type":"text","message_id":"6481485539588","userName":"永格天@李孟哲",
          //"text":"51"}
        } else if (message_json.type == "image") {
          var url = message_json.DURL
          var notification = false
          var caption = ct["is_from"]["text"].format(message_json.userName)
          sendtext(chat_id, ct["sendPhoto_ing"]);
          // ^ (正在傳送圖片，請稍後...)
          sendPhoto(chat_id, url, notification, caption)
          //sendPhoto(url, notification)
          //{"type":"image","message_id":"6548749837597","userName":"永格天@李孟哲",
          //"DURL":"https://drive.google.com/uc?export=download&id=0B-0JNskkLZktW"}
        } else if (message_json.type == "sticker") {
          var sticker_png_url = "https://stickershop.line-scdn.net/stickershop/v1/sticker/" + message_json.stickerId + "/android/sticker.png;compress=true"
          var notification = false
          var caption = ct["is_from"]["text"].format(message_json.userName)
          sendtext(chat_id, ct["sendSticker_ing"])
          // ^ (正在傳送貼圖，請稍後...)
          sendPhoto(chat_id, sticker_png_url, notification, caption)
          //https://stickershop.line-scdn.net/stickershop/v1/sticker/3214753/android/sticker.png;compress=true
          //{"type":"sticker","message_id":"6548799151539","userName":"永格天@李孟哲",
          //"stickerId":"502","packageId":"2"}
        } else if (message_json.type == "audio") {
          var url = ct["sorry_plz_go_to_url"]["text"].format(message_json.DURL, message_json.userName)
          sendtext(chat_id, url)
          // ^ "抱歉!請至該連結下載或聆聽!\n{0}\n\n{1}來自: "
          //{"type":"audio","message_id":"6548810000783","userName":"永格天@李孟哲",
          //"DURL":"https://drive.google.com/uc?export=download&id=0B-0JNsk9KakE5Q"}
        } else if (message_json.type == "location") {
          var notification = false
          var latitude = message_json.latitude
          var longitude = message_json.longitude
          sendLocation(chat_id, latitude, longitude, notification)
          var text = ct["is_from"]["text"].format(message_json.userName)
          if (message_json.address) {
            text = message_json.address + '\n'+text
          }
          sendtext(chat_id, text);
          //{"type":"location","message_id":"6548803214227","userName":"永格天@李孟哲",
          //"address":"260台灣宜蘭縣宜蘭市舊城西路107號",
          //"latitude":24.759711,"longitude":121.750114}
        } else if (message_json.type == "video") {
          var url = message_json.DURL
          var notification = false
          var caption = ct["is_from"]["text"].format(message_json.userName)
          sendVoice(chat_id, url, notification, caption)
          //{"type":"video","message_id":"6548802053751","userName":"永格天@李孟哲",
          //"DURL":"https://drive.google.com/uc?export=download&id=0B-0JNsk9kL8vc1"}
        } else if (message_json.type == "file") {
          var url = ct["sorry_plz_go_to_url"]["text"].format(message_json.DURL, message_json.userName)
          sendtext(chat_id, url);
          //senddocument(url)
        }
      } catch (e) {
        sendtext(chat_id, ct["send_to_TG_error"]['text'].format(e));
        // ^ '傳送失敗...，原因如下\n\n{0}'
      }
    } else { //以下有登記，未"🚀 發送訊息"
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
        sendtext(chat_id, ct["you_have_new_massage"]["text"].format(ALL.data[col - 1].Name, (col - 1)));
        // ^ "你有新訊息!\n來自：{0}\n點擊以快速切換至該房間 /d{1}"
      }
      //以下處理關鍵字通知====================================================
      var keyword_notice = ALL.keyword_notice
      //Logger.log("以下處理關鍵字通知")
      if (keyword_notice && text != "") {
        var txt = text
        var keys = ALL.keyword
        var keys_value = key_word_check(message_json.text, keys)
        //Logger.log("TTTT = ",keys_value)
        //Logger.log("Tkeys_value.length = ",keys_value.length)
        if (keys_value.length > 0) {
          var text2 = ""
          for (var i = 0; i < keys_value.length; i++) {
            text2 += keys_value[i] + " "
          }
          text = ct["keyword_trigger"]["text"].format(text2, ALL.data[col - 1].Name, (col - 1))
          sendtext(chat_id, text);
          // ^ "有關鍵字被提及！\n{0}\nby: {1}\n點擊以快速切換至該房間 /d{2}",
        }
      }
      //===================================================================
    }

  } else { //以下處理未登記的(新資料)=======================
    var newcol = Object.keys(ALL.FastMatch2).length;
    //以下處理FastMatch2==================================
    ALL.FastMatch2[Room_text] = newcol
    var r = JSON.stringify(ALL);
    doc.setText(r); //寫入
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
    sendtext(chat_id, text, notification);
  }
} else {
  GmailApp.sendEmail(email, "telegram-line出事啦(可能有新類型通訊格式，或gs網址外洩)", d + "\n" + ee);
}
lock.releaseLock();
return 0 ;
}

//以下各類函式支援
//=====================================================================================================
function Log(estringa, from, sheet_key, email) {
  var ee = JSON.stringify(estringa);
  var d = new Date();
  var SpreadSheet = SpreadsheetApp.openById(sheet_key);
  var Sheet = SpreadSheet.getSheetByName("Log");
  var SheetLastRow = Sheet.getLastRow();
  Sheet.getRange(SheetLastRow + 1, 1).setValue(d);
  Sheet.getRange(SheetLastRow + 1, 3).setValue(ee);
  switch (from) {
    case 'telegram':
      Sheet.getRange(SheetLastRow + 1, 2).setValue("Telegram");
      break;
    case 'line':
      Sheet.getRange(SheetLastRow + 1, 2).setValue("Line");
      break;
    default:
      GmailApp.sendEmail(email, "telegram-line出事啦", d + " " + ee);
  }
}
//=================================================================
function ReplyKeyboardRemove(chat_id, ct) {
  try {
    var notification = ct["notification"]
    var parse_mode = ct["parse_mode"]
    if (notification == undefined || notification != true)
      var notification = false
    if (parse_mode == undefined)
      var parse_mode = ""
  } catch (e) {
    var notification = false
    var parse_mode = ""
  }
  if (ct["text"] == undefined) {
    var text = String(ct)
  } else {
    var text = ct["text"]
  }

  var ReplyKeyboardRemove = {
    'remove_keyboard': true,
    'selective': false
  }
  var payload = {
    "method": "sendMessage",
    'chat_id': String(chat_id),
    'text': text,
    "parse_mode": parse_mode,
    "notification": notification,
    'reply_markup': JSON.stringify(ReplyKeyboardRemove)
  }
  start(payload);
}
//=================================================================================
function ReplyKeyboardMakeup(chat_id, keyboard, resize_keyboard, one_time_keyboard, ct) {
  //Logger.log("ct = ",ct)
  //Logger.log("ct str = ",String(ct))
  try {
    var notification = ct["notification"]
    var parse_mode = ct["parse_mode"]
    if (notification == undefined || notification != true)
      var notification = false
    if (parse_mode == undefined)
      var parse_mode = ""
  } catch (e) {
    var notification = false
    var parse_mode = ""
  }
  if (ct["text"] == undefined) {
    var text = String(ct)
  } else {
    var text = ct["text"]
  }
  //Logger.log("ReplyKeyboardMakeup->ct = ", text + "\n" + ct + "\n" + ct["text"])
  var ReplyKeyboardMakeup = {
    'keyboard': keyboard,
    'resize_keyboard': resize_keyboard,
    'one_time_keyboard': one_time_keyboard,
  }
  var payload = {
    "method": "sendMessage",
    'chat_id': String(chat_id), // 這裡不改是突然想到非主控
    'text': text,
    'parse_mode': parse_mode,
    'disable_notification': notification,
    'reply_markup': JSON.stringify(ReplyKeyboardMakeup)
  }
  start(payload);
}
//=================================================================================
function keyboard_main(chat_id, ct, doc_key) {
  var doc = DocumentApp.openById(doc_key)
  var f = doc.getText();
  var ALL = JSON.parse(f); //獲取資料//轉成JSON物件
  var keyboard_main = ALL.RoomKeyboard
  var resize_keyboard = false
  var one_time_keyboard = false
  ReplyKeyboardMakeup(chat_id, keyboard_main, resize_keyboard, one_time_keyboard, ct)
}
//=================================================================================
function In(name) { //防止與命令衝突的命名
  var arr = ["/main", "🔙 返回房間", "🔭 訊息狀態", "✔️ 關閉鍵盤", "🚀 發送訊息", "/exit", "📬 讀取留言",
    "🔖 重新命名", "🐳 開啟通知", "🔰 暫停通知", "🔃 重新整理", "🔥 刪除房間", "/delete", "/debug",
    "/AllRead", "/allread", "/Allread", "/allRead", "⭐️ 升級房間", "💫 降級房間", "/uproom", "droproom",
    "/uproom_2", "/unsetroom", "♻ 移除關鍵字", "📎 新增關鍵字", "/lookkeyword", "⏰訊息時間啟用?", "🔧 更多設定",
    "🔑設定關鍵字提醒", "啟動關鍵字提醒", "暫停關鍵字提醒",
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
    'text': "🔃 重新整理"
  }, {
    'text': '🔧 更多設定'
  }, {
    'text': "🔭 訊息狀態"
  }]) //加入返回鍵
  //=================================================
  ALL.RoomKeyboard = keyboard //寫回RoomKeynoard
  write_ALL(ALL, doc) //寫入
  return "成功"
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
    var Name = String(ALL.data[i].Name)
    ALL.FastMatch[Name] = i
  }
  for (var i = 0; i < data_len; i++) {
    var RoomId = ALL.data[i].RoomId
    ALL.FastMatch2[RoomId] = i
  }

  var r = JSON.stringify(ALL);
  doc.setText(r); //寫入
  return "成功"
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
function TG_Send_video_To_Line(Line_id, video_id) {
  //為什麼就跟錄音跟影片要原本的TG_token?? 是說不用原本的就是TG出bug了吧?
  var base_json = base()
  var CHANNEL_ACCESS_TOKEN = base_json.CHANNEL_ACCESS_TOKEN;
  var Telegram_bot_key = base_json.Telegram_bot_key
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
    //Logger.log("FFFFFFFFFFFF = ", e)
  }
}
//=================================================================================
function Line_leave(room_or_groupID) {

  var base_json = base()
  var CHANNEL_ACCESS_TOKEN = base_json.CHANNEL_ACCESS_TOKEN;

  var url = 'https://api.line.me/v2/bot/room/' + room_or_groupID + '/leave';
  //--------------------------------------------------
  var header = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
  }

  var options = {
    'headers': header,
    'method': 'post'
  }
  //--------------------------------------------------
  UrlFetchApp.fetch(url, options);
  return "成功"
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
function get_extension(filename, reciprocal) {
  var extension = filename.split(".")[reciprocal]
  return extension
}
//=================================================================================
function get_all_keyword(ALL) {
  var all_word = ''
  for (var i = 0; i < ALL.keyword.length; i++) {
    all_word = all_word + (i + 1) + '. "' + ALL.keyword[i] + '"\n'
  }
  return all_word
}
//=================================================================================
function ch_Name_and_Description() {
  var base_json = base()
  var FolderId = base_json.FolderId
  var Folder = DriveApp.getFolderById(FolderId); //download_from_line
  var files = Folder.getFiles();

  while (files.hasNext()) {
    var file = files.next();
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
    } else if (get_extension(file.getName(), 0) == 'content') {
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
    //Logger.log("NNNNNNN = ", file.getName())
    //Logger.log("NNNNNNN222 = ", get_extension(file.getName(), 0))
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
function sendtext(chat_id, ct) {
Logger.log("sendtext =========\n",chat_id)
Logger.log("sendtext 22222222=\n",ct)
  try {
    var notification = ct["notification"]
    var parse_mode = ct["parse_mode"]
    if (notification == undefined || notification != true)
      var notification = false
    if (parse_mode == undefined)
      var parse_mode = ""
  } catch (e) {
    var notification = false
    var parse_mode = ""
  }
  if (ct["text"] == undefined) {
    var text = String(ct)
  } else {
    var text = ct["text"]
  }

  var payload = {
    "method": "sendMessage",
    'chat_id': String(chat_id),
    'text': text,
    'disable_notification': notification,
    "parse_mode": parse_mode
  }
  start(payload);
}
//=================================================================
function sendPhoto(chat_id, url, notification, caption) {
  if (notification == undefined)
    notification = false
  caption = caption || ""
  var payload = {
    "method": "sendPhoto",
    'chat_id': String(chat_id),
    'photo': url,
    'disable_notification': notification,
    'caption': caption
  }
  start(payload);
}
//=================================================================================
function sendAudio(chat_id, url, notification, caption) {
  if (notification == undefined)
    notification = false
  caption = caption || ""
  var payload = {
    "method": "sendAudio",
    'chat_id': String(chat_id),
    'audio': url,
    'disable_notification': notification,
    'caption': caption
  }
  start(payload);
}
//=================================================================
function sendVoice(chat_id, url, notification, caption) {
  if (notification == undefined)
    notification = false
  caption = caption || ""
  var payload = {
    "method": "sendVoice",
    'chat_id': String(chat_id),
    'voice': url,
    'disable_notification': notification,
    'caption': caption
  }
  start(payload);
}
//=================================================================
function senddocument(chat_id, url, notification, caption) {
  if (notification == undefined)
    notification = false
  caption = caption || ""
  var payload = {
    "method": "senddocument",
    'chat_id': String(chat_id),
    'document': url,
    'disable_notification': notification,
    'caption': caption
  }
  start(payload);
}
//=================================================================
function sendLocation(chat_id, latitude, longitude, notification) {
  if (notification == undefined)
    notification = false
  var payload = {
    "method": "sendLocation",
    "chat_id": String(chat_id),
    "latitude": latitude,
    "longitude": longitude,
    'disable_notification': notification
  }
  start(payload);
}
//=================================================================
function TG_leaveChat(chat_id) {
  var payload = {
    "method": "leaveChat",
    "chat_id": String(chat_id)
  }
  start(payload);
}
//=================================================================================
function write_ALL(ALL, doc) {
  try {
    var r = JSON.stringify(ALL);
    doc.setText(r); //寫入
  } catch (e) {
    return e
  }
  return true
}
//=================================================================================
function key_word_check(txt, keys) {
  var keys_value = []
  for (var i = 0; i < keys.length; i++) {
    if (txt.search(String(keys[i])) > -1) {
      //Logger.log("TTTTSSS = ",txt.search(String(keys[i])))
      for (var j = 0; j < keys_value.length; j++) {
        //Logger.log("TTUU5555 = ",i," , ",j)
        if (keys_value[j] == keys[i]) {
          //Logger.log("TTUU5555 = continue")
          continue
        }
      }
      keys_value.push(String(keys[i]))
    }
  }
  //Logger.log(keys_value)
  return keys_value
}
//=================================================================================
//喔乾，感謝 Kevin Tseng 開源這個用法
//來源: https://kevintsengtw.blogspot.com/2011/09/javascript-stringformat.html?showComment=1536387871696#c7569907085658128584
//可在Javascript中使用如同C#中的string.format (對jQuery String的擴充方法)
//使用方式 : var fullName = 'Hello. My name is {0} {1}.'.format('FirstName', 'LastName');
String.prototype.format = function() {
  var txt = this.toString();
  for (var i = 0; i < arguments.length; i++) {
    var exp = getStringFormatPlaceHolderRegEx(i);
    txt = txt.replace(exp, (arguments[i] == null ? "" : arguments[i]));
  }
  return cleanStringFormatResult(txt);
}
//讓輸入的字串可以包含{}
function getStringFormatPlaceHolderRegEx(placeHolderIndex) {
  return new RegExp('({)?\\{' + placeHolderIndex + '\\}(?!})', 'gm')
}
//當format格式有多餘的position時，就不會將多餘的position輸出
//ex:
// var fullName = 'Hello. My name is {0} {1} {2}.'.format('firstName', 'lastName');
// 輸出的 fullName 為 'firstName lastName', 而不會是 'firstName lastName {2}'
function cleanStringFormatResult(txt) {
  if (txt == null) return "";
  return txt.replace(getStringFormatPlaceHolderRegEx("\\d+"), "");
}
//=================================================================================
function Random_text() {
  var id = ""
  var codeLength = 12
  var selectChar = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
  for (var i = 0; i < codeLength; i++) {
    var charIndex = Math.floor(Math.random() * 36);
    id += selectChar[charIndex];
  }
  return id
}
//=================================================================================
function start(payload) {
  var base_json = base()
  var Telegram_bot_key = base_json.Telegram_bot_key
  var data = {
    "method": "post",
    "payload": payload
  }
  Logger.log("ZZZZ = ", payload)
  //UrlFetchApp.fetch("https://api.telegram.org/bot" + Telegram_bot_key + "/", data);
  //*/  為了速度和穩定 不必要就算了
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
