RevealExternalHtml = {
    id: 'RevealExternalHtm',
    init: function(deck) {
        initExternalHtml(deck);
    }
};

const initExternalHtml = function() {
    // Get all canvases
    var sections = document.querySelectorAll("section.data-external-html");
    for (var i = 0; i < sections.length; i++) {
        var currentSection = sections[i];
        let readHtml = ""
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.readyState === 4) {
                readHtml = xhr.responseText
            } else {
                console.warn('Failed to get file ')
            }
        };
        xhr.open('GET', currentSection.getAttribute("data-external-html-src"), false);
        try {
            xhr.send();
        } catch (error) {
            console.warn(error);
        }
        let bodyExternal = (new DOMParser).parseFromString(readHtml, 'text/html').body.childNodes
        for (let chldCount = 0; chldCount < bodyExternal.length; chldCount++) {
            currentSection.parentNode.insertBefore(bodyExternal[chldCount], currentSection)
        }
        currentSection.remove()
    }
}