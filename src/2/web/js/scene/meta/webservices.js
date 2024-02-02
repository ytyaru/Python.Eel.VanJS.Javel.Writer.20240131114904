(function(){
const {table,tr,th,td,a,input,button,br} = van.tags
class WebService {
    constructor() {
        this._items = new Map()
        this._items.set('github', {category:'hosting', name:'GitHub', domain:'github.com', user:{id:null, name:''}})
        this._items.set('mastodon', {category:'sns', name:'Mastodon', instances:new Map([['mstdn.jp', ({user:{id:null, name:''}})],['mastodon-japan.net', ({user:{id:null, name:''}})]]), ui:new InstanceUi('mastodon')})
        this._items.set('misskey', {category:'sns', name:'Misskey', instances:new Map([['nijimiss.moe', ({user:{id:null, name:''}})], ['misskey-square.net', ({user:{id:null, name:''}})]]), ui:new InstanceUi('misskey')})
        console.debug(this._items.entries())
        console.debug(Array.from(this._items.entries()).filter(([k,v])=>{console.debug('filter:',k,v);return k;}).map(([k,v])=>console.debug(k, v)))
        console.debug(this.array.map(([k,v])=>console.debug(k, v)))
        console.debug(this.array.length)
    }
    get items() { return this._items }
    get array() { return Array.from(this._items.entries()).filter(([k,v])=>k) }
    get siloArray() { return Array.from(this._items.entries()).filter(([k,v])=>!v.hasOwnProperty('instances')) }
    get federatedArray() { return Array.from(this._items.entries()).filter(([k,v])=>v.hasOwnProperty('instances')) }
    get silos() { return new Map(this.siloArray) } // 営利系サービス
    federateds(s) { return new Map(this.federatedArray.map(([k,v])=>((!s || (s && s===k)) ? [k, v] : null)).filter(v=>v)) } // 連合系サービス
    federated(s) { return this.federatedArray.map(([k,v])=>(((s===k)) ? v : null)).filter(v=>v)[0] } // 連合系サービス
    addInstance(s, domain, username) { this._items.get(s).instances.set(domain, {user:{id:null, name:username}}) }
    removeInstance(s, domain) { this._items.get(s).instances.delete(domain) }
}
class InstanceUi {
    constructor(serviceKey) {
        this._serviceKey = serviceKey
        this._items = []
    }
    get items() { return this._items }
    makeDomain() { return [
        input({id:`new-instance-${this._serviceKey}`,placeholder:`domain.com`,size:8}), 
        this.#makeAddButton(),
    ] }
    #makeAddButton() { return button({
        onclick:e=>{
            console.debug('button clicked!!', document.querySelector(`#new-instance-${this._serviceKey}`).value)
            this.#addDomain(document.querySelector(`#new-instance-${this._serviceKey}`).value)
            console.debug(this.items)
        }, 
        onkeydown:e=>{
            if (' '===e.key) { e.preventDefault() }
            if ([' ','Enter','Ins'].some(v=>v===e.key)) {
                this.#addDomain(document.querySelector(`#new-instance-${this._serviceKey}`).value)
            }
        },
    }, '＋') }
    #addDomainUserUi(domain) {
        const table = document.querySelector(`#webservices`)
        const tr = document.querySelector(`#tr-webservices-${this._serviceKey}`)
        const th = tr.querySelector(`th`)
        const lastTr = this.#getLastTr()
        console.log(table, tr, th, lastTr)
        th.setAttribute('rowspan', `${parseInt(th.getAttribute('rowspan'))+1}`)
        table.insertBefore(this.#makeTr(domain), lastTr)
    }
    #getLastTr() {
        const tr = document.querySelector(`#tr-webservices-${this._serviceKey}`)
        let lastTr = null
        console.log(webServiceTable._s.federated(this._serviceKey).instances.size)
        for (let i=0; i<webServiceTable._s.federated(this._serviceKey).instances.size-1; i++) {
            lastTr = ((lastTr) ? lastTr : tr).nextSibling; console.log(lastTr);
        }
        return lastTr
    }
    #makeTr(domain, username) { return tr(
        th(a(Ui.extLink({href:`https://${domain}/`}), domain)),
        td(
            Ui.user(this._serviceKey, domain, ((username) ? username : '')),
            a({
                onclick:e=>{this.#delDomain(domain);}, 
                onkeydown:e=>{if([' ','Enter','Del'].some(v=>v===e.key)){e.preventDefault();this.#delDomain(domain);}},
                style:`cursor:pointer;`,tabindex:0}, '✖')),
    ) }
    #removeDomainUserUi(domain) {
        this.#getTr(domain).remove()
        const th = document.querySelector(`#tr-webservices-${this._serviceKey}`).querySelector(`th`)
        th.setAttribute('rowspan', `${parseInt(th.getAttribute('rowspan'))-1}`)
    }
    #getTr(domain) {
        let tr = document.querySelector(`#tr-webservices-${this._serviceKey}`)
        let th = null
        console.log(webServiceTable._s.federated(this._serviceKey).instances.size)
        for (let i=0; i<webServiceTable._s.federated(this._serviceKey).instances.size; i++) {
            th = ((0===i) ? tr.querySelector(`th`).nextSibling : tr.querySelector(`th`))
            const d = th.querySelector(`a`).innerText
            console.log(d)
            if (domain===d) { return tr }
            tr = tr.nextSibling
        }
        throw new Error(`対象ドメインのtr要素を発見できませんでした。:${this._serviceKey}, ${domain}`)
    }
    makeTrs() {
        console.debug('makeTrs()..........', this._serviceKey)
        const trs = []
        const inss = this.items
        console.debug(inss)
        for (let domain of inss.map(ins=>ins.domain)) {
            trs.push(tr(
                th(a(Ui.extLink({href:`https://${domain}/`}), domain), a({onclick:e=>{this.#delDomain(domain)}, onkeydown:e=>{if([' ','Enter','Del'].some(v=>v===e.key)){e.preventDefault();this.#delDomain(domain);}},style:`cursor:pointer;`,tabindex:0}, '✖')),
                td(Ui.user(this._serviceKey, domain, inss.filter(ins=>ins.domain===domain)[0].user.name)),
            ))
        }
        console.debug(trs)
        return trs
    }
    #addDomain(domain) { console.log(webServiceTable._s.federated(this._serviceKey)); if(webServiceTable._s.federated(this._serviceKey).instances.has(domain)) { console.warn(`入力したドメイン名${domain}は既存のため追加を中断しました。`); return; } webServiceTable._s.federated(this._serviceKey).instances.set(domain, ({user:{id:null, name:''}})); this.#addDomainUserUi(domain); this.#focusUser(domain); }
    #delDomain(domain) {
        console.debug('#delDomain():',domain, webServiceTable._s.federated(this._serviceKey).instances)
        if (this.#isDelete(domain)) {
            this.#removeDomainUserUi(domain)
            webServiceTable._s.federated(this._serviceKey).instances.delete(domain)
            this.#focusDomain()
            console.log('del :',domain, webServiceTable._s.federated(this._serviceKey).instances)
        }
    }
    #isDelete(domain) {
        const username = document.querySelector(`#webservice-${this._serviceKey}-${domain}`).value
        if (username) { return confirm(`${webServiceTable._s.federated(this._serviceKey).name} のドメイン ${domain} とそのユーザ ${username} を削除します。\n削除しますよ？\n削除してよろしいですね？`) }
        else { return true }
    }
    #focusUser(domain) { setTimeout(()=>document.querySelector(`#webservice-${this._serviceKey}-${domain}`).focus(), 0); }
    #focusDomain() { setTimeout(()=>document.querySelector(`#new-instance-${this._serviceKey}`).focus(), 0); }
}
class WebServiceTable {
    constructor() {
        this._s = new WebService()
    }
    getValidValues() {
        const values = []
        for (let sk of this._s.items.keys()) {
            const s = this._s.items.get(sk)
//            (s.hasOwnProperty('instances')) ? Array.from(s.instances).map(([k,v],i)=>({k:v.user.name})) : ({})
            values.push(((s.hasOwnProperty('instances')) ? Array.from(s.instances).map(([k,v],i)=>({k:v.user.name})) : ({[sk]:s.user.name.toLowerCase()})))
        }
        console.log(values)
        return values
        //Array.from(document.querySelectorAll(`input[id^="icon-webservice-"]`))
    }
    make() { return table({id:'webservices'},...this.#makeSilos(), ...this.#makeFederateds()) }
    #makeSilos() { return this._s.siloArray.map(([k,v])=>tr(th({colspan:2},a(Ui.extLink({href:`https://${v.domain}/`,style:`display:block;`}), v.name)), Ui.user(k))) }
    #makeFederateds() {
        console.debug('#makeFederateds()')
        const trs = []
        for (let serviceKey of this._s.federateds().keys()) {
            trs.push(...this.#makeFederated(serviceKey))
        }
        return trs
        return this.federateds().keys().map(k=>this.#makeFederated(serviceKey)).flat()
    }
    #makeFederated(serviceKey) {
        console.debug('#makeFederated(serviceKey)')
        const trs = []
        const inss = this._s.items.get(serviceKey).instances
        const ui = this._s.items.get(serviceKey).ui
        console.debug(inss, ui.items)
        for (let domain of inss.keys()) {
            const tr = van.tags.tr(
                ((0===trs.length) ? th({rowspan:inss.size+ui.items.length}, a(Ui.extLink({href:`https://ja.wikipedia.org/wiki/${serviceKey}`,style:`display:block;`}), serviceKey), ui.makeDomain()) : null),
                th(a(Ui.extLink({href:`https://${domain}/`,style:`display:block;`}), domain)),
                td(Ui.user(serviceKey, domain, inss.get(domain).user.name)),
            )
            if (0===trs.length) { tr.setAttribute('id', `tr-webservices-${serviceKey}`) }
            trs.push(tr)
        }
        console.debug(serviceKey, trs)
        ui.makeTrs().forEach(tr=>trs.push(tr))
        console.debug(serviceKey, trs)
        return trs
    }
}
class Ui {
    static extLink(obj) { return {...obj, target:'_blank', rel:'noopener noreferrer'} }
    static user(s, d, v) { return input({id:`webservice-${s}${((d) ? '-'+d: '')}`, placeholder:'ユーザ名', value:((v) ? v : '')}) }
}
//window.webServiceTable = new WebServiceTable()
window.WebServiceTable = WebServiceTable
})()
