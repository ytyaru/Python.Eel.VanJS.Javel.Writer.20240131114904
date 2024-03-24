(function(){
const {table,tbody,thead,tfoot,tr,th,td,caption} = van.tags
class KvTable { // ラベルとUIの列を持ったテーブル（th,tdはdisplay:block/inlineを切り替える）
    static make(uiMap, sid) {
        const doms = Array.from(uiMap.entries()).map(([eid, e])=>e.dom)
        const display = ((Css.getInt('inline-size') < 480) ? 'block' : 'table-cell');
        return table({class:'kv-table'}, ()=>tbody(this.#trs(doms, display)))
    }
    static #trs(doms, display) { return doms.map(dom=>this.#tr(dom, display)) }
    static #tr(dom, display) { console.log(dom);return tr(
        th({style:()=>`display:${display};`}, dom.lb),
        td({style:()=>`display:${display};`}, dom.el, dom.dl),
    )}
    static resize() {
        console.log('inline-size:', Css.getInt('inline-size'))
        const display = ((Css.getInt('inline-size') < 480) ? 'block' : 'table-cell')
        for (let table of document.querySelectorAll('table[class="kv-table"]')) {
            if ('none'===table.style.display) { continue }
            for (let cell of document.querySelectorAll('th, td')) {
                Css.set('display', display, cell)
            }
        }
    }
}
window.KvTable = KvTable
})()
