function language(number) {
  var language = {  //多包一層看以後有沒有打算擴充...........................................................................
    "language_objet": [{
      "language_name": "Native(Taiwan)",
      "version": 0.1,
      "update_time": 1536343691,
      "author": "永格天",
      "correspond_text": {
        "backed_up_ing": {
          "type":"to_Telegram"
          "text": "已備份舊資料，更新doc資料庫中...",
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "backed":{
          "type":"to_Telegram"
          "text": "doc資料庫更新完畢!，如之後有問題可以手動還原\n#doc 備份點",
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "re_send_command":{
          "type":"to_Telegram"
          "text": "請重新執行上一個指令_(:з」∠)_",
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "For_this_reply":{
          "type":"to_Line"
          "text": "{0}\n^針對此回復^\n{1}", // {0} = 要回覆的文字內容 , {1} = 回覆的文字內容
        },
        "sendPhoto_ed":{
          "type":"to_Telegram"
          "text": "(圖片已發送!)",
          "notification": true,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "sendVideo_ed":{
          "type":"to_Telegram"
          "text": "(影片已發送!)",
          "notification": true,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "not_support_sticker":{
          "type":"to_Telegram"
          "text": "(暫時不支援貼圖傳送喔!)",
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "not_support_audio":{
          "type":"to_Telegram"
          "text": "(暫時不支援audio傳送喔!)",
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "not_support_voice":{
          "type":"to_Telegram"
          "text": "(暫時不支援voice傳送喔!)",
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "plz_exit_and_resend":{
          "type":"to_Telegram"
          "text": "請先按下 /exit 離開後再下指令喔!",
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "duplicate_name":{
          "type":"to_Telegram"
          "text": "名子不可重複，請重新輸入一個!",
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "duplicate_command":{
          "type":"to_Telegram"
          "text": "名子不可跟命令重複，請重新輸入一個!";,
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "rename_success":{
          "type":"to_Telegram"
          "text": "{0}完成~\n{1}\n->\n{2}\n{3}",
          // {0} = 自定義的"🔖 重新命名" , {1} = 原本的房間名
          // {2} = "重命名的房間名" , {3} = 自定義的"🔮 開啟主選單"
          "notification": true,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "delete_room_success":{
          "type":"to_Telegram"
          "text": "已刪除此聊天室",
          "notification": true,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "plz_input_token":{
          "type":"to_Telegram"
          "text": "請輸入botToken",
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "unsetbot":{
          "type":"to_Telegram"
          "text": "已取消設定bot",
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "plz_input_token_not_command":{
          "type":"to_Telegram"
          "text": "請輸入token 而非指令!\n若要取消升級步驟請 {0}", // {0} = /unsetbot
          "notification": true,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "Webhook_success_plz_input_any_text_in_new_bot":{
          "type":"to_Telegram"
          "text": "Webhook已連結!\n進入最後一個步驟了! \n請至新機器人聊天室那任意輸入文字以進行綁定。",
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "some_error":{
          "type":"to_Telegram"
          "text": "看來發生了一點錯誤.....\n請稍候再試.....",
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "plz_input_correct_token":{
          "type":"to_Telegram"
          "text": "看來發生了一點錯誤>_<\n請輸入正確token!",
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "Occupied_ed":{
          "type":"to_Telegram"
          "text": "這個 '聊天室' 已被其他bot佔用了!\n請至新的bot聊天室留言。",
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "uproom_success":{
          "type":"to_Telegram"
          "text": "已升級成功(๑•̀ㅂ•́)و✧\n\n房間狀態:\n{0}", // {0} = 房間的json
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "not_input_here":{
          "type":"to_Telegram"
          "text": "請至 __新機器人聊天室__ !!!那任意輸入文字以進行綁定。\n不是這裡喔!",
          "notification": false,  //不通知? true or false
          "parse_mode":"Markdown"  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "droproom_fail":{
          "type":"to_Telegram"
          "text": "降級失敗! 詳情如下：\nresponseCode：\n{0}\nerror：\n{1}",
          // {0} = responseCode , {1} = e
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "droproom_success":{
          "type":"to_Telegram"
          "text": "已降級成功(๑•̀ㅂ•́)و✧\n\n" + "房間狀態:\n{0}", // {0} = 房間狀態
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "add_keyword_success":{
          "type": "to_Telegram"
          "text": "已成功新增\n\n{0}\n\n如遇離開請按 /main\n或者繼續輸入新增",
          // {0} = 全部的keyword列表
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "add_keyword_fail":{
          "type": "to_Telegram"
          "text": "新增失敗，原因如下：{0}"
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "delete_keyword_success":{
          "type": "to_Telegram"
          "text": "已成功移除\n\n{0}\n\n如遇離開請按 /main\n或者繼續輸入移除",
          // {0} = 全部的keyword列表
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "delete_keyword_fail":{
          "type": "to_Telegram"
          "text": "移除失敗，如遇重新移除請先再次看過關鍵字名單再操作\n按下 /lookkeyword 可顯示名單\n移除失敗原因如下：\n{0}",
          // {0} = 移除失敗原因
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "change_message_time_func":{
          "type": "to_Telegram"
          "text": "已成功 {0} 訊息時間!", // {0} = 開啟or關閉
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "開啟":{ //這下我的 In() 要怎麼改.....，算了 一定有辦法的。
          "type": "to_Telegram"
          "text": "開啟",
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "關閉":{
          "type": "to_Telegram"
          "text": "關閉",
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "w_error_status":{
          "type": "to_Telegram"
          "text": "寫入失敗，詳情如下：",
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "not_eat_this":{
          "type": "to_Telegram"
          "text": "030...\n請不要給我吃怪怪的東西...",
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "":{
          "type": "to_Telegram"
          "text": "",
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "":{
          "type": "to_Telegram"
          "text": "",
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "🔮 開啟主選單":{
          "type":"to_Telegram"
          "text": "🔮 開啟主選單",
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "🔖 重新命名":{
          "type":"to_Telegram"
          "text": "🔖 重新命名",
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        },
        "":{
          "type":"to_Telegram"
          "text": "",
          "notification": false,  //不通知? true or false
          "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
        }

      }
    }, ]
  }

  return language["language_objet"][number]
}
