# Telegram_link_Line
用Telegram來收發Line的訊息。
use telegram to Send and receive messages(from Line).
----
舊版的在v1資料夾，此為針對v1的README。


# 準備
- 需要使用者申請 Telegram_bot跟Line_bot(Developer Trial)
的)
- 需有一google帳號並在其中創建：
1.一個doc檔，並將v2中的"doc.gs"內容複製上去。
2.一個sheet檔，並在其"A1"中填入0，然後將除了第1列的格式全部設為字串。
3.一個gs檔(google apps script)，並將v2其中的"Telegram_link_Line.gs"的內容複製上去，之後依檔案中16~23行的要求填入資料(註一)。
......(我是分隔線)......
接下來按下左上角的
"發佈" ->
"部屬為網路應用程式" ->
(專案版本 選"新增") ->
(將應用程式執行為 改成"我") ->
(具有應用程式存取的使用者 改成"任何人甚至匿名使用者") ->
確定(or更新)(註二) ->
將他給你的網址複製起來，並設定Telegram和Line的bot Post到該網址。(註三)
----
- 註一
  doc和sheet的ID在網址中，例如網址：
  https://docs.google.com/spreadsheets/d/1vp35X4AfgP2mGLib0PZQ0NLaw_Ur0PSD_0rjgbwOfx/edit#gid=0

  那ID就是"1vp35X4AfgP2mGLib0PZQ0NLaw_Ur0PSD_0rjgbwOfx"
  (介於"d/"跟"/edit")


- 註二
  第一次會要求權限，同意就好。


- 註三
  Telegram用
  "https://api.telegram.org/botKEY/setWebhook?url=https://XXX"(這個格式)
  Line則要到後台改(http://imgur.com/PYdDF7b)

# Screenshot
![Imgur](http://i.imgur.com/jXROwBF.png)
![Imgur](http://i.imgur.com/mxeheeh.png)
![Imgur](http://i.imgur.com/I0Qsimh.png)

# 版本資訊
  2017/04/08-初步發佈最基本款(收發訊息)
  (整體通知功能暫時沒用因為telegram已經有了，所以猶豫中)

  待做功能：
  - 自動依時間編排房間位置
  - 刪除聊天室
  - 重生資料(有bug時緊急排除)
  - 傳送照片、聲音、影片、位置...等

  待排除bug：
  - doc的資料不穩定，Telegram端同時傳兩個指令有機率塞入兩次"data"，此時需手動排除。因此請盡量等他給予回應後再傳下一個指令。

# doc的json說明

    {
        "data": [{
            "RoomId": "zzz",
            "Name": "(這個房間是空的)❎",
            "status": "normal",
            "Amount": 0,
            "Notice": false
        }],
        "mode": 0,
        "Notice": "正常通知",
        "opposite": {
            "RoomId": "zzz",
            "Name": "(這個房間是空的)❎"
        },
        "last": {
            "RoomId": "zzz",
            "Name": "zzz"
        },
        "Order": [0, 2, 1, 4, 3],
        "keyword": ["mi", "bot"],
        "RoomKeyboard": [
            [{
                "text": "🔮 回主選單"
            }],
            [{
                "text": "(這個房間是空的)❎"
            }]
        ],
        "FastMatch": {
            "(這個房間是空的)❎": 0
        },
        "FastMatch2": {
            "zzz": 0
        }
    }

data = 存放房間資訊
mode = 暫存指令(通常為0)
Notice = 管理整體通知(但可能廢除)(未作用)
opposite = 暫存指令對象房間
last = 來自Line端的最後訊息房間(未作用)
Order = 預計用來做自動依時間排序房間(未作用)
keyword = 關鍵字設定，出現關鍵字自動通知
RoomKeyboard = 房間的keyboard，為節省重生時間而生
FastMatch = 快速索引用
FastMatch2 = 快速索引用


# Author
永格天
