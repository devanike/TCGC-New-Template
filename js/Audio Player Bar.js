// AUDIO PLAY BAR
const musicDivs = document.querySelectorAll('.music');
const playAudioBar = document.getElementById('play-pause-button');
const forwardButton = document.getElementById('forward-button');
const backwardButton = document.getElementById('backward-button');
const shuffleButton = document.getElementById('shuffle-button');
const repeatButton = document.getElementById('repeat-button');
const volumeButton = document.getElementById('volume-button');
const volumeSlider = document.getElementById('volume-slider');
const durationBar = document.querySelector('#audio-controls-bar .duration');
const progressBar = document.getElementById('progress-bar');
const durationCount = document.getElementById('duration-count');
const audioControlsBar = document.getElementById("audio-controls-bar");
const currentArtist = document.getElementById('current-artist');
const currentTitle = document.getElementById('current-title');
const shortAudioPlayer = document.getElementById('short-audio');
let currentAudio = null;
let currentPlayIcon = null;
let currentIndex = -1;
let progressUpdateInterval = null
let isShuffled = false;
let isRepeating = false;
let shuffledList = [];
let originalList = [];
// const audioPauseDuration = 35 * 60 * 1000; // 35 minutes
// const shortAudioDuration = 35 * 1000;


// Initialize the original list of music
originalList = Array.from(musicDivs).map((musicDiv, index) => {
    const audioPlayer = musicDiv.querySelector('.audio-player');
    const playIcon = musicDiv.querySelector('#play-icon');

    const artistElement = musicDiv.querySelector('.artist');
    const titleElement = musicDiv.querySelector('.title');

    const artist = artistElement ? artistElement.textContent : 'Unknown Artist';
    const title = titleElement ? titleElement.textContent : 'Unknown Title';
    
    audioPlayer.addEventListener('ended', () => {
        if (isRepeating && audioPlayer === currentAudio) {
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        } else {
            playNext();
        }
    });
    audioPlayer.addEventListener('loadedmetadata', () => {
        const durationElement = musicDiv.querySelector('.duration');
        const formattedDuration = formatTime(audioPlayer.duration);
        durationElement.textContent = formattedDuration;
        if (audioPlayer === currentAudio) {
            durationBar.textContent = formattedDuration;
        }
    });
    return { audioPlayer, playIcon, artist, title, index, musicDiv };
});


 // Function to shuffle the playlist
function shufflePlaylist() {
    shuffledList = [...originalList];
    for (let i = shuffledList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]];
    }
}

musicDivs.forEach((musicDiv, index)  => {
    const playIcon = musicDiv.querySelector('#play-icon');
    const audioPlayer = musicDiv.querySelector('.audio-player');

    playIcon.addEventListener('click', () => {
        handlePlayPause(audioPlayer, playIcon, index);
        if (audioPlayer === currentAudio) {
            audioPlayer.currentTime = parseFloat(localStorage.getItem('currentAudioTime'));
        }
    });

    // Sync the play/pause state with the audio player controls
    audioPlayer.addEventListener('play', () => {
        playIcon.classList.remove("fa-play")
        playIcon.classList.add("fa-pause")
        // startProgressUpdateInterval(audioPlayer);
        highlightCurrentMusicDiv(musicDiv);
    });

    audioPlayer.addEventListener('pause', () => {
        playIcon.classList.add("fa-play")
        playIcon.classList.remove("fa-pause")
        clearInterval(progressUpdateInterval);
    });

    audioPlayer.addEventListener('ended', () => {
        playIcon.classList.add("fa-play")
        playIcon.classList.remove("fa-pause")
        clearInterval(progressUpdateInterval);
        removeHighlightFromMusicDiv(musicDiv);
        if (isRepeating && audioPlayer === currentAudio) {
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        } else {
            playNext();
        }
    });

    audioPlayer.addEventListener('timeupdate', () => {
        const currentTime = formatTime(audioPlayer.currentTime);
        const duration = formatTime(audioPlayer.duration);
        durationCount.innerHTML = `${currentTime}/${duration}`;
        updateProgressBar(audioPlayer);
    });
});

playAudioBar.addEventListener('click', () => {
    if (currentAudio) {
        if (currentAudio.paused) {
            currentAudio.play()
            playAudioBar.classList.remove("fa-play")
            playAudioBar.classList.add("fa-pause")
            if (currentPlayIcon) {
                currentPlayIcon.classList.remove("fa-play");
                currentPlayIcon.classList.add("fa-pause");
            }
            // startProgressUpdateInterval(currentAudio);
            // shows the audio controls bar
            audioControlsBar.classList.remove('hide-player');
        } else {
            currentAudio.pause();
            playAudioBar.classList.remove("fa-pause")
            playAudioBar.classList.add("fa-play")
            if (currentPlayIcon) {
                currentPlayIcon.classList.remove("fa-pause");
                currentPlayIcon.classList.add("fa-play");
            }
            clearInterval(progressUpdateInterval);
        }
    }
});

forwardButton.addEventListener('click', () => {
    playNext();
});

backwardButton.addEventListener('click', () => {
    playPrevious();
});

progressBar.addEventListener('input', () => {
    if (currentAudio) {
        currentAudio.currentTime = (progressBar.value / 100) * currentAudio.duration;
    }
});

// Initialize the volume slider based on the current audio volume
if (currentAudio) {
    volumeSlider.value = currentAudio.volume;
}

volumeSlider.addEventListener('input', () => {
    if (currentAudio) {
        currentAudio.volume = volumeSlider.value;
    }
});

function handlePlayPause(audioPlayer, playIcon, index) {
    // Pause te current audio if it's playing
    if (currentAudio && currentAudio !== audioPlayer) {
        currentAudio.pause();
        currentAudio.currentTime = 0; // Restart the previously playing song
        if (currentPlayIcon) {
            currentPlayIcon.classList.remove("fa-pause");
            currentPlayIcon.classList.add("fa-play");
        }
        playAudioBar.classList.remove("fa-pause")
        playAudioBar.classList.add("fa-play")
    }

     // Toggle the play/pause state
    if (audioPlayer.paused) {
        audioPlayer.play();
        playAudioBar.classList.remove("fa-play")
        playAudioBar.classList.add("fa-pause")
        playIcon.classList.remove("fa-play")
        playIcon.classList.add("fa-pause")
        currentAudio = audioPlayer;
        currentPlayIcon = playIcon;
        currentIndex = index;
        durationBar.textContent = formatTime(audioPlayer.duration);
        updateProgressBar(audioPlayer);
        updateDurationCount(audioPlayer);
        volumeSlider.value = audioPlayer.volume;
        // shows the audio controls bar
        audioControlsBar.classList.remove('hide-player');
        currentArtist.textContent = originalList[index].artist;
        currentTitle.textContent = originalList[index].title;
        highlightCurrentMusicDiv(document.querySelectorAll('.music')[index]);

        

    } else {
        audioPlayer.pause();
        playAudioBar.classList.remove("fa-pause")
        playAudioBar.classList.add("fa-play")
        playIcon.classList.remove("fa-pause")
        playIcon.classList.add("fa-play")
        currentAudio = null;
        currentPlayIcon = null;
        currentIndex = -1
        clearInterval(progressUpdateInterval);
    }
}

function playNext() {
    const list = isShuffled ? shuffledList : originalList;
    if (currentIndex < list.length - 1) {
        currentIndex++;
    } else {
        currentIndex = 0; // loop to the first audio
    }
    playAudioAtCurrentIndex(list);
}

function playPrevious() {
    const list = isShuffled ? shuffledList : originalList;
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = list.length - 1; // loop to the last audio
    }
    playAudioAtCurrentIndex(list);
}

function playAudioAtCurrentIndex(list) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0; // Restart the previously playing song
        // if (currentPlayIcon) currentPlayIcon.textContent = 'play_arrow';
        if (currentPlayIcon) {
            currentPlayIcon.classList.remove("fa-pause");
            currentPlayIcon.classList.add("fa-play");
        }
        removeHighlightFromMusicDiv(document.querySelectorAll('.music')[currentIndex]);
    }

    // const { audioPlayer, playIcon } = audioList[currentIndex];
    const { audioPlayer, playIcon, artist, title, musicDiv } = list[currentIndex];
    audioPlayer.play();
    playAudioBar.classList.remove("fa-play")
    playAudioBar.classList.add("fa-pause")
    playIcon.classList.remove("fa-play")
    playIcon.classList.add("fa-pause")
    durationBar.textContent = formatTime(audioPlayer.duration);
    currentAudio = audioPlayer;
    currentPlayIcon = playIcon;
    updateProgressBar(audioPlayer);
    updateDurationCount(audioPlayer);
    currentArtist.textContent = artist;
    currentTitle.textContent = title;
    highlightCurrentMusicDiv(musicDiv);
}

function updateProgressBar(audioPlayer) {
    const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.value = progressPercent;
}

function updateDurationCount(audioPlayer) {
    durationCount.innerHTML = `${formatTime(audioPlayer.currentTime)}/<span class="duration">${formatTime(audioPlayer.duration)}</span>`;
}

shuffleButton.addEventListener('click', () => {
    isShuffled = !isShuffled;
    if (isShuffled) {
        shufflePlaylist();
        shuffleButton.classList.add('active'); // Add class to indicate shuffle is active
        if (currentAudio) {
            currentIndex = shuffledList.findIndex(item => item.audioPlayer === currentAudio);
            if (currentIndex === -1) {
                currentIndex = 0; // Default to the first song in shuffledList if not found
            }
        }
    } else {
        shuffledList = [];
        shuffleButton.classList.remove('active'); // Remove class to indicate shuffle is inactive
        if (currentAudio) {
            currentIndex = originalList.findIndex(item => item.audioPlayer === currentAudio);
            if (currentIndex === -1) {
                currentIndex = 0; // Default to the first song in originalList if not found
            }
        }
    }
})

repeatButton.addEventListener('click', () => {
    isRepeating = !isRepeating;
    repeatButton.classList.toggle('active', isRepeating); // Toggle class to indicate repeat is active
    if (isRepeating && currentAudio) {
        currentAudio.addEventListener('ended', () => {
            if (isRepeating && currentAudio) {
                currentAudio.currentTime = 0;
                currentAudio.play();
            }
        }, { once: true }); 
    }
});

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function highlightCurrentMusicDiv(musicDiv) {
    document.querySelectorAll('.music').forEach(div => div.classList.remove('active'));
    musicDiv.classList.add('active');
}

function removeHighlightFromMusicDiv(musicDiv) {
    musicDiv.classList.remove('active');
}

function savePlayerState() {
    if (currentAudio) {
        localStorage.setItem('currentAudioIndex', currentIndex);
        localStorage.setItem('currentAudioTime', currentAudio.currentTime);
    }
}

// Save state when the page is unloaded (e.g., refresh or close)
window.addEventListener('beforeunload', savePlayerState);

// Function to load state after refresh
function loadPlayerState() {
    const savedIndex = localStorage.getItem('currentAudioIndex');
    const savedTime = localStorage.getItem('currentAudioTime');
    
    if (savedIndex !== null && savedTime !== null) {
        currentIndex = parseInt(savedIndex);
        const savedAudioPlayer = originalList[currentIndex].audioPlayer;
        const savedPlayIcon = originalList[currentIndex].playIcon;

        savedAudioPlayer.currentTime = parseFloat(savedTime);
        currentAudio = savedAudioPlayer;
        currentPlayIcon = savedPlayIcon;

        // Adjust UI to reflect the loaded state
        durationBar.textContent = formatTime(currentAudio.duration);
        updateProgressBar(currentAudio);
        updateDurationCount(currentAudio);

        // Update current artist and title
        currentArtist.textContent = originalList[currentIndex].artist;
        currentTitle.textContent = originalList[currentIndex].title;
    }
}

// Load state when the page is loaded
window.addEventListener('load', loadPlayerState);

// checks if the current page should exclude the 35-minute audio interruption functionality
const excludeInterruption = document.body.getAttribute('data-exclude-interruption') === 'true';

if (!excludeInterruption) {
    // Define short audio element
    const shortAudioPlayer = document.getElementById('short-audio');
    let hasPausedForShortAudio = false;
    let currentAudio = null;
    let lastShortAudioTime = 0;

    // Function to handle the time update and check for the interval mark
    function handleTimeUpdate() {
        const currentTime = Math.floor(currentAudio.currentTime);
        console.log(`Current time: ${currentTime} seconds`);

        for (const interval of intervals) {
            if (currentTime == interval && !hasPausedForShortAudio && (currentTime - lastShortAudioTime >= 35 * 60)) {
                console.log('Pausing main audio and playing short audio');
                hasPausedForShortAudio = true;

                currentAudio.pause();
                shortAudioPlayer.play();
                lastShortAudioTime = currentTime; // Update last short audio playback time

                shortAudioPlayer.addEventListener('ended', resumeMainAudioOnce, { once: true });
                break; // Exit the loop once the short audio is played
            }
        }
    }

    // Function to resume the main audio
    function resumeMainAudioOnce() {
        console.log('Short audio ended, resuming main audio');

        if (currentAudio) {
            currentAudio.play();
        }
        hasPausedForShortAudio = false;
    }

    // Ensure currentAudio is set and event listener is attached
    musicDivs.forEach((musicDiv, index) => {
        const audioPlayer = musicDiv.querySelector('.audio-player');

        audioPlayer.addEventListener('play', () => {
            currentAudio = audioPlayer;
            console.log('Current audio set:', currentAudio.src);

            hasPausedForShortAudio = false;
            currentAudio.addEventListener('timeupdate', handleTimeUpdate);

        });
    });
}

