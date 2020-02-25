function base() {
  //前期準備，不懂看README
  var sheet_key = "(都填入2個雙引號之間，也就是這裡)"; //你的sheet ID
  var doc_key = "(跟上面格式一樣，下面依此類推)"; //你的doc ID
  var Telegram_bot_key = ""; //Telegram bot的token
  var Telegram_id = ""; //你的Telegram帳號ID(要通知你)
  var Line_id = ""; //你的line ID
  var CHANNEL_ACCESS_TOKEN = ''; //你的Line token
  var email = "@gmail.com"; //你的email(祈禱永遠別收到來自此的e-mail)
  var FolderId = ""; //你的選擇要存的資料夾(google_grive_FolderId)，必須獨立不能共用!
  var gsURL = ""; //該gs檔的發佈網址
  //前期準備完成!==============================================================
  var base_json = {
    "sheet_key": sheet_key,
    "doc_key": doc_key,
    "Telegram_bot_key": Telegram_bot_key,
    "Telegram_id": Telegram_id,
    "Line_id": Line_id,
    "CHANNEL_ACCESS_TOKEN": CHANNEL_ACCESS_TOKEN,
    "email": email,
    "FolderId": FolderId,
    "gsURL": gsURL
  }
  return base_json
}
//============================================================================
function setWebhook() {
  var base_json = base()
  var Telegram_bot_key = base_json.Telegram_bot_key
  var gsURL = base_json.gsURL
  UrlFetchApp.fetch("https://api.telegram.org/bot" + Telegram_bot_key + "/setWebhook?url=" + gsURL + "&max_connections=1")
}
//============================================================================
