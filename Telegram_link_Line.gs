function doPost(e) {

    //前期準備
    var estringa = JSON.parse(e.postData.contents);
    var ee = JSON.stringify(estringa);
    var sheet_key = "你的sheetID";
    var Telrgram_bot_key = "你Telegram bot的token";
    var Telegram_id = "你的TelegramID";
    var Line_id = "你的LineID"; //你的lineID
    var CHANNEL_ACCESS_TOKEN = '你的Line token';
    var text = "";//空的
    var email = "你的Email" //有問題的話會寄信給你
    //然後還要自己在sheet中新增一個名為"Log"的分頁(page)，亦或自己去下面改名稱


    if (estringa.update_id) { //利用兩方json不同來判別
        //以下來自telegram
        var from = 'telegram';
        Log(estringa, from, sheet_key,email); //log
        //以下準備接收telegram資訊並發到line
        var Keyword = estringa.message.text.charAt(0);
        var t = estringa.message.text.search(",");
        text = estringa.message.text.slice(t+1);
        if (estringa.message.text.substring(0, 2) == ">:") {
            var Line_id = estringa.message.text.substring(2, 35);
            var url = 'https://api.line.me/v2/bot/message/push';

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

            UrlFetchApp.fetch(url, options);
        }else {
          var url = "https://api.telegram.org/bot" + Telrgram_bot_key + "/sendMessage?chat_id=" + Telegram_id + "&text=";
          text = "您未指定對象!"
          UrlFetchApp.fetch(url+text);
        }


    } else if (estringa.events[0].timestamp) {

        //以下來自line
        var from = 'line';
        Log(estringa, from, sheet_key,email); //log
        //以下準備接收line資訊並發到telegram
        text = estringa.events[0].message.text;
        var mensaje = {
            "method": "sendMessage",
            "chat_id": Telegram_id,
            "text": text,
        }
        var payload = mensaje;
        var data = {
            "method": "post",
            "payload": payload
        }
        var url = "https://api.telegram.org/bot" + Telrgram_bot_key + "/sendMessage?chat_id=" + Telegram_id + "&text=";
        if(estringa.events[0].source.userId){
          var text_id = estringa.events[0].source.userId;
        }else {
          var text_id = estringa.events[0].source.groupId;
        }
        UrlFetchApp.fetch(url+text_id);
        UrlFetchApp.fetch("https://api.telegram.org/bot" + Telrgram_bot_key + "/", data);

    }else {
      GmailApp.sendEmail("we684123@gmail.com", "telegram-line出事啦", d + " " + ee);
    }
}
//===============================================================
function Log(estringa, from, sheet_key,email) {
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
