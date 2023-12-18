const progressBar = document.getElementById('theft-progress');

$(document).ready(function() {
    // Load the first page based on the URL
    setLinks(startPage);

    $('#backButton').on('click', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const currentPage = urlParams.get('page');

        console.log("Current Page: " + currentPage);

        const { backlink, nextlink } = setLinks(currentPage);

        console.log("Backlink: " + backlink);
        console.log("Nextlink: " + nextlink);



        const backParams = new URLSearchParams(backlink);
        const backPage = backParams.get('page');

        console.log("Back Page: " + backPage);
        console.log("Current Page: " + currentPage);


    
        history.pushState(null, '', backlink);

        
        $('#' + currentPage).removeClass('transition visible');
        $('#' + currentPage).css('display', ''); 
        $('#' + currentPage).addClass('hidden');

        if(backPage === null) {
            window.location.href = backlink;
        } else {
            $('#' + backPage).transition('fade');
        }

        updateProgressBar();
    });
    
    $('#nextButton').on('click', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const currentPage = urlParams.get('page');

        const { backlink, nextlink } = setLinks(currentPage);

        console.log("Backlink: " + backlink);
        console.log("Nextlink: " + nextlink);


        const nextParams = new URLSearchParams(nextlink);
        const nextPage = nextParams.get('page');

        // console.log("Back Page: " + backPage);
        console.log("Current Page: " + currentPage);


    
        history.pushState(null, '', nextlink);

        
        $('#' + currentPage).removeClass('transition visible');
        $('#' + currentPage).css('display', ''); 
        $('#' + currentPage).addClass('hidden');
        $('#' + nextPage).transition('fade');

        updateProgressBar();


    });
});

function setLinks(currentPage) {
    let backlink, nextlink;

    if(section === 'concepts') {
        if(currentPage === 'objectives') {
            $('#objectives').transition('fade');
            backlink = `/challenge/identity`;
            nextlink = `/course-player?module=identity&section=concepts&page=intro-video`;
            updateProgressBar();
        } 
        else if(currentPage === 'intro-video') {
            $('#intro-video').transition('fade');
            backlink = `/course-player?module=identity&section=concepts&page=objectives`;
            nextlink = `/course-player?module=identity&section=concepts&page=definitions`;
            updateProgressBar();
        } else if(currentPage === 'definitions') {
            $('#definitions').transition('fade');
            backlink = `/course-player?module=identity&section=concepts&page=intro-video`;
            nextlink = `/course-player?module=identity&section=concepts&page=types`;
            updateProgressBar();
        }
    }

    return { backlink, nextlink };

}


function updateProgressBar() {
    let progress;

    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');

    

    if (pageParam === 'objectives') {
        progress = (1 / total) * 100;
    } else if (pageParam === 'intro-video') {
        progress = (2 / total) * 100;
    } else if (pageParam === 'definitions') {
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
