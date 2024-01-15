# danbooruTagPicker
これはchromeの拡張です、開いたdanbooruからanimagine ver3.0の推奨する並び順でクリップボードにコピーします  
This is a chrome extension that copies from the opened danbooru to the clipboard in the order recommended by animagine ver 3.0  
  
## ver0.2  
ちょっとだけ大規模にほぼ作り直し  
前のバージョンでカスタマイズした人ごめんねー、もう一回カスタマイズできるよ！  
タグの除去リストを2種類追加、学習はともかく生成に不要な"username", "logo", "watermark"などを簡単に除去できるようになった  
  
### カスタマイズは自分で書いて？  
service-worker.jsの108行目あたりまでは読まなくてOK、そこから先でカスタマイズをやろう  
120行目あたりのignoreTagsが完全一致のタグ除去リスト  
135行目あたりのignoreTagsRegで部分一致のタグ除去リスト  
166行目あたりのresultに追加したいタグを書く(lora可になった)  
  
ちなみに部分一致でbreastsを消して、タグ追加にflat chestを入れると全てのキャラが貧乳化するよ！  
  
## ver0.1  
とりあえず作る  