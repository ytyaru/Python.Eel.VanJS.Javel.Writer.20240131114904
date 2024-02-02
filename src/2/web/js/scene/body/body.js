(function(){
class Body {
    constructor() {
        this._styler = new Styler()
        this._parser = new Parser()
        this._viewer = new Viewer(this._parser)
        this.#init()
    }
    get parser() { return this._parser }
    get styler() { return this._styler }
    get viewer() { return this._viewer }
    #init() { this.#addListener(); this.#addElement() }
    #addListener() {
        window.addEventListener('resize', (e)=>{this.styler.resize();})
        window.dispatchEvent(new Event('resize'))
    }
    #addElement() {
        van.add(document.body, div({style:()=>this.styler.style}, 
            textarea({rows:5, cols:40, style:`resize:none;`, 
                oninput:(e)=>this.parser.manuscript.val=e.target.value}, 
                ()=>this.parser.manuscript.val), 
            button({style:`word-break:break-all;padding:0;margin:0;line-height:1em;letter-spacing:0;`},
                ()=>`${this.parser.size.val}字`), 
            this.viewer.make()))
    }
}
class Parser {
    constructor() {
        this.manuscript = van.state('')
        this.textBlocks = van.derive(()=>this.toBlocks(this.manuscript.val))
        this.htmls = van.derive(()=>this.toHtml(this.textBlocks.val))
        this.size = van.derive(()=>this.calcSize(this.htmls.val))
    }
    toBlocks(text) {
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
    toHtml(blocks) { return blocks.map(b=>((b.startsWith('# ')) ? h1(this.#inline(b.slice(2))) : p(this.#inline(b)))) }
    #inline(block) { 
        console.log(block)
        const inlines = []; let start = 0;
        for (let d of this.#genBrEmRuby(block)) {
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
    #genBrEmRuby(text) { return [...this.#genBr(this.#matchBr(text)), ...this.#genEm(this.#matchEm(text)), ...this.#genRuby(this.#matchRubyL(text)), ...this.#genRuby(this.#matchRubyS(text))].sort((a,b)=>a.index - b.index) }
    #genBr(matches) { return matches.map(m=>({'match':m, 'html':br(), 'index':m.index, 'length':m[0].length})) }
    #matchBr(text) { return [...text.matchAll(/[\r|\r?\n]/gm)] }
    #matchEm(text) { return [...text.matchAll(/《《([^｜《》\n]+)》》/gm)] }
    #genEm(matches) { return matches.map(m=>({'match':m, 'html':em(m[1]), 'index':m.index, 'length':m[0].length}))}
    #matchRubyL(text) { return [...text.matchAll(/｜([^｜《》\n\r]{1,50})《([^｜《》\n\r]{1,20})》/gm)] }
    #matchRubyS(text) { return [...text.matchAll(/([一-龠々仝〆〇ヶ]{1,50})《([^｜《》\n\r]{1,20})》/gm)] }
    #genRuby(matches) { return matches.map(m=>({match:m, html:ruby(m[1], rp('（'), rt(m[2]), rp('）')), 'index':m.index, length:m[0].length})) }
    calcSize(htmls) { return this.htmls.val.reduce((sum, el)=>sum + el.innerText.length, 0) }
}
class Styler {
    constructor() {
        this._width = van.state(0)
        this._height = van.state(0)
        this._gridTemplate = van.state('')
        this._fontSize = van.state(16)
        this._style = van.derive(()=>this.getStyle())
    }
    get style() { return this._style.val }
    getStyle() { return `display:grid;${this._gridTemplate.val}width:${this._width.val}px;height:${this._height.val}px;` }
    resize(width=0, height=0) { this.gridTemplate(width, height) }
    gridTemplate(width=0, height=0) {
        if (0===width) { width = document.documentElement.clientWidth }
        if (0===height) { height = document.documentElement.clientHeight }
        this._width.val = width
        this._height .val = height
        const isLandscape = (height <= width)
        const menuBlockSize = this.calcFontSize(((isLandscape) ? width : height))
        const uiWidth = (isLandscape) ? ((width - menuBlockSize) / 2) : width
        const uiHeight = (isLandscape) ? height : ((height - menuBlockSize) / 2)
        const landscapeSizes = [`${uiWidth}px ${menuBlockSize}px ${uiWidth}px`, `${uiHeight}px`]
        const portraitSizes = [`${uiWidth}px`, `${uiHeight}px ${menuBlockSize}px ${uiHeight}px`]
        const sizes = (isLandscape) ? landscapeSizes : portraitSizes
        const columns = sizes[0]
        const rows = sizes[1]
        this._gridTemplate.val = `grid-template-columns:${columns};grid-template-rows:${rows};`
        this.setFontSize(this.calcFontSize(uiWidth))
    }
    setFontSize(v) { Css.set('--font-size', `${((Number.isFinite(v)) ? v+'px' : v)}`) }
    calcFontSize(uiWidth) {
        const minLineChars = uiWidth / 16
        if (minLineChars <= 30) { return 16 } // Screen<=480px: 16px/1字 1〜30字/行
        else if (minLineChars <= 40) { return 18 } // Screen<=640px: 18px/1字 26.6〜35.5字/行
        else { return uiWidth / 40 } // Screen<=640px: ?px/1字 40字/行
    }
}
class Viewer {
    constructor(parser) {
        this._id = 'body-viewer'
        this._parser = parser
        this.display = van.state('block')
        this.writingMode = van.state('vertical-rl')
        this.textOrientation = van.state('upright')
        this.overflowX = van.state('auto')
        this.overflowY = van.state('hidden')
    }
    get isShow() { return 'block'===this.display.val }
    set isShow(v) { this.display.val = (v) ? 'block' : 'none' }
    show() { this.display.val = 'block' }
    hide() { this.display.val = 'none' }
    make() { return div({id:this._id, tabindex:0, 
            style:this.#style.bind(this),
            onwheel:(e)=>this.#onWheel(e),
            onkeydown:(e)=>this.#onKeydown(e),
        }, ()=>div(this._parser.htmls.val))
    }
    get element() { return document.querySelector(`#${this._id}`) }
    toggleWritingMode() {
        this.writingMode.val= (this.isVertical) ? 'horizontal-tb' : 'vertical-rl'
        this.overflowX.val = (this.isVertical) ? 'auto' : 'hidden'
        this.overflowY.val = (this.isVertical) ? 'hidden' : 'auto'
        this.textOrientation.val = (this.isVertical) ? 'upright' : 'mixed'
    }
    get isVertical() { return ('vertical-rl'===this.writingMode.val) }
    get isHorizontal() { return ('horizontal-tb'===this.writingMode.val) }
    #onWheel(e) {
        if ('vertical-rl'===this.writingMode.val) {
            if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
            const target = document.querySelector(`#${this._id}`)
            target.scrollLeft += e.deltaY;
            e.preventDefault();
        }
    }
    #onKeydown(e) {
        if (['Right','Left','Up','Down'].some((key)=>`Arrow${key}`===e.code)) {
            if ('ArrowUp'===e.code) e.target.scrollTop -= 96
            if ('ArrowDown'===e.code) e.target.scrollTop += 96
            if ('ArrowLeft'===e.code) e.target.scrollLeft -= 96
            if ('ArrowRight'===e.code) e.target.scrollLeft += 96
            e.preventDefault()
        }
    }
    // html-viewerは縦書きでHTML表示したいからdiv要素にする。でもdiv要素はfocusが当たらない。なのでtabindex=0を設定した。標準のキー操作だと矢印の上を押し続けるとbody要素へフォーカスが飛んでしまう。なのでキャレットを排除すべくuser-select:none;にして、かつキーイベントでスクロール操作するよう実装した。
    #style() { console.log(this.writingMode.val);return `display:${this.display.val};writing-mode:${this.writingMode.val};text-orientation:${this.textOrientation.val};box-sizing:border-box;overflow-x:${this.overflowX.val};overflow-y:${this.overflowY.val};user-select:none;` }
}
window.Body = Body
//window.javel = javel || {}
//window.javel.writer = javel.writer || {}
//window.javel.writer.Body = Body
})()

