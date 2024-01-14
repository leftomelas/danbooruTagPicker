function copyToClipbordTag() {

  function filter_tag(tagString) {
    result = ""
    var elements = document.querySelectorAll(tagString);

    elements.forEach(element => {
      var tags = element.querySelectorAll("li[data-tag-name]");
      tags.forEach(tag => {
        result += tag.dataset.tagName + ","
      });
    });
    return result;
  };

  // 正規表現を使って文字列の先頭に移動する関数
  function moveCharacterToStart(inputString, targetCharacter) {
    // 正規表現で対象の文字を検索
    var regex = new RegExp(targetCharacter);
    var match = inputString.match(regex);
    // 対象の文字が見つかった場合、文字列の先頭に移動
    if (match) {
      return match[0] + "," + inputString.replace(regex, '').replace(",,", ",");

    } else {
      // 対象の文字が見つからない場合は元の文字列を返す
      return inputString;
    }
  }


  var tagstring = ""
  tagstring += filter_tag('ul.character-tag-list');
 
  //作者タグは外します、使う人はコメントアウト外してね
  //tagstring += filter_tag('ul.artist-tag-list');
  tagstring += filter_tag('ul.copyright-tag-list');
  tagstring += filter_tag('ul.general-tag-list');

  //タグを追加していく作業はここで終わり
  //最後にカンマがきてるはずなので削除する
  tagstring = tagstring.slice(0, -1);

  tagstring = moveCharacterToStart(tagstring, "[1-9]boy[s]*")
  tagstring = moveCharacterToStart(tagstring, "[1-9]girl[s]*")

  tagstring = tagstring.replace(/,,/g, ",");
  tagstring = tagstring.replace(/_/g, " ");
  tagstring = tagstring.replace(/\(/g, "\\\(");
  tagstring = tagstring.replace(/\)/g, "\\\)");

  //不要な人はコメントアウトしてね？
  tagstring += ",masterpiece,best quality"  

  navigator.clipboard.writeText(tagstring)
    .then(() => {
      console.log('クリップボードにコピーしました:' + tagstring);
    })
    .catch((error) => {
      console.error('クリップボードへのコピーに失敗しました: ', error);
    });
}


chrome.action.onClicked.addListener((tab) => {
  if (tab.url.includes('https://danbooru.donmai.us/posts/')) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: copyToClipbordTag
    });
  }
});

