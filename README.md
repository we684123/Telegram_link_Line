# Telegram_link_Line
>用Telegram來收發Line的訊息。
>use telegram to Send and receive messages(from Line).
*****
舊版的在v1、v2分支，此為針對v3的README。    
如果是 Telegram_Bot 新手推薦看完 [這個影片](https://youtu.be/On9yeMtG2Wg)後在來使用。    

如果想要獲取更新之訊，可以加入這個頻道  https://t.me/TG_link_Line



| 功能 | V1 | V2 | V3 |     
|-------|:----:|:-----:|:-----:|     
| 文字      |  ✓ |    ✓     |   ✓  |    
| 貼圖      |     |            | 僅Line發給TG |      
| 照片      |     | 僅TG發給Line |    ✓  |       
| 影片      |     |            |   ✓  |      
| 錄音      |     |            | 僅Line發給TG |      
| 位置      |     |            |   ✓  |      
| 檔案      |     |            | 僅Line發給TG |      
| 知道誰發言 |     |    ✓      |   ✓  |      
| 針對回復   |     |           |   ✓  |      
| 房間分類   |     |    ✓      |   ✓  |      
| 獨立房間   |     |           |    ✓  |      
* V2、V3有時會不知道是誰發言是因為對方[版本](https://goo.gl/noYa7L)不夠新。



# 準備
 ##### 需要使用者申請 Telegram_bot跟Line_bot(Developer Trial)

 ##### 需有一google帳號並在其中創建：


1.  一個doc檔，並將v3中的"doc.gs"內容複製上去。

2.  一個sheet檔
    * 在sheet中新增5個分頁(page)：    
  __"Debug"、"Log"、"紀錄發送的訊息"、"Line訊息區"、"JSON備份"__   
    * 其中 "Line訊息區" 在其"A1"中填入0(整數數字)，然後將除了第1列的格式全部設為字串(純文字)。      
    [說明圖1](http://i.imgur.com/za6Ia6Q.png)、[說明圖2](http://i.imgur.com/rj9vlR3.png)    


3.  二個gs檔(google apps script)，並將v3其中的"Telegram_link_Line.gs"的內容複製在一開始給你的"程式碼"區內。    
  ![Imgur](https://i.imgur.com/V3KF0rh.png)
  複製完後按下左上角的 __"檔案" -> "新增" -> "指令碼檔案" -> 輸入你要的名稱 -> 將"baseANDtest"內容複製上去並填上資訊(註一)__    
  ![Imgur](https://i.imgur.com/tt2F4cj.png)
  ----    
  ![Imgur](https://i.imgur.com/ySQ5jJO.png)
  ----    
  ![Imgur](https://i.imgur.com/MvEDdfk.png)
  ----    
  ![Imgur](https://i.imgur.com/WgT109q.png)
  然成後請如下操作：
    * 接下來按下左上角的
    * "發佈" ->
    * "部屬為網路應用程式" ->
    * (專案版本 選"新增") ->
    * (將應用程式執行為 改成"我") ->
    * (具有應用程式存取的使用者 改成"任何人甚至匿名使用者") ->
    * 確定(or更新)(註二) ->
    * 將他給你的網址複製起來，並設定Telegram和Line的bot Post到該網址。(註三)
    * 將 CP() 設定計時器 每6小時一次 (<-非必要，以防萬一用。)(用來備份整個doc)    
    [說明圖1](http://i.imgur.com/KGXuqhT.png)、[說明圖2](http://i.imgur.com/GWpqmYH.png)、[說明圖3](http://i.imgur.com/tP8HUgR.png)、[說明圖4](http://i.imgur.com/HHs9qOH.png)
##### Telegram bot 需要新增四個指令：

       main - 開啟主選單
       allread - 全部已讀
       debug - 重生資料(bot壞掉時用)(不會讓房間不見)
       exit - 離開對話

  * 跟 @BotFather 對話  ->    
  * 然後 /mybots  ->    
  * 選你的bot  ->    
  * 在進去 "edit Bot"  ->    
  * "edit commands"  ->    
  * 貼上上方指令並送出  ->    
  * 完成！    
  ps' /allread、/debug這兩個指令也可以移到bot的About裡面     
----
- 註一

  doc和sheet的ID在網址中，例如網址：
  https://docs.google.com/spreadsheets/d/1vp35X4AfgP2mGLib0PZQ0NLaw_Ur0PSD_0rjgbwOfx/edit#gid=0

  那ID就是"1vp35X4AfgP2mGLib0PZQ0NLaw_Ur0PSD_0rjgbwOfx"
  (介於"d/"跟"/edit")    

  不知道自己的Telegram ID可以在Telegram中找 @you_id_bot 問。    

  然後關於gs文件中第7行的 "Line_id"、第8行的 "CHANNEL_ACCESS_TOKEN"在如下圖line的後台中。     
  ![Imgur](http://i.imgur.com/meQfSFm.jpg)


- 註二

  第一次會要求權限，同意就好。


- 註三

  Telegram用     
  ```html
  "https://api.telegram.org/bot<token>/setWebhook?url=<https://XXX>&max_connections=1"
  ```    
  (這個格式("&lt;token&gt;"改成你的bot token 跟 "url="後面接gs專案網址 ))    
  (設定Webhook的方式就是將你改好的網址丟到任一瀏覽器上，並按Enter送出)

  Line則要到後台改([長這樣](http://i.imgur.com/k0pSRfR.png))


- NOTE：    
    你必須先跟你的機器人對話過他才能傳訊息給你。      
    如有出現問題請記得看一下 sheet 的 log !!!
- NOTE2：    
    現在Line伺服器在群組中有時會發userID(須對方line app更新)    
    所以有些知道是誰說的，有些不知道，我現在也很困擾。
# Screenshot
![Imgur](https://i.imgur.com/n9vBs6V.png)
----
![Imgur](https://i.imgur.com/FDVa131.png)
----
![Imgur](https://i.imgur.com/vlcHMHT.png)

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
        },
        "TG_control_bot_updateID": 610460242,
        "TG_bot_updateID_array": [{
            "update_id": 873054250,
            "TG_token": "437876669:AAE4bwnipQZiKdJEO9LndVdAqH76I0__ito",
            "line_roomID": "U9d16309b78be9a02acf3bcfb06b28df3",
            "Room_Name": "永格天@李孟哲✅"
        }, {
            "update_id": 488717600,
            "TG_token": "394777564:AAE9M7-e9vq74sfsByMg9RaIBdO4NYYwfQ4",
            "line_roomID": "C56858d2726373c094e030152171b2e23",
            "Room_Name": "吃飯團✅"
        }, {
            "update_id": 444300614,
            "TG_token": "437876669:AAE4bwnipQZiKdJEO9LndVdAqH76I0__ito",
            "line_roomID": "Ua117f5dc6861315c9f7a0184c1ff4154",
            "Room_Name": "XXA班✅"
        }]
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

TG_control_bot_updateID =
因為現在是多個bot對同一個程式post(獨立房間功能)，所以要知道哪個bot是主控bot(中控台的概念)

TG_bot_updateID_array =
有連線的bot(獨立房間)

# 版本資訊
  2017/09/28 - V3初次發布!

# Author
永格天
