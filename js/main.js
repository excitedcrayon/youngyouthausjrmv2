"use strict";

const Constants = {
    production: false,
    URL: ( !this.production ) ? "https://youngyouth.jrmorg.com" : location.origin ,
    lessonsFolder: 'lessons'
}

window.addEventListener('DOMContentLoaded', () => {
    try{
        new VideoPlayer();
    }catch(e){
        console.log(`Exception: ${e}`);
    }
});

let currentAutoPlayIndex = 0;

class VideoPlayer{
    constructor(){
        this.videoElement = document.querySelector('#video');
        this.videoTitleElement = document.querySelector('#videoTitle');
        this.subVideosElement = document.querySelector('.content-sub-videos');
        this.searchElement = document.querySelector('.header-center [name="search"]');
        this.headerBurgerMenuElement = document.querySelector('.header-burger-menu');
        this.overlay = document.querySelector('.overlay');
        this.overlayCloseButton = document.querySelector('.overlay-content button');
        this.videoList = [];

        this.main();

    }
    main(){
        this.data();
        this.searchFilter();
        this.playSelectedVideo();
        this.autoPlayNextVideo();
        this.menu();
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
                    subVideoSection.setAttribute(`title`, file);

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

                    this.videoList.push(file);
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
    playSelectedVideo(){
        window.addEventListener('click', (e) => {
            //console.log(e.target.className);

            if ( e.target.className.indexOf('sub-video-title') > -1 || e.target.className.indexOf('sub-video') > -1 ) {
                let subVideoSection = e.target.parentElement;
                let subVideoSectionTitle = subVideoSection.getAttribute('title');
                let indexOfSelected = this.videoList.indexOf(subVideoSectionTitle);
                // set autoplay index to index of selected
                currentAutoPlayIndex = indexOfSelected;


                // reset video player
                this.videoElement.src = '';
                this.videoTitleElement.textContent = '';
                // load new data to video player
                this.videoElement.src = `${Constants.URL}/${Constants.lessonsFolder}/${subVideoSectionTitle.toString()}`;
                this.videoTitleElement.textContent = subVideoSectionTitle;

            }
        });
    }
    searchFilter(){

        if ( this.searchElement ) {
            this.searchElement.addEventListener('keydown', () => {

                let searchValue = this.searchElement.value.toUpperCase();

                if ( searchValue.length > 1 ) {

                    let subVideoSectionList = document.querySelectorAll('.sub-video-section');

                    subVideoSectionList.forEach(subVideoSection => {

                        let titleOfSubVideoSection = subVideoSection.getAttribute('title').toUpperCase();

                        if ( titleOfSubVideoSection.indexOf(searchValue) > -1 ) {
                            subVideoSection.style.display = "";

                        } else {
                            subVideoSection.style.display = "none"; 
                        }

                    });

                } else {

                    let subVideoSectionList = document.querySelectorAll('.sub-video-section');

                    subVideoSectionList.forEach(subVideoSection => {
                        subVideoSection.style.display = "";
                    });

                }

            });
        }

    }
    autoPlayNextVideo(){
        this.videoElement.addEventListener('ended', e => {
            currentAutoPlayIndex = currentAutoPlayIndex + 1;

            if ( currentAutoPlayIndex > this.videoList.length - 1 ) {
                currentAutoPlayIndex = 0;
            }

            this.videoElement.src = '';
            this.videoTitleElement.textContent = '';

            this.videoElement.src = `${Constants.URL}/${Constants.lessonsFolder}/${this.videoList[currentAutoPlayIndex]}`;
            this.videoTitleElement.textContent = this.videoList[currentAutoPlayIndex];

            this.videoElement.play();
            
        });
    }
    menu(){
        this.headerBurgerMenuElement.addEventListener('click', () => {
            this.headerBurgerMenuElement.classList.toggle('active-menu');
            this.overlay.classList.toggle('active-overlay');
            document.body.classList.toggle('active-body-overlay');
        });

        this.overlayCloseButton.addEventListener('click', () => {
            this.headerBurgerMenuElement.classList.toggle('active-menu');
            this.overlay.classList.toggle('active-overlay');
            document.body.classList.toggle('active-body-overlay');
        });
    }
}
