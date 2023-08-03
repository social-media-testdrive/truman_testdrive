// update the indentity theft progress bar
const progressBar = document.getElementById('theft-progress');
if (progressBar) {
    progressBar.setAttribute('data-percent', progress);
    progressBar.querySelector('.bar').style.width = progress + "%";
    if(progress > 0 && progress < 100){
    progressBar.querySelector('.bar').style.backgroundColor = '#6BBCC7';
    } else if(progress == 100) {
    progressBar.querySelector('.bar').style.backgroundColor = 'blue';
    }
    // progressBar.querySelector('.progress').textContent = progress + "%";
} else {
    console.error('Could not find progress bar element');
}

