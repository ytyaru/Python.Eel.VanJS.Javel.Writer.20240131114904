class File {
    static download(blob, name) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.download = name || `${IntlJa.iso.format(new Date()).replace(/[\/\: ]/g,'')}.txt`;
        a.href = url;
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }
}
class TextFile extends File {
    static download(text, name, newline=null, hasBom=false) {
        super.download(this.createUtf8Blob(text, newline, hasBom), name)
    }
    static createUtf8Blob(text, newline=null, hasBom=false) {
        const content = []
        //if (this.#isWindows()) { hasBom = true }
        if (hasBom) { content.push(new Uint8Array([0xEF, 0xBB, 0xBF])); }
        content.push(this.replaceNewLine(text, newline))
        return new Blob(content, {type: 'text/plain'})
    }
    static replaceNewLine(text=null, newline=null) {
        const content = (text) ? text : document.getElementById('content').value;
        console.debug('newline: ', newline)
        if (!newline && this.isWindows()) { newline='CR-LF' }
        switch (newline) {
            case 'LF': return content;
            case 'CR': return content.replace(/\r\n|\n/g, "\r");
            case 'CR-LF': return content.replace(/\r|\n/g, "\r\n");
            default: return content;
        }
    }
    static isWindows() { return (0 <= window.navigator.userAgent.toLowerCase().indexOf('windows nt')) }
}
class JsonFile extends TextFile {
    static download(obj, name, newline=null, hasBom=false) {
        super.download(JSON.stringify(obj), name, newline, hasBom)
    }
}
class HtmlFile extends TextFile {
    static download(blob, name, newline=null, hasBom=false) {
        super.download(blob, ((name) ? name : 'index.html'), newline, hasBom)
    }
}
//HTMLTextAreaElement.prototype.download = function(name, newline=null, hasBom=false) {
//    TextFile.download(this.value, name, newline, hasBom)
//}
