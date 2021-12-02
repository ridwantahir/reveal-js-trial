const RevealDynamicStyles = {
    id: 'revealdynamicstyels',

    init: function(reveal) {

        function updateDynamiClasses() {
            document.querySelectorAll('div.grid-parent').forEach(function(parentDiv) {
                let parentStyle = getComputedStyle(parentDiv)
                let numberOfCols = parentStyle.getPropertyValue('--num-cols');
                let i = 1;
                [...parentDiv.children].forEach(chldDiv => {
                    if (i % numberOfCols != 0) {
                        chldDiv.classList.add('grid-right-border')
                    }
                    if (parentDiv.children.length > numberOfCols) {
                        chldDiv.classList.add('grid-all-border')
                    }
                    i++
                })
            });
        }

        updateDynamiClasses()
    }

};