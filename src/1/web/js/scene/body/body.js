(function(){
class Body {
    constructor() {
        this._styler = new Styler()
        this._parser = new Parser()
        this.#init()
    }
    get parser() { return this._parser }
    get styler() { return this._styler }
    #init() {
        window.addEventListener('resize', (e)=>{this.styler.resize();})
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
        //this._style = van.state(getStyle())
    }
    get style() { return this._style.val }
    //getStyle() { return `display:grid;${resize()}` }
    getStyle() { return `width:${this._width.val}px;height:${this._height.val}px;display:grid;${this._gridTemplate.val}` }
    resize(width=0, height=0) {
        this.gridTemplate(width, height)
        /*
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
        this.fontSize(uiWidth)
        return `grid-template-columns:${columns};grid-template-rows:${rows};`
        */
    }
    isLandscape(width=0, height=0) {
        console.log(`isLandscape():`, width, height)
        if (0===width) { width = document.documentElement.clientWidth }
        if (0===height) { height = document.documentElement.clientHeight }
        console.log(width, height)
        return (height <= width)
    }
    gridTemplate(width=0, height=0) {
        if (0===width) { width = document.documentElement.clientWidth }
        if (0===height) { height = document.documentElement.clientHeight }
        this._width.val = width
        this._height .val = height
//        Css.set('--width', width)
//        Css.set('--height', height)
        const isLandscape = (height <= width)
        //const menuBlockSize = 16
        const menuBlockSize = this.calcFontSize(((isLandscape) ? width : height))
        const uiWidth = (isLandscape) ? ((width - menuBlockSize) / 2) : width
        const uiHeight = (isLandscape) ? height : ((height - menuBlockSize) / 2)
        const landscapeSizes = [`${uiWidth}px ${menuBlockSize}px ${uiWidth}px`, `${uiHeight}px`]
        const portraitSizes = [`${uiWidth}px`, `${uiHeight}px ${menuBlockSize}px ${uiHeight}px`]
        const sizes = (isLandscape) ? landscapeSizes : portraitSizes
        const columns = sizes[0]
        const rows = sizes[1]
        //return `grid-template-columns:${columns};grid-template-rows:${rows};`
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
    /*
    fontSize(uiWidth) {
        const minLineChars = uiWidth / 16
        if (minLineChars <= 30) { Css.set('--font-size', '16px'); return; } // Screen<=480px: 16px/1字 1〜30字/行
        else if (minLineChars <= 40) { Css.set('--font-size', '18px'); return; } // Screen<=640px: 18px/1字 26.6〜35.5字/行
        else { Css.set('--font-size', `${uiWidth / 40}px`); return; } // Screen<=640px: ?px/1字 40字/行
    }
    */
}
window.Body = Body
//window.javel = javel || {}
//window.javel.writer = javel.writer || {}
//window.javel.writer.Body = Body
})()

