RevealExternalCode = {
    id: 'RevealExternalCode',
    init: function(deck) {
        initAll(deck);
    }
};

const initAll = function() {
    function readSubCode(codeStr, begin, end) {
        let codeLines = codeStr.split(/[\r\n]+/)
        let actualBegin = 1;
        let actualEnd = codeLines.length
        if (begin && parseInt(begin.toString().trim()) >= 1 && parseInt(begin.toString().trim()) <= codeLines.length) {
            actualBegin = parseInt(begin)
        }
        if (end && parseInt(end.toString().trim()) >= actualBegin && parseInt(end.toString().trim()) <= codeLines.length) {
            actualEnd = parseInt(end)
        }
        console.log(codeLines.length)
        console.log(codeLines.slice(actualBegin - 1, actualEnd).join('\r\n'))
        console.log(actualBegin)
        console.log(actualEnd)
        return codeLines.slice(actualBegin - 1, actualEnd).join('\r\n')
    }
    // Get all canvases
    var els = document.querySelectorAll(".data-external-code");
    for (var i = 0; i < els.length; i++) {
        var el = els[i];
        let readAttributes = []
        let readCode = ""
        let langFound = ""
        let attribs = ""
        let beginLineNumber = el.getAttribute("data-external-code-begin")
        let endLineNumber = el.getAttribute("data-external-code-end");
        [...el.attributes].forEach(a => {
            let attrName = a.name
            let attrValue = a.value
            if (attrName == 'lang') {
                langFound = attrValue
            }
            readAttributes[attrName] = attrValue
        })
        if (langFound) {
            readAttributes['class'] = readAttributes['class'] + ' ' + langFound
        }
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.readyState === 4) {
                readCode = readSubCode(xhr.responseText, beginLineNumber, endLineNumber)
                console.log(readCode)
            } else {
                console.warn('Failed to get file ')
            }
        };
        xhr.open('GET', el.getAttribute("data-extenal-code-src"), false);
        try {
            xhr.send();
        } catch (error) {
            console.warn(error);
        }
        for (key in readAttributes) {
            if (readAttributes[key]) {
                attribs = attribs + ` ${key}="${readAttributes[key]}" `
            } else {
                attribs = attribs + ` ${key} `
            }
        }
        let genCode = `<pre ${attribs} ><code ${attribs}>${readCode}</code></pre>`
        el.innerHTML = genCode
    }
}