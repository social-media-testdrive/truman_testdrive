// source: https://codepen.io/gravyraveydavey/pen/BremeB
$('audio.with-transcript').each(function(){
    let $audio_el = $(this);
    let source = $audio_el.find('source').attr('src');	
    let timecodes = {};
    let $list = $('ul[data-audio-file="'+source+'"]');
    let $items = $('li', $list);
    let markers = [];
    $items.each(function(){
        // get timecode from data attribute
        let timecode = $(this).attr('data-timecode');
        // build object of timecodes and element offsets
        timecodes[ timecode ] = {};
        timecodes[ timecode ]['el'] = $(this);
        timecodes[ timecode ]['offset'] = $(this).offset().top  - $list.offset().top;
        
        // look for marker class, then add marker if found
        if ($(this).hasClass('timecode-marker')){
            let timeparts = timecode.split(':');
            // parse parts as ints
            $.each(timeparts, function(index, val){
                timeparts[index] = parseInt(val);
            });
            let seconds = calc_seconds(timeparts);
            markers.push(seconds);				
        }

    });
    //console.log(timecodes);	

    // define mediaelement.js player
    // pass in the markers array
    $audio_el.mediaelementplayer({
        features: ['playpause','current','progress','duration','markers'],
        markers: markers,
        stretching: 'responsive',
        markerCallback:function(media,time){
            console.log('reached marker!');
        }
    });		
    // $audio_el.mediaelementplayer({
    //     features: ['playpause', 'current', 'progress', 'duration', 'volume', 'speed'],
    //     markers: markers,
    //     stretching: 'responsive',
    //     pluginPath: 'https://cdn.jsdelivr.net/npm/mediaelement@latest/build/',
    //     markerCallback: function(media, time) {
    //         console.log('reached marker!');
    //     },
    //     defaultSpeed: 1.0,
    //     speeds: ['0.5', '1.0', '1.5', '2.0'],
    //     success: function(mediaElement, originalNode) {
    //         // Trigger a window resize event
    //         setTimeout(() => {
    //             window.dispatchEvent(new Event('resize'));
    //         }, 100);
    //     }
    // });      
    // set up the scroll tether to audio timecode
    $audio_el.on('canplaythrough', function(){
        //console.log('can play through!');
    }).bind('timeupdate', function(){
        
            let current_time = $audio_el[0].currentTime;
            let current_minutes = formatNumber(parseInt(current_time / 60, 10));
            let current_seconds = formatNumber(parseInt(current_time % 60));

            let timecode_index = current_minutes + ":" + current_seconds;
            console.log(current_minutes + ":" + current_seconds);	
            //console.log($('li[data-timecode="'+timecode+'"]').length + 'matching els');
            if (typeof timecodes[timecode_index] !== 'undefined'){
                if(!timecodes[timecode_index]['el'].hasClass('current')){
                    $('.current', $list).removeClass('current');
                    timecodes[timecode_index]['el'].addClass('current');
                    //console.log('scroll to' + $('li.current').offset().top);
                    $list.animate({
                        scrollTop: timecodes[timecode_index]['offset']
                    }, 500);
                }			
            }
    });
});

function formatNumber(n){
    return n > 9 ? "" + n: "0" + n;
}

function calc_seconds (array) {
    let sum = 0;
    switch(array.length){
        case 1:
            sum += array[0];
            break;
        case 2:
            sum += (array[0]*60);
            sum += array[1];
            break;
        case 3:
            sum += (array[0]*60*60);
            sum += (array[1]*60);
            sum += array[2];
            break;
    }
    return sum;
}

function triggerResizeEvent() {
    window.dispatchEvent(new Event('resize'));
}
