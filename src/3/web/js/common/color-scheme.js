(function(){
class ColorScheme {
    constructor() {
        this.fg = van.state('white')
        this.bg = van.state('black')
//        this.lock = van.state('unlock')
//        this.blueLight = van.state('max')
        Css.set('--color', this.fg.val)
        Css.set('--background-color', this.bg.val)
    }
    get isLight() { return this.#isBc(['white','#fff','#ffffff','#ffffffff','rgb(255,255,255)']) }
    get isDark() { return this.#isBc(['black','#000','#000000','#00000000','rgb(0,0,0)']) }
    #isBc(expecteds) { return expecteds.some(expected=>this.bg.val.replace(/\s+/g,'').toLowerCase().startsWith(expected)) }
    toggle() {
        console.log(this.isDark, Css.get('--background-color'))
        if (this.isDark) { this.light() } else { this.dark() }
        //if (this.isDark()) { this.lightMinBlue() } else { this.darkMinBlue() }
    }
    light() {
        this.bg.val = 'white'
        this.fg.val = 'black'
        this.a = '#00f'
        this.selectionFg = '#ff0'
        this.selectionBg = '#000'
        this.aSelectionFg = '#00f'
        this.aSelectionBg = '#ff0'
        this.caret = this.fg.val
        this.outline = this.fg.val
        this.buttonFocusFg = this.bg.val
        this.buttonFocusBg = this.fg.val
        this.#setCss()
    }
    dark() {
        this.bg.val = 'black'
        this.fg.val = 'white'
        this.a = 'yellow'
        this.selectionBg = '#aa0'
        this.selectionFg = '#000'
        this.aSelectionBg = '#aa0'
        this.aSelectionFg = '#008'
        this.caret = this.fg.val
        this.outline = this.fg.val
        this.buttonFocusFg = this.bg.val
        this.buttonFocusBg = this.fg.val
        this.#setCss()
    }
    #setCss() {
        Css.set('--color', this.fg.val)
        Css.set('--em-color', this.fg.val)
        Css.set('--a-color', this.a)
        Css.set('--background-color', this.bg.val)
        Css.set('--selection-color', this.selectionFg)
        Css.set('--selection-background-color', this.selectionBg)
        Css.set('--a-selection-color', this.aSelectionFg)
        Css.set('--a-selection-background-color', this.aSelectionBg)
        Css.set('--caret-color', this.caret)
        Css.set('--outline-color', this.outline)
        Css.set('--button-focus-color', this.buttonFocusFg)
        Css.set('--button-focus-background-color', this.buttonFocusBg)
        console.log(Css.get('--a-color'))
    }
    lightMinBlue() {
        this.fg.val = 'black'
        this.bg.val = 'yellow'
        this.a = 'red'
        this.#setCss()
    }
    darkMinBlue() {
        this.fg.val = 'yellow'
        this.bg.val = 'black'
        this.a = 'green'
    }
    // click: 白黒
    // long-click: 青光[軽減／非軽減]  青[有無]
    // long-click: lock（clickで切り替わらなくなる。長押しするたびにロック／解除を切替 🔓🔒🔑）
    // long-click: サブメニュー（hjkli;）
    // softLight/softDark
    // b キー押下: 青光[軽減／非軽減]  青[有無] ＋青　➖青
    // l キー押下: lock（clickで切り替わらなくなる。長押しするたびにロック／解除を切替 🔓🔒🔑）
}
window.colorScheme = new ColorScheme()
})()
