(function(){
class AuthorState {
    constructor() {
        this.name = van.state('')
        this.cryptos = vanX.reactive(cryptoAssets.getValidValues())
        this.services = vanX.reactive(webService.getValidValues())
        console.log(this.cryptos)
        console.log(this.services)
//            this.dates = dates
//            this.uuid = null
    }
    get htmls() { return [
        p(this.name),
        p(()=>div(this.services)),
        p(()=>div(this.cryptos)),
    ]}
    get yaml() { return jsyaml.dump({'author':{name:this.name.val, ...this.#webServiceYaml, ...this.#cryptoAssetsYaml}}) }
    get #webServiceYaml() { // 値があるキーのみ対象にしたオブジェクトに作り直す
        const obj = {}
        for (let key of Object.keys(this.services).sort()) {
            if      (''===this.services[key]) { continue }
            else if (Type.isString(this.services[key])) { obj[key] = this.services[key] }
            else if (Type.isObject(this.services[key])) {
                obj[key] = {}
                for (let insId of Object.keys(this.services[key])) {
                    if (this.services[key][insId]) {
                        obj[key][insId] = this.services[key][insId]
                    }
                }
                if (0===Object.keys(obj[key]).length) { delete obj[key] }
            }
        }
        return ((0===Object.keys(obj).length) ? ({}) : ({service:obj}))
    }
    get #copy() {
        const obj = {}
        JSON.parse(JSON.stringify(this.services))
    }
    get #cryptoAssetsYaml() {
        const obj = {}
        //for (let key of Object.keys(this.services)) {
        for (let key of Object.keys(this.cryptos).sort()) {
            if (this.cryptos[key]) { obj[key] = this.cryptos[key] }
        }
        return ((0===Object.keys(obj).length) ? ({}) : ({cryptos:obj}))
    }
}
class SelectElement {
    constructor(label, items, setFn, selectedIndex=0) {
        this._label = label
        this._items = items
        this._setFn = setFn
        this._selected = van.state(selectedIndex)
        this._summary = van.derive(()=>this._items[this._selected.val].summary)
        this._comment = van.derive(()=>this._items[this._selected.val].comment)
        this._details = van.derive(()=>this._items[this._selected.val].details)
    }
    get label() { return this._label }
    make(meta) { return div(van.tags.select({title:()=>this._comment.val, onchange:(e)=>{
        console.log(this._selected.val);
        this._selected.val = e.target.value
        this._setFn(meta, this.selectedItem) // meta.genre = this.selectedItem.name
    }}, this.#options), van.tags.details({style:'display:inline-block;'},van.tags.summary(this._summary), this._details)) }
    get #options() { return this._items.map((item,i)=>van.tags.option({title:item.summary, value:i}, item.name)) }
    get selectedItem() { return this._items[this._selected.val] }
}
const Category = new SelectElement('カテゴリ', [
    {name: '文学', summary:'人間の醜さや悲劇を描いた小説。', comment:'芸術性を重視', details:'純文学。学問でない散文で、芸術性のある文章。'},
    {name: '一般文芸', summary:'物語の面白さを追求した小説。', comment:'娯楽性を重視', details:'大衆文学。文学よりも娯楽性を重視した文章。'},
    {name: 'ライト文芸', summary:'現実味のあるライトノベル小説。', comment:'大人用ラノベ', details:'大人用ラノベ。一般文芸＋ライトノベル。ラノベと同様にキャラクターを売りにしつつ、より現実味がある文章。'},
    {name: 'ライトノベル', summary:'登場人物の面白さを追求した小説。', comment:'思春期向け。非現実的な設定。平易な文体。', details:'思春期向け。非現実的な設定。平易な文体。ハッピーエンド。多幸感。ストレスフリー。頭を空っぽにしてスラスラ読める。不快な展開がなく快感ばかり。'},
    {name: '児童', summary:'12歳以下の児童向け小説。', comment:'子供用小説', details:''},
], (meta,item)=>meta.category=item.name)
const Genre = new SelectElement('ジャンル', [
    {name: 'ファンタジー', summary:'剣・魔法・ドラゴン等が存在する世界での冒険譚。', comment: '', details:''},
    {name: 'SF', summary:'科学的根拠をベースにした物語。', comment: '誰が犯人か、どんな手口か、動機は何か。', details:''},
    {name: '推理', summary:'謎解きが主題の小説。', comment: '', details:''},
    {name: 'ホラー', summary:'恐怖が主題の小説。', comment: '怪談、幽霊、妖怪、呪い、ゾンビ、ウイルス、パニック', details:''},
    {name: '恋愛', summary:'恋愛を主軸においた物語。', comment: '', details:''},
    {name: '青春', summary:'学生が主人公の物語。', comment: '', details:''},
    {name: '歴史/時代', summary:'歴史を物語にした小説。', comment: '史実→"歴史"／創作→"時代"', details:''},
    {name: '経済', summary:'経済の仕組みや労働問題を扱う物語。', comment: '', details:''},
    {name: '政治', summary:'政治的出来事を扱った物語。', comment: '', details:''},
    {name: '官能', summary:'性描写が主題の小説。', comment: '', details:''},
    {name: 'ノンフィクション', summary:'事実に基づいた物語。', comment: '', details:''},
    {name: '随筆', summary:'見聞・思索・感想などを気ままに記した文章。', comment: 'エッセイ、日記、雑記、私小説', details:'話の筋道が整合的な体系に回収されてしまうことを何より忌避して、複数の論理や断片的な思考に積極的に身を任せ、脱線や逸脱や逡巡をいとわない。安直な全体化に執拗に抵抗する、そんな自由な思考の「試み」にこそ、エッセイというジャンルの本質がある。'},
], (meta,item)=>meta.genre=item.name)
class WorkState {
    constructor(title, catchCopy, intro, category, genre) {
        this.title = title
        this.catch = catchCopy
        this.intro = intro
        this.category = category // 小説（文学、一般文芸、ライト文芸、ライトノベル、児童）
        this.genre = genre // ファンタジー、SF、推理、ホラー、恋愛、青春、歴史、経済、政治、官能、随筆、ノンフィクション
    }
    get htmls() { return [
        h1(this.title),
        h2(this.catch),
        p(this.category),
        p(this.genre),
    ]}
    get yaml() { return jsyaml.dump({title:this.title, catch:this.catch, intro:this.intro, category:this.category, genre:this.genre}) }
    //get yaml() { return jsyaml.dump({title:this.title, catch:this.catch, intro:this.intro, category:this.category, genre:this.genre, author:{'name':this.author.name }}) }
}

class Meta {
    constructor(title, catchCopy, intro, category, genre) {
        this.work = vanX.reactive(new WorkState(title, catchCopy, intro, category, genre))
        this.author = new AuthorState()
    }
    get htmls() { return [
        h1(this.work.title),
        h2(this.work.catch),
        p(this.work.intro),
        p(this.work.category),
        p(this.work.genre),
        p(this.author.name),
        p(Object.entries(this.author.services).join(',')),
        p(Object.entries(this.author.cryptos).join(',')),
//            p(()=>div(this.author.webServices.map((item,i)=>`${WebService.ITEMS[i].name}:${item.username.val}`))),
//            p(()=>div(this.author.cryptoAssets.map((item,i)=>`${CryptoAssets.ITEMS[i].abbr}:${item.address.val}`))),
    ]}
    //get yaml() { return `---\n${jsyaml.dump({title:this.title, catch:this.catch, intro:this.intro, category:this.category, genre:this.genre, author:{'name':this.author.name }})}---` }
    get yaml() { return `---\n${this.work.yaml}${this.author.yaml}---` }
    get #webServiceYaml() { return this.author.webServices.filter(item=>item.username.val).map(item=>{
        console.log(item);
        return ({'type':WebService.ITEMS[item.index].name, 'address':item.username.val});
    }) }
}
const meta = new Meta('タイトル', 'キャッチコピー', '紹介文', Category.selectedItem.name, Genre.selectedItem.name)
//window.Category = Category
//window.Genre = Genre
van.add(document.body, div(div(table(
    tr(th('タイトル'), td(input({placeholder:'タイトル',value:'タイトル',oninput:(e)=>meta.work.title=e.target.value}))), 
    tr(th('ｷｬｯﾁｺﾋﾟｰ'), td(input({placeholder:'キャッチコピー',value:'キャッチコピー',oninput:(e)=>meta.work.catch=e.target.value}))), 
    tr(th('紹介文'), td(input({placeholder:'紹介文',value:'紹介文',oninput:(e)=>meta.work.intro=e.target.value}))), 
    tr(th(Category.label), td(()=>Category.make(meta.work))), 
    tr(th(Genre.label), td(()=>Genre.make(meta.work))), 
//)), div(()=>div(meta.htmls)), pre(()=>meta.yaml)))
))))


})()
