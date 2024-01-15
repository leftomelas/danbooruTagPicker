function copyToClipbordTag() {


  //danbooruよりデーターを読み取りタグを配列に入れて返す
  function getTagFromDanbooru(tagString) {
    result = []
    var elements = document.querySelectorAll(tagString);

    elements.forEach(element => {
      var tags = element.querySelectorAll("li[data-tag-name]");

      tags.forEach(tag => {
        var tagstring = tag.dataset.tagName
        result.push(tagstring)
      });
    });
    return result;
  };


  //tagsからignoreTagsに一致するタグを除去
  //完全一致
  function filterIgnoreTags(tags, ignoreTags) {

    //スぺースをアンダーバーにする
    ignoreTags = ignoreTags.reduce((p, c, i) => {
      p.push(c.replace(" ", "_"))
      return p
    }, [])

    result = tags.reduce((p, c, i) => {
      if (ignoreTags.includes(c)) {
        console.log("filterIgnoreTagsで除外(完全一致):" + c)
      } else {
        p.push(c)
      }
      return p
    }, []);
    return result;
  }


  //tagsからignoreTagsに一致するタグを除去
  //部分一致
  function filterPartialIgnoreTags(tags, ignoreTags) {

    //一部マッチさせたい文字列を格納した配列から正規表現のregexを作る
    patternText = ignoreTags.reduce((p, c, i) => {
      return p + "|" + c.replace(" ", "_")
    }, "")
    patternText = ".*(" + patternText.slice(1) + ").*"
    reg = new RegExp(patternText, "i")

    //実際にフィルターを掛ける
    result = tags.reduce((p, c, i) => {
      if (reg.test(c)) {
        console.log("filterPartialIgnoreTagsで除外(正規表現):" + c)
      } else {
        p.push(c)
      }
      return p
    }, []);
    return result;
  }

  //アンダーバーをスペースに変換
  function convertUnderbar2Space(tags) {
    result = tags.reduce((p, c, i) => {
      tag = c.replace(/_/g, " ");
      p.push(tag)
      return p
    }, []);
    return result;
  }

  // ()<>[]をエスケープ
  function escapeChar(tags) {
    result = tags.reduce((p, c, i) => {
      tag = c.replace(/[\(\)\<\>\[\]]/g,
        (match, p1, offset, string) => {
          return "\\" + match;
        }
      );
      p.push(tag)
      return p
    }, []);
    return result;
  }

  // 1boy,1girlなどを分離する
  function captureGirlBoy(tags) {

    resultFront = []
    resultBehind = []

    reg = RegExp(/^([1-9]boy[s]*|[1-9]girl[s]*)$/, "i")
    tags.forEach((tag) => {
      if (reg.test(tag)) {
        resultFront.push(tag)
      } else {
        resultBehind.push(tag)
      }
    })
    return [resultFront, resultBehind]
  }

  //カスタマイズする人はここから先で
  var tags = []
  //タグ読み込み
  tags = tags.concat(getTagFromDanbooru('ul.character-tag-list'));
  //作者タグは外します、使う人はコメントアウト外してね
  //tags = tags.concat(getTagFromDanbooru('ul.artist-tag-list'));
  tags = tags.concat(getTagFromDanbooru('ul.copyright-tag-list'));
  tags = tags.concat(getTagFromDanbooru('ul.general-tag-list'));

  //タグの検索結果ページのtagsを対象に抽出
  tags = tags.concat(getTagFromDanbooru('ul.search-tag-list'));


  //除外タグ、完全一致
  //かっこのエスケープ不要、アンダーバーありなしどっちでもＯＫ
  //pubic hairなどを部分一致で使うとmale pubic hairなども消えるのでそれが嫌ならここに書くこと
  var ignoreTags = [
    // "monochrome", "greyscale",
    // "thought_bubble", "speech_bubble", "comic", "sound effects", "heart", "heartbeat", "spoken heart",
  ]
  tags = filterIgnoreTags(tags, ignoreTags);


  //除外タグ、正規表現を使った部分一致
  //よくわからない人は英数字のみで書けば部分一致として機能する
  //かっこのエスケープ不要、アンダーバーありなしどっちでもＯＫ
  //
  // （わかる人向け）例えばこれが
  // ignoreTagsReg=["hoge","pubic hair","f.*ck"]
  // こんな風に正規表現に変形する
  //  /.*(hoge|pubic_hair|f.*ck).*/i
  var ignoreTagsReg = [
    "username", "logo", "watermark", "signature", "artist name", "copyright", "address", "text",
    //"censor",
    //"pubic hair",
  ]
  tags = filterPartialIgnoreTags(tags, ignoreTagsReg);

  //タグのアンダーバーをスペースに変換する
  //したくないならコメントアウトで
  tags = convertUnderbar2Space(tags)

  //かっこ等をエスケープ
  tags = escapeChar(tags)

  var result = ""

  //1girlなどの前に文字列を入れたい場合はここを使う
  //result += "1haeteruko,"

  //1girl等をつなげる
  var [boyGirlTag, otherTags] = captureGirlBoy(tags)
  result += boyGirlTag.join(",") + ","

  //1girlなどの後に文字を入れたい場合はここを使う
  //result += "himekishi chan,"

  //他のタグをつなげる
  result += otherTags.join(",") + ","

  //一番最後に任意の文字を入れたい場合はここを使う
  result += "explicit, nsfw, masterpiece,best quality"

  //,が二つ続いたらいっこ削除
  result = result.replace(",,", ",");

  //最後に,が来てる場合は削除
  if (result.endsWith(',')) {
    result = result.slice(0, -1);
  }

  navigator.clipboard.writeText(result)
    .then(() => {
      console.log('クリップボードにコピーしました:' + result);
    })
    .catch((error) => {
      console.error('クリップボードへのコピーに失敗しました: ', error);
    });

}


chrome.action.onClicked.addListener((tab) => {
  if (tab.url.includes('https://danbooru.donmai.us/posts')) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: copyToClipbordTag
    });
  }
});
