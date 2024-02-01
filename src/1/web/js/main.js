//    const {div,span,h1,h2,p,br,em,ruby,rt,rp,textarea,button,input,table,tr,th,td,pre} = van.tags
const {div,h1,p,br,em,ruby,rt,rp,textarea,button} = van.tags
window.addEventListener('DOMContentLoaded', async(event) => {
    /*
    const manuscript = van.state('')
    const textBlocks = van.derive(()=>toBlocks(manuscript.val))
    const htmls = van.derive(()=>toHtml(textBlocks.val))
    const size = van.derive(()=>calcSize(htmls.val))
    const style = van.state(getStyle())
    String.prototype.trimLine = function() { return this.replace(/^\n*|\n*$/g, '') }
    function toBlocks(text) {
        if (0===text.trim().length) { return [] }
        text = text.replace('\r\n', '\n')
        text = text.replace('\r', '\n')
        const blocks = []; let start = 0;
        for (let match of text.matchAll(/\n\n/gm)) {
            blocks.push(text.slice(start, match.index).trimLine())
            start = match.index + 2
        }
        blocks.push(text.slice(start).trimLine())
        return blocks.filter(v=>v)
    }
    function toHtml(blocks) { return blocks.map(b=>((b.startsWith('# ')) ? h1(inline(b.slice(2))) : p(inline(b)))) }
    function inline(block) { 
        console.log(block)
        const inlines = []; let start = 0;
        for (let d of genBrEmRuby(block)) {
            console.log(d)
            inlines.push(block.slice(start, d.index))
            inlines.push(d.html)
            start = d.index + d.length
            console.log(start, d.index, d.length)
        }
        inlines.push(block.slice(start).trimLine())
        console.log(inlines)
        return inlines.filter(v=>v)
    }
    function genBrEmRuby(text) { return [...genBr(matchBr(text)), ...genEm(matchEm(text)), ...genRuby(matchRubyL(text)), ...genRuby(matchRubyS(text))].sort((a,b)=>a.index - b.index) }
    function genBr(matches) { return matches.map(m=>({'match':m, 'html':br(), 'index':m.index, 'length':m[0].length})) }
    function matchBr(text) { return [...text.matchAll(/[\r|\r?\n]/gm)] }
    function matchEm(text) { return [...text.matchAll(/《《([^｜《》\n]+)》》/gm)] }
    function genEm(matches) { return matches.map(m=>({'match':m, 'html':em(m[1]), 'index':m.index, 'length':m[0].length}))}
    function matchRubyL(text) { return [...text.matchAll(/｜([^｜《》\n\r]{1,50})《([^｜《》\n\r]{1,20})》/gm)] }
    function matchRubyS(text) { return [...text.matchAll(/([一-龠々仝〆〇ヶ]{1,50})《([^｜《》\n\r]{1,20})》/gm)] }
    function genRuby(matches) { return matches.map(m=>({match:m, html:ruby(m[1], rp('（'), rt(m[2]), rp('）')), 'index':m.index, length:m[0].length})) }
    function calcSize(htmls) { return htmls.reduce((sum, el)=>sum + el.innerText.length, 0) }
    function getStyle() { return `display:grid;${resize()}` }
    function resize(width=0, height=0) {
        console.log(`resize():`, width, height)
        if (0===width) { width = document.documentElement.clientWidth }
        if (0===height) { height = document.documentElement.clientHeight }
        console.log(width, height)
        const isLandscape = (height <= width)
        // this.menu.isVertical = this.#isLandscape()
        const menuBlockSize = 16
        const uiWidth = (isLandscape) ? ((width - menuBlockSize) / 2) : width
        const uiHeight = (isLandscape) ? height : ((height - menuBlockSize) / 2)
        const landscapeSizes = [`${uiWidth}px ${menuBlockSize}px ${uiWidth}px`, `${uiHeight}px`]
        const portraitSizes = [`${uiWidth}px`, `${uiHeight}px ${menuBlockSize}px ${uiHeight}px`]
        const sizes = (isLandscape) ? landscapeSizes : portraitSizes
        const columns = sizes[0]
        const rows = sizes[1]
        fontSize(uiWidth)
        return `grid-template-columns:${columns};grid-template-rows:${rows};`
    }
    function fontSize(uiWidth) {
        const minLineChars = uiWidth / 16
        if (minLineChars <= 30) { Css.set('--font-size', '16px'); return; } // Screen<=480px: 16px/1字 1〜30字/行
        else if (minLineChars <= 40) { Css.set('--font-size', '18px'); return; } // Screen<=640px: 18px/1字 26.6〜35.5字/行
        else { Css.set('--font-size', `${uiWidth / 40}px`); return; } // Screen<=640px: ?px/1字 40字/行
    }
    */
    const body = new Body()
    body.parser
    body.styler
    van.add(document.body, div({style:()=>body.styler.style}, textarea({rows:5, cols:40, oninput:(e)=>body.parser.manuscript.val=e.target.value}, ()=>body.parser.manuscript.val), button({style:`word-break:break-all;padding:0;margin:0;line-height:1em;letter-spacing:0;`},()=>`${body.parser.size.val}字`), ()=>div({style:()=>`height:${body.styler._height}px;`},body.parser.htmls.val)))
    //van.add(document.body, div({style:()=>body.styler.style}, textarea({rows:5, cols:40, oninput:(e)=>body.parser.manuscript.val=e.target.value}, ()=>body.parser.manuscript.val), button({style:`word-break:break-all;padding:0;margin:0;line-height:1em;letter-spacing:0;`},()=>`${body.parser.size.val}字`), ()=>div(body.parser.htmls.val)))
    //van.add(document.body, div({style:()=>style.val}, textarea({rows:5, cols:40, oninput:(e)=>manuscript.val=e.target.value}, ()=>manuscript.val), button({style:`word-break:break-all;padding:0;margin:0;line-height:1em;letter-spacing:0;`},()=>`${size.val}字`), ()=>div(htmls.val)))
    //van.add(document.body, div({style:()=>getStyle()}, textarea({rows:5, cols:40, oninput:(e)=>manuscript.val=e.target.value}, ()=>manuscript.val), button({style:`word-break:break-all;padding:0;margin:0;line-height:1em;letter-spacing:0;`},()=>`${size.val}字`), ()=>div(htmls.val)))
    body.parser.manuscript.val = `# 原稿《げんこう》

　《《ここ》》に書いたテキストは下に表示《ひょうじ》されます。

　２つ以上の連続改行があると次の段落になります。
　１つだけの改行だと段落内改行です。

　
　全角スペースだけの段落なら連続した空行を表現できます。お勧めはしません。

　行頭インデントは全角スペースで書きます。

「セリフなど鉤括弧があるときはインデントしないよ」

――そのとき、神風が吹いた`
    /*
    new ResizeObserver(entries=>{
        console.log('resize observe')
        for (let entry of entries) { resize(entry.contentRect.width, entry.contentRect.height) }
    }).observe(document.querySelector('body'));
    */
    //window.addEventListener('resize', (e)=>debounce(()=>{resize();style.val=getStyle();}, 300))
    //window.addEventListener('resize', (e)=>{console.log('resize() event');debounce(()=>{console.log('debounce');resize();style.val=getStyle();}, 300)})
    //window.addEventListener('resize', (e)=>debounce(()=>{console.log('debounce');resize();style.val=getStyle();}, 300))
//    window.addEventListener('resize', (e)=>{resize();style.val=getStyle();})
    document.querySelector('textarea').focus()
})

