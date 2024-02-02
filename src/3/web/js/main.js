//    const {div,span,h1,h2,p,br,em,ruby,rt,rp,textarea,button,input,table,tr,th,td,pre} = van.tags
const {div,h1,p,br,em,ruby,rt,rp,textarea,button} = van.tags
window.addEventListener('DOMContentLoaded', async(event) => {
    const body = new Body()
    body.parser.manuscript.val = `# 原稿《げんこう》

　《《ここ》》に書いたテキストは下に表示《ひょうじ》されます。

　２つ以上の連続改行があると次の段落になります。
　１つだけの改行だと段落内改行です。

　
　全角スペースだけの段落なら連続した空行を表現できます。お勧めはしません。

　行頭インデントは全角スペースで書きます。

「セリフなど鉤括弧があるときはインデントしないよ」

――そのとき、神風が吹いた`
    document.querySelector('textarea').focus()
})

