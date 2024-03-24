(function(){
class FocusLoop { // https://github.com/ghosh/Micromodal/blob/master/lib/src/index.js
    constructor() {
        this._sid = `` // 対象となる画面ID
        this._qs = [
            'a[href]',
            'area[href]',
            'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
            'select:not([disabled]):not([aria-hidden])',
            'textarea:not([disabled]):not([aria-hidden])',
            'button:not([disabled]):not([aria-hidden])',
            'iframe',
            'object',
            'embed',
            '[contenteditable]',
            '[tabindex]:not([tabindex^="-"])'
        ]
    }
    get sid( ) { return this._sid }
    set sid(v) { return this._sid = v }
    get queries() { return this._qs }
    get #targets() { return Array.from(document.querySelectorAll(this._qs)) }    // フォーカス候補要素を取得する
    get elements() { return this.#targets.filter(el=>(null!==el.offsetParent)) } // 候補から非表示要素を排除する
    init() {
        const els = this.elements;
        if (0 < els.length) { els[0].focus() }
        this.addEvent()
    }
    fin() { this.removeEvent() }
    onKeydown(event) { if (event.keyCode === 9) this.focus(event) }
    focus(event) {
        const els = this.elements
        if (!document.body.contains(document.activeElement)) { els[0].focus() }
        else {
            const focusedItemIndex = els.indexOf(document.activeElement)
            if (event.shiftKey && 0===focusedItemIndex) {
                els[els.length-1].focus()
                event.preventDefault()
            }
            if (!event.shiftKey && els.length > 0 && focusedItemIndex === els.length - 1) {
                els[0].focus()
                event.preventDefault()
            }
        }
    }
    addEvent() { document.addEventListener('keydown', this.onKeydown.bind(this)) }
    removeEvent() { document.removeEventListener('keydown', this.onKeydown.bind(this)) }
}
window.FocusLoop = new FocusLoop()
})()
