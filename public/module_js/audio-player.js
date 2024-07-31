// referenced: https://codepen.io/patriferra/pen/bGdNxLM
$('audio.with-transcript').each(function() {
    let $audio_el = $(this);
    let source = $audio_el.find('source').attr('src');    
    let timecodes = {};
    let $list = $('ul[data-audio-file="'+source+'"]');
    let $items = $('li', $list);

    $items.each(function() {

        // get timecode from data attribute
        let timecode = $(this).attr('data-timecode');

        // build object of timecodes and element offsets
        timecodes[timecode] = {};
        timecodes[timecode]['el'] = $(this);
        timecodes[timecode]['offset'] = $(this).position().top;

        // Add click event to take user to the specific timecode
        $(this).on('click', function() {
            let timeparts = timecode.split(':');
            let seconds = calc_seconds(timeparts);
            $audio_el[0].currentTime = seconds;
            $audio_el[0].play();
        });
    });

    // Define mediaelement.js player
    $audio_el.mediaelementplayer({
        features: ['playpause','current','progress','duration'],
        // features: ['playpause','current','progress','duration','volume','fasterslower'],
        stretching: 'responsive',
    });

    // Set up the scroll tether to audio timecode
    $audio_el.on('canplaythrough', function() {
        // console.log('can play through!');
    }).on('timeupdate', function() {
        let current_time = $audio_el[0].currentTime;
        let current_minutes = formatNumber(parseInt(current_time / 60, 10));
        let current_seconds = formatNumber(parseInt(current_time % 60));

        let timecode_index = current_minutes + ":" + current_seconds;
        // console.log(current_minutes + ":" + current_seconds);    
        // console.log($('li[data-timecode="'+timecode+'"]').length + 'matching els');
        if (typeof timecodes[timecode_index] !== 'undefined') {
            if(!timecodes[timecode_index]['el'].hasClass('current')) {
                $('.current', $list).removeClass('current');
                timecodes[timecode_index]['el'].addClass('current');
                // Scroll the ul element to the next timecode position proactively
                let newScrollTop = timecodes[timecode_index]['el'].position().top + $list.scrollTop();
                // console.log("now newScrollTop: " + newScrollTop);

                $list.stop().animate({
                    scrollTop: newScrollTop
                }, 500);

                // Scroll only when need to at cutoff point
                // let newScrollTop = timecodes[timecode_index]['el'].position().top + $list.scrollTop() - $list.position().top;
                // $list.stop().animate({
                //     scrollTop: newScrollTop
                // }, 500);

            }            
        }
    });
});

function formatNumber(n) {
    return n > 9 ? "" + n : "0" + n;
}

function calc_seconds(array) {
    let sum = 0;
    switch(array.length) {
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






function initializeAudioPlayer() {
    $('audio.with-transcript').each(function() {
        let $audio_el = $(this);
        let source = $audio_el.find('source').attr('src');    
        let timecodes = {};
        let $list = $('ul[data-audio-file="'+source+'"]');
        let $items = $('li', $list);
    
        $items.each(function() {
    
            // get timecode from data attribute
            let timecode = $(this).attr('data-timecode');
    
            // build object of timecodes and element offsets
            timecodes[timecode] = {};
            timecodes[timecode]['el'] = $(this);
            timecodes[timecode]['offset'] = $(this).position().top;
    
            // Add click event to take user to the specific timecode
            $(this).on('click', function() {
                let timeparts = timecode.split(':');
                let seconds = calc_seconds(timeparts);
                $audio_el[0].currentTime = seconds;
                $audio_el[0].play();
            });
        });
    
        // Define mediaelement.js player
        $audio_el.mediaelementplayer({
            features: ['playpause','current','progress','duration'],
            // features: ['playpause','current','progress','duration','volume','fasterslower'],
            stretching: 'responsive',
        });
    
        // Set up the scroll tether to audio timecode
        $audio_el.on('canplaythrough', function() {
            // console.log('can play through!');
        }).on('timeupdate', function() {
            let current_time = $audio_el[0].currentTime;
            let current_minutes = formatNumber(parseInt(current_time / 60, 10));
            let current_seconds = formatNumber(parseInt(current_time % 60));
    
            let timecode_index = current_minutes + ":" + current_seconds;
            // console.log(current_minutes + ":" + current_seconds);    
            // console.log($('li[data-timecode="'+timecode+'"]').length + 'matching els');
            if (typeof timecodes[timecode_index] !== 'undefined') {
                if(!timecodes[timecode_index]['el'].hasClass('current')) {
                    $('.current', $list).removeClass('current');
                    timecodes[timecode_index]['el'].addClass('current');
                    // Scroll the ul element to the next timecode position proactively
                    let newScrollTop = timecodes[timecode_index]['el'].position().top + $list.scrollTop();
                    // console.log("now newScrollTop: " + newScrollTop);
    
                    $list.stop().animate({
                        scrollTop: newScrollTop
                    }, 500);
    
                    // Scroll only when need to at cutoff point
                    // let newScrollTop = timecodes[timecode_index]['el'].position().top + $list.scrollTop() - $list.position().top;
                    // $list.stop().animate({
                    //     scrollTop: newScrollTop
                    // }, 500);
    
                }            
            }
        });
    });
}



