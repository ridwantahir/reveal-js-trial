RevealSvgMotion = {
    id: 'RevealSvgMotion',
    init: function(deck) {
        initAnimate(deck);
    }
};
this.animationMetaData = []

function genAnimId(idBase, tagName, iter) {
    return idBase + "-" + tagName + "-" + iter
}

function initAnimate() {
    function unique(item, index, array) {
        return array.indexOf(item) == index;
    }

    function copyAttributesRec(baseElmt1, baseElmt2, res, idBase, fragIndx, itertn) {
        let terminalElements = ["circle", "ellipse", "line", "mesh", "path", "polygon", "polyline", "rect", "image", "text", "textPath"]
        let el1 = baseElmt1 //baseElmt1.querySelector(sel1);
        let el2 = baseElmt2 //baseElmt2.querySelector(sel2);
            //let res = []
        if (el1.tagName != el2.tagName) {
            throw `el1 is a ${el1.tagName} , while el2 is a ${el2.tagName}`
        }
        let chldrn1 = el1.childNodes;
        let chldrn2 = el2.childNodes;
        if (chldrn1.length != chldrn2.length) {
            throw `el1 has ${chldrn1.length} childrens while el2 has ${chldrn2.length}`
        }
        if (terminalElements.includes(el1.tagName)) {
            let newId = genAnimId(idBase, el1.tagName, itertn)
            let animParams = el2.getAttributeNames()
                .filter(n => !['id', 'data-keyframe-id', 'data-motion-id', 'xlink:href', 'href', 'preserveAspectRatio'].includes(n))
                .map(a => {
                    let oneAnimParam = {}
                    oneAnimParam['element'] = newId
                    oneAnimParam['attr'] = a
                    oneAnimParam['value'] = el2.getAttribute(a)
                    oneAnimParam['duration'] = 3000
                    return oneAnimParam

                })
            el1.id = newId
            res[fragIndx] = res[fragIndx].concat(animParams)
            return
        }
        if (chldrn1.length == 0) {
            return
        }
        for (let i = 0; i < chldrn1.length; i++) {

            if (chldrn2[i].getAttributeNames) {
                let newId = genAnimId(idBase, chldrn1[i].tagName, itertn)
                let animParams = chldrn2[i].getAttributeNames()
                    .filter(n => !['id', 'data-keyframe-id', 'data-motion-id', 'xlink:href', 'href', 'preserveAspectRatio'].includes(n))
                    .map(a => {
                        let oneAnimParam = {}
                        oneAnimParam['element'] = newId
                        oneAnimParam['attr'] = a
                        oneAnimParam['value'] = chldrn2[i].getAttribute(a)
                        oneAnimParam['duration'] = 3000
                        return oneAnimParam

                    })
                chldrn1[i].id = newId
                res[fragIndx] = res[fragIndx].concat(animParams)
            }
            copyAttributesRec(chldrn1[i], chldrn2[i], res, idBase + "-" + itertn, fragIndx, "" + itertn + "" + i)
        }
    }

    function addDummyFragment(elmt, minRequired) {
        let sectionParent = elmt.closest('section');
        let fragCounts = sectionParent.querySelectorAll(".fragment").length
        console.log(fragCounts + " / " + minRequired)
        for (let j = fragCounts; j < minRequired; j++) {
            var spn = document.createElement("SPAN");
            spn.className = "fragment"
            spn.setAttribute("data-fragment-index", `${j}`)
            sectionParent.appendChild(spn);
        }
    }

    const initAll = function() {
        let allSvgAnims = document.querySelectorAll('svg.data-svg-motion')
        for (let i = 0; i < allSvgAnims.length; i++) {
            let curSvgA = allSvgAnims[i]

            let newSvgId = "svg-" + Math.floor((Math.random() * 100) + 1) + "-" + i;
            curSvgA.id = newSvgId
            let withAnimFlags = curSvgA.querySelectorAll('[data-keyframe-id][data-motion-id]')
            let animIds = [...withAnimFlags].map(e => e.getAttribute('data-motion-id').toString().trim()).filter(unique)
            let fragIds = [...withAnimFlags].map(e => parseInt(e.getAttribute('data-keyframe-id').toString().trim())).filter(unique)
            let maxFragId = Math.max(...fragIds)
            addDummyFragment(curSvgA, maxFragId)
            let curFragAnimations = []
            for (let k = 0; k <= maxFragId; k++) {
                curFragAnimations[k] = []
            }
            animIds.forEach(animId => {
                let thisObjViews = [...withAnimFlags]
                    .filter(e => e.getAttribute("data-motion-id").toString().trim() === animId)
                    //.filter(e => e === animId).filter(unique)
                    .sort((a, b) => parseInt(a.getAttribute("data-keyframe-id").toString().trim()) - parseInt(b.getAttribute("data-keyframe-id").toString().trim()))
                let firstKeyFrame = parseInt(thisObjViews[0].getAttribute("data-keyframe-id").toString().trim())

                thisObjViews
                //.filter(v => parseInt(v.getAttribute("data-keyframe-id").toString().trim()) != 0)
                    .forEach(e => {
                    let curFragIndexF = parseInt(e.getAttribute("data-keyframe-id").toString().trim())
                    let baseElmt1 = thisObjViews[0]
                    let baseElmt2 = e
                    let idBase = newSvgId + "-" + animId
                    let itertn = ""
                    copyAttributesRec(baseElmt1, baseElmt2, curFragAnimations, idBase, curFragIndexF, itertn)
                })

                if (firstKeyFrame != 0) {
                    thisObjViews[0].classList.add("fragment");
                    thisObjViews[0].setAttribute("data-fragment-index", `${firstKeyFrame-1}`)
                        //copyAttributesRec(thisObjViews[0], thisObjViews[0], curFragAnimations, newSvgId + "-" + animId, 0, "", "hidden")
                        // let oneAnimParam = {}
                        // oneAnimParam['element'] = thisObjViews[0].id
                        // oneAnimParam['attr'] = 'dummy'
                        // oneAnimParam['value'] = 'dummy'
                        // oneAnimParam['duration'] = 50
                        // oneAnimParam['visibility'] = "hidden"
                        // curFragAnimations[0] = curFragAnimations[0].concat([oneAnimParam])
                }
                thisObjViews.shift()
                thisObjViews.forEach(e => e.remove())
            })

            this.animationMetaData[newSvgId] = curFragAnimations
        }
    }

    function animteMySlide() {
        //console.log(animMetaData)
        let fragmentId = Reveal.getIndices().f + 1 || 0; // in reveal.js fragments start with index 0, here with index 1
        let currentSlide = Reveal.getCurrentSlide()
            //let fragmentId = parseInt(fragmentIdStr.toString().trim())
        currentSlide.querySelectorAll('svg.data-svg-motion').forEach(e => {
            let curIdd = e.id
                //console.log(curIdd)
            let fragMetaData = this.animationMetaData[curIdd][fragmentId]
            if (!fragMetaData) {
                return
            }
            let animElts = fragMetaData.map(r => "#" + r['element']).filter(unique) //.filter(a => a == '#pod1--path-00')
                //console.log(animElts)
                //console.log(this.animationMetaData)
            cssToAnime = (x) => {
                prts = x.split("-")
                hed = prts.shift()
                tal = prts.filter(eb => eb.trim().length > 0).map(ee => ee.charAt(0).toUpperCase() + ee.slice(1)).join("")
                return hed + tal
            }

            for (let i = animElts.length - 1; i >= 0; i--) {
                let ue = animElts[i]
                animProps = {
                    targets: ue,
                    duration: 500,
                    easing: 'linear'
                }
                curA = fragMetaData.filter(a => '#' + a['element'] == ue)
                curA.forEach(cc => {
                        animProps[cssToAnime(cc['attr']).trim()] = cc['value'].trim()
                    })
                    //console.log(animProps)
                anime(animProps)
                    //reducer = (p, c) => p.transition().delay(0).duration(1000).attr(c['attr'], c['value'])
                    //curA.reduce(reducer, d3.select(ue))
            }
        })
    }

    function initialize() {
        SVGInject(document.querySelectorAll("img.data-svg-motion"))
            .then((value) => {
                initAll()
                console.log(animationMetaData)
            });

    }
    initialize()
    Reveal.addEventListener('slidechanged', function() {
        //console.log('slidechanged',Reveal.getIndices());
        animteMySlide();
    });
    Reveal.addEventListener('fragmentshown', function(event) {
        //console.log("fragmentshown",event);
        animteMySlide();
    });

    Reveal.addEventListener('fragmenthidden', function(event) {
        //console.log("fragmentshown",event);
        animteMySlide();
    });



}