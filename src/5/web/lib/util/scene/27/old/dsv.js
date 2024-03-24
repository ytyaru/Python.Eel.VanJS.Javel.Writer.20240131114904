(function(){
class Dsv { // Delimiter Separated Values
    constructor(delim) {
        this._delim = delim
    }
    get delim() { return this._delim; }
    load(text, hasNotHeader, hasNotNameLine, hasNotTypeLine) { // 1行目に列名を持てる。2行目に型名を持てる。
        if (hasNotNameLine && !hasNotTypeLine) { throw new Error(`第二、第三引数の組合せ不正です。名前行がなく型行がある設定は不可能です。名前行もつけるか、型行を消してください。`) }
        text = text.trimLine()
        //text = ((hasNotHeader) ? text : this.#removeHeader(text))
        const lines = text.split(/\r?\n/)

        const obj = {}
        const heads = [['names',hasNameLine], ['types',hasTypeLine]].map([key,has]=>new HeadLine(key,has,this._delim))
        for (let h of heads) { const [t, col] = h.get(text, lines); text = t; obj[h.key] = col; }
        const values = lines.map(line=>this.line(line).map(col=>this.#decodeNewLine(col)))



//        const [text, names, types] = this.getHeader(text, lines)
        //return lines.map(line=>this.line(line).map(col=>this.#decodeNewLine(col)))
//        const values = lines.map(line=>this.line(line).map(col=>this.#decodeNewLine(col)))
//        return {names:names, types:types, values:values}
    }
    /*
    getHeader(text, lines) {
        const names = ((hasNotNameLine) ? null : this.line(lines[0]))
        const types = ((hasNotTypeLine) ? null : this.line(lines[1]))
        text = ((hasNotNameLine) ? text : this.#removeHeader(text)
        text = ((hasNotTypeLine) ? text : this.#removeHeader(text)
        if (hasNotNameLine) { lines.shift() }
        if (hasNotTypeLine) { lines.shift() }
        return [text, names, types]
    }
    */
    toObjects(obj) { // obj: load()の戻り値（{names:names, types:types, values:values}）

    }
    line(line) { return line.split(this.delim) }
    countCols(line) { return line.count(this.delim) + 1 }
    countLines(text) { return text.count('\n') + 1 }
    #removeHeader(text) { const i=text.indexOf('\n'); return ((-1===i) ? text : text.substr(i+1)); }
    #decodeNewLine(col) { return col.replace(/\\n/g, '\n') } // 値に改行を含めたいときは\\nと記入すること
}
/*
const heads = [
    new HeadLine('names', hasNameLine)
    new HeadLine('types', hasTypeLine)
]

for (let h of heads) { const [t, col] = h.get(text, lines); obj[h.key] = col; }

const heads = [['names',hasNameLine], ['types',hasTypeLine]].map([key,has]=>new HeadLine(key,has,this._delim))
for (let h of heads) { const [t, col] = h.get(text, lines); text = t; obj[h.key] = col; }
nameLine = new HeadLine()
typeLine = new HeadLine()
*/
class HeadLine {
    constructor(key, has, delim) { this._key=key; this._has=has; this._delim; }
    get(text, lines) { 
        const col = this.line(((this._has) ? lines.shift() : null))
        return [((this._has) ? this.#removeHeader(text) : text), col]
    }
    get key() { return this._key }
    get has() { return this._has }
    #line(line) { return line.split(this._delim) }
    #removeHeader(text) { const i=text.indexOf('\n'); return ((-1===i) ? text : text.substr(i+1)); }
}
class NameLine {

}
class Tsv extends Dsv { constructor() { super('\t') } } // Tab Separated Values
class Csv extends Dsv { constructor() { super(',') } }  // Comma Separated Values
class Ssv extends Dsv { constructor() { super(' ') } }  // Space Separated Values
class Scsv extends Dsv { constructor() { super(';') } } // Semi-collon Separated Values
class Clsv extends Dsv { constructor() { super(':') } } // Collon Separated Values
String.prototype.Tsv = new Tsv()
String.prototype.Csv = new Csv()
String.prototype.Ssv = new Ssv()
String.prototype.Scsv = new Scsv()
String.prototype.Clsv = new Clsv()
})()
