(function(){
class IntlJa {
    constructor() { this._wa = null; this._iso = null; }
    get wa() { // IntlJa.wa.format(date) // 令和2年12月20日日曜日 12時23分16秒 日本標準時
        if (!this._wa) { this._wa = Intl.DateTimeFormat('ja-JP',{dateStyle:'full',timeStyle:'full',timeZone:'Asia/Tokyo',calendar:'japanese'}) }
        return this._wa
    }
    get iso() { // INtlJa.iso.format(date) // 2020/12/20 12:23:16
        if (!this._iso) { this._iso = Intl.DateTimeFormat('ja-JP',{dateStyle:'medium',timeStyle:'medium',timeZone:'Asia/Tokyo'}) }
        return this._iso
    }
}
window.IntlJa = new IntlJa()
})()
