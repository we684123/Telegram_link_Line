# Telegram_link_Line
>用Telegram來收發Line的訊息。
>use telegram to Send and receive messages(from Line).
*****
此為針對 v3.2.1 的README。    
如果是 Telegram_Bot 新手推薦看完 [這個影片](https://youtu.be/On9yeMtG2Wg)後在來使用。    

如果想要獲取更新資訊，可以加入這個頻道  https://t.me/TG_link_Line



| 功能 | V1 | V2 | V3 | V3.1 | V3.2 |     
|-------|:----:|:-----:|:-----:|:-----:|:-----:|     
| 文字      |  ✓  |    ✓        |   ✓  |   ✓  |  ✓  |    
| 貼圖      |     |    | 僅Line發給TG |  ✓(註1) | ✓(註1)|    
| 照片      |     | 僅TG發給Line |    ✓  |   ✓   |  ✓  |    
| 影片      |     |              |   ✓  |   ✓  |  ✓  |    
| 錄音      |     |      | 僅Line發給TG |   ✓  |  ✓  |    
| 位置      |     |              |   ✓  |   ✓  |  ✓  |    
| 檔案      |    |  | 僅Line發給TG | 僅Line發給TG |  ✓ |    
| GIF  |  | |  | 僅TG發給Line(註2) | 僅TG發給Line(註2)  |    
|TG_video_note|   |            |      |      |  ✓  |
| 知道誰發言 |     |    ✓       |   ✓  |  ✓  |  ✓  |    
| 針對回復   |     |            |   ✓  |  ✓  |   ✓  |   
| 房間分類   |     |    ✓       |   ✓  |  ✓  |  ✓  |    
| 獨立房間   |     |            |    ✓  |  ✓  |  ✓  |    
| 關鍵字提醒 |     |            |    ✓  |  ✓  |  ✓  |    
| 訊息時間   |     |            |    ✓  |  ✓  |  ✓  |    
| 自訂語言包 |     |            |       |  ✓  |  ✓  |    
| 自訂時區  |     |            |       |  ✓  |  ✓  |    
| 知道Line_bot異動 |     |      |       |     |  ✓  |         
|知道Line群人員異動 |     |      |       |     |  ✓  |    
| /tryget_XXX 功能 |     |      |       |     |  ✓  |    
* V2、V3有時會不知道是誰發言是因為對方[版本](https://goo.gl/noYa7L)不夠新。
* 註1：目前確定 "安卓8.5.3" 可以正常看貼圖，"Windows 5.10.0.1789" 則無法，其他未知。
* 註2：LINE發送到TG僅會收到GIF的第一格的畫面。



----

# Screenshot
![Imgur](https://i.imgur.com/n9vBs6V.png)
----
![Imgur](https://i.imgur.com/FDVa131.png)
----
**獨立房間(升級房間) + ☀️ 顯示發送者：**    
![Imgur](https://github.com/we684123/Telegram_link_Line/blob/master/%E5%9C%96%E5%BA%8A/s3.gif?raw=true)    

**關鍵字提及：**    
(在 "🔧 更多設定" 內)    
![Imgur](https://i.imgur.com/NdYFcNY.png)    

**訊息時間：**    
(在 "🔧 更多設定" 內)    
![Imgur](https://i.imgur.com/BrbLaRE.png)

**自訂語言包：**    
在 "Telegram_link_Line(version3)/Languages" 中有 "Native(zh-tw).gs" 這個原生繁中語言包，其中 **可修改** 的內容如圖反白區域。     
**(修改後記得按下 "新增發布" 且在TG端 /debug 才能變更成功)**    
對了 如果你覺得你自訂的語言包不錯，可以pm我或自行pull請求來上傳。    
![Imgur](https://imgur.com/QPbPgcl.png)    

其屬性及內容：

    "":{ //物件名稱
      "type": "to_Telegram",     
      //^ "to_Line"、"to_Telegram"、"command(Telegram)"、"to_Telegram(only_text)"
      "text": "" or ['',''],   
      //^ 自定義文字內容 如有像 {0} 這種東西代表會有引入的文字 你也可以完全不引入
      //^ 如果形式是['','']則陣列內的內容會自動串接成一字串。
      "notification": false,  //不通知? true or false
      "parse_mode":""  //送出文字模式 "HTML" or "Markdown" or ""
    },


像是這個 {0}的用法     
![Imgur](https://imgur.com/gubGDbT.png)    


鍵盤內容也可自訂    
![Imgur](https://imgur.com/bZnoT6P.png)    

支援 粗體、斜體、連結
![Imgur](https://imgur.com/w9PS2iL.png)
----


# 其他人的教學

 #### [企鵝](https://t.me/penguinF)做了一個非常詳細的[圖文教學](https://hackmd.io/s/Bkc6LwAP7#)(萬分感謝 m(_ \_)m )，可以去看看。
 #### (但是此教學目前過期，不過創建LINEbot的部分是能用的，另外就是這個版本升級房間時不再使用新的bot，轉成用"新群組"替代)

----

# 準備
 ##### 需要使用者申請 Telegram_bot跟Line_bot(Developer Trial)

 ##### 需有一google帳號並在其中創建：

![Imgur](https://i.imgur.com/U1oJeU5.png)

1.  一個doc檔，並將v3中的"doc.gs"內容複製上去。

2.  一個sheet檔
    * 在sheet中新增5個分頁(page)：    
  __"Debug"、"Log"、"紀錄發送的訊息"、"Line訊息區"、"JSON備份"__      
    [說明圖](https://i.imgur.com/UD8X3KO.png)
    * 其中 "Line訊息區" 在其"A1"中填入 "[0,0]" (字串)，然後選取所有儲存格的格式設為字串(純文字)。      
    [說明圖](https://i.imgur.com/CnrhMB7.png)    

3.  一個資料夾(用來放來自Line的媒體)，推薦名稱叫 "download_from_line"

4.  三個gs檔(google apps script)，並將v3其中的"Telegram_link_Line.gs"的內容複製在一開始給你的"程式碼"區內。    
  ![Imgur](https://i.imgur.com/V3KF0rh.png)
  複製完後按下左上角的 __"檔案" -> "新增" -> "指令碼檔案" -> 輸入你要的名稱(推薦叫"baseANDtest") -> 將"baseANDtest.gs"內容複製上去並填上資訊(註一)__    
  ![Imgur](https://i.imgur.com/tt2F4cj.png)
  ----    
  ![Imgur](https://i.imgur.com/ySQ5jJO.png)
  ----    
  ![Imgur](https://i.imgur.com/MvEDdfk.png)
  ----    
  ![Imgur](https://i.imgur.com/WgT109q.png)

  再一次
  按下左上角的 __"檔案" -> "新增" -> "指令碼檔案" -> 輸入你要的名稱(推薦叫"Languages") -> 將"[Native(zh-tw).gs](https://github.com/we684123/Telegram_link_Line/blob/redev2/Telegram_link_Line(version3)/Languages/Native(zh-tw).gs)"內容複製上去__    

  ![Imgur](https://i.imgur.com/KCwcCEz.png)


  然成後請如下操作：    
  * 接下來按下左上角的     
  * "發佈" ->     
  * "部屬為網路應用程式" ->     
  * 專案版本 選"新增"**(一定要記得!!!)** ->     
  * 將應用程式執行為 改成"我" ->     
  * 具有應用程式存取的使用者 改成"任何人甚至匿名使用者" ->     
  * 確定(or更新)(註二) ->     
  * 將他給你的網址複製起來，並設定Telegram和Line的bot Post到該網址。(註三)     
  * 將 [CP()](https://t.me/TG_link_Line/23)，[設定計時器](https://t.me/TG_link_Line/24) 每6小時一次 (<-非必要，以防萬一用。)(用來備份整個doc)    
    [說明圖1](http://i.imgur.com/KGXuqhT.png)、[說明圖2](http://i.imgur.com/GWpqmYH.png)、[說明圖3](http://i.imgur.com/tP8HUgR.png)、[說明圖4](http://i.imgur.com/HHs9qOH.png)
  * **執行 up_version()，如[說明圖](https://imgur.com/ghcR90c)，很重要!(考試不會考:p**    

##### Telegram bot 需要新增四個指令：

      main - 開啟主選單
      exit - 離開對話
      debug - 重生資料(bot壞掉時用)(不會讓房間不見)
      allread - 全部已讀

  * 跟 [@BotFather](https://t.me/BotFather) 對話  ->    
  * 然後 /mybots  ->    
  * 選你的 bot  ->    
  * 在進去 "edit Bot"  ->    
  * "edit commands"  ->    
  * 貼上上方指令並送出  ->    
  * 完成！    
  ps' /allread、/debug這兩個指令也可以移到bot的About裡面     
  ![bot的About](https://imgur.com/ypwUAtg.png)    

##### Telegram bot 需要關閉隱私模式：
  **不然升級房間後會有沒接收到訊息的問題。**

  找[@BotFather](https://t.me/BotFather)關閉掉隱私模式。    

  步驟：
  - /mybos
  - (選擇你的bot)
  - Bot Settings
  - Group Privacy
  - turn off

  此時上面的文字應該是會改成向類似這樣
  "Privacy mode  is disabled for (bot 名稱) (bot的username)."    

----
- 註一

  doc和sheet的ID在網址中，例如網址：
  https://docs.google.com/spreadsheets/d/1vp35X4AfgP2mGLib0PZQ0NLaw_Ur0PSD_0rjgbwOfx/edit#gid=0

  那ID就是"1vp35X4AfgP2mGLib0PZQ0NLaw_Ur0PSD_0rjgbwOfx"
  **(介於 "d/" 跟 "/edit" 之間)**    

  不知道自己的Telegram ID可以在Telegram中找 [@you_id_bot](https://t.me/you_id_bot) 問。    

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

  ```html
  EX:    
    token = "123123:ZFDGFG"    
    url   = "https://XXX"     
  那網址就是:    
  "https://api.telegram.org/bot123123:ZFDGFG/setWebhook?url=https://XXX&max_connections=1"    
  ```    

  __沒有 "<" 跟 ">"，請務必把這兩個符號刪掉!__    


  (設定Webhook的方式就是將你改好的網址丟到任一瀏覽器上，並按Enter送出，如果成功會回你 "Webhook was set" 或 "Webhook always set")    

  Line則要到後台改([長這樣](http://i.imgur.com/k0pSRfR.png))


- NOTE：    
    你必須先跟你的機器人對話過他才能傳訊息給你。      
    如有出現問題請記得看一下 sheet 的 log !!!
- NOTE2：    
    現在Line伺服器在群組中有時會發userID(須對方line app更新)    
    所以有些知道是誰說的，有些不知道，我現在也很困擾。

----

# 注意

**如果你的GCP專案列表出現不明的專案請先不要砍，這個專案可能就是這個bot用的，如果砍了...     
[這裡有補救的方式......](https://blog.tdccc.com.tw/307)    
 by我的血淚教訓。**

----

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
          "text": "🔃 重新整理"
        }, {
          "text": "🔧 更多設定"
        }, {
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
      "FastMatch3": {},
      "keyword_notice": false,
      "massage_time": false,
      "TG_temporary_docking": {},
      "wait_to_Bind": {},
      "GMT": "GMT+8",
      "code_version": 3.1
    }

data = 存放房間資訊

mode = 暫存指令(通常為0)

Notice = 管理整體通知(確定廢除)(未作用)

opposite = 暫存指令對象房間

last = 來自Line端的最後訊息房間(未作用)

Order = 預計用來做自動依時間排序房間(未作用)

keyword = 關鍵字設定，出現關鍵字自動通知

RoomKeyboard = 房間的 keyboard，為節省重生時間而生

FastMatch = 快速索引用

FastMatch2 = 快速索引用

FastMatch3 = 快速索引用(給已升級房間用)

keyword_notice =
是否開啟關鍵字通知(預設為"關閉")

massage_time =
是否開啟訊息時間(預設為"關閉")

TG_temporary_docking =
如果bot被邀進群組則會登記於此，一旦bot在該群組中收到的前4則訊息，沒有包含綁定的隨機碼就會離開該群組以減少流量負荷。

wait_to_Bind =
當TG端按下升級房間時，則會將待綁定的房間資料塞入此處等待綁定，會被 /debug 或 /unsetroom 指令消除。

GMT =
此預設 GMT+8 若不再該時區可自行調整(預計下一版會可以在TG端調整)

code_version =     
該程式的版本，用來驗證配對語言包正確性。

---
# 版本資訊

  ##### 2019/02/21 - (V3.2.3)     
   * 修正 刪除房間後還會觸發"關鍵字"的問題    
   * 修正 line_bot在一般房間中加入時無法顯示加入的房間類型的問題(room、group、user)    
   * 修正 刪除房間後觸發"新房間"的問題(變成原本的房間洗白後再創一次，且bot還是離開的狀態    


    已知Bug：當line成員離開時無法顯示是誰離開(需等下次加新功能時才能修)

  更新方式：   
  1. Telegram_link_Line.gs 修改    
  2. **重部署版本** (版本是 "新增" )    

  ##### 2019/01/11 - (V3.2.2)     
   * 修正 電腦版圖片無法下載的問題    
    (現在確定 win7電腦版(5.12.1.1857)、安卓(8.19.2)、IOS(8.17.0)皆可預覽跟下載)    

   更新方式：
   1. Telegram_link_Line.gs 修改    
   2. **重部署版本** (版本是 "新增" )    

  ##### 2018/12/27 - (hotfix)(V3.2.1)     
   * 修正 /tryget 失敗沒提示原因、指令後面加上"@XXX"後失敗 的問題
   * 修正 在讀取留言時，成員加入、離開的訊息無法讀取 的問題
   * 修正 遇到follow、unfollow事件就發生錯亂 的問題
   * 修正 傳送失敗時，沒有辦法知道出錯的是哪個訊息及發送目標 的問題

   更新方式：
   1. Telegram_link_Line.gs 修改    
   2. Languages.gs 修改    
   3. **重部署版本** (版本是 "新增" )

  ##### 2018/12/14 - (V3.2)     
   * 支援 File 傳送至 Line。    
   * 支援 Telegram 傳送格式化連結給 Line。**(粗體、斜體、連結，不包含code)**
   * 支援 Telegram Vote_Note(前鏡頭圓形影片) 傳至 Line。
   * 支援 在 bot 內更改時區(GMT)。
   * Telegram "回覆訊息"格式更改，以美化 Line 那邊的排版。
   * Line 傳送給 Telegram 的檔案和錄音不再是連結而是"實物"。
   * "已升級的房間" 在 "主選單" 中的狀態符號改為"⭐️"。
   * "已升級的房間" 已可直接改名，不需先降回去普通房間。
   * 現在可以在還有未讀訊息的情況下直接升級房間，會自動在新群傾倒舊訊息。
   * 現在在 Telegram 中已能知道 Line 群人員加入、離開的狀況。
   * 現在在 Telegram 中已能知道 Line_bot 被踢除、加入的狀況。
   * 現在如果 "Line伺服器" 掛掉無法取得檔案，可用 /tryget_XXX 的方式重新取得。
   * "(正在傳送XX，請稍後...)" 或其他 "告知類" 訊息在完成後會自動刪除。
   * 修復 一直傳同張照片的問題、附檔名錯亂的問題。
   * 修復 安卓、ios版Line app 無法查看照片的問題(分別測試於8.18.1、8.17.0)。
   * 修復 Line room type 為"room"時，Line群人名無法獲取的問題。
   * 修復 特殊情況下要轉傳2次驗證碼才能綁訂房間的問題。
   * 提升bot檔案檢索速度。
   * 指令效果變更! /allread 現在不會把檔案丟到垃圾桶。    
   如要丟棄檔案請至 "🔧 更多設定 / 🌋 丟棄舊檔" 。
   * ct['xxx']['text']的內容現在可以為 ['String','String']，系統會串接起來。


**這次更新前一樣先 CP() 過後再用 /allread 在更新較不會有意外發生。**    

**此外如果你的GCP專案列表出現不明的專案請先不要砍，這個專案可能就是這個bot用的，如果砍了...     
[這裡有補救的方式......](https://blog.tdccc.com.tw/307)    
 by我的血淚教訓。**


更新方式：
1. Telegram_link_Line.gs 修改    
2. Languages.gs 修改    
3. 在gs中[執行 up_version() 函式](https://imgur.com/ghcR90c)。
4. **重部署版本** (版本是 "新增" 謝謝)

  ##### 2018/10/06 -     
   * GIF、錄音 可從 Telegram 傳 Line。    
   * Telegram 貼圖可傳至 Line (部分Line裝置無法觀看)。
   * 新增自訂語言包功能，對於不習慣我的bot講話風格者可自訂自己的bot風格。
   * 可自行調整時區(GMT)，預設 GMT+8，預計下次更新可以在 Telegram 中調時區。
   * **TG群_link_Line群 功能開啟** ，升級房間的功能變更，改成用"新群組"的方式來升級房間。(不知為何有些人開的群組bot收不到訊息，必須升級至超級群組並給bot管理員權限才OK)。
   * 刪除房間的功能不再只是刪除在doc端的資料，現在開始會嘗試離開，但如果是bot與他人1對1的"房間"則無法離開。
   * 修正 /debug 指令失效問題。
   * 修正登記新房間後會有機率撞名導致開啟房間錯亂的問題。
   * 修正把房間全刪後無法新增新房間的問題。(算你狠wwwww

此次更新前請務必將所有房間降級後再來更新，如覺得太多房間要降覺得麻煩可以先將 Telegram_link_Line.gs 的內容貼上，然後 **儲存但不發佈** 後執行 "mv_all_uproom()" 這個函式來一鍵全降級。
(記得先"CP()"過，如果真的出狀況還可以去sheet中"JSON備份"內找到備份還原回去)。

一樣在 __"更新前"__ 請盡量看過所有內容後按下 /allread 指令，較不會有意外發生。    

如果升級群組後發現你轉傳"驗證碼"後完全沒反應，請先去開找[@BotFather](https://t.me/BotFather)關閉掉隱私模式，然後再轉傳一次。    

步驟：
- /mybos
- (選擇這個bot)
- Bot Settings
- Group Privacy
- turn off

此時上面的文字應該是會改成向類似這樣
"Privacy mode  is disabled for (bot 名稱) (bot的username)."

在不行的話，請升級成 **超級群組** 並給bot管理員的權限----。


更新內容：    
1.Telegram_link_Line.gs 修改    
2.Languages.gs 新增(看readme    

  ##### 2018/05/28 -     
  * 提升穩定性，加入"關鍵字提醒"、"訊息時間"兩功能    
  * 溫馨提醒! 預設兩項功能皆是"關閉"，請自行開啟謝謝!    

  請手動更新 Telegram_link_Line.gs，在 __"更新後"__，還需要手動執行 REST_keyboard 函式[(如圖示範)](https://imgur.com/ekyByn5)，若擔心資料崩潰可先執行 CP 函式，這樣就算壞了也能手動回朔。     
  而在 __"更新前"__ 請盡量看過所有內容後按下 /allread 指令，較不會有意外發生。    


  ##### 2018/03/16 -     
  * 有效提升穩定性、現在發圖片時的"簡介"也會一同被發出去了    
  * 正發送"位置"、"文檔"的錯誤    

  ##### 2017/09/28 - V3初次發布!

----

# Author
[永格天](https://we684123.carrd.co/)
