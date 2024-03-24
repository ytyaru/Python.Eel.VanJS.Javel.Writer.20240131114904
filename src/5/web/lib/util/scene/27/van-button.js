(function(){
class HTMLVanButtonElement extends HTMLElement {
//class VanButton extends HTMLElement {
    //static #ATTRS = 'onpush,onhold,onced,disabled,radiused,hold,once,radius,colors,light,dark,noon,night,color-scheme'.split(',')
    //static ATTRS = 'onpush,onhold,onced,disabled,radiused,hold,once,radius,colors,light,dark,noon,night,color-scheme'.split(',')
    //static KEYS = 'onpush,onhold,onced,disabled,radiused,hold,once,radius,colors,light,dark,noon,night,color-scheme'.split(',')
    static ATTRS = {
        'onpush': 'function',
        'onhold': 'function',
        'onced': 'boolean',
        'disabled': 'boolean',
        'radiused': 'boolean',
        'hold': 'integer',
        'once': 'integer',
        'radius': 'number',
        'colors': 'string',
        'light': 'boolean',
        'dark': 'boolean',
        'noon': 'boolean',
        'night': 'boolean',
        'color-scheme': 'string'
    }
    States = {'isFree':0, 'isHide':1, 'isDisabled':2, 'isRiveted':3, 'isDown':4, 'isLongDowned':5 }
    static ColorSchemes = {
        'light':{base:chroma('#ddd'), main:chroma('#000'), accent:chroma('#d82')},  // 白黒
        'dark':{base:chroma('#000'), main:chroma('#ddd'), accent:chroma('#dd0')},   // 白黒
        'noon':{base:chroma('#fff'), main:chroma('#000'), accent:chroma('#d82')},   // 昼（明）
        'night':{base:chroma('#000'), main:chroma('#0d0'), accent:chroma('#dd0')},  // 夜（青光無）
    }
    constructor() {
        super()
        this.options = {
            isOnce: false,
            onPush: (e)=>{},
            onHold: (e)=>{},
        }
        this._state = this.States.isFree
        this._device = {
            'keyboard':{name:'', isFocus:false, isDown:false, event:null, push:{start:0, end:0}},
            'gamepad':{name:'', isFocus:false, isDown:false, event:null},
            'mouse':{name:'', isHover:false, isDown:false, event:null},
            'touch':{name:'', isTouch:false, event:null},
        }
        this._colorScheme = this.constructor.ColorSchemes.light
        this._customColorScheme = {base:chroma('#ddd'), main:chroma('#000'), accent:chroma('#d82')}
        this._style = vanX.reactive({
            'display': 'inline-block', // flex,grid,table,none,inline,inline-block,block
            'color': {fore:'#000', back:'#eee'},
            'border': {width:'1px', style:'solid', color:'#dd0', radius:'0px'},
            'outline': {isShow:false, has:false, width:'2px', style:'dashed', color:'#f00', offset:'0px'},
        })
        this._push = {         // 押下時間（ms）
            start: Date.now(), // 押下した時点
            end  : Date.now(), // 離した時点
            hold : 1000 * 2,   // 長押し判定する押下時間（この時間未満ならisRun, この時間以上ならisLongRunを実行する）
            once : {           // 連打防止（この時間未満に再実行要求されても無視する。一定時間isDisabledにすることで防ぐ）
                first: { start: 0, end: 0 },
                last:  { start: 0, end: 0 },
                time: 1000 * 2, // 押下後disabledにする時間（disabled中に押下するとdisabled時間延長する）
            }
        }
        this._timeout = { // setTimeout(), clearTimeout()
            'hold': null,
            'disabled': null,
        }
    }
    connectedCallback() {
        this.#makeAttr()
        this.#addEventListener()
        this.#updateState() 
    }
    disconnectedCallback() {}
    adoptedCallback() {}
    //static get observedAttributes() { return this.#ATTRS }
    //static get observedAttributes() { return this.ATTRS }
    static get observedAttributes() { return Array.from(Object.keys(this.ATTRS)) }
    attributeChangedCallback(property, oldValue, newValue) {
        console.log(property, oldValue, newValue)
        if (oldValue === newValue) return;
        switch(property) {
            case 'onpush': return this.#setFn('onPush', newValue)
            case 'onhold': return this.#setFn('onHold', newValue)
            case 'onced': return this.onced = true
            case 'radiused': return this.radiused = true
            case 'disabled': return this.disabled = true
            case 'hold': return this.hold = newValue
            case 'once': return this.once = newValue
            case 'radius': return this.radius = newValue
            case 'colors': return this.colors = newValue
            case 'light': return this.light = newValue
            case 'dark': return this.dark = newValue
            case 'noon': return this.noon = newValue
            case 'night': return this.night = newValue
            case 'color-scheme': return this.colorScheme = newValue
            default: this.#set(property, oldValue, newValue)
        }
        this[ property ] = newValue;
    }
    
    
    //#setFn(property, oldValue, newValue) { this.options[property] = new Function(newValue) }
    //#setFn(k, v) { this.options[k] = ((Type.isFn(v)) ? v : (Type.isStr(v) ? new Function(v) : throw new Error(`関数かソースコード文字列のみ有効です。:${v}`))) }
    #setFn(k, v) { console.error(this.id, Type.isFn(v), Type.isStr(v)); this.options[k] = ((Type.isFn(v)) ? v : (Type.isStr(v) ? new Function(v) : (()=>{alert(`関数かソースコード文字列のみ有効です。:${v}`)}))) }
    #setPush(property, oldValue, newValue) { this.options.onPush = new Function(newValue) }
    #setHold(property, oldValue, newValue) { this.options.onHold= new Function(newValue) }
    #setBool(property, oldValue, newValue) { if ('boolean'===typeof newValue) { this[property] = newValue } }
    #set(property, oldValue, newValue) { this[property] = newValue }
    set onpush(fn) { this.options.onPush = fn }
    set onhold(fn) { this.options.onHold = fn }
    set onced(v) { this.options.isOnce = v }
    set once(v) {
        this.onced = true
        const n = parseInt(v)
        this._push.once.time = ((NaN===n) ? 2*1000 : n)
    }
    set hold(v) {
        const n = parseInt(v)
        this._push.hold = ((NaN===n) ? 2*1000 : n)
    }
    set disabled(v) { this._state = ((v) ? this.States.isDisabled : this.States.isFree) }
    get disabled( ) { return (this.States.isDisabled===this._state) }
    set radiused(v) { this._style.border.radius = ((v) ? '10%' : '0px') }
    get radiused( ) { return ('0px'!==this._style.border.radius) }
    set radius(v) { this._style.border.radius = v; }
    set colors(v) {
        const props = ['base','main','accent']
        const [base, main, accent] = ((Type.isStr(v)) ? this.#getColorsStr(v) : ((Type.isObj(v) && props.any(k=>v.hasOwnProperty(k)) ? props.map(k=>v[k]) : [null,null,null])))
        console.log(base, main, accent)
        if (!base || !main || !accent) { return }
        this.baseColor = base
        this.mainColor = main
        this.accentColor = accent
    }
    #getColorsStr(str) {
        for (let delim of [',',';']) {
            if (2===this.#count(str,delim)) { return str.split(delim).map(v=>v.trim()) }
        }
        throw new Error('colorsの値が文字列型の時はbase,main,accentの色をカンマかセミコロンで区切って入力してください。例：#f00,#0f0,#00f')
    }
    #count(s, d) { return (s.match(new RegExp(d, 'g')) || [] ).length }
    set baseColor(v) {this._customColorScheme.base=chroma(v); this._colorScheme=this._customColorScheme; this.#setStyleFree();}
    set mainColor(v) {this._customColorScheme.main=chroma(v); this._colorScheme=this._customColorScheme; this.#setStyleFree();}
    set accentColor(v) {this._customColorScheme.accent=chroma(v); this._colorScheme=this._customColorScheme; this.#setStyleFree();}
    set light(v) { this.colorScheme = 'light' }
    set dark(v) { this.colorScheme = 'dark' }
    set noon(v) { this.colorScheme = 'noon' }
    set night(v) { this.colorScheme = 'night' }
    set colorScheme(v) {
        if (this.constructor.ColorSchemes.hasOwnProperty(v)) {
            //console.error('colorScheme():', v, this.id)
            this._colorScheme = this.constructor.ColorSchemes[v]
            this.#setStyleFree()
        }
    }
    #addEventListener() {
        this.addEventListener('push', async(e)=>{
            console.log(e);
            this.options.onPush(e)
        });
        this.addEventListener('hold', async(e)=>{
            console.log(e);
            this.options.onHold(e)
        });
    }
    #makeAttr() {
        this.classList.add('van-button')
        this.tabIndex = 0 // フォーカス可能にする
        this.onkeydown = (e)=>this.#onKeydown(e)
        this.onkeyup = (e)=>this.#onKeyup(e)
        this.onfocus = (e)=>{console.log('focus');this._device.keyboard.isFocus=true;this.#updateState();}
        this.onblur = (e)=>{console.log('blur');this._device.keyboard.isFocus=false;this.#updateState();}
        this.onmouseenter = (e)=>{console.log('mouseenter');this._device.mouse.isHover=true;this.#updateState();}
        this.onmouseleave = (e)=>{console.log('mouseleave');this._device.mouse.isHover=false;this.#updateState();}
        this.onpointerenter = (e)=>{console.log('pointerenter');this._device.touch.isHover=true;this.#updateState();}
        this.onpointerleave = (e)=>{console.log('pointerleave');this._device.touch.isHover=false;this.#updateState();}
        this.onpointerin = (e)=>{console.log('pointerin');this._device.touch.isHover=true;this.#updateState();}
        this.onpointerout = (e)=>{console.log('pointerout');this._device.touch.isHover=false;this.#updateState();}
        this.onpointerdown = (e)=>{console.log('pointerdown');this.#pushStart();this._device.touch.isTouch=true;this.#updateState();}
        this.onpointerup = (e)=>{console.log('pointerup');this._device.touch.isTouch=false;this.#updateState();this.#onPush(e);}
        this.onpointercancel = (e)=>{console.log('pointercancel');this._device.touch.isTouch=false;this.#updateState();}
        //console.warn(this.style.cssText)
    }
    #pushStart() {
        this._push.start = Date.now()
        this.#setOnceTime('start')
        this.#clearTimeoutHold()
        //this._timeout.hold = setTimeout(()=>this.options.onHold(), this._push.hold)
        this._timeout.hold = setTimeout(()=>this.dispatchEvent(new CustomEvent('hold')), this._push.hold)

    }
    #clearTimeoutHold() { if (this._timeout.hold) { clearTimeout(this._timeout.hold) } }
    #onPush(e) {
        this._push.end = Date.now()
        this.#setOnceTime('end')
        if (this.States.isDisabled===this._state) {
            if (this.options.isOnce) { // disabled時間内に押下するとdisabled解放時間が延長する
                if (this._timeout.disabled) { clearTimeout(this._timeout.disabled); }
                this._timeout.disabled = setTimeout(()=>{ this._state = this.States.isFree; this.#clearOnceTime(); this.#updateState(); }, this._push.once.time)
            }
            return
        }
        if (this.#isHold()) { return }
        this.#clearTimeoutHold(e)
        if (this.options.isOnce) {
            if (this.#isDuplicatePush()) { console.log('%c DuplicatePush!!!!!!!!!!!!!!!!!!', 'background-color: red; color: white;'); return } // 超短時間に２回以上実行要求されたら
            console.log('%c oncePush !!!!!!!!!!!!!!!!!!', 'background-color: green; color: white;')
            this.dispatchEvent(new CustomEvent('push'))// まだ一回しか要求されてない、２回以上要求されたが一定時間以上の間隔がある
            this._state = this.States.isDisabled
            this.#updateState()
            if (this._timeout.disabled) { clearTimeout(this._timeout.disabled); }
            this._timeout.disabled = setTimeout(()=>{ this._state = this.States.isFree; this.#clearOnceTime(); this.#updateState(); }, this._push.once.time)
        } else { this.dispatchEvent(new CustomEvent('push')) }
        this._push.start = Date.now()
        console.log(e)
    }
    #isDuplicatePush() {
        console.log('this._push.once', this._push.once, [this._push.once.first.start, this._push.once.first.end, this._push.once.last.start, this._push.once.last.end].some(v=>v===0), ((this._push.once.last.start - this._push.once.first.end) < this._push.once.time))
        if ([this._push.once.first.start, this._push.once.first.end, this._push.once.last.start, this._push.once.last.end].some(v=>v===0)) { return false }
        return ((this._push.once.last.start - this._push.once.first.end) < this._push.once.time)
    }
    #setOnceTime(se) { // se: 'start'/'end'
        if (0===this._push.once.first[se]) { this._push.once.first[se] = Date.now(); }
        else { this._push.once.last[se] = Date.now() }
        console.log('#setOnceTime(se)', se, this._push.once, (this._push.once.first[se]), (this._push.once.last[se]))
        console.log(this._push.once.first.start, this._push.once.first.end)
        console.log(this._push.once.last.start, this._push.once.last.end)
    }
    #clearOnceTime() {
        this._push.once.first.start = 0
        this._push.once.first.end = 0
        this._push.once.last.start = 0
        this._push.once.last.end = 0
    }
    #isHold() { return (this._push.hold <= this.#pushMs()) }
    #pushMs() { return this._push.end - this._push.start }
    #onKeydown(e) {
        console.log('#onKeydown(e):', e.key, ' '===e.key)
        if      ([' ', 'Enter'].some(k=>k===e.key)) { this.#pushKeyboard(e); }
//        else if ('Enter'===e.key) { this._device.keyboard.isDown = true; this.#updateState(); }
//        else if ('Esc'===e.key) {  }
//        else if ('F1'===e.key) {  }
    }
    #pushKeyboard(e) {
        this._device.keyboard.isDown = true
        if (0===this._device.keyboard.push.start) {
            this._device.keyboard.push.start = Date.now()
            this.#pushStart()
            this.#updateState();
        }
    }
    #releasedKeyboard(e) {
        this._device.keyboard.isDown = false
        this.#updateState()
        this.#onPush(e);
        this._device.keyboard.push.start = 0
    }
    #onKeyup(e) {
        console.log('#onKeyup(e):', e.key)
        if ([' ', 'Enter'].some(k=>k===e.key)) { this.#releasedKeyboard(e); }
    }
    #hasFocus(e) { return (e.target===document.activeElement) }
    #style() { return `user-select:none;cursor:pointer;box-sizing:border-box;${this.#outline()}${this.#border()}${this.#display()}justify-content:center;align-items:center;padding:0;margin:0;color:${this._style.color.fore};background-color:${this._style.color.back};` }
    #display() { return `display:${this._style.display};`; }
    #border() { return `border-width:${this._style.border.width};border-style:${this._style.border.style};border-color:${this._style.border.color};${this.#borderRadius()}` }
    #borderRadius() { return `border-radius:${this._style.border.radius};` }
    #outline() { return `outline-width:${this._style.outline.width};outline-style:${this._style.outline.style};outline-color:${this._style.outline.color};outline-offset:${this._style.outline.offset};` }
    #updateState() {
        if (this.States.isHide===this._state) { }
        else if (this.States.isDisabled===this._state) { }
        else if (this.#isRiveted()) { this._state = ((this.#isDown()) ? this.States.isDown : this.States.isRiveted); }
        else if (this.#isDown()) { this._state = this.States.isDown }
        else { this._state = this.States.isFree; }
        console.log('this._state:', this._state)
        console.log('key:', this._device.keyboard.isFocus, 'pad:', this._device.gamepad.isFocus, 'hov:', this._device.mouse.isHover)
        console.log('key:', this._device.keyboard.isDown, 'pad:', this._device.gamepad.isDown, 'mou:', this._device.mouse.isDown, 'tou:', this._device.touch.isTouch)
        this.#updateStyle()
    }
    #isDown() { return (this._device.keyboard.isDown || this._device.gamepad.isDown || this._device.mouse.isDown || this._device.touch.isTouch) }
    #isRiveted() { return (this._device.keyboard.isFocus || this._device.gamepad.isFocus || this._device.mouse.isHover) }
    #updateStyle() {
        switch (this._state) {
            case this.States.isFree: return this.#setStyleFree()
            case this.States.isHide: return this.#setStyleHide()
            case this.States.isDisabled: return this.#setStyleDisabled()
            case this.States.isRiveted: return this.#setStyleRiveted()
            case this.States.isDown: return this.#setStyleDown()
            case this.States.isLongDown: return this.#setStyleLongDown()
            default: throw new Error('不正な状態です。')
        }
    }
    #setStyleFree() {
        console.log('#setStyleFree()', this._style.color.fore, this._style.color.fore.val)
        this._style.color.fore = this._colorScheme.main.hex() // Css.get('--cs-main')
        this._style.color.back = this._colorScheme.base.hex() // Css.get('--cs-base')
        this._style.border.color = this._style.color.fore
        this._style.outline.has = false
        this._style.outline.color = this._colorScheme.main.hex()
        console.log('fore:', this._style.color.fore)
        console.log('back:', this._style.color.back)
        this.#setStyle()
    }
    #setStyleHide() { this._style.display = 'none'; this.#setStyle(); }
    #setStyleDisabled() {
        this._style.color.fore = chroma.mix(this._colorScheme.main, this._colorScheme.base).hex()
        this._style.color.back = this._colorScheme.base.hex()
        this._style.border.color = this._style.color.fore
        this._style.outline.has = this.#isRiveted()
        this._style.outline.color = this._colorScheme.accent.hex()
        this.#setStyle()
    }
    #setStyleRiveted() {
        console.log('#setStyleRiveted()', this._style.color.fore, this._style.color.fore.val)
        this._style.color.fore = this._colorScheme.base.hex()
        this._style.color.back = this._colorScheme.main.hex()
        this._style.border.color = this._style.color.fore
        this._style.outline.has = true
        this._style.outline.color = this._colorScheme.accent.hex()
        console.log('fore:', this._style.color.fore)
        console.log('back:', this._style.color.back)
        this.#setStyle()
    }
    #setStyleDown() {
        this._style.color.fore = this._colorScheme.accent.hex()
        this._style.color.back = this._colorScheme.base.hex()
        this._style.border.color = this._style.color.fore
        this._style.outline.has = true
        this._style.outline.color = this._colorScheme.main.hex()
        this.#setStyle()
    }
    #setStyleLongDown() {
        this._style.color.fore = this._colorScheme.accent.hex()
        this._style.color.back = this._colorScheme.base.hex()
        this._style.border.color = this._style.color.fore
        this._style.outline.has = true
        this._style.outline.color = this._colorScheme.main.hex()
        this.#setStyle()
    }
    #setStyle() {
        this.style.userSelect = 'none'
        this.style.cursor = 'pointer'
        this.style.display = this._style.display
        this.style.color = this._style.color.fore
        this.style.backgroundColor = this._style.color.back
        this.style.boxSizing = 'border-box'
        this.style.borderWidth = this._style.border.width
        this.style.borderStyle = this._style.border.style
        this.style.borderColor = this._style.border.color
        this.style.borderRadius  = this._style.border.radius
        this.style.outlineWidth = ((this._style.outline.has) ? this._style.outline.width : '0px')
        this.style.outlineStyle = this._style.outline.style
        this.style.outlineColor = this._style.outline.color
        this.style.outlineOffset = this._style.outline.offset
    }
}
customElements.define('van-button', HTMLVanButtonElement);
//window.VanButton = VanButton
window.HTMLVanButtonElement = HTMLVanButtonElement
})()
