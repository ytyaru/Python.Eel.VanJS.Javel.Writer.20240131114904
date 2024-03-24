(function(){
class Tsv {
    get DELIM() { return '\t' }
    load(tsv, hasNotHeader) {
        tsv = tsv.trimLine()
        tsv = ((hasNotHeader) ? tsv : this.#removeHeader(tsv))
        const lines = tsv.split(/\r?\n/)
        return lines.map(line=>this.line(line))
    }
    line(line) { return line.split(this.DELIM) }
    countCols(line) { return line.count(this.DELIM) + 1 }
    countLines(tsv) { return line.count('\n') + 1 }
    #removeHeader(text) { const i=text.indexOf('\n'); return ((-1===i) ? text : text.substr(i+1)); }
}
class _TsvHeader {
    get(lang='en', isLong=false) { return (('ja'===lang) ? this.getJa(isLong) : this.getEn(isLong)) }
    getEn(isLong=false) {
        if (isLong) { return ['sceneId','elementId','type','label','placeholder','value,min,max,step','datalist','attributes'].join('\t') }
        return ['sid','eid','type','label','placeholder','value','datalist','attrs'].join('\t')
    }
    getJa(isLong=false) {
        if (isLong) { return ['画面ID','要素ID','型','ラベル','プレースホルダ','値,最小値,最大値,刻値','データリスト','他属性'].join('\t') }
        return ['画面ID','要素ID','型','ラベル','プレースホルダ','値','データリスト','他属性'].join('\t')
    }
}
const TsvHeader = new _TsvHeader()

class TsvSample {
    get header() { return TsvHeader }
    get(lang='en', isLong=false) { return TsvHeader.get(lang,isLong) + `
dl-ex	description	textarea	説明	説明。		["候補１(無効)","候補２(無効)"]	
dl-ex	category	select	カテゴリ		key2	{"key1":"label-1", "groupValue":{"key2":"label-2"}}	
dl-ex	title	text	タイトル	表題		["候補１","候補２"]	
dl-ex	search	search	検索	検索キーワード		["候補１","候補２"]	
dl-ex	url	url	URL	https://domain.com/		["候補１","候補２"]	
dl-ex	tel	tel	電話番号	00000000000		["候補１","候補２"]	
dl-ex	password	password	パスワード	見せられないよ！		["候補１(無効)","候補２(無効)"]	
dl-ex	even	number	偶数	0	0,0,100,2	[0,25,50,75,100]	
dl-ex	odd	range	奇数	0	0,1,99,2	[1,24,49,74,99]	
dl-ex	datetime	datetime	日時			["1999-12-31T23:59:59","2000-01-01T00:00:00"]	
dl-ex	date	date	日付			["1999-12-31","2000-01-01"]	
dl-ex	month	month	月			["1999-12","2000-01"]	
dl-ex	week	week	週			["1999-W52","2000-W01"]	
dl-ex	time	time	時刻			["00:00","23:59"]	
dl-ex	color	color	色			["#ff0000","#00ff00","#0000ff"]	
dl-ex	file	file	ファイル			["候補１(無効)","候補２(無効)"]	
dl-ex	sex	radio	性別		{"male":"男", "female":"女"}		
dl-ex	isMan	check	人間か		true		
dl-ex	editor	div	エディタ				{"tabindex":0, "contenteditable":true}
dl-ex	viewer	div	ビューア				{"tabindex":0}
dl-ex	save	button			JSONファイルダウンロード		
    `}
}
class SceneMap {
    constructor() {
        this._map = new Map()
        this._tsv = new Tsv()
        this._keys = this._tsv.line(TsvHeader.get())
    }
    loadTsv(tsv, hasNotHeader) {
        tsv = this._tsv.load(tsv, hasNotHeader)
        for (let line of tsv) { this.add(...line) }
    }
    addElsTsv(sid, tsv) {
        tsv = this._tsv.load(tsv, hasNotHeader)
        for (let line of tsv) { this.add(sid, ...line) }
    }
    has(sid, eid) {
        if (sid && eid) { return (this._map.has(sid) && this._map.get(sid).uiMap.has(eid)) }
        else if (sid) { return this._map.has(sid) }
        return false
    }
    add(sid, eid, type, label, placeholder, value, datalist, attrs) {
        const col = this.#line(sid, eid, type, label, placeholder, value, datalist, attrs)
        if (this._map.has(sid)) { this._map.get(sid).uiMap.set(eid, {col:col}) }
        else { this._map.set(sid, {uiMap:new Map([[eid, ({col:col})]]), make:SceneMakeHelper.table}) }
    }
    set(sid, eid, type, label, placeholder, value, datalist, attrs) {
        const col = this.#line(sid, eid, type, label, placeholder, value, datalist, attrs)
        if (this._map.has(sid)) { this._map.get(sid).uiMap.set(eid, {col:col}) }
        else { this._map.add(sid, {uiMap:new Map([[eid, ({col:col})]]), make:SceneMakeHelper.table}) }
    }
    get(sid, eid) {
        if (sid && eid) { return this._map.get(sid).uiMap.get(eid) }
        else if (sid) { return this._map.get(sid) }
        return this._map
    }
    del(sid, eid) {
        if (sid && eid) { return this._map.get(sid).uiMap.delete(eid) }
        else if (sid) { return this._map.delete(sid) }
        return this._map.clear()
    }
    clear() { this._map.clear() }
    #line(sid, eid, type, label, placeholder, value, datalist, attrs) {
        if (eid===undefined) {
                 if (Type.isAry(sid)) { return this.#array(sid) }
            else if (Type.isStr(sid)) { return this.#string(sid) }
            else if (Type.isObj(sid)) { return this.#object(sid) }
        }
        if (undefined!==sid && undefined!==eid && undefined!==type && undefined!==label && undefined!==placeholder && undefined!==value && undefined!==datalist && undefined!==attrs) {
            return {sid:sid, eid:eid, type:type, label:label, placeholder:placeholder, value:value, datalist:datalist, attrs:attrs}
        }
        throw new Error(`入力値不足により中断します。UIを追加するとき引数値は${this._keys.length}個必要です。その内容と順序は${this._keys}です。型は文字列、配列、オブジェクト、関数引数のいずれかです。しかし与えられた引数には不足があるようです。その内容は ${sid}, ${eid}, ${type}, ${label}, ${playceholder}, ${value}, ${datalist}, ${attrs} でした。`)
    }
    #string(str) {
        const count = this._tsv.countCols(str)
        if (count < this._keys.length) { throw new Error(`入力値不足により中断します。文字列型をセットするとき、要素数は${this._keys.length}個必要です。要素を区切る文字はTabです。しかし与えられた値にはTabが${count}個しかありませんでした。その内容は ${str} でした。`) }
        return this.#array(this._tsv.line(str))
    }
    #array(ary) {
        if (ary.length < this._keys.length) { throw new Error(`入力値不足により中断します。配列型をセットするとき、要素数は${this._keys.length}個必要です。その内容と順序は ${this._keys} です。しかし与えられた値は${ary.length}個しかありませんでした。その内容は ${ary} でした。`) }
        return this._keys.reduce((obj, k, i) => { obj[k] = ary[i]; return obj; }, {})
    }
    #object(obj) {
        for (let k of this._keys) {
            if (!obj.hasOwnProperty(k)) { throw new Error(`入力値不足により中断します。オブジェクト型をセットするとき、次のプロパティキーを持っているべきです。${this._keys}。しかし与えられた値には ${k} がありませんでした。その内容は ${obj} でした。`) }
        }
        return obj
    }
}
class SceneMakeHelper {
    static table(uiMap, sid) {
        return van.tags.table(
            van.tags.caption(sid),
            Array.from(uiMap.entries()).map(([eid, e])=>{
                return van.tags.tr(van.tags.th(e.col.label), van.tags.td(e.dom.el, e.dom.dl))
            })
        )
    }
}
class UiMaker {
    constructor(map) {
        this._map = map // new SceneMap()
        this._parsers = new TsvTypeParsers()
    }
    get Parsers() { return this._parsers }
    load(tsv, hasNotHeader) { this._map.loadTsv(tsv, hasNotHeader) }
    make() {
        for (let [sid, uiMap] of this._map.get()) {
            for (let [eid, uiObj] of uiMap) {
                const obj = this._map.get(sid, eid)
                obj.parser = this._parsers.get(obj.col.type)
                obj.tag = obj.parser.makeTag(obj.col, this._parsers.makeTag(obj.col))
                obj.dom = {el:obj.parser.makeEl(obj.col,obj.tag), dl:obj.parser.makeDl(obj.col,obj.tag), lb:obj.parser.makeLb(obj.col,obj.tag)}
            }
        }
    }
    makeTags() {
        for (let [sid, s] of this._map.get()) {
            for (let [eid, uiObj] of s.uiMap) {
                const obj = this._map.get(sid, eid)
                console.log(obj)
                obj.parser = this._parsers.get(obj.col.type)
                console.log(obj, this._parsers, obj.col.type, this._parsers.get(obj.col.type))
                obj.tag = obj.parser.makeTag(obj.col, this._parsers.makeTag(obj.col))
            }
        }
    }
    makeDoms() {
        for (let [sid, s] of this._map.get()) {
            for (let [eid, uiObj] of s.uiMap) {
                const obj = this._map.get(sid, eid)
                if (!obj.hasOwnProperty('parser') || !obj.hasOwnProperty('tag')) { this.makeTag(sid, eid) }
                obj.dom = {
                    el: obj.parser.makeEl(obj.col, obj.tag), 
                    dl: obj.parser.makeDl(obj.col, obj.tag), 
                    lb: obj.parser.makeLb(obj.col, obj.tag),
                }
                console.log(obj.dom)
            }
        }
    }
    makeTag(sid, eid) {
        console.log(sid, eid)
        const obj = this._map.get(sid, eid)
        console.log(obj)
        const parser = this._parsers.get(obj.col.type)
        const tag = parser.makeTag(obj.col, this._parsers.makeTag(obj.col))
        obj.parser = parser
        obj.tag = tag
        return obj.tag
    }
    makeDom(sid, eid) {
        const obj = this._map.get(sid, eid)
        if (!obj.hasOwnProperty('parser') || !obj.hasOwnProperty('tag')) { this.makeTag(sid, eid) }
        obj.dom = {
            el: obj.parser.makeEl(obj.col, obj.tag), 
            dl: obj.parser.makeDl(obj.col, obj.tag), 
            lb: obj.parser.makeLb(obj.col, obj.tag),
        }
        console.log(obj.dom.el, obj.parser)
        return obj.dom
    }
}
class TsvTypeParsers {
    constructor() {
        this._parsers = []
        this.#addDefaultParser()
    }
    #addDefaultParser() {
        this.add(new TextParser())
        this.add(new UrlParser())
        this.add(new SearchParser())
        this.add(new TelParser())
        this.add(new PasswordParser())
        this.add(new NumberParser())
        this.add(new RangeParser())
        this.add(new DateTimeParser())
        this.add(new DateParser())
        this.add(new TimeParser())
        this.add(new MonthParser())
        this.add(new WeekParser())
        this.add(new ColorParser())
        this.add(new FileParser())
        this.add(new RadioParser())
        this.add(new CheckboxParser())
        this.add(new ButtonParser())
        this.add(new SubmitButtonParser())
        this.add(new ResetButtonParser())
        this.add(new ImageButtonParser())
        this.add(new SelectParser())
        this.add(new TextareaParser())
    }
    #matchParser(types) { return this._parsers.filter(p=>p.match(type)) }
    add(parser) {
        console.log(parser.constructor.name, ':', parser instanceof UiParser)
        if (parser instanceof UiParser) {
            console.log(this._parsers)
            const parsers = this._parsers.filter(p=>p.match(parser.types))
            console.log(parsers, parser.types, parser)
            if (0 < parsers.length) { throw new Error(`重複エラー。引数は既存TsvUiTypeのtype名と重複します。: ${parsers.types}`) }
            else if (1 < parsers.length) { throw new Error(`重複エラー。すでに重複したパーサがあります。: ${parsers.length} : ${parsers.map(p=>p._types)}`) }
            this._parsers.push(parser)
        } else { throw new Error(`型エラー。引数はTsvUiType型であるべきです。`) }
    }
    get(type) {
        const parsers = this._parsers.filter(p=>p.match(type))
        if      (1===parsers.length) { return parsers[0] }
        else if (0===parsers.length) { // 標準HTML要素を返すパーサを動的生成する
            const parser = this.#makeStandeardHtmlParser(type)
            if (parser) { return parser } 
            throw new Error(`指定されたtype ${type} に該当するパーサが取得できませんでした。`)
        }
        else { throw new Error(`論理エラー。一意であるべきなのに複数あります。`) }
    }
    #makeStandeardHtmlParser(type) { return ((this.#getStandeardHtmlNames().some(n=>n===type)) ? new UiParser(type, type, {}) : null) }
    #getStandeardHtmlNames() { return 'a,abbr,address,area,article,aside,audio,b,base,bdi,bdo,blockquote,body,br,button,canvas,caption,cite,code,col,colgroup,data,datalist,dd,del,details,dfn,dialog,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,head,header,hgroup,hr,html,i,iframe,img,input,ins,kbd,label,legend,li,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,optgroup,option,output,p,picture,portal,pre,progress,q,rp,rt,ruby,s,samp,script,search,section,select,slot,small,source,span,strong,style,sub,summary,sup,table,tbody,td,template,textarea,tfoot,th,thead,time,title,tr,track,u,ul,var,video,wbr'.split(',') }
    makeTag(column) {
        const parser = this.get(column.type)
        const tag = parser.getTag(column.type)
        console.log(tag)
        if (!Type.isObj(tag)) { throw new Error(`parser.fromType(type)はオブジェクト型を返すべきです。:${typeof tag}: ${obj}`) }
        tag.datalist = ((column.datalist) ? JSON.parse(column.datalist) : null)
        tag.attrs = {...tag.attrs, ...((column.attrs) ? JSON.parse(column.attrs) : ({}))}
        tag.attrs.id = `${column.sid.Chain}-${column.eid.Chain}`
        tag.attrs.name = column.eid.Camel
        tag.attrs.placeholder = column.placeholder.replace(/\\n/g, '\n')
        tag.attrs['data-sid'] = column.sid.Chain
        tag.attrs['data-eid'] = column.eid.Chain
        this.#setValue(column, tag, parser)
        this.#setList(tag)
        return parser.makeTag(column, tag)
    }
    #setValue(column, tag, parser) {
        if ('input'===tag.tagName && 'file'===tag.attrs.type || UiParser.ValueKinds.None===parser.valueKind) { return }
        else if (this.#isButton(tag.tagName, tag.attrs) || UiParser.ValueKinds.ButtonLike===parser.valueKind) {
            const v = this.#newLine((column.value || column.label || ''))
            tag.attrs.value = v
            tag.children.push(v)
        }
        else if (tag.attrs.hasOwnProperty('contenteditable') || UiParser.ValueKinds.Children===parser.valueKind) { tag.children = this.#newLine(column.value) }
        tag.attrs.value = this.#newLine(column.value)
    }
    #isButton(tagName, attrs) { return ('button'===tagName || ('input'===tagName && 'button,submit,reset,image'.split(',').some(a=>a===attrs.type))) }
    #newLine(str) { return str.replace(/\\n/g, '\n') }
    #setList(tag) {
        if (!tag.datalist) { return }
        if ('input'!==tag.tagName) { return }
        if ('hidden,password,checkbox,radio'.split(',').some(v=>v===tag.attrs.type)) { return }
        tag.attrs.list = `${tag.attrs['data-sid']}-${tag.attrs['data-eid']}-list`
    }
    makeEl(col, tag) {
        const parser = this.get(col.type)
        return parser.makeEl(col, tag)
    }
}
class UiParser {
    static ValueKinds = {
        'None': 0,
        'Attr': 1,
        'ButtonLike': 2,
        'Children': 3,
    }
    constructor(types, tagName, attrs, valueKind=UiParser.ValueKinds.Attr) {
        this._types = types
        this._tagName = tagName
        this._attrs = attrs
        this._valueKind = valueKind
        if (!(Type.isStr(this._types) || Type.isStrs(this._types))) { throw new Error(`typesは文字列かその配列のみ受け付けます。配列の場合は短縮名などを複数指定したい時に指定します。: ${this._types}`) }
    }
    get types() { return this._types }
    get tagName() { return this._tagName }
    get attrs() { return this._attrs }
    get valueKind() { return this._valueKind }
    match(type) {
             if (Type.isStr (type) && Type.isStr (this._types)) { return this._types===type }
        else if (Type.isStr (type) && Type.isStrs(this._types)) { return this._types.some(t=>t===type) }
        else if (Type.isStrs(type) && Type.isStr (this._types)) { return type.some(t=>t===this._types) }
        else if (Type.isStrs(type) && Type.isStrs(this._types)) {
            for (let typ of type) {
                for (let t of this._types) {
                    if (t===typ) { return true }
                }
            }
            return false
        }
        throw new Error(`引数typeは文字列または文字列の配列であるべきです。:${typeof type}: ${type}`)

    }
    getTag(type) { return {tagName:this.tagName, attrs:this.attrs, children:[]} }
    makeTag(col, tag) { console.log(tag); return tag }
    makeEl(col, tag) { return ((this.#hasVanTags(tag)) ? this.#makeElVan(tag) : this.#makeElStd(tag)) }
    #hasVanTags(tag) { return (van.tags.hasOwnProperty(tag.tagName) && Type.isFn(van.tags[tag.tagName])) }
    #makeElVan(tag) { return van.tags[tag.tagName](tag.attrs, tag.children) }
    #makeElStd(tag) {
        const el = document.createElement(tag.tagName)
        for (let [k,v] of Object.entries(tag.attrs)) {
            if (el.hasOwnProperty(k)) { el[k] = v }
            else { el.setAttribute(k, v) }
        }
        
        el.append(...tag.children)
        return el
    }
    makeDl(col, tag) {
        const types = 'text,search,url,tel,email,number,month,week,date,time,datetime,datetime-local,range,color,password'.split(',')
        if (!tag.datalist) { return null }
        if ('select'===tag.tagName || ('input'===tag.tagName && 'radio'===tag.attrs.type)) { return } // TSVのdatalist列に候補値をセットするが、それぞれoptionやvalueの値であってdatalistではないため対象外
        if (!('input'===tag.tagName && types.some(t=>t===tag.attrs.type))) { console.warn(`datalist非対応要素のため作成しません。対応しているのはinput要素のうちtypeが${types}のいずれかのみです。: ${tag.tagName} ${tag.attrs.type}`); return null; }
        if (!Type.isArray(tag.datalist)) { console.warn(`datalistのデータが配列でないので作成を中断しました。`, col, tag); return null }
        return van.tags.datalist({id:tag.attrs.list}, tag.datalist.map(v=>van.tags.option({value:v})))
    }
    makeLb(col, tag) {
        const attrs = (('input'===tag.tagName && ['radio','checkbox'].some(v=>v===tag.attrs.type)) ? ({}) : ({for:tag.attrs.id}))
        return van.tags.label(attrs, col.label)
    }
}
class TextParser extends UiParser { constructor(types='text', tagName='input', attrs={type:'text'}, valueKind=UiParser.ValueKinds.Attr) { super(types, tagName, attrs, valueKind) } }
class UrlParser extends UiParser { constructor(types='url', tagName='input', attrs={type:'url'}, valueKind=UiParser.ValueKinds.Attr) { super(types, tagName, attrs, valueKind) } }
class TelParser extends UiParser { constructor(types='tel', tagName='input', attrs={type:'tel'}, valueKind=UiParser.ValueKinds.Attr) { super(types, tagName, attrs, valueKind) } }
class SearchParser extends UiParser { constructor(types='search', tagName='input', attrs={type:'search'}, valueKind=UiParser.ValueKinds.Attr) { super(types, tagName, attrs, valueKind) } }
class PasswordParser extends UiParser { constructor(types='password', tagName='input', attrs={type:'password'}, valueKind=UiParser.ValueKinds.Attr) { super(types, tagName, attrs, valueKind) } }
class NumberParser extends UiParser {
    constructor(types='number',tagName='input',attrs={type:'number'},valueKind=UiParser.ValueKinds.Attr) { super(types,tagName,attrs,valueKind) }
    makeTag(col, tag) {
        tag = super.makeTag(col, tag)
        const [value, min, max, step] = col.value.split(',')
        const vals = JSON.stringify({value, min, max, step})
        for (let attr of ['value','min','max','step']) {
            const n = Number(vals[attr])
            if (!isNaN(n)) { tag.attrs[attr] = n }
        }
        return tag
    }
}
class RangeParser extends NumberParser { constructor(types='range', tagName='input', attrs={type:'range'}, valueKind=UiParser.ValueKinds.Attr) { super(types, tagName, attrs, valueKind) } }
class DateTimeParser extends UiParser { constructor(types=['datetime-local','datetime'], tagName='input', attrs={type:'datetime-local'}, valueKind=UiParser.ValueKinds.Attr) { super(types, tagName, attrs, valueKind) } }
class DateParser extends UiParser { constructor(types='date', tagName='input', attrs={type:'date'}, valueKind=UiParser.ValueKinds.Attr) { super(types, tagName, attrs, valueKind) } }
class TimeParser extends UiParser { constructor(types='time', tagName='input', attrs={type:'time'}, valueKind=UiParser.ValueKinds.Attr) { super(types, tagName, attrs, valueKind) } }
class MonthParser extends UiParser { constructor(types='month', tagName='input', attrs={type:'month'}, valueKind=UiParser.ValueKinds.Attr) { super(types, tagName, attrs, valueKind) } }
class WeekParser extends UiParser { constructor(types='week', tagName='input', attrs={type:'week'}, valueKind=UiParser.ValueKinds.Attr) { super(types, tagName, attrs, valueKind) } }
class ColorParser extends UiParser { constructor(types='color', tagName='input', attrs={type:'color'}, valueKind=UiParser.ValueKinds.Attr) { super(types, tagName, attrs, valueKind) } }
class FileParser extends UiParser { constructor(types='file', tagName='input', attrs={type:'file'}, valueKind=UiParser.ValueKinds.Attr) { super(types, tagName, attrs, valueKind) } }
class RadioParser extends UiParser {
    constructor(types='radio', tagName='input', attrs={type:'radio'}, valueKind=UiParser.ValueKinds.Attr) { super(types, tagName, attrs, valueKind) }
    makeEl(col, tag) {
        console.log(col.datalist)
        const valueLabelObj = JSON.parse(col.datalist)
        // [<label><input>] attrsを共用する。複数のラジオボタンで。けどそれは困るのでディープコピーした。
        return Array.from(Object.entries(valueLabelObj)).map(([k,v])=>{const att=JSON.parse(JSON.stringify(tag.attrs));console.log(k,v,att.id);att.name=`${att['data-sid']}-${att['data-eid']}`;att.value=k;att.id+='-'+k.Chain;att.checked=(col.value===k);return van.tags.label(van.tags.input(att), v);})
    }
}
class CheckboxParser extends UiParser {
    constructor(types=['checkbox','check'], tagName='input', attrs={type:'checkbox'}, valueKind=UiParser.ValueKinds.Attr) { super(types, tagName, attrs, valueKind) }
    makeEl(col, tag) {
        tag.attrs.checked = ['true','1','checked'].some(v=>v===tag.attrs.value)
        tag.attrs.value = null
        console.log(tag.attrs, col.label)
        return van.tags.label(van.tags.input(tag.attrs), col.label)
    }
}
class ButtonParser extends UiParser { constructor(types='button', tagName='button', attrs={type:'button'}, valueKind=UiParser.ValueKinds.ButtonLike) { super(types, tagName, attrs, valueKind) } }
class SubmitButtonParser extends UiParser { constructor(types='submit', tagName='button', attrs={type:'submit'}, valueKind=UiParser.ValueKinds.ButtonLike) { super(types, tagName, attrs, valueKind) } }
class ResetButtonParser extends UiParser { constructor(types='reset', tagName='button', attrs={type:'reset'}, valueKind=UiParser.ValueKinds.ButtonLike) { super(types, tagName, attrs, valueKind) } }
class ImageButtonParser extends UiParser {
    constructor(types='image', tagName='button', attrs={type:'image'}, valueKind=UiParser.ValueKinds.ButtonLike) { super(types, tagName, attrs, valueKind) }
    makeEl(col, tag) {
        const el = super.makeEl(col, tag)
        const img = document.createElement('img')
        img.src = tag.attrs.value
        el.appendChild(img)
        return el
    }
}
class SelectParser extends UiParser {
    constructor(types='select', tagName='select', attrs={}, valueKind=UiParser.ValueKinds.Attr) { super(types, tagName, attrs, valueKind) }
    makeEl(col, tag) {
        const el = super.makeEl(col, tag)
        if (!Type.isObj(tag.datalist)) { console.warn(`select要素のoption要素がありませんが、空のselect要素を作成します。option設定はTSVのdatalist列にJSONを指定してください。値は{"opt-val-1":"label-1", "optgroup-label-2":{"opt-val-2-1":"label-2-1"}}のようにしてください。これは<option value="opt-val-1">label-1</option><optgroup label="optgroup-label-2"><option value="opt-val-2-1">label-2-1</option></optgroup>のようになります。`); return el; }
        van.add(el, this.#makeOptions(tag.datalist, col.value))
        return el
    }
    #makeOptionGroup(label, valueLabelObj, value) { console.log(label, valueLabelObj);return van.tags.optgroup({label:label}, this.#makeOptions(valueLabelObj, value)) }
    #makeOptions(valueLabelObj, value) { console.log(valueLabelObj, value); return Array.from(Object.entries(valueLabelObj)).map(([k,v])=>{console.log(k,v,value);return ((Type.isStr(v)) ? van.tags.option({value:k, selected:(k===value)}, v) : this.#makeOptionGroup(k, v, value))}) }
}
class TextareaParser extends UiParser { constructor(types=['textarea','area'], tagName='textarea', attrs={}, valueKind=UiParser.ValueKinds.Attr) { super(types, tagName, attrs, valueKind) } }
class SceneBuilder {
    constructor(map) {
        this._map = map // new SceneMap()
        this._uiMaker = new UiMaker(this._map)
    }
    get Map() { return this._map }
    get UiMaker() { return this._uiMaker }
    setAttr(sid, eid, key, value) { if (this._map.has(sid, eid)) { this._map.get(sid, eid).tag.attrs[key] = value } else { throw new Error(`存在しないキーです。:sid:${sid}, eid:${eid}`) }  }
    setChildren(sid, eid, children) {
        if (!Type.isAry(children)) { throw new Error(`setChildrenの第三引数はHTML要素またはそれを返す関数の配列であるべきです。:${typeof children}, ${children}`) }
        if (!this._map.has(sid, eid)) { throw new Error(`存在しないキーです。:sid:${sid}, eid:${eid}`) }
        this._map.get(sid, eid).tag.children = children
    }
    addChild(sid, eid, child) {
        if (!(Type.isEl(child) || Type.isFn(child) || Type.isStr(child))) { throw new Error(`addChildの第三引数はHTML要素、それを返す関数、文字列のいずれかであるべきです。:${typeof value}, ${value}`) }
        if (!this._map.has(sid, eid)) { throw new Error(`存在しないキーです。:sid:${sid}, eid:${eid}`) }
        console.log(this._map.get(sid, eid).tag)
        this._map.get(sid, eid).tag.children.push(child)
    } 
    margeAttrs(sid, eid, attrs) { this._map.get(sid, eid).tag.attrs[key] = ({...this._map.get(sid, eid).obj.attrs[key], ...attrs}) }
    setMake(sid, fn) {
        this.#makeDoms(sid)
        this._map.get(sid).make = fn
    }
    makeAll() {
        const scenes = []
        for (let [sid, s] of this._map.get()) {
            for (let [eid, e] of s.uiMap) {
                this.#makeDom(sid, eid, e)
            }
            const scene = ((Type.isFunction(s.make)) ? s.make(s.uiMap, sid) : SceneMakeHelper.table(s.uiMap, sid))
            scene.dataset.sceneId = sid
            scenes.push(scene)
        }
        return scenes
    }
    #makeDoms(sid) { for (let [eid, e] of this._map.get(sid).uiMap) { this.#makeDom(sid, eid, e) } }
    #makeDom(sid, eid, e) {
        console.log(sid, eid, e)
        if (!e.hasOwnProperty('dom')) { e.dom = this.UiMaker.makeDom(sid, eid) }
        else if (e.hasOwnProperty('dom') && !e.dom) { e.dom = this.UiMaker.makeDom(sid, eid) }
        console.log(sid, eid, e)
    }
    getEl(sid) { if (sid) { return document.querySelector(`*[data-scene-id="${sid}"]`) } }
}
class SceneTransitioner {
    constructor(builder) { // SceneMap instance
        this._builder = builder
        this._now = null
        this._mode = {dir:0, loopMethod:0}
        this._seq = new MapSequence(this._builder.Map.get(), 0)
        this._fn = null
        this._dispMap = new Map()
        console.log(this._map)
    }
    set onSelected(v) { if (Type.isFunction(v)) { this._fn = v } }
    get nowId() { return this._now }
    get nowEl() { return document.querySelector(this._now) }
    init(sid) { this.#addAll(sid) }
    #addAll(sid) {
        van.add(document.body, this._builder.makeAll())
        this.#initDisp()
        this.#hideAll()
        this.select(sid)
    }
    select(sid) {
        if (!this._builder.Map.get().has(sid)) { sid = this._builder.Map.get().entries().next().value[0] } // sidが未指定なら最初の画面を選択する
        console.log(`select(): sid=${sid}`, this._fn, Type.isFunction(this._fn))
        this._now = sid
        this._seq.key = sid
        this.#hideAll()
        this.#show(sid)
        if (Type.isFunction(this._fn)) { this._fn(sid) }
        FocusLoop.sid = sid
    }
    move() {
        const [i, k, v] = this._seq.next()
        this.select(k)
    }
    first() { this.select(this._seq.first()[1]) }
    last() { this.select(this._seq.last()[1]) }
    #initDisp() { for (let [sid,v] of this._builder.Map.get()) { const d=Css.get('display',this._builder.getEl(sid)); this._dispMap.set(sid, ((d) ? d : 'block')); } }
    #hideAll() { for (let [sid,v] of this._builder.Map.get()) { this.#hide(sid) } }
    #hide(sid) { this.#setDisp(sid, false) }
    #show(sid) { this.#setDisp(sid, true) }
    #setDisp(sid, isShow) { const el=this._builder.getEl(sid); if (el) {el.style.setProperty('display', ((isShow) ? this._dispMap.get(sid) : 'none'))} }
}
class SceneStore { // 入力要素の値を取得・設定する
    constructor(sceneMap) { this._map = sceneMap.get() } // sceneMap: SceneMap instance
    get(sid) { return EV2Obj.get(this._map, sid) } // {sid:{eid:value, ...}, ...}
    set(obj) { return Obj2EV.set(obj) } // obj:{sid:{eid:value, ...}, ...}
}
class EV2Obj { // 要素の値をオブジェクトに変換する
    static get(map, sid) { // {sid:{eid:value, ...}, ...}
        console.log(map, sid)
        const json = {}
        if (sid) { return this.#jsonScene(map, sid) }
        console.log(this._map)
        for (let [sid, s] of map.entries()) {
            json[sid] = this.#evs(sid, s.uiMap)
        }
        return json
    }
    static #jsonScene(map, sid) { return this.#evs(sid, map.get(sid).uiMap) }
    static #evs(sid, uiMap) {
        const els = Array.from(uiMap.entries()).map(([eid,e])=>{
            const el = document.querySelector(`[data-sid="${sid.Chain}"][data-eid="${eid.Chain}"]`)
            if (!el) { return ({'null':null}) }
            if (!('jsonValue' in el)) { return ({'null':null}) }
            if (undefined===el.jsonValue) { return ({'null':null}) }
            return ({[eid]:el.jsonValue})
        })
        const obj = Object.assign(...els)
        if (obj.hasOwnProperty('null') && null===obj.null) { delete obj.null }
        return obj
    }
    //static #evs(sid, uiMap) { return this.#pickBy(Object.assign(...Array.from(uiMap.entries()).map(([eid,e])=>{console.log(sid,eid);return ({[eid]:document.querySelector(`[data-sid="${sid.Chain}"][data-eid="${eid.Chain}"]`).jsonValue})}))) }
    //static #pickBy(obj) { return Object.assign(...Array.from(Object.entries(obj)).filter(([k,v])=>(undefined!==v)).map(([k,v])=>({[k]:v})))}
}
class Obj2EV { // オブジェクトを要素の値に設定する
    static set(obj) {
        for (let [sid, s] of Object.entries(obj)) {
            for (let [eid, value] of Object.entries(s)) {
                document.querySelector(`[data-sid="${sid.Chain}"][data-eid="${eid.Chain}"]`).jsonValue = obj[sid][eid]
            }
        }
    }
}
class Scene {
    constructor() {
        this._tsv = new TsvSample()
        this._map = new SceneMap()
        this._builder = new SceneBuilder(this._map)
        this._trans = null
        this._store = null
    }
    get Tsv() { return this._tsv }
    get Builder() { return this._builder } // .Map, .UiMaker.Parsers.add()
    get Transitioner() { return this._trans }
    get Store() { return this._store }
    get UiMakeExtend() { return UiMakeExtend }
    get MakeHelper() { return SceneMakeHelper }
    static get _MakeHelper() { return SceneMakeHelper }
    init(tsv, isHeaderTrim) {
        if (Type.isStr(tsv)) { this._map.loadTsv(tsv, isHeaderTrim) }
        this._builder.UiMaker.makeTags() 
        this._trans = new SceneTransitioner(this._builder)
        this._store = new SceneStore(this._map)
    }
    addBody() { this._trans.init() }
}
window.Scene = Scene
window.UiParser = UiParser 
})()
