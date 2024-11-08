"use strict";

const Constants = {
    production: false,
    URL: ( !this.production ) ? "https://youngyouth.jrmorg.com" : location.origin ,
    lessonsFolder: 'lessons'
}

window.addEventListener('DOMContentLoaded', () => {
    console.log(Constants);
    try{
        new VideoPlayer();
    }catch(e){
        console.log(`Exception: ${e}`);
    }
});

class VideoPlayer{
    constructor(){
        this.videoElement = document.querySelector('#video');
        this.videoTitleElement = document.querySelector('#videoTitle');
        this.subVideosElement = document.querySelector('.content-sub-videos');

        this.main();

    }
    main(){
        this.data();
    }
    data(){
        fetch(`${Constants.URL}/getFiles.php`)
        .then(res => res.json())
        .then(files => {
            if ( files.length > 0) {

                // reverse array to show latest video on top
                files.reverse();

                files.forEach(file => {

                    let subVideoSection = document.createElement('div');
                    subVideoSection.className = 'sub-video-section';

                    let subVideoTitle = document.createElement('span');
                    subVideoTitle.className = 'sub-video-title';
                    subVideoTitle.textContent = file;

                    let subVideo = document.createElement('video');
                    let subVideoURL = `${Constants.URL}/${Constants.lessonsFolder}/${file}`;

                    subVideo.className = 'sub-video';
                    subVideo.setAttribute('src', subVideoURL);
                    subVideo.setAttribute(`data-filename`, file);
                    subVideo.setAttribute(`data-url`, subVideoURL);


                    subVideoSection.appendChild(subVideo);
                    subVideoSection.appendChild(subVideoTitle);
                    this.subVideosElement.appendChild(subVideoSection);
                });

                // render latest video on page load
                this.currentVideo(files[0]);
            }
        });
    }
    currentVideo(currentVideoIndex){
        // reset content
        this.videoElement.src = null;
        this.videoTitleElement.textContent = "";

        this.videoElement.src = `${Constants.URL}/${Constants.lessonsFolder}/${currentVideoIndex}`;
        this.videoTitleElement.textContent = currentVideoIndex;
    }
}
