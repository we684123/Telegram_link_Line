# Telegram_link_Line
>用Telegram來收發Line的訊息。    
>use telegram to Send and receive messages(from Line).    

>或者把它當作Line的訊息備份也是可啦 😛    

>支援 Telegram、Line 個人及群組    
>1對1、多對1、1對多、多對多 的訊息傳遞。    


此為針對 v3.3 的README。    
如果是 Telegram_Bot 新手推薦看完 [這個影片](https://youtu.be/On9yeMtG2Wg)後在來使用。    

如果想要獲取更新資訊，可以加入這個頻道  https://t.me/TG_link_Line

----

# 目錄(Index)
  1. [功能 (Features)](https://github.com/we684123/Telegram_link_Line/tree/master#%E5%8A%9F%E8%83%BDfeatures)
  2. [實際情況截圖 (Screenshot)](https://github.com/we684123/Telegram_link_Line/tree/master#screenshot)
  3. [自定義語言包說明 (Custom language pack description)](https://github.com/we684123/Telegram_link_Line/tree/master#%E8%87%AA%E5%AE%9A%E7%BE%A9%E8%AA%9E%E8%A8%80%E5%8C%85%E8%AA%AA%E6%98%8Ecustom-language-pack-description)
  4. [部署教學 (Installing)](https://github.com/we684123/Telegram_link_Line/tree/master#%E9%83%A8%E7%BD%B2%E6%95%99%E5%AD%B8-installing)
  5. [注意事項 (Precautions)](https://github.com/we684123/Telegram_link_Line/tree/master#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A0%85-precautions)
  6. [程式說明 (Code Introduction)](https://github.com/we684123/Telegram_link_Line/tree/master#%E7%A8%8B%E5%BC%8F%E8%AA%AA%E6%98%8E-code-introduction)
  7. [版本資訊 (Version)](https://github.com/we684123/Telegram_link_Line/tree/master#%E7%89%88%E6%9C%AC%E8%B3%87%E8%A8%8A)
  8. [常見問答 (Q&A)](https://github.com/we684123/Telegram_link_Line/tree/master#%E5%B8%B8%E8%A6%8B%E5%95%8F%E7%AD%94-qa)
  9. [贊助(Donate)](https://github.com/we684123/Telegram_link_Line/tree/master#%E8%B4%8A%E5%8A%A9donate)
  10. [作者 (Author)](https://github.com/we684123/Telegram_link_Line/tree/master#author)

----

# 功能(Features)

| 功能 |  V2 | V3 | V3.1 | V3.2 | V3.3 |     
|-------|:-----:|:-----:|:-----:|:-----:|:-----:|     
| 文字      |  ✓  |    ✓   |   ✓   |  ✓   |  ✓  |    
| 貼圖  |     |僅Line發給TG |✓(註1) |✓(註1)|✓(註3)|    
| 照片      |僅TG發給Line|     ✓  |   ✓   |  ✓  | ✓  |    
| 影片      |     |   ✓  |   ✓  |  ✓  | ✓  |    
| 錄音      |     |僅Line發給TG |   ✓  |  ✓  |   ✓  |   
| 位置      |     |   ✓  |   ✓  |  ✓  |  ✓  |    
| 檔案      |     | 僅Line發給TG | 僅Line發給TG |  ✓ |  ✓  |    
| GIF  |    |     | ✓(註2)| ✓(註2) | ✓(註2) |    
|TG_video_note|      |     |      |  ✓  |  ✓  |
| 知道誰發言 | ✓  |  ✓  |  ✓  |  ✓  | ✓  |   
| 針對回復   |     |    ✓  |  ✓  |  ✓  | ✓  |    
| 房間分類   |  ✓  |    ✓  |  ✓  |  ✓  |  ✓  |    
| 獨立房間   |     |    ✓  |  ✓  |  ✓  |  ✓  |    
| 關鍵字提醒 |     |    ✓  |  ✓  |  ✓  |  ✓  |    
| 訊息時間   |     |   ✓  |  ✓  |  ✓  |  ✓  |    
| 自訂語言包 |     |       |  ✓  |  ✓  |  ✓  |    
| 自訂時區  |     |         |  ✓  |  ✓  |  ✓  |    
| 知道Line_bot異動 |     |      |     |  ✓  |  ✓  |         
|知道Line群人員異動 |     |      |     |  ✓  |  ✓  |    
| /tryget_XXX 功能 |     |      |     |  ✓  |  ✓  |    
| 🍭變換房位  |     |      |     |      |  ✓  |    
| 🆗設定提示  |     |      |     |      |  ✓  |    
| 🎨傳圖設定  |     |      |     |      |  ✓  |    
* V2、V3有時會不知道是誰發言是因為對方[版本](https://goo.gl/noYa7L)不夠新。
* 註1：目前確定 "安卓的line版本8.5.3" 可以正常看貼圖，"Windows的line版本 5.10.0.1789" 則無法，其他未知。
* 註2：僅TG發給Line，LINE發送到TG僅會收到GIF的第一格的畫面。
* 註3：目前不支援TG的動圖。 支援Line動圖傳至TG。 TG傳送貼圖至Line會先去我的伺服器轉檔，若覺不妥可自架。



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

**支援 粗體、斜體、連結**
![Imgur](https://imgur.com/w9PS2iL.png)


----

# 自定義語言包說明(Custom language pack description)

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

----

# 部署教學 (Installing)

## 其他人的教學

 #### [企鵝](https://t.me/penguinF)做了一個非常詳細的[圖文教學](https://hackmd.io/s/Bkc6LwAP7#)(萬分感謝 m(_ \_)m )，可以去看看。    

 #### 但是此教學目前過期，不過創建LINEbot的部分是能用的
 #### 另外就是這個版本升級房間時不再使用新的bot，轉成用"新群組"替代！

----

## 部屬教學影片(Install teach video)
[![Telegram_link_Line部屬教學影片](http://img.youtube.com/vi/tOkCOcP-nmY/0.jpg)](http://bit.ly/2yjI91k)
$NU錄影片阿

----

## 準備
 **需要使用者申請 Telegram_bot跟Line_bot(Developer Trial)**

 **需有一google帳號並在其中創建：**

![Imgur](https://i.imgur.com/U1oJeU5.png)

**事前聲明：下列4個步驟的檔案必須在同一個google帳號下，或者有存取權，bot才會正常運作。**    

1.  一個doc檔，並將v3中的"doc.gs"內容複製上去。

2.  一個sheet檔
    * 在sheet中新增5個分頁(page)：    
  __"Debug"、"Log"、"紀錄發送的訊息"、"Line訊息區"、"JSON備份"__      
    [說明圖](https://i.imgur.com/UD8X3KO.png) (上方文字請用複製比較保險)
    * 其中 "Line訊息區" 在其"A1"中填入 "[0,0]" (字串)，然後選取所有儲存格的格式設為字串(純文字)。      
    [說明圖](https://i.imgur.com/CnrhMB7.png)    

3.  一個資料夾(用來放來自Line的媒體)，推薦名稱叫 "download_from_line"(如果Google空間爆了bot會罷工喔，一般帳號有15G應該還好，如果是這個bot的東西占滿空間可以去"自己的TGbot"->"更多設定"->"丟棄舊檔"來丟到垃圾桶)

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
  按下左上角的 __"檔案" -> "新增" -> "指令碼檔案" -> 輸入你要的名稱(推薦叫"Languages") -> 將"[Native(zh-tw).gs](https://github.com/we684123/Telegram_link_Line/blob/master/Telegram_link_Line/Languages/Native(zh-tw).gs)"內容複製上去__    

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

# 注意事項 (Precautions)

1. **如果你的GCP專案列表出現不明的專案請先不要砍，這個專案可能就是這個bot用的，如果砍了...     
    [這裡有補救的方式......](https://blog.tdccc.com.tw/307)    
    by我的血淚教訓。**

2. **因為 Line 官方在 2019/06/10 後便將所有的 bot 改成[新的方案](http://at-blog.line.me/tw/archives/LINEOA2.0.html)    
    因此開始有人次的限制!!!請務必注意這一點!!!!!       
    (只好安慰自己說起碼拿來當備份還算實用...**    

3. **目前我還會繼續更新這個專案，最少搞定現在有的bug，還有先前承諾的功能。**

----
# 程式說明 (Code Introduction)

## 程式流程

如果要理解程式的流程，推薦可以從[V2紀念用](https://github.com/we684123/Telegram_link_Line/releases/tag/V2%E7%B4%80%E5%BF%B5%E7%94%A8)下手，那時只有核心邏輯。

在這支程式中一切都是從 doPost(e) 這個 function 開始的，然後經過前面的一修必要流程(模式選擇、幾本的預設、預處理、讀取doc檔)後，再從 **"if (estringa.update_id) {"** 這裡判斷是TG送來的，還是Line送來的json，並做出對應的處理。

### 程式規劃

為了讓使用者可以用最少的步驟完成更新，所以我在規劃程式劃分時只分離出3個檔案    
1. baseANDtest.gs <- 用來存放設定好後就不會再輕易改變的設定檔 (如 bot 的 token)    
2. Telegram_link_Line.gs <- 所有的程式    
3. Languages.gs <- 可自定義的語言包，可以把bot改成自己喜歡的樣子(V3.1開始才有)    

因為這樣的設計故我需說明一下 Telegram_link_Line.gs (擠在一起很難讀)    


#### 如果是從 Telegram 來的

0.  開啟 sheet 寫入 log。    
1.  判斷是不是群組或超級群組    
    1-1 是否是以綁訂在 doc 中的 "升級房間" 中? (Y -> 1-3 , N -> 1-2)    
    1-2 如果沒有在 doc 中，則給4次的機會來做房間綁定，4次後則離開。    
    1-3 如果在 doc 中，則依傳送的類型(文字、貼圖...)用不同的函式傳到對應的 Line 房間。    
    ****

2. 如果是私人1對1        
    2-1 是不是擁有者? (Y -> 2-3 , N -> 2-2)    
    2-2 發送該傳案連結請他自己做一個    
    2-3 傳過來的是文字訊息? (Y -> 2-4 , N -> 2-5)    
    2-4 依 ALL['mode'] 的值來判斷現在的模式，並依模式對bot進行設定，亦或發送訊息至 Line。    
    2-5 如果 ALL['mode'] == "🚀 發送訊息" 則傳訊息至 Line，如果不是則請他注意當前模式。    

#### 如果是從 Line 來的

0.  開啟 sheet 寫入 log。    
    0-1 先取得 userName，爾後在將資料整理成本程式適合的格式後再繼續    
    0-2 如果是媒體檔(照片、影片...)則先下載備用    
    ****
1.  查看傳來的訊息中的房間 ID 是否有在 doc 中(Y -> 1-1 , N -> 2)    
    1-1 是否是 "已升級房間" ? (Y -> 1-2 , N -> 1-3)    
    1-2 傳送訊息至對應的 TG 房間    
    1-3 將訊息存在 sheet 的 "Line訊息區" 分頁中，並由bot私訊通知擁有者。    
    ****
2. 如果訊息的 type 不是 "leave"，則在 doc 中新增房間資料，並更新 sheet，再通知擁有者。    
    ****


## doc的json說明
doc是很重要的文件，用來儲存會變動的資料。    

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
此預設 GMT+8 若不再該時區可自行在 TGbot "更多設定" 中調整

code_version =     
該程式的版本，用來驗證配對語言包正確性。

**在這之後其實還有一些沒說明的屬性當可以在 up_version 函式中找到。**    


---
# 版本資訊
  ##### 2019/08/20 - (V3.3)     
  "🔧更多設定" 內:
  * 新增 "🍭變換房位" 功能
    可以自由調換主選單的房間位置
  * 新增 "🆗設定提示" 功能
    可以自訂是否要提示狀態? 提示後要不要刪除? 是否要延遲一定時間再刪?
  * 新增 "🌀轉圖設定"、"🎨 傳圖設定" 功能
    能夠設定貼圖的處理方式。

  新的特性:
  * 支援 TG 的 "已升級房間"，從 "普通群組" 升級成 "超級群組" 的自動轉換
  * 新增 /up_version 指令至 TG_bot，之後升級程式可在複製貼上發布後對 bot 下該指令進行升級。
  * 新增 /info , /v , /V , /version 指令，用來查看 bot 程式版本。
  * 改變 "🔭訊息狀態" 現在會顯示目前已使用的人次量。

  **這次有特別新增 server 的程式碼    
  如果要自架 "轉圖server" 的請至 "image_conversion_server" 資料夾查看！**    

  更新方式：
  1. Telegram_link_Line.gs 修改    
  2. Languages.gs 修改    
  3. **重部署版本** (版本是 "新增" )
  4. 對 bot 下 /up_version 指令，或是在 gs 上直接執行 up_version() 函式


> 已知Bug：
>  1. 當line成員離開時無法顯示是誰離開(需等下次加新功能時才能修)     
(真的是下次啦QQ，要先來改老師給東西不然會開天窗，只好做一半先發布Orz)    
>  2. TG bot 傳送 "檔案" 時檔案的中文顯示不出來(覺得TG的問題，我之後盡量嘗試修補)


  ****


  ##### 2019/04/07 - (hotfix)(V3.2.4)     
 * 修正 TG、Line 端傳送字串太長導致失敗的問題

 更新方式：
 1. Telegram_link_Line.gs 修改    
 2. **重部署版本** (版本是 "新增" )
 ****

  ##### 2019/02/21 - (V3.2.3)     
   * 修正 刪除房間後還會觸發"關鍵字"的問題    
   * 修正 line_bot在一般房間中加入時無法顯示加入的房間類型的問題(room、group、user)    
   * 修正 刪除房間後觸發"新房間"的問題(變成原本的房間洗白後再創一次，且bot還是離開的狀態    


    已知Bug：當line成員離開時無法顯示是誰離開(需等下次加新功能時才能修)

  更新方式：   
  1. Telegram_link_Line.gs 修改    
  2. **重部署版本** (版本是 "新增" )    
  ****

  ##### 2019/01/11 - (V3.2.2)     
   * 修正 電腦版圖片無法下載的問題    
    (現在確定 win7電腦版(5.12.1.1857)、安卓(8.19.2)、IOS(8.17.0)皆可預覽跟下載)    

   更新方式：
   1. Telegram_link_Line.gs 修改    
   2. **重部署版本** (版本是 "新增" )    
   ****

  ##### 2018/12/27 - (hotfix)(V3.2.1)     
   * 修正 /tryget 失敗沒提示原因、指令後面加上"@XXX"後失敗 的問題
   * 修正 在讀取留言時，成員加入、離開的訊息無法讀取 的問題
   * 修正 遇到follow、unfollow事件就發生錯亂 的問題
   * 修正 傳送失敗時，沒有辦法知道出錯的是哪個訊息及發送目標 的問題

   更新方式：
   1. Telegram_link_Line.gs 修改    
   2. Languages.gs 修改    
   3. **重部署版本** (版本是 "新增" )
   ****

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
****

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
****

  ##### 2018/05/28 -     
  * 提升穩定性，加入"關鍵字提醒"、"訊息時間"兩功能    
  * 溫馨提醒! 預設兩項功能皆是"關閉"，請自行開啟謝謝!    

  請手動更新 Telegram_link_Line.gs，在 __"更新後"__，還需要手動執行 REST_keyboard 函式[(如圖示範)](https://imgur.com/ekyByn5)，若擔心資料崩潰可先執行 CP 函式，這樣就算壞了也能手動回朔。     
  而在 __"更新前"__ 請盡量看過所有內容後按下 /allread 指令，較不會有意外發生。    
****


  ##### 2018/03/16 -     
  * 有效提升穩定性、現在發圖片時的"簡介"也會一同被發出去了    
  * 正發送"位置"、"文檔"的錯誤    
****

  ##### 2017/09/28 - V3初次發布!

----

# 常見問答 (Q&A)

  ### 1. 為什麼升級房間後 bot 不會有任何回應?
  你忘記解除隱私模式，請見[這裡](https://github.com/we684123/Telegram_link_Line/tree/dev#telegram-bot-%E9%9C%80%E8%A6%81%E9%97%9C%E9%96%89%E9%9A%B1%E7%A7%81%E6%A8%A1%E5%BC%8F)，設定後如果還是不行，請將 bot 移除群組後在重新拉入試試。

  ### 2. 為什麼 bot 沒有辦法傳送貼圖、照片、影片?
  在剛部屬或升級bot時有一個 **"執行 up_version()"** 步驟，尼可能沒有做，請對 bot 下 /up_version 指令後即可解決(如果是 V3.3 以前的版本[請手動到gs執行](https://imgur.com/ghcR90c))

  ### 3. 如何查看 bot 版本?
  請對 bot 下 /info , /v , /V , /version 中其中一個指令，如果是 V3.2 或 V3.1 的版本，請至 doc 文件尋找 code_version 的值，更早的版本... 只能對照程式碼了(｡ŏ﹏ŏ)

  ### 4. bot 突然在某個地方卡住了怎麼辦?
  原則上應該是不會出現這種狀況(都用全局鎖了qwq)，如果不是網路或TG的問題的話，請 /main + /debug 再繼續操作，要是依舊無解請在 Telegram 上找 @we684123 來協助處理。

  ### 5. 為什麼我的 line bot 無法加入 line 的群組中?
  這是因為 line 限制一個群組只能加入一個 bot，如果你目前群組內的 bot 是 Telegram_link_Line bot 的話可以請擁有者邀你進入他的TG群，本bot支援 TG 群對 line 群的對話方式。

  ### 6. Line bot 在對方傳訊息後自動回說「感謝您傳送訊息給我！很抱歉...」，這段訊息怎麼關掉?
  這個要去 lline bot 的後臺關掉($NU 後台網址或圖片)

  ### 7. 怎麼確定這個 bot 的資料不會外傳?
  基本上這 bot 是架在你的 Google Apps Script 上的(其實也算是在GCP上)，我完全沒存取權，如果你沒有主動將設定檔 (baseANDtest.gs & doc.gs & gs的對外網址) 的內容洩漏出去的話是不會有這樣的問題的。

  唯一有可能的是貼圖因為無法在 gs 上進行轉換，故會先送到我的 server 上做轉換後才送回你的 Google Drive，我的server目前不會存任何貼圖，且如果您在 "🔧更多設定" -> "🌀轉圖設定" 設成 "不讓server存" 那我未來即使為了加快轉圖速度而保留轉圖後的貼圖，也不會存下你的貼圖。

  當然，您也可以直接自架轉圖 server，原始碼我也有開源於此專案，架好後去 "🌀轉圖設定" 改一下 server 域名就好。

  ### 8. (這個房間是空的)❎  這個房間可以刪掉嗎?
  可以的，請直接刪掉！

  ### 9. 對方從 line 傳的檔案一直在不下來怎麼辦? (bot 回傳 500)    
  500的話要嘛是 line 伺服器的問題，只能等。    
  還有一個可能是他傳的大小超過 50MB，bot 無法下載(還在構思這怎麼解決qwq)    

  但就算沒超過 50 MB，Line server也會處理N久     
  我遇過等她處理 32MB 處理整整2小時半的案例過...。

# 贊助(Donate)
hmmm........     
如果你覺得這對你有幫助的話，........    
聽說這是 "台灣pay" 的 QRcode..............    
我也沒用過(｡ŏ﹏ŏ) .......................................    

![Imgur](https://i.imgur.com/rVmAnh6.jpg)    


----

# Author
![](https://avatars3.githubusercontent.com/u/22027801?s=460&v=4)    

[永格天](https://we684123.carrd.co/)    
一個~~中二病~~水瓶座男子    
不太擅長塗鴉 (看大頭貼就知道Orz...)    
