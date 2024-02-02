(function(){
const {table,tr,th,td,a,input,button,br} = van.tags
class CryptoAssetTable {
    constructor() {
        this._items = new Map([['MONA', 'Monacoin'], ['BTC', 'Bitcoin'], ['LTC', 'Lightcoin'], ['ETH', 'Ethereum'], ['SOL', 'Solana'], ['DOGE', 'Dogecoin']])
    }
    make() { return table({id:`crypto-assets-table`},this.#tr()) }
    #tr() { return Array.from(this._items).map(([k,v],i)=>tr(
        ((0===i) ? th({rowspan:this._items.size},a({href:'https://ja.wikipedia.org/wiki/%E6%9A%97%E5%8F%B7%E9%80%9A%E8%B2%A8'},'暗号資産'), br(), this.#addCoinUi()) : null),
        ...this.#contents(k, v)
    ))}
    #addCoinUi() { return [
        input({id:'new-coin-abbr',placeholder:'BTC',size:4,onkeydown:e=>{if(['Enter','Insert'].some(v=>v===e.key)){this.#addNewCoin(e.target.value)}}}),
        button({onclick:e=>{this.#addNewCoin()}},'＋'),
    ]}
    #contents(abbr, name, hasDel) { return [
        th(a({href:`https://ja.wikipedia.org/wiki/${name}`}, abbr)),
        td(
            input({id:`crypto-address-${abbr.toLowerCase()}`, placeholder:'アドレス'}), 
            ((hasDel) ? a({onclick:e=>{this.#delNewCoin(abbr)}, onkeydown:e=>{if(' '===e.key){e.preventDefault()}else if('Tab'===e.key){return} if([' ','Enter','Delete'].some(v=>v===e.key)){this.#delNewCoin(abbr)}}, tabindex:0, style:`cursor:pointer;`}, '✖') : null)),
    ]}
    #addNewCoin(v) {
        const abbr = (v) ? v : document.querySelector(`#new-coin-abbr`).value
        if (this._items.has(abbr)) { console.warn(`暗号通貨の略名 ${abbr} は既存のため追加を中止します。`); return; }
        this._items.set(abbr, abbr)
        const table = document.querySelector(`#crypto-assets-table`)
        const tr = table.querySelector(`tr`)
        const th = tr.querySelector(`th`)
        th.setAttribute('rowspan', `${this._items.size}`)
        table.append(van.tags.tr(this.#contents(abbr, name, true)))
        document.querySelector(`#crypto-address-${abbr.toLowerCase()}`).focus()
    }
    #delNewCoin(abbr) {
//        const abbr = document.querySelector(`#new-coin-abbr`).value
        if (this.#isDelNewCoin(abbr)) {
            this._items.delete(abbr)
            console.log(document.querySelector(`#crypto-address-${abbr.toLowerCase()}`).parentElement.parentElement)
            document.querySelector(`#crypto-address-${abbr.toLowerCase()}`).parentElement.parentElement.remove()
            document.querySelector(`#new-coin-abbr`).focus()
        }
    }
    #isDelNewCoin(abbr) {
        const address = document.querySelector(`#crypto-address-${abbr.toLowerCase()}`).value
        return ((address) ? confirm(`暗号通過 ${abbr} とそのアドレス ${address} を削除します。\n削除しますよ？\n削除してよろしいですね？`) : true)
    }
}
//window.cryptoAssetTable = new CryptoAssetTable()
window.CryptoAssetTable = CryptoAssetTable
})()
