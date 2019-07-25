function up_version() {
  // 每次進行程式版本更新時，若有提到要執行這個 function 請照做一次

  // 以下為了簡化程式複雜度(不想一直try_error)，故先行檢查、修復ALL物件的完整性
  var base_json = base();
  var FolderId = base_json.FolderId
  var doc_key = base_json.doc_key
  var Telegram_id = base_json.Telegram_id
  var doc = DocumentApp.openById(doc_key)
  var ALL = JSON.parse(doc.getText());
  var ct = language()["correspond_text"]

  var lock = LockService.getScriptLock();
  var success = lock.tryLock(30 * 1000);

  // 下面是 V3.1 所需
  if (ALL.FastMatch3 == undefined) {
    ALL.FastMatch3 = {}
  }
  if (ALL['TG_temporary_docking'] == undefined) {
    ALL['TG_temporary_docking'] = {}
  }
  if (ALL['wait_to_Bind'] == undefined) {
    ALL['wait_to_Bind'] = {}
  }
  if (ALL['GMT'] == undefined) {
    ALL['GMT'] = "GMT+8"
  }

  // 下面是 V3.2 所需
  if (ALL['code_version'] == undefined) {
    ALL['code_version'] = 3.1
  }
  if (ALL['code_version'] < 3.2) {
    var ctv = language()["match_version"]
    if (ctv < 3.2) {
      throw new Error("請更新 language 文件再重來!")
    }
    var Folder = DriveApp.getFolderById(FolderId);
    clear_folders(Folder); // 清目標資料夾下所有資料夾
    clear_files(Folder); // 清目標資料夾下所有檔案
    var Description = "{'version': 3.2}"
    // 下面2個註解提醒一下自己之後要完美支援貼圖，希望之後改版能成啦!
    //create_Folder(Folder, 'Telegram_貼圖', Description)
    //create_Folder(Folder, 'Line_貼圖', Description)
    create_Folder(Folder, '檔案放置區', Description)
    var list = list_folder(Folder)
    for (var i = 0; i < list.length; i++) {
      ALL[list[i]['FolderName']] = list[i]
    }
    ALL = up_room_start(ALL) // 將房間已升級的符號改變成星星
    ALL['code_version'] = 3.2
    // /debug
    ALL.mode = 0
    ALL.wait_to_Bind = {}
    var REST_F = REST_FastMatch1and2and3(ALL);
    var REST_k = REST_keyboard(REST_F[1]);
    var r = JSON.stringify(REST_k[1]);
    doc.setText(r); //寫入
    sendtext(Telegram_id, ct["debug_ed"]["text"].format(REST_F[0], REST_k[0]));
    // 🔮 開啟主選單
    keyboard_main(Telegram_id, ct["🔮 開啟主選單"], REST_k[1])
  }

  // 下面是 V3.3 所需 ( 終於解決貼圖問題啦~ 撒花ヽ(✿ﾟ▽ﾟ)ノ
  if (ALL['code_version'] < 3.3) {
    var ctv = language()["match_version"]
    if (ctv < 3.3) {
      throw new Error("請更新 language 文件再來執行此函式!")
    }
    var Folder = DriveApp.getFolderById(FolderId);
    var Description = "{'version': 3.3}"
    create_Folder(Folder, 'Line貼圖放置區', Description)
    create_Folder(Folder, 'Telegram貼圖放置區', Description)

    var sticker_sheet_name = '貼圖對照表'
    var sticker_sheet_doc = DocumentApp.create(sticker_sheet_name);
    var docFileId = sticker_sheet_doc.getId()
    var File = DriveApp.getFileById(docFileId);
    var file2 = File.makeCopy(sticker_sheet_name, Folder)
    File.setTrashed(true)

    var sticker_sheet_doc2 = DocumentApp.openById(file2.getId())
    sticker_sheet_doc2.setText('{}')

    var list = list_folder(Folder)
    for (var i = 0; i < list.length; i++) {
      ALL[list[i]['FolderName']] = list[i]
    }

    var list2 = list_files(Folder)
    for (var j = 0; j < list2.length; j++) {
      ALL[list2[j]['FileName']] = list2[j]
    }

    // 這是我的server沒錯，原始碼之後也會公開，各位亦可自行選擇是否自架server
    // 在此聲明我不會蒐集任何個資
    // 但有可能保留已轉換的媒體，用來加速轉換的速度(目前沒有留，之後再看看)
    //
    // 此外，這是免費資源，但server能力有限
    // 希望不要有除了 Telegram_link_Line 以外的請求到我的server
    // 我有限制轉圖的大小於server端。
    // 希望能相信一次人性。
    ALL["conservion_server"] = {
      "domain_name": 'we684123.hopto.org',
      "conservion_api":'/media_conservion',
    }

    ALL['code_version'] = 3.3
    ALL.mode = 0
    ALL.wait_to_Bind = {}
    sendtext(Telegram_id, 'V3.3 已升級完成\n終於解決貼圖問題啦~~~\nヽ(✿ﾟ▽ﾟ)ノ (撒花');
  }

  // 寫入ALL
  var r = JSON.stringify(ALL);
  doc.setText(r); //寫入
  lock.releaseLock();
}
//===============================================================
function doPost(e) {
  //嘗試lock
  var lock = LockService.getScriptLock();
  var success = lock.tryLock(30 * 1000);

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
    var ee = JSON.stringify(estringa);
  } else if (debug == 2) { //模擬Line
    var sheet_key = base_json.sheet_key
    var SpreadSheet = SpreadsheetApp.openById(sheet_key);
    var SheetD = SpreadSheet.getSheetByName("Debug");
    var e = SheetD.getRange(2, 2).getDisplayValue(); //讀取debug分頁中的模擬資訊
    var estringa = JSON.parse(e);
    var ee = JSON.stringify(estringa);
  } else {
    var estringa = JSON.parse(e.postData.contents);
    var ee = JSON.stringify(estringa);
  }

  //各種預設
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
  var ct = language()["correspond_text"] //語言載入
  var download_folder_name = '檔案放置區'
  var DLineSFN = 'Line貼圖放置區' //download_line_Sticker_folder_name
  var DTGSFN = 'Telegram貼圖放置區' //download_Telegram_Sticker_folder_name
  var sticker_sheet = '貼圖對照表'
  var G_drive_Durl = 'https://drive.google.com/uc?export=download&id='
  var G_drive_Durl_ex = 'https://drive.google.com/uc?export=download&confirm=YzWC&id='
  var rt_max_chats = 14 //對Line回復時應許的字元數
  var notification = false
  var nonsense_number = 3

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
    console.log(f) //還是要來看到底怎樣會出事，雖然救的回來就是了。
    var Dlen = f.search('}{"');
    var ff = f.substring(0, Dlen + 1)
    var r = ff;
    doc.setText(r); //寫入
    var ALL = JSON.parse(r);
  }

  //以下正式開始===========================================
  if (estringa.update_id) { //利用兩方json不同來判別
    //以下來自telegram
    var from = 'telegram';
    Log(ee, from, sheet_key, email); //log
    var mode = ALL.mode;
    var GMT = ALL.GMT
    var Stext = estringa.message.text;
    var chat_id = estringa.message.chat.id
    var chat_type = estringa.message.chat.type
    //前期準備完成


    //擁有者檢查===================================================
    if (Telegram_id != chat_id && chat_type == "private") {
      //如果不是 發一段話即結束
      lock.releaseLock(); //先結束鎖不影響
      sendtext(chat_id, ct["not_owner"])
      return 0;
    }


    //來源檢查===================================================
    if (chat_type == "supergroup" || chat_type == "group") { //現在只剩 群組、超級群組 的可能
      var number = ALL.FastMatch3[chat_id]
      if (number == undefined) { //在不認識的群組時
        //如果出現綁定隨機碼，備份並綁定。
        if (ALL['wait_to_Bind'][Stext] != undefined) {
          CP();
          sendtext(Telegram_id, ct["backed_up_ing"])
          // ^ "已備份舊資料，更新doc資料庫中..."
          var n = ALL['wait_to_Bind'][Stext] //這邊的Stext是驗證碼
          //下面"升級房間2"用的資料新入
          var chat_title = estringa.message.chat.chat_title
          var Name = ALL.data[n]["Name"]
          ALL.data[n]["Name"] = Name.substr(0, Name.length - 1) + "⭐"
          ALL.data[n]["Bind_groud_chat_id"] = chat_id
          ALL.data[n]["Bind_groud_chat_title"] = chat_title
          ALL.data[n]["Bind_groud_chat_type"] = chat_type
          ALL.data[n].status = "已升級房間2"
          ALL.data[n]["Display_name"] = false
          ALL.FastMatch3[chat_id] = n //快速存取3寫入

          //下面收拾善後
          delete ALL.data[n]["Binding_number"]
          delete ALL['TG_temporary_docking'][chat_id]
          //下面這行會有如果同時升級兩個會導致另一個失敗的問題\
          //但想想應該不會有人一次升兩個...吧?
          ALL['wait_to_Bind'] = {}
          ALL.mode = 0
          var REST_result = REST_keyboard(REST_FastMatch1and2and3(ALL)[1])
          ALL = REST_result[1]
          write_ALL(ALL, doc) //寫入
          text = ct["bing_success"]['text'].format(ALL.data[n]["Name"])
          keyboard_main(Telegram_id, text, ALL)
          // ^ {0} 綁定成功!\n\n提醒您! 如果這群不只主人你一個人的話\n
          //   請記得去主控bot選擇這個房間並開啟"☀ 顯示發送者"，
          //   以免Line端眾不知何人發送。

          if (ALL.data[n]['Amount']) { //如果還有訊息直接傾倒
            sendtext(chat_id, ct["not_read_all_ed"])
            var j = read_massage(sheet_key, doc, ALL, ct, GMT, chat_id, notification, Telegram_id)
            if (j) {
              ALL.data[n]['Amount'] = 0
            }
            write_ALL(ALL, doc) //寫入
          }

          lock.releaseLock();
          return 0;
        } else { //如果沒有隨機碼
          if (ALL['TG_temporary_docking'][chat_id] == nonsense_number) { //容忍3句廢話(#
            delete ALL['TG_temporary_docking'][chat_id]
            TG_leaveChat(chat_id)
            write_ALL(ALL, doc) //寫入
            lock.releaseLock();
            return 0;
          } else if (ALL['TG_temporary_docking'][chat_id] == undefined) {
            // 初入群的時候
            if (estringa.message.left_chat_member) { //不理離開群組的訊息
              lock.releaseLock();
              return 0;
            }
            ALL['TG_temporary_docking'][chat_id] = 0
            write_ALL(ALL, doc) //寫入
            sendtext(chat_id, ct['not_registered'])
            // ^ 您好!此群似乎還沒有與資料庫綁定，等主人綁定後我才能在此服務。...
            lock.releaseLock();
            return 0;
          } else { //還是等隨機碼驗證中...
            ALL['TG_temporary_docking'][chat_id] += 1
            write_ALL(ALL, doc) //寫入
            lock.releaseLock();
            return 0;
          }
        }
      } else { //已綁定群組中發話
        if (ALL.data[number]['Amount']) { //如果還有訊息直接傾倒
          sendtext(chat_id, ct["not_read_all_ed"])
          var j = read_massage(sheet_key, doc, ALL, ct, GMT, chat_id, notification, Telegram_id)
          if (j) {
            ALL.data[number]['Amount'] = 0
          }
          write_ALL(ALL, doc) //寫入
          lock.releaseLock();
          return 0
        }

        try { //處理 tryget 指令
          // 下面這個是跟Line重(ㄔㄨㄥˊ )要Line的檔案
          var rg = Stext.split("@")[0].split("_")
          if (rg[0] == '/tryget') {
            tryget_XXX(ALL, chat_id, ct, rg, download_folder_name, CHANNEL_ACCESS_TOKEN)
            lock.releaseLock();
            return 0
          }
        } catch (e) {}

        // 下面才是正常的流程
        var n = number
        var Line_id = ALL.data[n]['RoomId'] //目標LINE房間ID
        if (ALL.data[n]["Display_name"]) { //預先處理名稱問題
          var last_name = ''
          var first_name = estringa.message.from.first_name
          if (estringa.message.from.last_name) {
            last_name = estringa.message.from.last_name
          }
          var by_name = ct['by_name']['text'].format(first_name, last_name)
          var TG_name = ct['TG_name']['text'].format(first_name, last_name)
        } else {
          var by_name = ''
        }

        //優先處理格式化字串，不然下面要寫一堆
        if (estringa.message['entities']) {
          //處理 text 格式化字串連結
          var entities = estringa.message['entities']
          Stext = entities_conversion(Stext, entities, ct)
        }
        if (estringa.message['caption_entities']) {
          //處理 caption 格式化字串連結
          var entities = estringa.message['caption_entities']
          var caption = estringa.message.caption
          estringa.message.caption = entities_conversion(caption, entities, ct)
        }

        //以下處理發話
        if (estringa.message.text) {
          try {
            if (estringa.message.reply_to_message) {
              var rt = estringa.message.reply_to_message.text
              var index = rt.search(ct['reduce_seach_chat']['text'])
              if (index) {
                // 處理回覆的字數限制問題(需要跟著名子字數走)
                var rt_max_chats = rt_max_chats + parseInt(index)
              }
              var rt_text = rt_text_reduce(rt, rt_max_chats)
              var rt_date = estringa.message.reply_to_message.date
              var date = get_time_txt(rt_date * 1000, GMT)
              text = ct["For_this_reply"]["text"].format(rt_text, date, Stext);
              // ^ "{0}\n{1}\n████針對回復████\n{2}"
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
          var max = p.length - 1; //挑品質最好的 //NU$ 須注意照片大小以免傳送失敗
          var photo_id = p[max].file_id
          var Folder = DriveApp.getFolderById(ALL[download_folder_name]['FolderId']);
          var gfid = downloadFromTG(Telegram_bot_key, photo_id, fileName, Folder)
          var Durl = get_200_url(G_drive_Durl + gfid)
          TG_Send_Photo_To_Line(Line_id, photo_id, Durl)

          if (ALL.data[n]["Display_name"] && estringa.message.caption) {
            var t1 = ct["is_from"]['text'].format(TG_name)
            var t2 = ct["assemble_caption"]['text'].format(t1, estringa.message.caption)
            TG_Send_text_To_Line(Line_id, t2)
          } else { //如只有 簡介 或 來源 則一同發出
            if (ALL.data[n]["Display_name"]) {
              TG_Send_text_To_Line(Line_id, (ct["is_from"]['text'].format(TG_name)))
            }
            if (estringa.message.caption) { //如有簡介則一同發出
              var text = by_name + estringa.message.caption
              TG_Send_text_To_Line(Line_id, text)
            }
          }

          sendtext(chat_id, ct["sendPhoto_ed"]);
          // ^ "(圖片已發送!)"
        } else if (estringa.message.video) {
          //以下選擇telegram video並發到line
          var file_id = estringa.message.video.file_id
          var thumb_id = estringa.message.video.thumb.file_id
          TG_Send_video_To_Line(Line_id, file_id, thumb_id)
          if (ALL.data[n]["Display_name"] && estringa.message.caption) {
            var t1 = ct["is_from"]['text'].format(TG_name)
            var t2 = ct["assemble_caption"]['text'].format(t1, estringa.message.caption)
            TG_Send_text_To_Line(Line_id, t2)
          } else { //如只有 簡介 或 來源 則一同發出
            if (ALL.data[n]["Display_name"]) {
              TG_Send_text_To_Line(Line_id, (ct["is_from"]['text'].format(TG_name)))
            }
            if (estringa.message.caption) { //如有簡介則一同發出
              var text = by_name + estringa.message.caption
              TG_Send_text_To_Line(Line_id, text)
            }
          }
          sendtext(chat_id, ct["sendVideo_ed"]);
          // ^ "(影片已發送!)"
        } else if (estringa.message.video_note) {
          //以下選擇telegram video並發到line
          var file_id = estringa.message.video_note.file_id
          var thumb_id = estringa.message.video_note.thumb.file_id
          TG_Send_video_To_Line(Line_id, file_id, thumb_id)
          if (ALL.data[n]["Display_name"] && estringa.message.caption) {
            var t1 = ct["is_from"]['text'].format(TG_name)
            var t2 = ct["assemble_caption"]['text'].format(t1, estringa.message.caption)
            TG_Send_text_To_Line(Line_id, t2)
          } else { //如只有 簡介 或 來源 則一同發出
            if (ALL.data[n]["Display_name"]) {
              TG_Send_text_To_Line(Line_id, (ct["is_from"]['text'].format(TG_name)))
            }
            if (estringa.message.caption) { //如有簡介則一同發出
              var text = by_name + estringa.message.caption
              TG_Send_text_To_Line(Line_id, text)
            }
          }
          sendtext(chat_id, ct["sendVideo_ed"]);
          // ^ "(影片已發送!)"
        } else if (estringa.message.sticker) {
          var file_id = estringa.message.sticker.file_id
          TG_Send_Sticker_To_Line(Line_id, file_id)
          if (ALL.data[n]["Display_name"]) { //如果開啟人名顯示
            TG_Send_text_To_Line(Line_id, (ct["caption_der_form"]['text'].format(TG_name)))
            // ^ "來自: {0}"
          }
          sendtext(chat_id, ct["sendSticker_ed"]);
          // ^ "(貼圖已發送!)"
        } else if (estringa.message.audio) {
          var duration = estringa.message.audio.duration
          var audio_id = estringa.message.audio.file_id
          TG_Send_audio_To_Line(Line_id, audio_id, duration, Telegram_bot_key)
          if (ALL.data[n]["Display_name"] && estringa.message.caption) {
            var t1 = ct["is_from"]['text'].format(TG_name)
            var t2 = ct["assemble_caption"]['text'].format(t1, estringa.message.caption)
            TG_Send_text_To_Line(Line_id, t2)
          } else { //如只有 簡介 或 來源 則一同發出
            if (ALL.data[n]["Display_name"]) {
              TG_Send_text_To_Line(Line_id, (ct["is_from"]['text'].format(TG_name)))
            }
            if (estringa.message.caption) { //如有簡介則一同發出
              var text = by_name + estringa.message.caption
              TG_Send_text_To_Line(Line_id, text)
            }
          }
          sendtext(chat_id, ct["sendAudio_ed"]);
          // ^ "(音檔已發送!)"
        } else if (estringa.message.voice) {
          var duration = estringa.message.voice.duration
          var audio_id = estringa.message.voice.file_id
          TG_Send_audio_To_Line(Line_id, audio_id, duration, Telegram_bot_key)
          if (ALL.data[n]["Display_name"] && estringa.message.caption) {
            var t1 = ct["is_from"]['text'].format(TG_name)
            var t2 = ct["assemble_caption"]['text'].format(t1, estringa.message.caption)
            TG_Send_text_To_Line(Line_id, t2)
          } else { //如只有 簡介 或 來源 則一同發出
            if (ALL.data[n]["Display_name"]) {
              TG_Send_text_To_Line(Line_id, (ct["is_from"]['text'].format(TG_name)))
            }
            if (estringa.message.caption) { //如有簡介則一同發出
              var text = by_name + estringa.message.caption
              TG_Send_text_To_Line(Line_id, text)
            }
          }
          sendtext(chat_id, ct["sendVoice_ed"]);
          // ^ "(錄音已發送!)"
        } else if (estringa.message.location) {
          var latitude = estringa.message.location.latitude
          var longitude = estringa.message.location.longitude

          try {
            var response = Maps.newGeocoder().setLanguage(
              'zh-TW').reverseGeocode(latitude, longitude);
            var formatted_address = response.results[0]['formatted_address']
          } catch (e) {
            var formatted_address = '未知地點'
          }

          //感謝 思考要在空白頁 http://blog.yslin.tw/2013/02/google-map-api.html
          TG_Send_location_To_Line(Line_id, latitude, longitude, formatted_address)
          if (ALL.data[n]["Display_name"]) {
            TG_Send_text_To_Line(Line_id, (ct["caption_der_form"]['text'].format(TG_name)))
          }
        } else if (estringa.message.animation) {
          var file_id = estringa.message.animation.file_id
          var thumb_id = estringa.message.animation.thumb.file_id
          TG_Send_video_To_Line(Line_id, file_id, thumb_id)
          if (ALL.data[n]["Display_name"] && estringa.message.caption) {
            var t1 = ct["is_from"]['text'].format(TG_name)
            var t2 = ct["assemble_caption"]['text'].format(t1, estringa.message.caption)
            TG_Send_text_To_Line(Line_id, t2)
          } else { //如只有 簡介 或 來源 則一同發出
            if (ALL.data[n]["Display_name"]) {
              TG_Send_text_To_Line(Line_id, (ct["is_from"]['text'].format(TG_name)))
            }
            if (estringa.message.caption) { //如有簡介則一同發出
              var text = by_name + estringa.message.caption
              TG_Send_text_To_Line(Line_id, text)
            }
          }
          sendtext(chat_id, ct["sendGIF_ed"]);
          // ^ "(GIF已發送!)"
        } else if (estringa.message.document) {
          var fileId = estringa.message.document.file_id
          var fileName = estringa.message.document.file_name
          var file_size = parseInt(estringa.message.document.file_size)
          var file_size_MB = (file_size / 1024 / 1024).toFixed(3)


          var Folder = DriveApp.getFolderById(ALL[download_folder_name]['FolderId']);
          var gfid = downloadFromTG(Telegram_bot_key, fileId, fileName, Folder)
          var Durl = G_drive_Durl + gfid
          text = ct['sendFileToLine']['text'].format(Durl, fileName, file_size, file_size_MB)
          if (estringa.message.caption) { //如有簡介則一同發出
            text = text + '\n' + estringa.message.caption
          }
          if (ALL.data[n]["Display_name"]) {
            text = by_name + text
          }
          TG_Send_text_To_Line(Line_id, text)
          sendtext(chat_id, ct["sendFile_ed"]);
          // ^ "(File連結已發送!)"
        }
      }
      lock.releaseLock();
      return 0;
    }
    //======================================================
    //以下是私人1對1的時候
    //先定義好往Line的發送對象
    var Line_id = ALL.opposite.RoomId;

    //再針對不同的情況處理訊息
    if (estringa.message.text) { //如果是文字訊息
      try { //處理 tryget 指令
        // 下面這個是跟Line重(ㄔㄨㄥˊ )要Line的檔案
        var rg = Stext.split("@")[0].split("_")
        if (rg[0] == '/tryget') {
          tryget_XXX(ALL, chat_id, ct, rg, download_folder_name, CHANNEL_ACCESS_TOKEN)
          lock.releaseLock();
          return 0
        }
      } catch (e) {}

      if (mode == "🚀 發送訊息" && Stext != "/exit") {
        //以下準備接收telegram資訊並發到line

        // 檢查是否誤傳
        if (in_command(Stext) || Stext.substr(0, 2) == "/d") {
          sendtext(chat_id, ct["plz_exit_and_resend"]);
          // ^ "請先按下 /exit 離開後再下指令喔!"
          lock.releaseLock();
          return 0;
        }

        try {
          // 下面這個是跟Line重(ㄔㄨㄥˊ )要Line的檔案
          var rg = Stext.split("@")[0].split("_")
          if (rg[0] == '/tryget') {
            tryget_XXX(ALL, chat_id, ct, rg, download_folder_name, CHANNEL_ACCESS_TOKEN)
            lock.releaseLock();
            return 0
          }
        } catch (e) {}

        if (estringa.message['entities']) {
          //處理 text 格式化字串連結
          var entities = estringa.message['entities']
          Stext = entities_conversion(Stext, entities, ct)
        }
        if (estringa.message['caption_entities']) {
          //處理 caption 格式化字串連結
          var entities = estringa.message['caption_entities']
          var caption = estringa.message.caption
          estringa.message.caption = entities_conversion(caption, entities, ct)
        }

        try {
          if (estringa.message.reply_to_message.text) {
            var rt = estringa.message.reply_to_message.text
            var index = rt.search(ct['reduce_seach_chat']['text'])
            if (index) {
              // 處理回覆的字數限制問題(需要跟著名子字數走)
              var rt_max_chats = rt_max_chats + parseInt(index)
            }
            var rt_text = rt_text_reduce(rt, rt_max_chats)
            var rt_date = estringa.message.reply_to_message.date
            var date = get_time_txt(rt_date * 1000, GMT)
            text = ct["For_this_reply"]["text"].format(rt_text, date, Stext);
            // ^ "{0}\n{1}\n████針對回復████\n{2}"
          } else {
            text = Stext;
          }
        } catch (e) {
          text = Stext;
        }
        TG_Send_text_To_Line(Line_id, text)
        lock.releaseLock();
        return 0;

        //========================================================
      } else if (mode == "🔖 重新命名" && Stext != "/main") {
        if (in_name(ALL, (U + "✅")) || in_name(ALL, (U + "❎")) || in_name(ALL, (U + "⭐️"))) { //排除重名
          sendtext(chat_id, ct["duplicate_name"]);
          // ^ "名子不可重複，請重新輸入一個!"
        } else if (in_command(Stext)) { //排除與指令重複
          sendtext(chat_id, ct["duplicate_command"]);
          // ^ "名子不可跟命令重複，請重新輸入一個!"
        } else {
          // 找目標
          var OName = ALL.opposite.Name
          var FM = ALL.FastMatch[OName]
          // 確認符號
          if (ALL.data[FM]['status'] == '已升級房間2') {
            var symbol = "⭐️"
          } else if (ALL.data[FM]['Notice']) {
            var symbol = "✅"
          } else {
            var symbol = "❎"
          }
          // 取代符號
          ALL.data[FM].Name = Stext + symbol
          var y = JSON.parse(
            JSON.stringify(ALL.FastMatch).replace(OName, Stext + symbol)
          ); //簡化一下當年的技術債... 當紀念吧...

          ALL.FastMatch = y;
          ALL.mode = 0
          //以下處理RoomKeyboard====================================
          ALL = REST_keyboard(ALL)[1] //重新編排keyborad
          write_ALL(ALL, doc) //寫入

          //=======================================================
          //var text = "🔖 重新命名完成~\n" + OName + " \n->\n " + Stext + "\n🔮 開啟主選單"
          ct["rename_success"]["text"] = ct["rename_success"]["text"].format(
            ct["🔖 重新命名"]["text"], OName, (Stext + symbol), ct["🔮 開啟主選單"]["text"]);
          text = ct["rename_success"]
          keyboard_main(chat_id, text, ALL)
        }
        lock.releaseLock();
        return 0;
        //=========================================================
      } else if (mode == "🔥 刪除房間" && Stext == "/delete") {
        var aims = ALL.opposite.RoomId
        var number = ALL.FastMatch2[aims]

        //doc處理
        ALL.data.splice(number, 1) //刪除目標
        ALL.mode = 0
        //sheet處理
        var SpreadSheet = SpreadsheetApp.openById(sheet_key);
        var Sheet = SpreadSheet.getSheetByName("Line訊息區");
        Sheet.deleteColumn(number + 1);
        try {
          var a1 = Line_leave(aims); //從Line中離開
        } catch (e) {
          sendtext(chat_id, ct['can_not_leave_from_line'])
          var a1 = false
        }
        var y1 = REST_keyboard(ALL); //重製快速鍵盤
        var a2 = y1[0]
        var y2 = REST_FastMatch1and2and3(y1[1]); //重製快速索引
        var a3 = y2[0]
        ALL = y2[1]

        write_ALL(ALL, doc) //寫入

        text = ct["delete_room_success"]['text'].format(a1, a2, a3)
        // ^ "Line_leave：{0}\nREST_keyboard：{1}\nREST_FastMatch1and2and3：{2}\n已刪除此聊天室"
        keyboard_main(chat_id, text, ALL)
        lock.releaseLock();
        return 0;
      } else if (mode == "⭐ 升級房間" && Stext == "/uproom") {
        ALL.mode = "/uproom"
        var FastMatch2_number = ALL.FastMatch2[ALL.opposite.RoomId]
        var Binding_number = String(Random_text(12))
        ALL.data[FastMatch2_number]['Binding_number'] = Binding_number //有點多餘但可確保
        ALL['wait_to_Bind'][Binding_number] = FastMatch2_number
        write_ALL(ALL, doc) //寫入
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
          write_ALL(ALL, doc) //寫入

          sendtext(chat_id, ct["unsetroom_ed"]);
          // ^ "已取消設定bot"
        } else {
          sendtext(chat_id, ct['in_uproom_but'])
        }
        lock.releaseLock();
        return 0;
      } else if (mode == "💫 降級房間" && Stext == "/droproom") {
        var aims = ALL.opposite.RoomId
        var number = ALL.FastMatch2[aims]
        var oppid = ALL.data[number]["Bind_groud_chat_id"]
        var Name = ALL.data[number]["Name"]

        if (ALL.data[number]["Notice"]) { //回復符號
          ALL.data[number]["Name"] = Name.substr(0, Name.length - 1) + "✅"
        } else {
          ALL.data[number]["Name"] = Name.substr(0, Name.length - 1) + "❎"
        }

        delete ALL.data[number].botToken
        delete ALL.data[number]["Bind_groud_chat_id"]
        delete ALL.data[number]["Bind_groud_chat_title"]
        delete ALL.data[number]["Bind_groud_chat_type"]
        delete ALL.data[number]["Display_name"]
        delete ALL.FastMatch3[oppid]
        ALL.data[number].status = "normal"
        ALL.mode = 0 //讓mode回復正常
        var REST_result = REST_keyboard(REST_FastMatch1and2and3(ALL)[1])
        write_ALL(REST_result[1], doc) //寫入

        keyboard_main(chat_id, ct["droproom_success"]["text"].format(
          JSON.stringify(ALL.data[number])), ALL)
        // ^ "已降級成功(๑•̀ㅂ•́)و✧\n\n" + "房間狀態:\n" + JSON.stringify(ALL.data[number])
        lock.releaseLock();
        return 0;
      } else if ((mode == "♻ 移除關鍵字" || mode == "📎 新增關鍵字") && Stext == "/lookkeyword") {
        text = ct["lookkeyword_result"]['text'].format(get_all_keyword(ALL))
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
            var index = parseInt(rmwkey_array[i]) - 1
            ALL.keyword.splice(index, 1)
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
      } else if (mode == "⏰ 訊息時間啟用?" && Stext != "/main") {
        function mixT(chat_id) {
          keyboard_main(chat_id, ct["change_message_time_func"]["text"].format(
            String(Stext)), ALL)
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
      } else if (mode == "✈️ 設定GMT" && Stext != "/main") {
        ALL['GMT'] = 'GMT' + Stext
        ALL.mode = 0
        write_ALL(ALL, doc)
        text = ct["set_GMT_ed"]['text'].format(Stext)
        keyboard_main(chat_id, text, ALL)
        lock.releaseLock();
        return 0;
      } else if (mode == "🌋 丟棄舊檔" && Stext != "/main" && Stext != ct["🔙 返回大廳"]["text"]) {
        var send_ed = sendtext(chat_id, ct['get_command_ed'])
        // ^ "已接收指令!\n處理中請稍後..."
        var Folder = DriveApp.getFolderById(ALL[download_folder_name]['FolderId']);
        switch (Stext) {
          case ct['Trashed_10day']["text"]:
            var result = clear_files_by_mode(Folder, 'time', 10)
            break;
          case ct['Trashed_30day']["text"]:
            var result = clear_files_by_mode(Folder, 'time', 30)
            break;
          case ct['Trashed_ALL']["text"]:
            var result = clear_files_by_mode(Folder, 'All')
            break;
          default:
            sendtext(chat_id, ct['not_eat_this'])
            // ^ "030...\n請不要給我吃怪怪的東西..."
            lock.releaseLock();
            return 0;
        }
        deleteMessage(chat_id, JSON.parse(send_ed)["result"]['message_id'])
        if (!result[0]) { //意外發生
          var ey = '失敗\n' + result[1]
        } else {
          var ey = '成功'
        }
        ct['Trashed_result'] = ct['Trashed_result']['text'].format(ey)
        ALL.mode = 0
        write_ALL(ALL, doc)
        keyboard_main(chat_id, ct['Trashed_result'], ALL)
        lock.releaseLock();
        return 0;
      } else {
        //以下指令分流
        switch (Stext) {
          case '/main':
          case ct['🔃 重新整理']["text"]:
            if (ALL.mode != 0) {
              ALL.mode = 0
              write_ALL(ALL, doc) //寫入
            }
            keyboard_main(chat_id, ct["🔮 開啟主選單"], ALL)
            break;
          case ct['🔙 返回大廳']["text"]:
            if (ALL.mode != 0) {
              ALL.mode = 0
              write_ALL(ALL, doc) //寫入
            }
            var keyboard = ALL.RoomKeyboard;
            var resize_keyboard = true
            var one_time_keyboard = false
            var text = ct["請選擇聊天室"]
            ReplyKeyboardMakeup(chat_id, keyboard, resize_keyboard, one_time_keyboard, text)

            break;
          case ct['🔭 訊息狀態']["text"]:
            var consumption = Number(JSON.parse(get_Line_consumption())['totalUsage'])
            sendtext(chat_id, ct["consumption"]['text'].format(consumption))
            data_len = ALL.data.length;
            text = ""
            for (var i = 0; i < data_len; i++) {
              if (ALL.data[i].Amount == 0) {
                continue;
              }
              text = ct["unread_number"]["text"].format(text, ALL.data[i].Name, ALL.data[i].Amount)
              // ^ text + ALL.data[i].Name + '\n' + '未讀：' + ALL.data[i].Amount + '\n' + '-------------\n'
            }
            ct["unread_number"]["text"] = text // 覆蓋回去
            if (text == "") {
              ct["unread_number"]["text"] = "沒有任何未讀。"
            }
            sendtext(chat_id, ct["unread_number"]);
            break;
          case ct['✔ 關閉鍵盤']["text"]:
            var text = ct['colse_Keyboard_ed']
            ReplyKeyboardRemove(chat_id, text)
            // ^ "已關閉鍵盤，如欲再次開啟請按 /main"
            break;
          case ct['🚀 發送訊息']["text"]:
            ALL.mode = "🚀 發送訊息"
            write_ALL(ALL, doc) //寫入
            ReplyKeyboardRemove(chat_id, ct["sendtext_to_XXX"]["text"].format(ALL.opposite.Name))
            // ^  "將對 {0} 發送訊息\n如欲離開請輸入 /exit \n請輸入訊息："
            break;
          case '/exit':
            ALL.mode = 0
            write_ALL(ALL, doc) //寫入
            keyboard_main(chat_id, ct["exit_room_ed"], ALL)
            // ^ "======已停止對話!======"
            break;
          case ct['📬 讀取留言']["text"]:
            if (ALL.data[ALL.FastMatch2[ALL.opposite.RoomId]].Amount == 0) {
              sendtext(chat_id, ct["not_need_read"], notification);
              // ^ "這個房間並沒有未讀的通知喔~ "
            } else {
              //獨立出來比較好
              read_massage(sheet_key, doc, ALL, ct, GMT, chat_id, notification, Telegram_id)
            }
            break;
          case ct['🔖 重新命名']["text"]:
            var OName = ALL.opposite.Name
            ALL.mode = "🔖 重新命名"
            write_ALL(ALL, doc) //寫入
            ReplyKeyboardRemove(chat_id, ct["rename_room_text"]['text'].format(OName))
            // ^ "將對 {0} 重新命名!!!\n如要取消命名請按 /main 取消\n請輸入新名子："
            break;
          case ct['🔥 刪除房間']["text"]:
            ALL.mode = "🔥 刪除房間"
            write_ALL(ALL, doc) //寫入
            sendtext(chat_id, ct["sure_delete_room?"]["text"].format(ALL.opposite.Name));
            // ^ 你確定要刪除 {0} 嗎?\n若是請按一下 /delete\n若沒按下則不會刪除!!!"
            break;
          case ct['🐳 開啟通知']["text"]:
            var OName = ALL.opposite.Name
            var FM = ALL.FastMatch[OName]
            ALL.data[FM].Notice = true;
            var u = ALL.data[FM].Name.replace("❎", "✅");
            ALL.data[FM].Name = u;
            var y = JSON.parse(String(JSON.stringify(ALL.FastMatch)).replace(
              OName, OName.slice(0, OName.length - 1) + "✅"));
            ALL.FastMatch = y;
            ALL.opposite.Name = u;
            ALL = REST_keyboard(ALL)[1] //重新編排keyborad
            write_ALL(ALL, doc) //寫入
            sendtext(chat_id, ct["enabled_notification_ed"]["text"].format(OName));
            // ^ "已開啟 {0} 的通知"
            //以下處理RoomKeyboard=================================

            break;
          case ct['🔰 暫停通知']["text"]:
            var OName = ALL.opposite.Name
            var FM = ALL.FastMatch[OName]
            ALL.data[FM].Notice = false
            var u = ALL.data[FM].Name.replace("✅", "❎");
            ALL.data[FM].Name = u;
            var y = JSON.parse(String(JSON.stringify(ALL.FastMatch)).replace(
              OName, OName.slice(0, OName.length - 1) + "❎"));
            ALL.FastMatch = y;
            ALL.opposite.Name = u;
            ALL = REST_keyboard(ALL)[1] //重新編排keyborad
            write_ALL(ALL, doc) //寫入
            sendtext(chat_id, ct["disabled_notification_ed"]["text"].format(OName));
            // ^ "已暫停 {0} 的通知"
            //以下處理RoomKeyboard==================================

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
              var ans = UrlFetchApp.fetch(
                "https://api.telegram.org/bot" + Telegram_bot_key + "/", data);
              var ans_json = JSON.parse(ans)
              var ctrl_bot_id = ans_json['result'].from.id
              if (ctrl_bot_id == undefined) {
                sendtext(chat_id, ct["get_ctrl_id_error"].format(ans))
                return 0
              }
              ALL.ctrl_bot_id = ctrl_bot_id
              write_ALL(ALL, doc) //寫入
            }

            ALL.mode = "⭐ 升級房間"
            write_ALL(ALL, doc) //寫入

            sendtext(chat_id, ct["uproom_Introduction"]);
            // ^ "⭐ 升級房間功能介紹：\n升級房間後，以後來自該對象(Line)的訊息
            //皆會及時傳到 **新的"群組"聊天室** ，而不會傳到這個"bot"聊天室中，
            //這個功能是可以回來這裡取消的。
            sendtext(chat_id, ct['uproom_sure?']["text"].format(ALL.opposite.Name));
            // ^ "您確定要升級 {0} 嗎?\n若是請按一下 /uproom \n若沒按下則不會進入升級!!!"
            break;
          case ct['💫 降級房間']["text"]:
            ALL.mode = "💫 降級房間"
            write_ALL(ALL, doc) //寫入

            sendtext(chat_id, ct["droproom_sure?"]["text"].format(ALL.opposite.Name));
            // ^ "您確定要降級 {0} 嗎?\n若是請按一下 /droproom \n若沒按下則不會降級!!!"
            break;
          case ct['☀ 顯示發送者']["text"]:
            var OName = ALL.opposite.Name
            var FM = ALL.FastMatch[OName]
            ALL.data[FM].Display_name = true;
            ALL.mode = 0
            write_ALL(ALL, doc) //寫入
            var keyboard = [
              [{
                'text': ct['💫 降級房間']["text"]
              }, {
                'text': ct["☁ 不顯示發送者"]["text"]
              }],
              [{
                'text': ct["🔙 返回大廳"]["text"]
              }]
            ]
            text = ct['Display_name_ch_ed']['text'].format(OName, ct['☀ 顯示發送者']["text"])
            // ^ {0} 已 {1}
            var u = undefined
            ReplyKeyboardMakeup(chat_id, keyboard, u, u, text)
            break;
          case ct['☁ 不顯示發送者']["text"]:
            var OName = ALL.opposite.Name
            var FM = ALL.FastMatch[OName]
            ALL.data[FM].Display_name = false;
            ALL.mode = 0
            write_ALL(ALL, doc) //寫入
            var keyboard = [
              [{
                'text': ct['💫 降級房間']["text"]
              }, {
                'text': ct["☀ 顯示發送者"]["text"]
              }],
              [{
                'text': ct["🔙 返回大廳"]["text"]
              }]
            ]
            text = ct['Display_name_ch_ed']['text'].format(OName, ct['☁ 不顯示發送者']["text"])
            // ^ {0} 已 {1}
            var u = undefined
            ReplyKeyboardMakeup(chat_id, keyboard, u, u, text)
            break;
          case '/debug':
            ALL.mode = 0
            ALL.wait_to_Bind = {}
            var REST_F = REST_FastMatch1and2and3(ALL); //強制等待，不知道為什麼有時候不會執行
            var REST_k = REST_keyboard(REST_F[1]); //強制等待，不知道為什麼有時候不會執行
            var r = JSON.stringify(REST_k[1]);
            doc.setText(r); //寫入
            sendtext(chat_id, ct["debug_ed"]["text"].format(REST_F[0], REST_k[0]));
            // ^ "已debug\nREST_FastMatch1and2and3() : {0}\nREST_keyboard() : {1}",
            break;
          case '/AllRead':
          case '/Allread':
          case '/allRead':
          case '/allread':
            var send_ed = sendtext(chat_id, ct["get_command_ed"]["text"]);
            // ^ "已接收指令!"
            AllRead();
            sendtext(chat_id, ct["allRead_ed"]["text"]);
            // ^ "已全已讀"
            deleteMessage(chat_id, JSON.parse(send_ed)["result"]['message_id'])
            break;
          case ct['🔧 更多設定']["text"]:
            var more_keyboard = [
              [{
                'text': ct["🔑 設定關鍵字提醒"]["text"]
              }, {
                'text': ct['⏰ 訊息時間啟用?']["text"]
              }],
              [{
                'text': ct["✈️ 設定GMT"]["text"]
              }, {
                'text': ct["🌋 丟棄舊檔"]["text"]
              }],
              [{
                'text': ct["🔙 返回大廳"]["text"]
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
              write_ALL(ALL, doc) //寫入
            }
            text = ct["more_setting_status"]['text'].format(
              ALL['keyword_notice'], ALL['massage_time'], ALL['GMT'])
            // ^ '設定狀態：\n● 關鍵字提醒：{0}\n● 訊息時間啟用： {1}\n'
            var resize_keyboard = true
            var one_time_keyboard = false
            ReplyKeyboardMakeup(chat_id, more_keyboard, resize_keyboard, one_time_keyboard, text)
            break;
          case ct['⏰ 訊息時間啟用?']["text"]:
            ALL.mode = "⏰ 訊息時間啟用?"
            write_ALL(ALL, doc) //寫入

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
            ReplyKeyboardMakeup(
              chat_id, massage_time_q_keyboard, resize_keyboard, one_time_keyboard, text)
            break;
          case ct["🔑 設定關鍵字提醒"]["text"]:
            if (ALL.keyword_notice == undefined) { //這一次啟動時的重製
              ALL.keyword_notice = false
              write_ALL(ALL, doc) //寫入
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
                'text': ct["🔙 返回大廳"]["text"]
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
                'text': ct["🔙 返回大廳"]["text"]
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
            ReplyKeyboardMakeup(
              chat_id, keyword_keyboard, resize_keyboard, one_time_keyboard, all_word)
            break;
          case ct['📎 新增關鍵字']["text"]:
            ALL.mode = "📎 新增關鍵字"
            ReplyKeyboardRemove(chat_id, ct["add_keyword_ing"])
            // ^ "請輸入欲新增關鍵字\n新增多組關鍵字請用 ',' 或 '，' 號隔開
            // \n如欲離開請按 /main"
            write_ALL(ALL, doc)
            break;
          case ct['♻ 移除關鍵字']["text"]:
            ALL.mode = "♻ 移除關鍵字"
            AllRead();
            ReplyKeyboardRemove(chat_id, ct["delete_keyword_ing"])
            // ^ '請輸入欲移除關鍵字的**前方編號!!!**\n刪除多組關鍵字請用 "任意符號" 隔開(推薦用","或"，")\n如遇離開請按 /main'
            write_ALL(ALL, doc) //寫入
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
                'text': ct["🔙 返回大廳"]["text"]
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
                'text': ct["🔙 返回大廳"]["text"]
              }]
            ]
            var resize_keyboard = true
            var one_time_keyboard = false
            ReplyKeyboardMakeup(
              chat_id, keyboard, resize_keyboard, one_time_keyboard, text)
            break;
          case '/lookkeyword':
            text = ct["lookkeyword_result"]['text'].format(get_all_keyword(ALL))
            sendtext(chat_id, text);
            break;
          case ct["✈️ 設定GMT"]["text"]:
            ALL.mode = "✈️ 設定GMT"
            sendtext(chat_id, ct["set_GMT_ing_1"]);
            ReplyKeyboardRemove(chat_id, ct["set_GMT_ing_2"]);
            write_ALL(ALL, doc) //寫入
            break;
          case ct["🌋 丟棄舊檔"]["text"]:
            ALL.mode = "🌋 丟棄舊檔"
            text = ct["file_to_Trashed"]
            var Trashed_keyboard = [
              [{
                'text': ct["Trashed_10day"]["text"]
              }, {
                'text': ct["Trashed_30day"]["text"]
              }],
              [{
                'text': ct['Trashed_ALL']["text"]
              }, {
                'text': ct["🔙 返回大廳"]["text"]
              }]
            ]
            var resize_keyboard = true
            var one_time_keyboard = false
            ReplyKeyboardMakeup(
              chat_id, Trashed_keyboard, resize_keyboard, one_time_keyboard, text)
            write_ALL(ALL, doc) //寫入
            break;
            //-------------------------------------------------------------------
          default:
            if (Stext == ct['/droproom']['text']) {
              sendtext(chat_id, ct["incorrect_operation"]);
              // ^ "錯誤的操作喔（ ・∀・），請檢查環境是否錯誤"
            }

            //下面處理房間選擇
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
              var Ostatus = ALL.data[FM].status
              if (ALL.data[FM].Display_name) {
                var ODisplay_name = "顯示人名：" + ALL.data[FM].Display_name + '\n'
              } else {
                var ODisplay_name = ""
              }
              ALL.opposite.RoomId = ORoomId;
              ALL.opposite.Name = OName;
              write_ALL(ALL, doc) //寫入
              var Notice = ALL.data[FM].Notice

              text = ct["select_room_text"]["text"].format(
                OName, OAmount, Notice, ODisplay_name, Ostatus)
              // ^ "您選擇了 {0} 聊天室\n未讀數量：{1}\n聊天室通知：{2}\n請問你要?"
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
                  'text': ct["🔙 返回大廳"]["text"]
                }]
              ]

              if (ALL.data[FM]["Bind_groud_chat_id"]) { //如果遇到已升級的則改"降級"
                var keyboard2 = [
                  [{
                    'text': ct['💫 降級房間']["text"]
                  }, {
                    'text': ct["☀ 顯示發送者"]["text"]
                  }],
                  [{
                    'text': ct['🔖 重新命名']["text"]
                  }, {
                    'text': ct["🔙 返回大廳"]["text"]
                  }]
                ]
                keyboard = keyboard2
              }
              if (ALL.data[FM]["Display_name"]) { //改鍵盤人名顯示與否
                keyboard2[0][1]['text'] = '☁ 不顯示發送者'
              }
              var resize_keyboard = true
              var one_time_keyboard = false
              ReplyKeyboardMakeup(chat_id, keyboard, resize_keyboard, one_time_keyboard, text)

            } else {
              sendtext(chat_id, ct["incorrect_operation"]);
              // ^ "錯誤的操作喔（ ・∀・），請檢查環境是否錯誤"
            }
        }
        lock.releaseLock();
        return 0;
      }
    } else if (estringa.message.photo) { //如果是照片
      if (mode == "🚀 發送訊息") {
        //以下選擇telegram照片並發到line
        var p = estringa.message.photo
        var max = p.length - 1;

        var photo_id = p[max].file_id
        var Folder = DriveApp.getFolderById(ALL[download_folder_name]['FolderId']);
        var gfid = downloadFromTG(Telegram_bot_key, photo_id, fileName, Folder)
        var Durl = get_200_url(G_drive_Durl + gfid)
        TG_Send_Photo_To_Line(Line_id, photo_id, Durl)

        if (estringa.message.caption)
          TG_Send_text_To_Line(Line_id, estringa.message.caption)
        //如有簡介則一同發出
        sendtext(chat_id, ct["sendPhoto_ed"]);
        // ^ "(圖片已發送!)"
      } else {
        sendtext(chat_id, ct["incorrect_operation"]);
        // ^ "錯誤的操作喔（ ・∀・），請檢查環境是否錯誤"
      }
    } else if (estringa.message.video) { //如果是影片
      if (mode == "🚀 發送訊息") {
        //以下選擇telegram video並發到line
        var video_id = estringa.message.video.file_id
        var thumb_id = estringa.message.video.thumb.file_id
        TG_Send_video_To_Line(Line_id, video_id, thumb_id)
        if (estringa.message.caption)
          TG_Send_text_To_Line(Line_id, estringa.message.caption)
        sendtext(chat_id, ct["sendVideo_ed"]);
        // ^ "(影片已發送!)"
      } else {
        sendtext(chat_id, ct["incorrect_operation"]);
        // ^ "錯誤的操作喔（ ・∀・），請檢查環境是否錯誤"
      }
    } else if (estringa.message.video_note) { //如果是影片
      if (mode == "🚀 發送訊息") {
        //以下選擇telegram video並發到line
        var video_id = estringa.message.video_note.file_id
        var thumb_id = estringa.message.video_note.thumb.file_id
        TG_Send_video_To_Line(Line_id, video_id, thumb_id)
        if (estringa.message.caption)
          TG_Send_text_To_Line(Line_id, estringa.message.caption)
        sendtext(chat_id, ct["sendVideo_ed"]);
        // ^ "(影片已發送!)"
      } else {
        sendtext(chat_id, ct["incorrect_operation"]);
        // ^ "錯誤的操作喔（ ・∀・），請檢查環境是否錯誤"
      }
    } else if (estringa.message.sticker) { //如果是貼圖
      if (mode == "🚀 發送訊息") {
        var file_id = estringa.message.sticker.file_id
        TG_Send_Sticker_To_Line(Line_id, file_id)
        sendtext(chat_id, ct["sendSticker_ed"]);
        // ^ "(貼圖已發送!)"
      } else {
        sendtext(chat_id, ct["incorrect_operation"]);
        // ^ "錯誤的操作喔（ ・∀・），請檢查環境是否錯誤"
      }
    } else if (estringa.message.audio) { //如果是聲音
      if (mode == "🚀 發送訊息") {
        var duration = estringa.message.audio.duration
        var audio_id = estringa.message.audio.file_id
        TG_Send_audio_To_Line(Line_id, audio_id, duration, Telegram_bot_key)
        if (estringa.message.caption)
          TG_Send_text_To_Line(Line_id, estringa.message.caption)
        sendtext(chat_id, ct["sendAudio_ed"]);
        // ^ "(音檔已發送!)"
      } else {
        sendtext(chat_id, ct["incorrect_operation"]);
        // ^ "錯誤的操作喔（ ・∀・），請檢查環境是否錯誤"
      }
    } else if (estringa.message.voice) { //如果是錄音
      if (mode == "🚀 發送訊息") {
        var duration = estringa.message.voice.duration
        var audio_id = estringa.message.voice.file_id
        TG_Send_audio_To_Line(Line_id, audio_id, duration, Telegram_bot_key)
        if (estringa.message.caption)
          TG_Send_text_To_Line(Line_id, estringa.message.caption)
        sendtext(chat_id, ct["sendVoice_ed"]);
        //sendtext(chat_id, ct["not_support_audio"]);
        // ^ "(暫時不支援audio傳送喔!)"
      } else {
        sendtext(chat_id, ct["incorrect_operation"]);
        // ^ "錯誤的操作喔（ ・∀・），請檢查環境是否錯誤"
      }
    } else if (estringa.message.location) { //如果是位置
      if (mode == "🚀 發送訊息") {
        var latitude = estringa.message.location.latitude
        var longitude = estringa.message.location.longitude
        try {
          var response = Maps.newGeocoder().setLanguage(
            'zh-TW').reverseGeocode(latitude, longitude);
          var formatted_address = response.results[0]['formatted_address']
        } catch (e) {
          var formatted_address = '未知地點'
        }
        //感謝 思考要在空白頁 http://blog.yslin.tw/2013/02/google-map-api.html
        TG_Send_location_To_Line(Line_id, latitude, longitude, formatted_address)
      } else {
        sendtext(chat_id, ct["incorrect_operation"]);
        // ^ "錯誤的操作喔（ ・∀・），請檢查環境是否錯誤"
      }
    } else if (estringa.message.animation) {
      if (mode == "🚀 發送訊息") {
        //var duration = estringa.message.animation.duration
        var file_id = estringa.message.animation.file_id
        var thumb_id = estringa.message.animation.thumb.file_id
        TG_Send_video_To_Line(Line_id, file_id, thumb_id)
        sendtext(chat_id, ct["sendGIF_ed"]);
        // ^ "(GIF已發送!)"
      } else {
        sendtext(chat_id, ct["incorrect_operation"]);
        // ^ "錯誤的操作喔（ ・∀・），請檢查環境是否錯誤"
      }
    } else if (estringa.message.document) {
      if (mode == "🚀 發送訊息") {
        var fileId = estringa.message.document.file_id
        var fileName = estringa.message.document.file_name
        var file_size = parseInt(estringa.message.document.file_size)
        var file_size_MB = (file_size / 1024 / 1024).toFixed(3)

        var Folder = DriveApp.getFolderById(ALL[download_folder_name]['FolderId']);
        var gfid = downloadFromTG(Telegram_bot_key, fileId, fileName, Folder)
        var Durl = G_drive_Durl + gfid
        text = ct['sendFileToLine']['text'].format(Durl, fileName, file_size, file_size_MB)
        if (estringa.message.caption) { //如有簡介則一同發出
          text = text + '\n' + estringa.message.caption
        }

        TG_Send_text_To_Line(Line_id, text)
        sendtext(chat_id, ct["sendFile_ed"]);
        // ^ "(File連結已發送!)"
      } else {
        sendtext(chat_id, ct["incorrect_operation"]);
        // ^ "錯誤的操作喔（ ・∀・），請檢查環境是否錯誤"
      }
    }
    lock.releaseLock();
    return 0;

    //====================================================================
    //====================================================================
    //====================================================================
  } else if (estringa.events[0].timestamp) {
    //以下來自line
    var from = 'line';
    // 下行預先開啟SpreadSheet
    var SpreadSheet = Log(ee, from, sheet_key, email); //log

    for (var ev = 0; ev < estringa.events.length; ev++) {
      var cutSource = estringa.events[ev].source; //好長 看的我都花了 縮減個
      //Logger.log("cutSource = ",cutSource);
      if (cutSource.type == "user") { //舊格式整理
        var line_roomID = cutSource.userId; //line_roomID = 要發送的地址
      } else if (cutSource.type == "room") {
        var line_roomID = cutSource.roomId;
        if (cutSource.userId) {}
      } else {
        var line_roomID = cutSource.groupId;
        if (cutSource.userId) {}
      } //強制轉ID
      var userId = cutSource.userId

      // room_id跟line_roomID的不同處在於，前者是適用於新格式的，後者是以前三個混用的狀況
      if (cutSource.groupId) { //看是group or room 再取出對應數值
        var room_id = cutSource.groupId
      } else {
        var room_id = cutSource.roomId
      }
      if (userId) { //嘗試取得發話人名稱
        if (cutSource.type == "user") {
          var userName = Get_profile(userId)['displayName']; //如果有則用
        } else if (cutSource.type == "room") {
          var userName = new_Get_profile(userId, 'room', room_id)['displayName'];
        } else {
          var userName = new_Get_profile(userId, 'group', room_id)['displayName'];
        }
      }


      if (!userName)
        userName = "";
      var cutM = estringa.events[ev].message; //好長 看的我都花了 縮減個

      if (!cutM) { //專門寫給非 message 事件的
        cutM = {}
        cutM.id = 0
        cutM.type = estringa.events[ev].type
      }
      var message_json = { //前面先寫 後面替換
        "type": "type",
        "message_id": cutM.id,
        "userName": userName,
        "timestamp": parseInt(estringa.events[ev].timestamp),
        "room_type": cutSource.type,
        "room_id": room_id
      }

      // 以下處理資料，分不需要下載跟需要下載處理
      // 以下不需要下載
      if (cutM.type == "text") { //文字
        message_json.text = String(cutM.text)
      } else if (cutM.type == "location") { //位置
        message_json.address = cutM.address
        message_json.latitude = cutM.latitude
        message_json.longitude = cutM.longitude
      } else if (cutM.type == "sticker") { //貼圖
        message_json.stickerId = cutM.stickerId
        message_json.packageId = cutM.packageId
      } else if (cutM.type == "leave") { //有想過Join要不要用，後來想想算了，沒差。
        message_json.text = ct['line_bot_leave']['text']
      } else if (cutM.type == "Join") {
        message_json.text = ct['line_bot_join']['text'].format(cutSource.type)
      } else if (cutM.type == "memberLeft") {
        message_json.lefted = estringa.events[ev]['left']
        // 對，是 left。不能改。Line為什麼不用lefted ......
      } else if (cutM.type == "memberJoined") {
        message_json.joined = estringa.events[ev]['joined']
      } else if (cutM.type == "follow") { //真的沒幹嘛...
      } else if (cutM.type == "unfollow") { //真的沒幹嘛...
      } else {
        //剩下的事件理論上真的碰不到，碰了也不是本機器人的服務範圍了，除非以後有其他想法

        // 以下需要下載
        // 先開資料夾
        var Folder = DriveApp.getFolderById(ALL[download_folder_name]['FolderId']);
        //處理文件
        message_json.ID = downloadFromLine(
          CHANNEL_ACCESS_TOKEN, cutM.id, cutM.fileName, Folder)[0]
        message_json.DURL = (
          "https://drive.google.com/uc?export=download&id=" + message_json.ID)
      }
      message_json.type = cutM.type
      var text = JSON.stringify(message_json)

      var SheetM = SpreadSheet.getSheetByName("Line訊息區");
      var chat_id = Telegram_id
      //===============================================================
      if (ALL.FastMatch2[line_roomID] != undefined) { //以下處理已登記的
        if (ALL.data[ALL.FastMatch2[line_roomID]].status == "已升級房間2" || (
            ALL.mode == "🚀 發送訊息" && line_roomID == ALL.opposite.RoomId)) {
          if (ALL.data[ALL.FastMatch2[line_roomID]].status == "已升級房間2") {
            //切換成綁訂房間的chat_id
            chat_id = ALL.data[ALL.FastMatch2[line_roomID]].Bind_groud_chat_id
          }
          if (message_json.ID == false && message_json.type != "join") {
            //預先處理掉不要的部分
            var tryget_command = ct['tryget_command']['text'].format(
              cutM.type, cutM.fileName, cutM.id, userName)
            sendtext(chat_id, tryget_command)
            continue; //跑下一輪以免其他的也失敗
          }
          try {
            if (message_json.type == "text") {
              text = ct['text_format']['text'].format(message_json.userName, message_json.text)
              sendtext(chat_id, text);
              //{"type":"text","message_id":"6481485539588","userName":"永格天@李孟哲",
              //"text":"51"}
            } else if (message_json.type == "image") {
              var url = message_json.DURL
              var caption = ct["is_from"]["text"].format(message_json.userName)
              var send_ed = sendtext(chat_id, ct["sendPhoto_ing"]);
              // ^ (正在傳送圖片，請稍後...)
              sendPhoto(chat_id, url, notification, caption)

              //刪除"正在傳送XXX" 整潔舒爽!
              deleteMessage(chat_id, JSON.parse(send_ed)["result"]['message_id'])

              //{"type":"image","message_id":"6548749837597","userName":"永格天@李孟哲",
              //"DURL":"https://drive.google.com/uc?export=download&id=0B-0JNskkLZktW"}
            } else if (message_json.type == "sticker") {
              var sticker_png_url = "https://stickershop.line-scdn.net/stickershop/v1/sticker/" +
                message_json.stickerId + "/android/sticker.png;compress=true"
              var caption = ct["is_from"]["text"].format(message_json.userName)
              var send_ed = sendtext(chat_id, ct["sendSticker_ing"])
              // ^ (正在傳送貼圖，請稍後...)
              sendPhoto(chat_id, sticker_png_url, notification, caption)

              //刪除"正在傳送XXX" 整潔舒爽!
              deleteMessage(chat_id, JSON.parse(send_ed)["result"]['message_id'])

              //https://stickershop.line-scdn.net/stickershop/v1/sticker/3214753
              // /android/sticker.png;compress=true
              //{"type":"sticker","message_id":"6548799151539","userName":"永格天@李孟哲",
              //"stickerId":"502","packageId":"2"}
            } else if (message_json.type == "audio") {
              //處理文件
              var file_id = message_json.ID
              var blob = DriveApp.getFileById(file_id).getBlob();
              var send_ed = sendtext(chat_id, ct["sendAudio_ing"])
              // ^ (正在傳送音檔，請稍後...)
              //處理caption
              caption = message_json.userName + '\n'
              if (ALL.massage_time) {
                caption += get_time_txt(message_json.timestamp, GMT)
              }

              sendAudio(chat_id, blob, notification, caption)
              //刪除"正在傳送XXX" 整潔舒爽!
              deleteMessage(chat_id, JSON.parse(send_ed)["result"]['message_id'])
              //{"type":"audio","message_id":"6548810000783","userName":"永格天@李孟哲",
              //"DURL":"https://drive.google.com/uc?export=download&id=0B-0JNsk9KakE5Q"}
            } else if (message_json.type == "location") {
              var latitude = message_json.latitude
              var longitude = message_json.longitude
              sendLocation(chat_id, latitude, longitude, notification)
              var text = ct["is_from"]["text"].format(message_json.userName)
              if (message_json.address) {
                text = message_json.address + '\n' + text
              }
              sendtext(chat_id, text);
              //{"type":"location","message_id":"6548803214227","userName":"永格天@李孟哲",
              //"address":"260台灣宜蘭縣宜蘭市舊城西路107號",
              //"latitude":24.759711,"longitude":121.750114}
            } else if (message_json.type == "video") {
              var url = message_json.DURL
              var caption = ct["is_from"]["text"].format(message_json.userName)
              var send_ed = sendtext(chat_id, ct["sendVideo_ing"])
              // ^ (正在傳送影片，請稍後...)
              try {
                sendVideo(chat_id, url, notification, caption)
              } catch (e) {
                var file_id = message_json.ID
                var blob = DriveApp.getFileById(file_id).getBlob();
                sendVideo(chat_id, blob, notification, caption)
              }

              //刪除"正在傳送XXX" 整潔舒爽!
              deleteMessage(chat_id, JSON.parse(send_ed)["result"]['message_id'])

              //{"type":"video","message_id":"6548802053751","userName":"永格天@李孟哲",
              //"DURL":"https://drive.google.com/uc?export=download&id=0B-0JNsk9kL8vc1"}
            } else if (message_json.type == "file") {
              //處理文件
              var file_id = message_json.ID
              var blob = DriveApp.getFileById(file_id).getBlob();
              var send_ed = sendtext(chat_id, ct["sendFile_ing"])
              // ^ (正在傳送檔案，請稍後...)

              //處理caption
              caption = message_json.userName + '\n'
              if (ALL.massage_time) {
                caption += get_time_txt(message_json.timestamp, GMT)
              }

              sendDocument(chat_id, blob, notification, caption)
              //刪除"正在傳送XXX" 整潔舒爽!
              deleteMessage(chat_id, JSON.parse(send_ed)["result"]['message_id'])
            } else if (message_json.type == "leave") {
              sendtext(chat_id, ct['line_bot_leave']);
            } else if (cutM.type == "memberJoined") {
              //新人加入啦
              var cutL = message_json['joined']['members']
              var members_data_text = get_line_members(message_json, cutL)
              ct['memberJoined']['text'] = ct['memberJoined']['text'].format(members_data_text)
              sendtext(chat_id, ct['memberJoined'])
              // ^ "有新人加入\n{0}"
            } else if (cutM.type == "memberLeft") {
              //有人離開啦
              var cutL = message_json['lefted']['members']
              var members_data_text = get_line_members(message_json, cutL)
              ct['memberLeft']['text'] = ct['memberLeft']['text'].format(members_data_text)
              sendtext(chat_id, ct['memberLeft'])
              // ^ "有人離開啦\n{0}"
            } else if (cutM.type == "join") {
              ct['line_bot_join']['text'] = ct['line_bot_join']['text'].format(cutSource.type)
              sendtext(chat_id, ct['line_bot_join']);
            } else if (cutM.type == "follow") {
              ct['follow']['text'] = ct['follow']['text'].format(message_json.userName)
              sendtext(chat_id, ct['follow']['text']);
            } else if (cutM.type == "unfollow") {
              ct['unfollow']['text'] = ct['unfollow']['text'].format(message_json.userName)
              sendtext(chat_id, ct['unfollow']['text']);
            }
          } catch (e) {
            var aims_room_name = ALL.data[ALL.FastMatch2[line_roomID]].Name
            ct["send_to_TG_error"]['text'] = ct["send_to_TG_error"]['text'].format(
              aims_room_name, JSON.stringify(message_json), e)
            sendtext(Telegram_id, ct["send_to_TG_error"]);
            // ^ '傳送失敗...，原因如下\n\n{0}'
            // NU$ 例外狀況未加
          }
        } else { //以下有登記，未"🚀 發送訊息"
          //以下處理sheet========================================================
          var col = ALL.FastMatch2[line_roomID] + 1; //找欄位
          var LastRowM = SheetM.getRange(1, col).getDisplayValue();
          LastRowM = JSON.parse(LastRowM)
          SheetM.getRange(LastRowM[0] + 2, col).setValue(JSON.stringify(message_json)) //更新內容
          LastRowM[0] = LastRowM[0] + 1;
          SheetM.getRange(1, col).setValue(JSON.stringify(LastRowM)) //更新數量
          //以下處理doc==========================================================
          ALL.data[col - 1].Amount = ALL.data[col - 1].Amount + 1 //!!!!!!!!!!!!!!!!!!!!!!
          write_ALL(ALL, doc) //寫入
          //以下處理通知=========================================================
          var Notice = ALL.data[col - 1].Notice //通知 true or false
          if (Notice) {
            sendtext(chat_id, ct["you_have_new_massage"]["text"].format(ALL.data[col - 1].Name, (col - 1)));
            // ^ "你有新訊息!\n來自：{0}\n點擊以快速切換至該房間 /d{1}"
          }
          //以下處理關鍵字通知====================================================
          var keyword_notice = ALL.keyword_notice
          if (keyword_notice && message_json.text != undefined && message_json.type == 'text') {
            var keys = ALL.keyword
            var keys_value = key_word_check(message_json.text, keys)
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
          //==================================================================
        }

      } else { //以下處理未登記的(新資料)=======================
        if (message_json.type == 'leave') {
          return 0;
        }
        var newcol = Object.keys(ALL.FastMatch2).length;
        //以下處理FastMatch2==================================
        ALL.FastMatch2[line_roomID] = newcol
        //var r = JSON.stringify(ALL);
        //doc.setText(r); //寫入
        //以下處理data========================================
        var data_len = ALL.data.length;

        if (userName) { // 初步選出房間名
          var U = userName
        } else {
          var U = line_roomID
        }

        for (;;) { // 打死都不要重名
          if (in_command(U)) {
            U = U + String(Random_text(6))
            continue;
          } else if (in_name(ALL, (U + "✅"))) {
            U = U + String(Random_text(6))
            continue;
          } else if (in_name(ALL, (U + "❎"))) {
            U = U + "_" + String(Random_text(6))
            continue;
          } else if (in_name(ALL, (U + "⭐️"))) {
            U = U + "_" + String(Random_text(6))
          } else {
            break;
          }
        }

        var N = {
          "RoomId": line_roomID,
          "Name": (U + "✅"),
          "status": "normal",
          "Amount": 1,
          "Notice": true,
          "line_room_type": cutSource.type
        }
        ALL.data.splice(data_len, 0, N)
        //以下處理FastMatch===================================
        var data_len = ALL.data.length
        var Room_Name = ALL.data[data_len - 1].Name //這個已經有✅了!

        ALL.FastMatch[(U + "✅")] = newcol

        //以下處理sheetM的數值===================================================
        SheetM.getRange(1, newcol + 1).setValue("[1,0]")
        //以下處理sheet(寫入訊息)================================================
        var col = ALL.FastMatch2[line_roomID] + 1; //找欄位
        SheetM.getRange(2, col).setValue(String(text)) //更新內容
        //以下處理RoomKeyboard==================================================
        ALL = REST_keyboard(ALL)[1]
        //以下處理doc(寫入訊息)==================================================
        write_ALL(ALL, doc) //寫入
        //以下通知有新的ID進來===================================================
        text = "已有新ID登入!!! id =\n" + U + "\n請盡快重新命名。"
        sendtext(chat_id, text);
      }
    }
  } else {
    GmailApp.sendEmail(email, "telegram-line出事啦(可能有新類型通訊格式，或gs網址外洩)", d + "\n" + ee);
  }
  lock.releaseLock();
  return 0;
}

//以下各類函式支援
//====================================================================
function Log(ee, from, sheet_key, email) {
  var d = new Date();
  var SpreadSheet = SpreadsheetApp.openById(sheet_key);
  var Sheet = SpreadSheet.getSheetByName("Log");
  var SheetLastRow = Sheet.getLastRow();

  switch (from) {
    case 'telegram':
      var from = "Telegram"
      break;
    case 'line':
      var from = "Line"
      break;
    default:
      GmailApp.sendEmail(email, "telegram-line出事啦(來源非TGorLine)", d + " " + ee);
  }
  var wt = [
    [d, from, ee]
  ]
  //Logger.log("wt = ", wt);
  Sheet.getRange("A" + String(SheetLastRow + 1) + ":" + "C" + String(SheetLastRow + 1)).setValues(wt);
  if (from == "Line") { //TG的話還真的不需要SpreadSheet
    return SpreadSheet
  }
}
//===============================================================
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
//===============================================================
function mv_all_uproom() {
  CP()
  var base_json = base()
  var doc_key = base_json.doc_key
  var doc = DocumentApp.openById(doc_key)
  var f = doc.getText()
  var ALL = JSON.parse(f);

  for (var i = 0; i < ALL['data'].length; i++) {
    if (ALL['data'][i].status == "已升級房間") {
      ALL['data'][i].status = "normal"
      var tk = ALL['data'][i].botToken
      delete ALL['data'][i].botToken
      try {
        UrlFetchApp.fetch("https://api.telegram.org/bot" + tk + "/deleteWebhook");
      } catch (e) {}
    }
  }

  try {
    delete ALL.TG_control_bot_updateID
  } catch (e) {}
  try {
    delete ALL.TG_bot_updateID_array
  } catch (e) {}

  write_ALL(ALL, doc) //寫入

}
//================================================================
function Get_profile(userId) {
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
    var profile = JSON.parse(
      UrlFetchApp.fetch("https://api.line.me/v2/bot/profile/" + userId, options))
  } catch (r) {
    var profile = "未知姓名"
  }
  return profile
}
//================================================================
function new_Get_profile(userId, rq_mode, groupId) {
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
    var url = 'https://api.line.me/v2/bot/{0}/{1}/member/{2}'.format(rq_mode, groupId, userId)
    var profile = UrlFetchApp.fetch(url, options)
    profile = JSON.parse(profile)
  } catch (r) {
    var profile = "未知姓名"
  }
  return profile
}
//================================================================
function get_line_members(message_json, cutL) {
  var members_data_text = ''
  var room_type = message_json['room_type']
  for (var i = 0; i < cutL.length; i++) {
    try {
      var j = new_Get_profile(cutL[i]['userId'], room_type, message_json['room_id'])
    } catch (e) {
      var j = Get_profile(cutL[i]['userId'])
    }
    members_data_text +=
      String('[{0}]({1})\n').format(j['displayName'], j['pictureUrl'])
  }
  return members_data_text
}
//================================================================
function TG_Send_text_To_Line(Line_id, text) {
  var base_json = base()
  var CHANNEL_ACCESS_TOKEN = base_json.CHANNEL_ACCESS_TOKEN;
  var max_chat = 1950

  var url = 'https://api.line.me/v2/bot/message/push';
  var header = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
  }
  //--------------------------------------------------
  if (text.length > max_chat) {
    var text_list = []
    var index = 0
    for (var i = 0; index < text.length; i++) {
      text_list[i] = text.substr(index, max_chat)
      index += max_chat
    }
    for (var j = 0; j < text_list.length; j++) {
      var retMsg = [{
        'type': 'text',
        'text': text_list[j]
      }];

      var payload = {
        'to': Line_id,
        'messages': retMsg
      }
      var options = {
        'headers': header,
        'method': 'post',
        'payload': JSON.stringify(payload)
      }
      var results = UrlFetchApp.fetch(url, options);
    }
    return results
  } else {
    var retMsg = [{
      'type': 'text',
      'text': text
    }];

    var payload = {
      'to': Line_id,
      'messages': retMsg
    }
    var options = {
      'headers': header,
      'method': 'post',
      'payload': JSON.stringify(payload)
    }
    return UrlFetchApp.fetch(url, options);
  }
}
//================================================================
function TG_Send_Photo_To_Line(Line_id, photo_id, G_drive_Durl) {
  var base_json = base()
  var CHANNEL_ACCESS_TOKEN = base_json.CHANNEL_ACCESS_TOKEN;

  var G1 = G_drive_Durl
  var G2 = TGdownloadURL(getpath(photo_id))
  var url = 'https://api.line.me/v2/bot/message/push';
  //--------------------------------------------------
  var retMsg = [{
    "type": "image",
    "originalContentUrl": G1,
    "previewImageUrl": G2
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
//================================================================
function TG_Send_video_To_Line(Line_id, video_id, thumb_id) {
  var base_json = base()
  var CHANNEL_ACCESS_TOKEN = base_json.CHANNEL_ACCESS_TOKEN;
  var Telegram_bot_key = base_json.Telegram_bot_key

  var G1 = TGdownloadURL(getpath(video_id, Telegram_bot_key), Telegram_bot_key)
  var G2 = TGdownloadURL(getpath(thumb_id, Telegram_bot_key), Telegram_bot_key)
  var url = 'https://api.line.me/v2/bot/message/push';
  //--------------------------------------------------
  var retMsg = [{
    "type": "video",
    "originalContentUrl": G1,
    "previewImageUrl": G2
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
//================================================================
function TG_Send_audio_To_Line(Line_id, audio_id, duration, Telegram_bot_key) {
  var base_json = base()
  var CHANNEL_ACCESS_TOKEN = base_json.CHANNEL_ACCESS_TOKEN;
  var G = TGdownloadURL(getpath(audio_id, Telegram_bot_key), Telegram_bot_key)

  if (duration <= 0) {
    duration = 0.1
  }
  var url = 'https://api.line.me/v2/bot/message/push';
  //--------------------------------------------------
  var retMsg = [{
    "type": "audio",
    "originalContentUrl": G,
    "duration": duration * 1000
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
//================================================================
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
  UrlFetchApp.fetch(url, options);
}
//================================================================
function TG_Send_Sticker_To_Line(Line_id, sticker_id) { //舊款function 先留著
  var base_json = base()
  var CHANNEL_ACCESS_TOKEN = base_json.CHANNEL_ACCESS_TOKEN;
  var G = TGdownloadURL(getpath(sticker_id))

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
//================================================================
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
  var n = 0
  try {
    UrlFetchApp.fetch(url, options);
    return "成功"
  } catch (e) { //https://api.line.me/v2/bot/group/{groupId}/leave
    n += 1
  }
  try {
    var url = 'https://api.line.me/v2/bot/group/' + room_or_groupID + '/leave';
    UrlFetchApp.fetch(url, options);
    return "成功"
  } catch (e) {
    n += 1
  }
  if (n == 2) {
    return '無法'
  } else {
    return "成功"
  }
}
//================================================================
function get_Line_quota() {

  var base_json = base()
  var CHANNEL_ACCESS_TOKEN = base_json.CHANNEL_ACCESS_TOKEN;

  var url = 'https://api.line.me/v2/bot/message/quota';
  //--------------------------------------------------
  var header = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
  }
  var options = {
    'headers': header,
    'method': 'get'
  }
  //--------------------------------------------------
  try {
    return UrlFetchApp.fetch(url, options);
  } catch (e) {
    return e
  }
}
//================================================================

/**
 * get_Line_consumption - json格式的已用人次
 *
 * @return {type}  json格式的已用人次
 */
function get_Line_consumption() {

  var base_json = base()
  var CHANNEL_ACCESS_TOKEN = base_json.CHANNEL_ACCESS_TOKEN;

  var url = 'https://api.line.me/v2/bot/message/quota/consumption';
  //--------------------------------------------------
  var header = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
  }
  var options = {
    'headers': header,
    'method': 'get'
  }
  //--------------------------------------------------
  try {
    return UrlFetchApp.fetch(url, options);
  } catch (e) {
    return e
  }
}
//================================================================
function getpath(id, Telegram_bot_key) {
  if (Telegram_bot_key === void 0) {
    var base_json = base()
    var Telegram_bot_key = base_json.Telegram_bot_key
  }
  url = "https://api.telegram.org/bot" + Telegram_bot_key + "/getFile?file_id=" + id
  var html = UrlFetchApp.fetch(url);
  html = JSON.parse(html);
  var path = html.result.file_path
  return path;
}
//================================================================
function TGdownloadURL(path, Telegram_bot_key) {
  if (Telegram_bot_key === void 0) {
    var base_json = base()
    var Telegram_bot_key = base_json.Telegram_bot_key
  }
  var TGDurl = "https://api.telegram.org/file/bot" + Telegram_bot_key + "/" + path
  return TGDurl;
}
//================================================================

/**
 * create_Folder - 創資料夾
 *
 * @param  {Folder} Folder        創建地點的Folder引入
 * @param  {String} Name          新Folder名稱
 * @param  {String} Description   新Folder說明
 * @return {Folder}               新創的Folder
 */
function create_Folder(Folder, Name, Description) {
  //前置檢查跟預設
  if (Folder === void 0)
    throw new Error("Folder未給")
  if (Name === void 0)
    throw new Error("Name未給")
  Description === void 0 ? '' : Description

  return Folder.createFolder(Name).setDescription(Description)
}
//================================================================

/**
 * get_folder_info - 得到目標資料夾的詳細資料
 *
 * @param  {type} Folder 欲得到的目標資料夾
 * @return {type}        目標資料夾的詳細資料
 */
function get_folder_info(Folder) {
  if (Folder === void 0)
    throw new Error("Folder未給")

  var folder_info = {
    "FolderName": Folder.getName(),
    "FolderId": Folder.getId(),
    "FolderUrl": Folder.getUrl(),
    "FoldersDescription": Folder.getDescription()
  }
  return folder_info
}
//================================================================

/**
 * list_folder - 得到目標資料夾下所有資料夾的詳細資料
 *
 * @param  {Folder} Description_Folder  目標資料夾
 * @return {Array}           詳細資料陣列
 */
function list_folder(Description_Folder) {
  if (Description_Folder === void 0)
    throw new Error("Description_Folder未給")

  var Folders = Description_Folder.getFolders();
  var Folders_list = []
  while (Folders.hasNext()) {
    var Folder = Folders.next();
    Folders_list.push(get_folder_info(Folder))
  }
  return Folders_list
}
//================================================================

/**
 * clear_folders - 目標資料夾下所有資料夾塞入垃圾桶
 *
 * @param  {Folder} Description_Folder 目標資料夾
 * @return {Array}                   結果陣列
 */
function clear_folders(Description_Folder) {
  if (Description_Folder === void 0)
    throw new Error("Description_Folder未給")

  var Folders = Description_Folder.getFolders();
  while (Folders.hasNext()) {
    try {
      Folders.next().setTrashed(true);
    } catch (e) {
      return [false, e]
    }
  }
  return [true]
}
//================================================================

/**
 * get_file_info - 得到目標資料夾的詳細資料
 *
 * @param  {type} file   欲查看的目標檔案
 * @return {type}        目標檔案的詳細資料
 */
function get_file_info(file) {
  if (file === void 0)
    throw new Error("file未給")

  var file_info = {
    "FileName": file.getName(),
    "FileId": file.getId(),
    "FolderUrl": file.getUrl(),
    "FileDescription": file.getDescription(),
    "FileMimeType": file.getMimeType()
  }
  return file_info
}
//================================================================

/**
 * list_files - 得到目標資料夾下所有檔案的詳細資料
 *
 * @param  {Folder} Description_Folder  目標資料夾
 * @return {Array}           詳細資料陣列
 */
function list_files(Description_Folder) {
  if (Description_Folder === void 0)
    throw new Error("Description_Folder未給")

  var Files = Description_Folder.getFiles();
  var Files_list = []
  while (Files.hasNext()) {
    var file = Files.next();
    Files_list.push(get_file_info(file))
  }
  return Files_list
}
//================================================================

/**
 * clear_files - 目標資料夾下所有檔案塞入垃圾桶
 *
 * @param  {Folder} Description_Folder 目標資料夾
 * @return {Array}                    結果陣列
 */
function clear_files(Description_Folder) {
  if (Description_Folder === void 0)
    throw new Error("Description_Folder未給")

  var files = Description_Folder.getFiles();
  while (files.hasNext()) {
    try {
      files.next().setTrashed(true);
    } catch (e) {
      return [false, e]
    }
  }
  return [true]
}
//================================================================

/**
 * clear_files_by_mode - 依模式、時間、來源清理檔案
 *
 * @param  {Folder} Description_Folder 目標資料夾
 * @param  {String} mode               time、All、Line、Telegram
 * @param  {Number} time               間隔時間(單位：天)
 * @return {Array}                     結果
 */
function clear_files_by_mode(Description_Folder, mode, time) {

  if (Description_Folder === void 0)
    throw new Error("Description_Folder未給")
  if (mode === void 0)
    throw new Error("mode未給")

  var files = Description_Folder.getFiles();
  while (files.hasNext()) {
    try {
      var f = files.next()
      var ft = f.getLastUpdated().getTime()
      var fd = f.getDescription()
      var d = new Date();
      var difference = (d - ft) / 1000 / 60 / 60 / 24 //換算成"天"了

      if (mode == 'time') {
        if (time === void 0)
          throw new Error("time未給")
        if (difference > time) {
          f.setTrashed(true);
        } else if (time < 0) {
          throw new Error("time給錯了")
        }
      } else if (mode == 'All') {
        f.setTrashed(true);
      } else if (mode == 'Line') {
        if (fd == 'line') {
          f.setTrashed(true);
        }
      } else if (mode == 'Telegram') {
        if (fd == 'Telegram') {
          f.setTrashed(true);
        }
      } else {
        throw new Error("mode設定有誤!")
      }
    } catch (e) {
      return [false, e]
    }
  }
  return [true]
}
//================================================================

/**
 * copy_file - 複製檔案到目標資料夾
 *
 * @param  {file} file               目標檔案
 * @param  {Folder} destination_folder 目標資料夾
 * @return {Array}                    結果陣列
 */
function copy_file(file, destination_folder) {
  if (file === void 0)
    throw new Error("file未給")
  if (destination_folder === void 0)
    throw new Error("destination_folder未給")

  try {
    file.makeCopy(destination_folder)
  } catch (e) {
    return [false, e]
  }
  return [true]
}
//================================================================

/**
 * downloadFromLine - 下載Line的東西。
 *
 * @param  {String} CHANNEL_ACCESS_TOKEN Line的token
 * @param  {String} Id                   下載的id
 * @param  {Folder} Folder               下載的後放哪個資料夾
 * @return {String}                      drive中的檔案id
 */
function downloadFromLine(CHANNEL_ACCESS_TOKEN, Id, fileName, Folder) {
  //讓我們感謝河馬大大!m(_ _)m
  //https://riverhippo.blogspot.tw/2016/02/google-drive-direct-link.html
  var url = 'https://api.line.me/v2/bot/message/' + Id + '/content';
  //--------------------------------------------------
  var header = {
    'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN
  }
  var options = {
    'headers': header,
    'method': 'get',
    'muteHttpExceptions': true
  }
  //--------------------------------------------------
  var blob = UrlFetchApp.fetch(url, options);
  if (blob.getResponseCode() != 200) {
    console.log(blob.getResponseCode())
    console.log(blob.getContentText())
    var i = blob.getResponseCode()
    console.log(i)
    var j = blob.getContentText()
    console.log(j)
    console.log('-------------')
    var k = "ResponseCode:\n{0}\nContentText:\n{1}".format(i, j)
    return [false, k]
  }

  var f = Folder.createFile(blob).setName(fileName)
  if (fileName == 'wait_Line' || fileName == undefined) {
    f.setName(f.getMimeType())
  }
  return [f.getId()]
}
//================================================================

/**
 * downloadFromTG - 從TG下載到google_drive
 *
 * @param  {String} Telegram_bot_key TG_token
 * @param  {String} Id               tg_file_id
 * @param  {String} fileName         檔名
 * @param  {Folder} Folder           塞入哪個資料夾
 * @return {String}                  新檔案的googel_id
 */
function downloadFromTG(Telegram_bot_key, tg_file_id, fileName, Folder) {
  var K = Telegram_bot_key
  var url = TGdownloadURL(getpath(tg_file_id, K), K)
  var blob = UrlFetchApp.fetch(url);
  var f = Folder.createFile(blob).setName(fileName)
  return f.getId()
}
//================================================================
function get_time_txt(timestamp, GMT) {
  var formattedDate = Utilities.formatDate(new Date(timestamp), GMT, "yyyy-MM-dd' 'HH:mm:ss");
  return formattedDate;
}
//================================================================
function tryget_XXX(ALL, chat_id, ct, rg, download_folder_name, CHANNEL_ACCESS_TOKEN) {
  // "/resend_video_fliename_123456789"
  var send_ed = sendtext(chat_id, ct['get_command_ed'])
  // ^ "已接收指令!\n處理中請稍後..."
  var line_flie_id = rg[1]
  var Folder = DriveApp.getFolderById(ALL[download_folder_name]['FolderId']);
  var tryget_file_id = downloadFromLine(
    CHANNEL_ACCESS_TOKEN, line_flie_id, 'wait_Line', Folder)
  var file_id = tryget_file_id[0]
  if (tryget_file_id[0] == false) {
    var error = tryget_file_id[1]
    ct['tryget_error']['text'] = ct['tryget_error']['text'].format(error)
    sendtext(chat_id, ct['tryget_error'])
    // ^ 目前依舊無法取得，請再等等qwq
  } else {
    var blob = DriveApp.getFileById(file_id).getBlob();
    sendDocument(chat_id, blob)
  }
  return deleteMessage(chat_id, JSON.parse(send_ed)["result"]['message_id'])
}
//================================================================
function sendtext(chat_id, ct, reply_to_message_id) {
  reply_to_message_id === void 0 ? reply_to_message_id : ''

  if (chat_id === void 0)
    throw new Error("chat_id未給")
  if (ct === void 0)
    throw new Error("ct未給")
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
  } else if (typeof ct["text"] === 'object') {
    var text = ''
    ct["text"].forEach(function(element) {
      text += element
    });
  } else {
    var text = ct["text"]
  }

  var max_chat = 4000
  if (text.length > max_chat) {
    var text_list = []
    var index = 0
    for (var i = 0; index < text.length; i++) {
      text_list[i] = text.substr(index, max_chat)
      index += max_chat
    }
    for (var j = 0; j < text_list.length; j++) {
      var payload = {
        "method": "sendMessage",
        'chat_id': String(chat_id),
        'text': String(text_list[j]),
        'disable_notification': notification,
        "parse_mode": parse_mode,
        'reply_to_message_id': reply_to_message_id
      }
      var results = start(payload);
    }
    return results
  } else {
    var payload = {
      "method": "sendMessage",
      'chat_id': String(chat_id),
      'text': text,
      'disable_notification': notification,
      "parse_mode": parse_mode,
      'reply_to_message_id': reply_to_message_id
    }
    return start(payload)
  }
}
//================================================================

/**
 * sendSticker - TG傳貼圖
 *
 * @param  {type} chat_id             必填，傳送目標 chat_id
 * @param  {type} url_or_bolb         傳送的貼圖id或bolb
 * @param  {type} notification        不通知與否?
 * @param  {type} reply_to_message_id 針對訊息ID回覆
 * @param  {type} reply_markup        回覆鍵盤
 * @return {type}                     json格式發送狀態
 */
function sendSticker(chat_id, url_or_bolb, notification, reply_to_message_id, reply_markup) {
  //真不敢相信，我居然到了v3.3才加入貼圖O_O
  if (chat_id === void 0)
    throw new Error("chat_id未給")
  if (url_or_bolb === void 0)
    throw new Error("url_or_bolb未給")
  if (notification === void 0)
    notification = false
  if (reply_to_message_id === void 0)
    reply_to_message_id = ''
  if (reply_markup === void 0)
    reply_markup = ''

  var payload = {
    "method": "sendPhoto",
    'chat_id': String(chat_id),
    'sticker': url_or_bolb,
    'disable_notification': notification,
    "reply_to_message_id": reply_to_message_id,
    "reply_markup": reply_markup
  }
  return start(payload);
}
//================================================================
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
  return start(payload);
}
//================================================================
function sendAudio(chat_id, url_or_bolb, notification, caption, duration) {
  if (notification === void 0)
    notification = false
  if (caption === void 0)
    caption = ''
  if (duration === void 0)
    duration = 0
  var payload = {
    "method": "sendAudio",
    'chat_id': String(chat_id),
    'audio': url_or_bolb,
    'disable_notification': notification,
    'caption': caption,
    'duration': duration
  }
  return start(payload);
}
//================================================================
function sendVideo(chat_id, url_or_bolb, notification, caption) {
  if (notification == undefined)
    notification = false
  caption = caption || ""
  var payload = {
    "method": "sendVideo",
    'chat_id': String(chat_id),
    'video': url_or_bolb,
    'disable_notification': notification,
    'caption': caption
  }
  return start(payload);
}
//================================================================
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
  return start(payload);
}
//================================================================
function sendDocument(chat_id, url_or_bolb, notification, caption) {
  if (notification === void 0)
    notification = false
  if (caption === void 0)
    caption = ''
  var payload = {
    "method": "sendDocument",
    'chat_id': String(chat_id),
    'document': url_or_bolb,
    'disable_notification': notification,
    'caption': caption
  }
  return start(payload);
}
//================================================================
function sendAnimation(chat_id, url, notification, caption) {
  /* Use this method to send animation files
   * (GIF or H.264/MPEG-4 AVC video without sound).
   *  On success, the sent Message is returned.
   * Bots can currently send animation files of up to 50 MB in size,
   *  this limit may be changed in the future.
   */
  // 頭痛... 為什麼ts沒辦法用，為什麼ES3沒有支援原生函式預設值qwq
  // TG bot api 又更新啦 2018/11/21
  if (notification == undefined)
    notification = false
  caption = caption || ""
  var payload = {
    "method": "sendAnimation",
    'chat_id': String(chat_id),
    'animation': url,
    'disable_notification': notification,
    'caption': caption
  }
  start(payload);
}
//================================================================
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
  return start(payload);
}
//================================================================
function deleteMessage(chat_id, message_id) {
  var payload = {
    "method": "deleteMessage",
    "chat_id": String(chat_id),
    "message_id": String(message_id)
  }
  return start(payload);
}
//================================================================
function TG_leaveChat(chat_id) {
  var payload = {
    "method": "leaveChat",
    "chat_id": String(chat_id)
  }
  return start(payload);
}
//================================================================
function ReplyKeyboardRemove(chat_id, ct) {
  if (chat_id === void 0)
    throw new Error("chat_id未給")
  if (ct === void 0)
    throw new Error("ct未給")
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
  } else if (typeof ct["text"] === 'object') {
    var text = ''
    ct["text"].forEach(function(element) {
      text += element
    });
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
  return start(payload);
}
//================================================================
function ReplyKeyboardMakeup(chat_id, keyboard, resize_keyboard, one_time_keyboard, ct) {
  if (chat_id === void 0)
    throw new Error("chat_id未給")
  if (ct === void 0)
    throw new Error("ct未給")
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
  } else if (typeof ct["text"] === 'object') {
    var text = ''
    ct["text"].forEach(function(element) {
      text += element
    });
  } else {
    var text = ct["text"]
  }

  if (resize_keyboard == undefined) {
    resize_keyboard = true
  }
  if (one_time_keyboard = undefined) {
    one_time_keyboard = false
  }
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
  return start(payload);
}
//================================================================
function keyboard_main(chat_id, ct, ALL) {
  var keyboard_main = ALL.RoomKeyboard
  var resize_keyboard = false
  var one_time_keyboard = false
  ReplyKeyboardMakeup(chat_id, keyboard_main, resize_keyboard, one_time_keyboard, ct)
}
//================================================================

/**
 * REST_keyboard - 重新整理主鍵盤
 *
 * @param  {Object} ALL ALL資料
 * @return {Array}     ['成功', ALL]
 */
function REST_keyboard(ALL) {
  var ct = language()["correspond_text"] //語言載入
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
    'text': ct["🔃 重新整理"]['text']
  }, {
    'text': ct['🔧 更多設定']['text']
  }, {
    'text': ct["🔭 訊息狀態"]['text']
  }]) //加入返回鍵
  //=================================================
  ALL.RoomKeyboard = keyboard //寫回RoomKeynoard
  return ['成功', ALL]
}
//================================================================
function REST_FastMatch1and2and3(ALL) { //重製快速索引
  var data_len = ALL.data.length
  ALL.FastMatch = {}
  ALL.FastMatch2 = {}
  ALL.FastMatch3 = {}
  for (var i = 0; i < data_len; i++) {
    var Name = String(ALL.data[i].Name)
    ALL.FastMatch[Name] = i
  }
  for (var i = 0; i < data_len; i++) {
    var RoomId = ALL.data[i].RoomId
    ALL.FastMatch2[RoomId] = i
  }
  for (var i = 0; i < data_len; i++) {
    var Bind_groud_chat_id = ALL.data[i].Bind_groud_chat_id
    if (Bind_groud_chat_id) {
      ALL.FastMatch3[Bind_groud_chat_id] = i
    }
  }
  return ["成功", ALL]
}

//================================================================
//喔乾，感謝 Kevin Tseng 開源這個用法
//來源:
// https://kevintsengtw.blogspot.com/2011/09/javascript-stringformat.html?
// showComment=1536387871696#c7569907085658128584
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
//================================================================
// 我印象中有找到一種方式來分割字串的，但不知道是哪個指令...
// 用法是 text.xxxx(10) -> 回傳 [字串前10個字 , 後10個到底的字]
String.prototype.nslice = function() {
  var txt = this.toString();
  var t1 = txt.substr(0, arguments[0])
  var t2 = txt.slice(arguments[0])
  return [t1, t2];
}
//================================================================
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
    row1.splice(i, 0, "[0,0]")
  }
  //var LastCol = Sheet.getLastColumn();
  Sheet.clear();
  Sheet.appendRow(row1)

  write_ALL(ALL, doc) //寫入
}
//================================================================
function write_ALL(ALL, doc) {
  try {
    var r = JSON.stringify(ALL); //別刪，這是源頭啦!!!
    doc.setText(r); //寫入
  } catch (e) {
    return e
  }
  return true
}
//================================================================
function key_word_check(txt, keys) {
  var keys_value = []
  for (var i = 0; i < keys.length; i++) {
    if (txt.search(String(keys[i])) > -1) {
      for (var j = 0; j < keys_value.length; j++) {
        if (keys_value[j] == keys[i]) {
          continue
        }
      }
      keys_value.push(String(keys[i]))
    }
  }
  return keys_value
}
//================================================================
function Random_text(codeLength) {
  var id = ""
  var selectChar = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D',
    'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
    'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
  for (var i = 0; i < codeLength; i++) {
    var charIndex = Math.floor(Math.random() * 36);
    id += selectChar[charIndex];
  }
  return id
}
//================================================================
function in_command(text) {
  var ct = language()["correspond_text"] //語言載入
  var command_list = Object.keys(ct)
  for (var i = 0; i < command_list.length; i++) {
    if (text == command_list[i]) {
      return true
    }
  }
  return false
}
//================================================================
function in_name(ALL, text) {
  var ALL_list = Object.keys(ALL["FastMatch"])
  for (var i = 0; i < ALL_list.length; i++) {
    if (text == ALL_list[i]) {
      return true
    }
  }
  return false
}
//================================================================
function get_all_keyword(ALL) {
  var all_word = ''
  for (var i = 0; i < ALL.keyword.length; i++) {
    all_word = all_word + (i + 1) + '. "' + ALL.keyword[i] + '"\n'
  }
  return all_word
}
//================================================================
function up_room_start(ALL) {
  var FM3_keys = Object.keys(ALL["FastMatch3"])
  for (var i = 0; i < FM3_keys.length; i++) {
    var n = ALL["FastMatch3"][FM3_keys[i]]
    var Name = ALL.data[n]["Name"]
    ALL.data[n]["Name"] = Name.substr(0, Name.length - 1) + "⭐"
  }
  return ALL
}
//================================================================
function entities_conversion(text, entities, ct) { //用來處理格式化的網址
  var EC_text = []
  var text_link = []
  var URL_Quantity = 0
  // 下先分解
  for (var i = entities.length - 1; i >= 0; i--) {
    //Logger.log('i = ', i)
    //Logger.log(entities[i]["type"])
    var st_capture = parseInt(entities[i]["offset"]) //+ index
    var ed_capture = parseInt(entities[i]["length"]) + st_capture
    var y = text.nslice(ed_capture)
    text = y[0]
    EC_text.unshift(y[1])
    if (entities[i]["type"] == 'text_link') {
      var y = text.nslice(st_capture)
      text = y[0]
      var u = ct['entities_conversion_text']['text'].format(y[1], URL_Quantity)
      URL_Quantity += 1
      EC_text.unshift(u)
      text_link.unshift(entities[i]["url"])
    } else if (entities[i]["type"] == 'bold') { //粗體
      var y = text.nslice(st_capture)
      text = y[0]
      EC_text.unshift(' *{0}* '.format(y[1]))
    } else if (entities[i]["type"] == 'italic') { //斜體
      var y = text.nslice(st_capture)
      text = y[0]
      EC_text.unshift(' _{0}_ '.format(y[1]))
    }
  }
  //Logger.log('EC_text = ', EC_text)
  //組合
  var assemble_text = ''
  var assemble_link = ''
  for (var j = 0; j < EC_text.length; j++) { // #NU 未來考慮連結短網址服務
    assemble_text += EC_text[j]
  }
  for (var j = 0; j < text_link.length; j++) { // #NU 未來考慮連結短網址服務
    assemble_link += ct["entities_conversion_link"]['text'].format(String(j), text_link[j])
  }
  if (assemble_link) {
    return text + ct["entities_conversion_ALL"]['text'].format(assemble_text, assemble_link)
  } else {
    return text + assemble_text
  }

}
//================================================================
function get_200_url(url) {
  // X的，受夠了! Line怎麼就不順便轉址一下
  // 明明手機的就會自己轉，電腦版的就不行，X
  //console.log("----------------------")
  var options = {
    'followRedirects': false,
    'method': 'get'
  }
  var ruse = UrlFetchApp.fetch(url, options);
  var i1 = ruse.getResponseCode()
  var i2 = ruse.getHeaders()

  if (i1 == 302 && i1 != 200) {
    url = get_200_url(i2["Location"])
  } else if (i1 == 200) {

    return url
  } else {
    console.log("fetch結果非預期的回應")
    console.log(url)
  }
  return url
}
//================================================================
function rt_text_reduce(text, rt_max_chats) {
  var max_chat = rt_max_chats
  if (text.length > max_chat) {
    text = text.nslice(max_chat)[0] + '...'
  }
  return text.replace('\n', '%0A').replace(/\n/g, ' ').replace('%0A', '\n')
}
//================================================================
function read_massage(sheet_key, doc, ALL, ct, GMT, chat_id, notification, Telegram_id) {

  try {
    var SpreadSheet = SpreadsheetApp.openById(sheet_key);
    var SheetM = SpreadSheet.getSheetByName("Line訊息區");
    var col = ALL.FastMatch2[ALL.opposite.RoomId] + 1;

    var Amount = SheetM.getRange(1, col).getDisplayValue();
    Amount = JSON.parse(Amount)
    var st = Amount[1] + 2
    var ed = Amount[0] + 1

    function upMessageData(i, col, ed) {
      SheetM.getRange(i, col).setValue("")
      var t = "[" + (ed - 1) + "," + (i - 1) + "]"
      SheetM.getRange(1, col).setValue(t);
      //SheetM.getRange(1, col).setValue(Amount);
    }

    for (var i = st; i <= ed; i++) {
      text = SheetM.getRange(i, col).getDisplayValue()
      var message_json = JSON.parse(text);

      if (message_json.ID == false && message_json.type != "join") {
        //預先處理掉不要的部分
        var tryget_command = ct['tryget_command']['text'].format(
          message_json.type, message_json.fileName, message_json.message_id,
          message_json.userName)
        sendtext(chat_id, tryget_command)
        upMessageData(i, col, ed)
        continue; //直接跑下一輪
      }

      if (message_json.type == "text") {
        var p = message_json.userName + "：\n" + message_json.text
        if (ALL.massage_time) {
          t = get_time_txt(message_json.timestamp, GMT)
          p += "\n" + t
        }
        sendtext(chat_id, p);
        //{"type":"text","message_id":"6481485539588","userName":"永格天@李孟哲",
        //"text":"51"}
      } else if (message_json.type == "image") {
        var url = message_json.DURL
        var caption = ct["is_from"]["text"].format(message_json.userName)
        if (ALL.massage_time) {
          t = get_time_txt(message_json.timestamp, GMT)
          caption += "\n" + t
        }
        var send_ed = sendtext(chat_id, ct["sendPhoto_ing"]);
        // ^ (正在傳送圖片，請稍後...)
        sendPhoto(chat_id, url, notification, caption)
        //刪除"正在傳送XXX" 整潔舒爽!
        deleteMessage(chat_id, JSON.parse(send_ed)["result"]['message_id'])
        //sendPhoto(url, notification)
        //{"type":"image","message_id":"6548749837597","userName":"永格天@李孟哲",
        //"DURL":"https://drive.google.com/uc?export=download&id=0B-0JNsk9kLZktWQ1U"}
      } else if (message_json.type == "sticker") {
        var sticker_png_url = "https://stickershop.line-scdn.net/stickershop/v1/sticker/" +
          message_json.stickerId + "/android/sticker.png;compress=true"
        var caption = ct["is_from"]["text"].format(message_json.userName)
        if (ALL.massage_time) {
          t = get_time_txt(message_json.timestamp, GMT)
          caption += "\n" + t
        }
        sendPhoto(chat_id, sticker_png_url, notification, caption)
        //https://stickershop.line-scdn.net/stickershop/v1/sticker/
        // 3214753/android/sticker.png;compress=true
        //{"type":"sticker","message_id":"6548799151539","userName":"永格天@李孟哲",
        //"stickerId":"502","packageId":"2"}
      } else if (message_json.type == "audio") { //這裡看看能不能改
        //處理文件
        var file_id = message_json.ID
        var blob = DriveApp.getFileById(file_id).getBlob();
        var send_ed = sendtext(chat_id, ct["sendAudio_ing"])
        // ^ (正在傳送音檔，請稍後...)
        //處理caption
        caption = message_json.userName + '\n'
        if (ALL.massage_time) {
          caption += get_time_txt(message_json.timestamp, GMT)
        }

        sendAudio(chat_id, blob, notification, caption)
        //刪除"正在傳送XXX" 整潔舒爽!
        deleteMessage(chat_id, JSON.parse(send_ed)["result"]['message_id'])
        //{"type":"audio","message_id":"6548810000783","userName":"永格天@李孟哲",
        //"DURL":"https://drive.google.com/uc?export=download&id=0B-0JNsk91ZKakE5Q1U"}
      } else if (message_json.type == "location") {
        var latitude = message_json.latitude
        var longitude = message_json.longitude
        sendLocation(chat_id, latitude, longitude, notification)
        var text = ct["is_from"]["text"].format(message_json.userName)
        if (ALL.massage_time) {
          t = get_time_txt(message_json.timestamp, GMT)
          text += "\n" + t
        }
        if (message_json.address) {
          text = message_json.address + '\n' + text
        }
        sendtext(chat_id, text);
        //{"type":"location","message_id":"6548803214227","userName":"永格天@李孟哲",
        //"address":"260台灣宜蘭縣宜蘭市舊城西路107號", <-沒事，這不是我家:P
        //"latitude":24.759711,"longitude":121.750114}
      } else if (message_json.type == "video") {
        var url = message_json.DURL
        var caption = ct["is_from"]["text"].format(message_json.userName)
        if (ALL.massage_time) {
          t = get_time_txt(message_json.timestamp, GMT)
          caption += "\n" + t
        }
        var send_ed = sendtext(chat_id, ct["sendVideo_ing"])
        try {
          sendVideo(chat_id, url, notification, caption)
        } catch (e) {
          var file_id = message_json.ID
          var blob = DriveApp.getFileById(file_id).getBlob();
          sendVideo(chat_id, blob, notification, caption)
        }
        //刪除"正在傳送XXX" 整潔舒爽!
        deleteMessage(chat_id, JSON.parse(send_ed)["result"]['message_id'])

        //{"type":"video","message_id":"6548802053751","userName":"永格天@李孟哲",
        //"DURL":"https://drive.google.com/uc?export=download&id=0B-0JNsk9kL8vc1WQ1U"}
      } else if (message_json.type == "file") {
        //處理文件
        var file_id = message_json.ID
        var blob = DriveApp.getFileById(file_id).getBlob();
        var send_ed = sendtext(chat_id, ct["sendFile_ing"])
        // ^ (正在傳送檔案，請稍後...)
        //處理caption
        caption = message_json.userName + '\n'
        if (ALL.massage_time) {
          caption += get_time_txt(message_json.timestamp, GMT)
        }
        //發送
        sendDocument(chat_id, blob, notification, caption)
        //刪除"正在傳送XXX" 整潔舒爽!
        deleteMessage(chat_id, JSON.parse(send_ed)["result"]['message_id'])
      } else if (message_json.type == "leave") {
        sendtext(chat_id, ct['line_bot_leave']);
      } else if (message_json.type == "join") {
        ct['line_bot_join'].text = ct['line_bot_join'].text.format(message_json.room_type)
        sendtext(chat_id, ct['line_bot_join']);
      } else if (message_json.type == "memberJoined") {
        //新人加入啦
        var cutL = message_json['joined']['members']
        var members_data_text = get_line_members(message_json, cutL)
        ct['memberJoined']['text'] = ct['memberJoined']['text'].format(members_data_text)
        sendtext(chat_id, ct['memberJoined'])
        // ^ "有新人加入\n{0}"
      } else if (message_json.type == "memberLeft") {
        //有人離開啦
        var cutL = message_json['lefted']['members']
        var members_data_text = get_line_members(message_json, cutL)
        ct['memberLeft']['text'] = ct['memberLeft']['text'].format(members_data_text)
        sendtext(chat_id, ct['memberLeft'])
        // ^ "有人離開啦\n{0}"
      } else if (message_json.type == "follow") {
        ct['follow']['text'] = ct['follow']['text'].format(message_json.userName)
        sendtext(chat_id, ct['follow']['text']);
      } else if (message_json.type == "unfollow") {
        ct['unfollow']['text'] = ct['unfollow']['text'].format(message_json.userName)
        sendtext(chat_id, ct['unfollow']['text']);
      }
      //最後再"推前"
      upMessageData(i, col, ed)
    }
    //讀取房間的 Amount 歸零
    ALL.data[ALL.FastMatch2[ALL.opposite.RoomId]].Amount = 0;
    write_ALL(ALL, doc) //寫入
    SheetM.getRange(1, col).setValue("[0,0]")

    sendtext(chat_id, ct["read_massage_ed"]);
    // ^ =======讀取完畢=======
  } catch (e) {
    var aims_room_name = ALL.data[ALL.FastMatch2[ALL.opposite.RoomId]].Name
    ct["send_to_TG_error"]['text'] = ct["send_to_TG_error"]['text'].format(
      aims_room_name, JSON.stringify(message_json), e)
    sendtext(Telegram_id, ct["send_to_TG_error"]);
    // ^ '傳送失敗...，原因如下\n\n{0}'
  }


  return true
}
//================================================================
function start(payload) {
  var base_json = base()
  var Telegram_bot_key = base_json.Telegram_bot_key
  var data = {
    "method": "post",
    "payload": payload
  }

  //*/  <- 只要刪除或增加最前面的"/"就能切換模式了喔(*´∀`)~♥
  // throw new Error("強制停止!")
  return UrlFetchApp.fetch("https://api.telegram.org/bot" + Telegram_bot_key + "/", data);
  /*/  為了速度和穩定 不必要就算了
  var sheet_key = base_json.sheet_key
  var d = new Date();
  var SpreadSheet = SpreadsheetApp.openById(sheet_key);
  var Sheet = SpreadSheet.getSheetByName("紀錄發送的訊息");
  var LastRow = Sheet.getLastRow();
  Sheet.getRange(LastRow + 1, 1).setValue(d);
  Sheet.getRange(LastRow + 1, 3).setValue(data);
  Logger.log("ZZZZ = ", payload)
  var returned = UrlFetchApp.fetch("https://api.telegram.org/bot" + Telegram_bot_key + "/", data);
  Sheet.getRange(LastRow + 1, 2).setValue(returned); //確認有發成功
  //*/
}
//================================================================
