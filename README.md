# Telegram_link_Line
>用Telegram來收發Line的訊息。
>use telegram to Send and receive messages(from Line).
*****
舊版的在v1資料夾，此為針對v2的README。    
如果是 Telegram_Bot 新手推薦看完 [這個影片](https://youtu.be/On9yeMtG2Wg)後在來使用。

# 準備
 ##### 需要使用者申請 Telegram_bot跟Line_bot(Developer Trial)

 ##### 需有一google帳號並在其中創建：


1.  一個doc檔，並將v2中的"doc.gs"內容複製上去。

2.  一個sheet檔
    * 在sheet中新增5個分頁(page)：
  "Debug"、"Log"、"紀錄發送的訊息"、"Line訊息區"、"JSON備份"   
    * 其中 "Line訊息區" 在其"A1"中填入0(整數數字)，然後將除了第1列的格式全部設為字串(純文字)。      
    [說明圖1](http://i.imgur.com/za6Ia6Q.png)、[說明圖2](http://i.imgur.com/rj9vlR3.png)    


3.  一個gs檔(google apps script)，並將v2其中的"Telegram_link_Line.gs"的內容複製上去，之後依檔案中16~23行的要求填入資料(註一)。 然成後請如下操作：
    * 接下來按下左上角的
    * "發佈" ->
    * "部屬為網路應用程式" ->
    * (專案版本 選"新增") ->
    * (將應用程式執行為 改成"我") ->
    * (具有應用程式存取的使用者 改成"任何人甚至匿名使用者") ->
    * 確定(or更新)(註二) ->
    * 將他給你的網址複製起來，並設定Telegram和Line的bot Post到該網址。(註三)
    * 將 CP() 設定計時器 每6小時一次 (<-非必要，以防萬一用。)
##### Telegram bot 需要新增兩個指令：

       main - 開啟主選單
       exit - 離開對話

  * 跟 @BotFather 對話  ->    
  * 然後 /mybots  ->    
  * 選你的bot  ->    
  * 在進去 "edit Bot"  ->    
  * "edit commands"  ->    
  * 貼上上方指令並送出  ->    
  * 完成！
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
  "https://api.telegram.org/botKEY/setWebhook?url=https://XXX"    
  (這個格式("KEY"改成你的botkey 跟 "url="後面接gs專案網址 ))    
  (設定post的方式就是將你改好的網址丟到任一瀏覽器上，並按Enter送出)

  Line則要到後台改([長這樣](http://i.imgur.com/k0pSRfR.png))


- NOTE：
    你必須先跟你的機器人對話過他才能傳訊息給你。    
    如有出現問題請記得看一下 sheet 的 log !!!
# Screenshot
![Imgur](http://i.imgur.com/4Vqwybc.png)

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
                "text": "🔭 訊息狀態"
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

keyword = 關鍵字設定，出現關鍵字自動通知(未作用)

RoomKeyboard = 房間的keyboard，為節省重生時間而生

FastMatch = 快速索引用

FastMatch2 = 快速索引用

# 版本資訊
  2017/06/01-更新說明文件    
  待做功能增加：    
  - 顯示自己ID      
  - 快速讀取訊息功能

  2017/05/22-簡化UI(最近都在忙證照，都沒時間更新(汗.. )        

  2017/04/13-加入自動修正doc.json崩潰
  * * *
  2017/04/08-初步發佈最基本款(收發訊息)
  (整體通知功能暫時沒用因為telegram已經有了，所以猶豫中)

  待做功能：

  - 自動依時間編排房間位置
  - 刪除聊天室
  - 重生資料(有bug時緊急排除)
  - 傳送照片、聲音、影片、位置...等

  ~~待排除bug：~~ (2017/04/13修復)

  - doc的資料不穩定，Telegram端同時傳兩個指令有機率塞入兩次"data"，此時需手動排除。因此請盡量等他給予回應後再傳下一個指令。

# Author
永格天
