class VanButtonParser extends UiParser {
    constructor(types='van-button', tagName='van-button', attrs={}, valueKind=UiParser.ValueKinds.ButtonLike) { super(types, tagName, attrs, valueKind) }
//    match(type, v) { return super.match(type, 'van-button') }
//    getTag(type) { return {tagName:'van-button', attrs:{}} }
    makeTag(col, tag) {
        tag = super.makeTag(col, tag) // JSON.parse()では関数型に変換できないので以下処理を行う（onpush,onhold）
        //tag.attrs.value = this.#newLine((column.value || column.label || ''))
        for (let [key, type] of Object.entries(HTMLVanButtonElement.ATTRS)) {
            if (!tag.attrs.hasOwnProperty(key)) { continue }
            tag.attrs[key] = Type.to(type, tag.attrs[key])
        }
        return tag
    }
    makeEl(col, tag) { // UiParser.make(col,tag)では
        const el = document.createElement('van-button')
        const ATTRS = Array.from(Object.entries(tag.attrs))
        const KEYS = Array.from(Object.keys(tag.attrs))
        console.log(col, tag, Object.keys(tag.attrs))
        for (let [k,type] of ATTRS) {
            if (KEYS.some(a=>a===k)) { el[((-1===k.indexOf('-')) ? k : k.Camel)] = tag.attrs[k] }
            else { el.setAttribute(k, tag.attrs[k]) }
        }
        el.innerText = ((col.value) ? col.value : ((col.label) ? col.label : ''))
        console.log(el)
        return el
    }
}
