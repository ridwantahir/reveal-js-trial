window.RevealTable = {
    id: 'RevealTable',
    init: function(deck) {
        initTable(deck);
    }
};

const initTable = function(Reveal) {
    function createTable(el, CSV, activeRows, activeCols) {
        let lines = CSV.split(/[\r\n]+/).filter(function(v) { return v !== '' });
        let labels = null
        let htmlEls = "<table><thead><tr>"
        let activeIndcs = activeRows.split(",")
        let activeColsIndcs = activeCols.split(",")
        if (lines.length > 0) {
            labels = lines[0].split(',');
            lines.shift();
        }
        for (var h = 0; h < labels.length; h++) {
            htmlEls = htmlEls + `<th>${labels[h]}</th>`
        }
        htmlEls = htmlEls + "</tr></thead><tbody>"
        for (var j = 0; j < lines.length; j++) {
            var cls = ""
            if (activeIndcs.includes((j + 1).toString())) {
                cls = `class="data-file-table-active-row"`
            }
            htmlEls = htmlEls + `<tr ${cls}>`
            tableRaw = lines[j].split(',');
            for (var r = 0; r < tableRaw.length; r++) {
                var colsCls = ""
                if (activeColsIndcs.includes((r + 1).toString())) {
                    colsCls = `class="data-file-table-active-col"`
                }
                htmlEls = htmlEls + `<td ${colsCls}>${tableRaw[r]}</td>`
            }
            htmlEls = htmlEls + "</tr>"
        }
        htmlEls = htmlEls + "</tbody></table>"
        el.innerHTML = htmlEls
    }

    var initializeTables = function() {
        // Get all canvases
        var els = document.querySelectorAll(".data-file-table");
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            var activeRows = ""
            var activeCols = ""
            if (el.hasAttribute("data-file-table-active-rows")) {
                activeRows = el.getAttribute("data-file-table-active-rows")
            }
            if (el.hasAttribute("data-file-table-active-cols")) {
                activeCols = el.getAttribute("data-file-table-active-cols")
            }
            var xhr = new XMLHttpRequest();
            xhr.onload = function() {
                if (xhr.readyState === 4) {
                    createTable(el, xhr.responseText, activeRows, activeCols);
                } else {
                    console.warn('Failed to get file ' + canvas.getAttribute("data-file-table") + ". ReadyState: " + xhr.readyState + ", Status: " + xhr.status);
                }
            };
            xhr.open('GET', el.getAttribute("data-file-table-src"), false);
            try {
                xhr.send();
            } catch (error) {
                console.warn(error);
            }
        }
    }
    initializeTables()
    return this;
};