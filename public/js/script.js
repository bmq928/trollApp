// const $ = require('jquery')

$(document).ready(function () {
    var dataFromServer = {}  //data get from server
    var audio = document.getElementById('audio-control')
    var $playBtn = $('#play-btn');
    var $title = $('#title')
    var $soundIndex = $('#sound-index').children('a')
    var isPlaying = false;
    var listCurSounds = []
    var curSoundIndex = 1;
    var iconState = (function () {
        var curState = 0;
        var audioState = ['pause', 'play']
        return function () {
            return {
                changeState: function () {
                    curState = (++curState) % audioState.length;
                    return audioState[curState]
                },
                changeIcon: function () {
                    this.changeState()
                    return this.getIcon();
                },
                getState: function () {
                    return curState;
                },
                getIcon: function () {
                    if (this.getState() === 0) return "pause"
                    else return "play_arrow"
                },
                setPlay: function () {
                    if (curState === 0) return this.changeIcon()
                    return this.getIcon()
                },
                setPause: function () {
                    if (curState === 1) return this.changeIcon()
                    return this.getIcon()
                }
            }
        }
    })()()

    ///////////////////////////////////
    //fetch
    $.getJSON("./api/dir", function (data) {
        dataFromServer = data;
        console.log(dataFromServer)
        $('#loader').trigger('GET_DATA')
        $('#main').trigger('GET_DATA')

        //change title
        var defaultTitle = Object.keys(dataFromServer)[0]
        $title.html(defaultTitle.toUpperCase())

        createDropdown(data)
        listCurSounds = dataFromServer[defaultTitle]
    })

    //////////////////////////////////////////////////////////////////////////////////////
    //audio control
    audio.onended = function () {
        // $playBtn.children('i').html(iconState.setPlay())
        changeIconTo('play')
        isPlaying = false;
        console.log('end');
    }
    audio.onplay = function () {
        // $playBtn.children('i').html(iconState.setPause())
        changeIconTo('pause')
        isPlaying = true;
        console.log('play')
    }
    audio.onpause = function () {
        // $playBtn.children('i').html(iconState.setPlay())
        changeIconTo('play')
        isPlaying = false;
        console.log('pause')
    }

    $('#loader').on('GET_DATA', function () {
        $(this).fadeOut()
    })

    $('#main').on('GET_DATA', function () {
        $(this).fadeIn()
    })

    $playBtn.on('click', function () {
        if (!isPlaying) audio.play();
        else audio.pause()
    })

    /////////////////////////////////////////////////////////////////////////////////////
    //arrow 
    //change soundtrack
    $('#left-arrow').on('click', function(){
        arrowClick('left')
    })

    $('#right-arrow').on('click', function(){
        arrowClick('right')
    })


    /////////////////////////////////////////////////////////////////////////////////////
    //helper
    function createDropdown(data) {

        //create content
        var $dropdown = $('#dropdown')
        var contents = Object.keys(data).map(function (title) {
            return '<li><a href="#!">' + title + '</a></li>'
        })
        contents.forEach(function (item) {
            $dropdown.append(item)
        })

        //assign event
        //change option
        $dropdown.children('li').on('click', function (e) {
            e.preventDefault()
            var option = $(this).children('a').html()
            $title.html(option.toUpperCase())
            listCurSounds = dataFromServer[option]
            console.log(listCurSounds)
            curSoundIndex = 1;
            $soundIndex.html(curSoundIndex)
            assignNewSound(listCurSounds[0].link)
        })
    }


    function assignNewSound(src) {
        $('source').attr('src', src);
        if (isPlaying) {
            //stop
            audio.pause()
            audio.currentTime = 0.0
            isPlaying = false;
            changeIconTo('play')
        }
        audio.load()
    }
    function changeIconTo(state) {
        if (state === 'pause') $playBtn.children('i').html(iconState.setPause())
        else if (state === 'play') $playBtn.children('i').html(iconState.setPlay())
    }
    function arrowClick(arrow) {
        var actualIndex = curSoundIndex - 1;
        var numSound = listCurSounds.length;

        if (arrow === 'left') actualIndex = (actualIndex - 1 + numSound) % numSound
        else if (arrow === 'right') actualIndex = (actualIndex + 1) % numSound

        curSoundIndex = actualIndex + 1;
        var src = listCurSounds[actualIndex].link;
        console.log(src)
        assignNewSound(src)
        $soundIndex.html(curSoundIndex)
    }
})