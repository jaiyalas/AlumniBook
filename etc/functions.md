# functions

**這裡條列我今天想到我們可能可以做的功能**

  * 有想到其他功能請盡量擴充本文件
  * 有任何問題請到 asana 上面的 Spec. Dev. 這個 issue 上面留 comments
  * 沒有其他疑問請到 Functions selecting 這個 issue 上留言說覺得我們應該要實作哪些功能。請參考在下的留言來留下對應功能的各序號。
  * functions/specs 原則上在今天結束之前應當需要確認下來, 謝謝

## 功能規格與簡述

### 基本資訊(靜態)

以下是靜態且題目要求的基本資訊儲存功能，主項目基本上就是 table，子項目就是 column。

  * [01] public info (公開資訊)
    - user name
    - user type
    - avatar */非強制要求項目/*
    - student ID
  * [02] personal profile (個人資訊)
    - first name zh-tw
    - last name zh-tw
    - first name en
    - last name en
    - phone number
    - postal addr.
    - email addr.
  * [03] business career (職涯簡歷)
    - short autobiography
    - current employer
    - position
    - past position

基本資訊中的 [01] 是完全公開資訊，沒有 privacy 問題。[02] 和 [03] 的閱讀權限基本上一致應該就可以，但是廣義來說 [02] 和 [03] 可以分開處理，而且這也是個不錯的實作昨天演講的技術的地方，所以我覺得我們將 [02] 和 [03] 的權限分開處理。不過這就要弄 data modeling 的人辛苦一點了。

### 基本功能(動態)

以下依據功能種類加以區別：

#### Setting

  * [04] 個人安全  
    - 密碼儲存
    - 密碼更新

#### Privacy 

我目前想到 privacy 可以根據兩種方式來定義：**其一**是利用使用者型別的方式去定義，例如說 professor 會可以看所有學生的個人資訊，但是預設上不能看職涯簡歷。**其二**是利用 user 之間的關係去定義，也就是每個 user maintains 一個 "list of other users" 來表示可以看到自己個人資訊和職涯簡歷的名單。

第二個方法就是弱化版的 friends 觀念，好處是可以不用另外設計關於 friendship 甚至 relationship 的架構，缺點當然就是缺乏彈性。當然，如果我們願意做 relationship 之類的 network 機制出來，整體功能會比較完整。

  * [05] user-type based privacy

  * [06] relationship based privacy

#### Relationship

基本上就是 friends。可以用來設定 [06] 並且可以用來條列好友清單等等。

  * [07] relationship edit (add/remove)
  
  * [08] show friends (personal social network)
  
### 進階功能

嗯，我覺得上面的能做完就偷笑了，進階再看看好了 :p 而且光是上面那邊就有很多東西可以在 data model 上面做 generalization，如果真的要做的話光是上面的量就夠 data modeling 和 implementation 兩邊頭大了。以上。