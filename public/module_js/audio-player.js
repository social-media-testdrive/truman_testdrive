$(document).ready(function() {
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
            timecodes[timecode]['offset'] = $(this).position().top - $list.position().top;

            // Add click event to seek to the specific timecode
            $(this).on('click', function() {
                let timeparts = timecode.split(':');
                let seconds = calc_seconds(timeparts);
                $audio_el[0].currentTime = seconds;
                $audio_el[0].play();
            });
        });

        // Define mediaelement.js player
        $audio_el.mediaelementplayer({
            features: ['playpause', 'current', 'progress', 'duration'],
            stretching: 'responsive'
        });

        // Set up the scroll tether to audio timecode
        $audio_el.on('canplaythrough', function() {
            // console.log('can play through!');
        }).bind('timeupdate', function() {
            let current_time = $audio_el[0].currentTime;
            let current_minutes = formatNumber(parseInt(current_time / 60, 10));
            let current_seconds = formatNumber(parseInt(current_time % 60));

            let timecode_index = current_minutes + ":" + current_seconds;
            // console.log(current_minutes + ":" + current_seconds);    
            if (typeof timecodes[timecode_index] !== 'undefined') {
                if (!timecodes[timecode_index]['el'].hasClass('current')) {
                    $('.current', $list).removeClass('current');
                    timecodes[timecode_index]['el'].addClass('current');
                    // Scroll the ul element to the next timecode position proactively
                    let next_timecode_index = getNextTimecodeIndex(current_minutes, current_seconds, timecodes);
                    if (next_timecode_index) {
                        $list.stop().animate({
                            scrollTop: timecodes[next_timecode_index]['offset']
                        }, 500);
                    }
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
                sum += (array[0] * 60);
                sum += array[1];
                break;
            case 3:
                sum += (array[0] * 60 * 60);
                sum += (array[1] * 60);
                sum += array[2];
                break;
        }
        return sum;
    }

    function getNextTimecodeIndex(current_minutes, current_seconds, timecodes) {
        let found = false;
        let next_timecode_index = null;
        Object.keys(timecodes).forEach((timecode) => {
            if (found) {
                next_timecode_index = timecode;
                found = false;
            }
            if (timecode === current_minutes + ":" + current_seconds) {
                found = true;
            }
        });
        return next_timecode_index;
    }
});
