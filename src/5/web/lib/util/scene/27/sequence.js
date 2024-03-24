(function(){
class MapSequence {
    static Direct = { Asc:0, Desc:-1 }
    static LoopMethods = { HeadTail:0, Yoyo:1, Stop:2 }
    constructor(map, loopMethod, dir, step, i) {
        this._map = map
        this._i = i || 0
        this._v = Array.from(this._map.keys())[this._i]
        this._dir = dir || Sequence.Direct.Asc
        this._step = step || 1
        this._loopMethod = loopMethod || Sequence.LoopMethods.HeadTail
    }
    next() {
        this._i += (((0 <= this._dir) ? 1 : -1) * this._step)
        if (this._i < 0) {
            switch (this._loopMethod) {
                case 0: { this._i = this._scenes.size-1; break; }
                case 1: { this._dir = ((0<=this._dir) ? -1 : 1); this._i = ((1<this._map.size) ? 1 : 0); break; }
                case 2: { this._i = 0; break; }
                default: throw new Error('不正なloopMethod')
            }
        }
        else if (this._map.size <= this._i) {
            switch (this._loopMethod) {
                case 0: { this._i = 0; break; }
                case 1: { this._dir = ((0<=this._dir) ? -1 : 1); this._i = ((1<this._map.size) ? this._map.size-2 : 0); break; }
                case 2: { this._i = this._map.size-1; break; }
                default: throw new Error('不正なloopMethod')
            }
        }
        return [this._i, this.key, this.value]
    }
    first() { this.i=0; return [this.i, this.key, this.value] }
    last() { this.i=((0<this._map.size) ? this._map.size-1 : 0); return [this.i, this.key, this.value] }
    get isFirst() { return (0===this.i) }
    //get isLast() { return ((this._map.size-1)===this.i) }
    get isLast() { return ((0<this._map.size) ? (this._map.size-1===this.i) : (0===this.i)) }
    get i() { return this._i }
    get kv() { return Array.from(this._map.entries())[this._i] }
    get key() { return Array.from(this._map.keys())[this._i] }
    get value() { return Array.from(this._map.values())[this._i] }
    set i(v) { if (0<=v && v<=this._map.size) { this._i = v } }
    set key(key) { // setIdxFromValue
        const f = Array.from(this._map.keys()).findIndex(k=>k===key)
        if (-1 < f) { this._i = f }
    }
}
class Sequence {
    static Direct = { Asc:0, Desc:-1 }
    static LoopMethods = { HeadTail:0, Yoyo:1, Stop:2 }
    constructor(values, loopMethod, dir, step, i) {
        this._values = values // Type.isArray
        this._i = i || 0
        this._dir = dir || Sequence.Direct.Asc
        this._step = step || 1
        this._loopMethod = loopMethod || Sequence.LoopMethods.HeadTail
    }
    next() {
        this._i += (((0 <= this._dir) ? 1 : -1) * this._step)
        if (this._i < 0) {
            switch (this._loopMethod) {
                case 0: { this._i = this._scenes.size-1; break; }
                case 1: { this._dir = ((0<=this._dir) ? -1 : 1); this._i = ((1<this._values.length) ? 1 : 0); break; }
                case 2: { this._i = 0; break; }
                default: throw new Error('不正なloopMethod')
            }
        }
        else if (this._values.length <= this._i) {
            switch (this._loopMethod) {
                case 0: { this._i = 0; break; }
                case 1: { this._dir = ((0<=this._dir) ? -1 : 1); this._i = ((1<this._values.length) ? this._values.length-2 : 0); break; }
                case 2: { this._i = this._values.length-1; break; }
                default: throw new Error('不正なloopMethod')
            }
        }
        return [this._i, this._values[this._i]]
    }
    first() { this.i=0; return [this.i, this.key, this.value] }
    last() { this.i=((0<this._values.length) ? this._values.length-1 : 0); return [this._i, this._values[this._i]] }
    get isFirst() { return (0===this.i) }
    get isLast() { return ((0<this._values.length) ? (this._values.length-1===this.i) : (0===this.i)) }
    get i() { return this._i }
    get value() { return this._values[this._i] }
    set i(v) { if (0<=v && v<=this._values.length) { this._i = v } }
    set value(val) { // setIdxFromValue
        const f = this._values.findIndex(v=>v===val)
        if (-1 < f) { this._i = f }
    }
}
window.MapSequence = MapSequence
window.Sequence = Sequence
})()
