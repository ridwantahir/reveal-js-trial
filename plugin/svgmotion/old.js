RevealSvgMotion = {
    id: 'RevealSvgMotion',
    init: function(deck) {
        initAnimate(deck);
    },
    play: function() { play(); },
    pause: function() { pause(); },
    seek: function(timestamp) { seek(timestamp); },
};

const initAnimate = function(Reveal) {
    var autoplay = true
    var playback = false;
    var isRecording = false;
    var timer = null;
    var initialized = 0;

    groupBy = function(data, key) { // `data` is an array of objects, `key` is the key (or property accessor) to group by
        // reduce runs this anonymous function on each element of `data` (the `item` parameter,
        // returning the `storage` parameter at the end
        return data.reduce(function(storage, item) {
            // get the first instance of the key by which we're grouping
            var group = item[key];

            // set `storage` for this instance of group to the outer scope (if not empty) or initialize it
            storage[group] = storage[group] || [];

            // add this item to its group within `storage`
            storage[group].push(item);

            // return the updated storage to the reduce function, which will then loop through the next 
            return storage;
        }, []); // {} is the initial value of the storage
    };

    function unique(item, index, array) {
        return array.indexOf(item) == index;
    }

    function extractKeyFrames(svgParent) {
        let svgElts = svgParent.find('[data-keyframe-id][data-motion-id]');
        let animIds = svgElts.map(elt => elt.attr("data-motion-id").toString().trim()).filter(unique)
        let keyFrames = svgElts.map(elt => elt.attr("data-keyframe-id").toString().trim()).filter(unique)
        let animationLen = keyFrames.length - 1;
        let animRow = animIds.map(anId => {
            let allViews = svgElts
                .filter(e => e.attr("data-motion-id").toString().trim() === anId)
                .sort((a, b) => parseInt(a.attr("data-keyframe-id").toString().trim()) - parseInt(b.attr("data-keyframe-id").toString().trim()))
            let firstKeyFrame = parseInt(allViews[0].attr("data-keyframe-id").toString().trim())
            if (firstKeyFrame != 0) {
                allViews[0].opacity(0)
            }
            let curAnimations = allViews.filter(v => parseInt(v.attr("data-keyframe-id").toString().trim()) != 0)
                .map(v => {
                    let curKeyFrame = parseInt(v.attr("data-keyframe-id").toString().trim())
                    let x = v.x()
                    let y = v.y();
                    let opacity = v.opacity()
                    return {
                        animFragment: curKeyFrame,
                        animationObj: [{
                                "element": `#${anId}`,
                                "modifier": "x",
                                "duration": 1000,
                                "parameters": [x]
                            },
                            {
                                "element": `#${anId}`,
                                "modifier": "y",
                                "duration": 1000,
                                "parameters": [y]
                            },
                            {
                                "element": `#${anId}`,
                                "modifier": "opacity",
                                "duration": 1000,
                                "parameters": [opacity]
                            }
                        ]
                    }
                })
            allViews.shift().node.id = anId
            allViews.forEach(v => { document.getElementById(v.node.id).remove() })
            return curAnimations
        })
        let afterGrouping = groupBy(animRow.flat(), 'animFragment')
        var sortedIndexes = [];
        for (var gKey in afterGrouping) {
            sortedIndexes[sortedIndexes.length] = parseInt(gKey);
        }
        sortedIndexes.sort();
        let maxIndex = Math.max(...sortedIndexes)
        let computedAnimations = []
        for (let i = 0; i <= maxIndex; i++) {
            if (sortedIndexes.includes(i)) {
                computedAnimations[i] = afterGrouping[i].map(r => r['animationObj']).flat()
            } else {
                computedAnimations[i] = []
            }
        }
        console.log(computedAnimations)
        return computedAnimations

    }


    function getAnimatedSVG(container) {
        var elements = SVG.find('svg');
        var svg = elements.toArray().find(element => element.node.parentElement == container);
        //console.warn("FOUND",svg.node);
        return svg;
    }

    /*****************************************************************
     ** Set up animations
     ******************************************************************/
    function setupAnimations(parentSvg) {
        //container.svg = getAnimatedSVG(container);

        parentSvg.node.animationTimeline = new SVG.Timeline().persist(true);
        parentSvg.node.animationSchedule = []; // completion time of each fragment animation

        // setup animation
        var animations = extractKeyFrames(parentSvg);
        if (animations) {

            parentSvg.node.animationSchedule.length = animations.length;
            var timestamp = 0;
            for (var fragment = 0; fragment < animations.length; fragment++) {
                parentSvg.node.animationSchedule[fragment] = {};
                parentSvg.node.animationSchedule[fragment].begin = timestamp;
                for (var i = 0; i < animations[fragment].length; i++) {
                    try {
                        // add each animation step
                        var elements = parentSvg.find(animations[fragment][i].element);
                        //console.log("element(" + animations[fragment][i].element + ")." + animations[fragment][i].modifier + "(" + animations[fragment][i].parameters + ")");
                        if (!elements.length) {
                            console.warn("Cannot find element to animate with selector: " + animations[fragment][i].element + "!");
                        }
                        for (var j = 0; j < elements.length; j++) {
                            elements[j].timeline(parentSvg.node.animationTimeline);
                            var anim = elements[j].animate(animations[fragment][i].duration, animations[fragment][i].delay, animations[fragment][i].when)
                            anim[animations[fragment][i].modifier].apply(anim, animations[fragment][i].parameters);
                        }

                        //console.log("Duration:", anim.duration());
                        timestamp = anim.duration();
                    } catch (error) {
                        throw error
                            //console.error("Error '" + error + "' setting up animation " + JSON.stringify(animations[fragment][i]));
                    }
                }
                // set animationSchedule for each fragment animation
                var schedule = parentSvg.node.animationTimeline.schedule();
                if (schedule.length) {
                    timestamp = schedule[schedule.length - 1].end;
                }
                parentSvg.node.animationSchedule[fragment].end = timestamp;
            }
            parentSvg.node.animationTimeline.stop();
            //console.warn(container.animation.schedule());
            // console.warn("Schedule", container.animationSchedule);
        }

        // setup current slide
        if (Reveal.getCurrentSlide().contains(parentSvg.node)) {
            Reveal.layout(); // Update layout to account for svg size
            animateSlide(0);
        }

        initialized += 1;
    }

    function initialize() {
        SVGInject(document.querySelectorAll("img.data-svg-motion"))
            .then((value) => {
                document.querySelectorAll("svg.data-svg-motion")
                    .forEach(element => {
                        setupAnimations(SVG(element));
                    })
            });

    }

    function play() {
        //console.log("Play", Reveal.getCurrentSlide());
        var elements = Reveal.getCurrentSlide().querySelectorAll("svg.data-svg-motion");
        for (var i = 0; i < elements.length; i++) {
            console.log(elements[i].animationTimeline);
            if (elements[i].animationTimeline) {
                elements[i].animationTimeline.play();
            }
        }
        autoPause();
    }

    function pause() {
        //console.log("Pause");
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }

        var elements = Reveal.getCurrentSlide().querySelectorAll("svg.data-svg-motion");
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].animationTimeline) {
                elements[i].animationTimeline.pause();
            }
        }
    }

    function autoPause() {

        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        var fragment = Reveal.getIndices().f + 1 || 0; // in reveal.js fragments start with index 0, here with index 1



        var elements = Reveal.getCurrentSlide().querySelectorAll("svg.data-svg-motion");

        for (var i = 0; i < elements.length; i++) {
            if (elements[i].animationTimeline && elements[i].animationSchedule[fragment]) {
                //console.log( elements[i].animationSchedule[fragment].end, elements[i].animation.time());
                var timeout = elements[i].animationSchedule[fragment].end - elements[i].animationTimeline.time();
                timer = setTimeout(pause, timeout);
            }
            //console.log("Auto pause",elements[i], timeout);
        }

    }

    function seek(timestamp) {
        //console.log("Seek", timestamp);
        var elements = Reveal.getCurrentSlide().querySelectorAll("svg.data-svg-motion");
        var fragment = Reveal.getIndices().f + 1 || 0; // in reveal.js fragments start with index 0, here with index 1
        for (var i = 0; i < elements.length; i++) {
            //console.log("Seek",timestamp,elements[i].animationSchedule[fragment].begin + (timestamp || 0) );
            if (elements[i].animationTimeline && elements[i].animationSchedule[fragment]) {
                elements[i].animationTimeline.time(elements[i].animationSchedule[fragment].begin + (timestamp || 0));
            }
        }
        if (timer) {
            // update time if animation is running
            autoPause();
        }
    }


    // Control animation
    function animateSlide(timestamp) {
        //		pause();
        //console.log("Animate slide");
        if (timestamp !== undefined) {
            seek(timestamp);
        }
        if (Reveal.isAutoSliding() || autoplay || playback || isRecording) {
            //console.log("Start animation");
            play();
        } else {
            pause();
        }
        //console.log("Done");
    }

    /*****************************************************************
     ** Event listeners
     ******************************************************************/

    Reveal.addEventListener('ready', function(event) {
        //console.log('ready ');
        /*
        		if ( printMode ) {
        			initializePrint();
        			return;
        		}
        */
        initialize();

        Reveal.addEventListener('slidechanged', function() {
            //console.log('slidechanged',Reveal.getIndices());
            animateSlide(0);
        });

        Reveal.addEventListener('overviewshown', function(event) {
            // pause animation
            pause();
        });

        /*
        		Reveal.addEventListener( 'overviewhidden', function( event ) {
        		} );
        */
        Reveal.addEventListener('paused', function(event) {
            //console.log('paused ');
            // pause animation
            pause();
        });
        /*
        		Reveal.addEventListener( 'resumed', function( event ) {
        console.log('resumed ');
        			// resume animation
        		} );
        */
        Reveal.addEventListener('fragmentshown', function(event) {
            //console.log("fragmentshown",event);
            animateSlide(0);
        });

        Reveal.addEventListener('fragmenthidden', function(event) {
            //console.log("fragmentshown",event);
            animateSlide(0);
        });
    });

    this.play = play;
    this.pause = pause;
    this.seek = seek;
    return this;
};