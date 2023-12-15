const progressBar = document.getElementById('theft-progress');

$(document).ready(function() {
    let backlink, nextlink;

    if(section === 'concepts') {
        if(page === 'objectives') {
            $('#objectives').transition('fade');
            // $('#objectives').removeClass('hidden');
            backlink = `/challenge/identity`;
            nextlink = `/course-player?module=identity&section=concepts&page=intro-video`;

            updateProgressBar();
        } else if(page === 'intro-video') {
            $('#intro-video').transition('fade');
            // $('#intro-video').removeClass('hidden');
            backlink = `/course-player?module=identity&section=concepts&page=objectives`;
            nextlink = `/course-player?module=identity&section=concepts&page=definitions`;
            updateProgressBar();

        } else if(page === 'definitions') {
            $('#definitions').transition('fade');
            // $('#definitions').removeClass('hidden');
            backlink = `/course-player?module=identity&section=concepts&page=intro-video`;
            nextlink = `/course-player?module=identity&section=concepts&page=types`;
            updateProgressBar();

        }
    } 

    $('#backButton').on('click', function() {
        window.location.href = backlink;
    });

    $('#nextButton').on('click', function() {
        window.location.href = nextlink;
    });
});


function updateProgressBar() {
    let progress;
    

    if (page === 'objectives') {
        progress = (1 / total) * 100;
    } else if (page === 'intro-video') {
        progress = (2 / total) * 100;
    } else if (page === 'definitions') {
        progress = (3 / total) * 100;
    }


    console.log("Progress: " + progress);
    if (progressBar) {
        progressBar.setAttribute('data-percent', progress);
        progressBar.querySelector('.bar').style.width = progress + "%";
        if(progress > 0 && progress < 100){
        progressBar.querySelector('.bar').style.backgroundColor = '#7AC4E0';
        } else if(progress == 100) {
        progressBar.querySelector('.bar').style.backgroundColor = '#3757A7';
        }
        // progressBar.querySelector('.progress').textContent = progress + "%";
    } else {
        console.error('Could not find progress bar element');
    }
}
