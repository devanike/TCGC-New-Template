// Retrieve song details from localStorage
const currentSong = JSON.parse(localStorage.getItem('currentSong'));
const audioPlayer = document.getElementById('audio-player');
const playPauseButton = document.getElementById('play-pause-button');
const durationCount = document.getElementById('duration-count');
const durationSpan = document.querySelector('.duration');
const currentArtist = document.getElementById('current-artist');
const currentTitle = document.getElementById('current-title');
const progressBar = document.getElementById('progress-bar');
const volumeButton = document.getElementById('volume-button');
const volumeSlider = document.getElementById('volume-slider');
const repeatButton = document.getElementById('repeat-button');
const songImage = document.getElementById('song-image');
const backwardButton = document.getElementById('backward-button');

const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const updateDuration = () => {
    if (audioPlayer.duration) {
        durationCount.textContent = `${formatTime(audioPlayer.currentTime)}/${formatTime(audioPlayer.duration)}`;
        durationSpan.textContent = formatTime(audioPlayer.duration);
        progressBar.max = audioPlayer.duration; //  max value of progress bar
    }
};

const updateVolumeIcon = () => {
    const volume = audioPlayer.volume;
    if (volume === 0) {
        volumeButton.classList.remove("fa-volume-low");
        volumeButton.classList.remove("fa-volume-high");
        volumeButton.classList.add("fa-volume-xmark"); // Volume off
    } else if (volume <= 0.5) {
        volumeButton.classList.remove("fa-volume-high"); 
        volumeButton.classList.remove("fa-volume-xmark"); 
        volumeButton.classList.add("fa-volume-low"); // Low volume
    } else {
        volumeButton.classList.remove("fa-volume-xmark"); 
        volumeButton.classList.remove("fa-volume-low"); 
        volumeButton.classList.add("fa-volume-high"); // High volume
    }
};


if (currentSong) {
    // Update the audio player with the song details
    document.getElementById('song-title').textContent = currentSong.song_title;
    document.getElementById('artist-name').textContent = currentSong.artist;
    document.getElementById('audio-source').src = currentSong.src;
    songImage.src = currentSong.image;
    document.getElementById('audio-player').load(); // Load the new audio source
    document.getElementById('audio-player').play(); // Start playing the song

    // Set the initial state of the play/pause button
    const playPauseButton = document.getElementById('play-pause-button');
    playPauseButton.classList.remove("fa-play")
    playPauseButton.classList.add("fa-pause")

    // Update the download button with the current song source
    const downloadButton = document.getElementById('download-button');
    downloadButton.href = currentSong.src;
    downloadButton.download = currentSong.song_title;

    currentTitle.textContent = currentSong.song_title
    currentArtist.textContent = currentSong.artist
    
    // Check if there is a stored playback time
    const storedTime = parseFloat(localStorage.getItem('audioPlayerCurrentTime'));
    if (!isNaN(storedTime)) {
        audioPlayer.currentTime = storedTime; // Set the current playback time
    }

    // Start playing the song if it was playing before refresh
    if (localStorage.getItem('audioPlayerPlaying') === 'true') {
        audioPlayer.play(); // Start playing the song
        playPauseButton.classList.remove("fa-play")
        playPauseButton.classList.add("fa-pause")
        
    }else {
        playPauseButton.classList.remove("fa-pause")
        playPauseButton.classList.add("fa-play")
        
    }

    // playPauseButton.classList.remove("fa-pause")
    // playPauseButton.classList.add("fa-play")

    playPauseButton.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play(); // Play the audio
            playPauseButton.classList.remove("fa-play")
            playPauseButton.classList.add("fa-pause")
            localStorage.setItem('audioPlayerPlaying', 'true');
        } else {
            audioPlayer.pause(); // Pause the audio
            playPauseButton.classList.remove("fa-pause")
            playPauseButton.classList.add("fa-play")
            localStorage.setItem('audioPlayerPlaying', 'false');
        }
    });

    backwardButton.addEventListener('click', () => {
        audioPlayer.currentTime = 0; // Set the current playback time to 0
        audioPlayer.play(); // Start playing the audio
        playPauseButton.classList.remove("fa-play")
        playPauseButton.classList.add("fa-pause")
        localStorage.setItem('audioPlayerPlaying', 'true');
    });

    // Update the play/pause button when the audio ends
    audioPlayer.addEventListener('ended', () => {
        if (repeatButton.dataset.repeat === 'one') {
            audioPlayer.currentTime = 0; // Restart the song
            audioPlayer.play(); // Play the song again
            playPauseButton.classList.remove("fa-play");
            playPauseButton.classList.add("fa-pause");
        } else {
            playPauseButton.classList.remove("fa-pause");
            playPauseButton.classList.add("fa-play");
            localStorage.setItem('audioPlayerPlaying', 'false');
        }
    });

     // Update duration when audio metadata is loaded
    audioPlayer.addEventListener('loadedmetadata', () => {
        playPauseButton.classList.remove("fa-play")
        playPauseButton.classList.add("fa-pause")
        updateDuration();
    });

    // Update current time while the audio is playing
    audioPlayer.addEventListener('timeupdate', () => {
        durationCount.textContent = `${formatTime(audioPlayer.currentTime)}/${formatTime(audioPlayer.duration)}`;
        progressBar.value = audioPlayer.currentTime;
        // Store current playback time in localStorage
        localStorage.setItem('audioPlayerCurrentTime', audioPlayer.currentTime.toString());
    });

    // Seek through the song when the user interacts with the progress bar
    progressBar.addEventListener('input', () => {
        audioPlayer.currentTime = progressBar.value; // Seek to the new time
    });

    // Update volume slider and button when the audio is loaded
    audioPlayer.addEventListener('loadeddata', () => {
        volumeSlider.value = audioPlayer.volume; // Set initial volume slider value
        updateVolumeIcon(); // Update volume button icon
    });

    // Update audio volume when the slider value changes
    volumeSlider.addEventListener('input', () => {
        audioPlayer.volume = volumeSlider.value; // Set audio volume
        updateVolumeIcon(); // Update volume button icon
    });
    
    // Toggle mute and unmute when the volume button is clicked
    volumeButton.addEventListener('click', () => {
        if (audioPlayer.volume > 0) {
            audioPlayer.volume = 0; // Mute the audio
            volumeSlider.value = 0; // Update volume slider
            volumeButton.classList.remove("fa-volume-low");
            volumeButton.classList.remove("fa-volume-high");
            volumeButton.classList.add("fa-volume-xmark");
        } else {
            audioPlayer.volume = 1; // Restore the audio volume
            volumeSlider.value = 1; // Update volume slider
            volumeButton.classList.remove("fa-volume-xmark"); 
            volumeButton.classList.remove("fa-volume-low"); 
            volumeButton.classList.add("fa-volume-high");
        }
    });

    // Repeat button click event listener
    repeatButton.addEventListener('click', () => {
        repeatButton.classList.toggle("active");
        // Toggle the repeat mode between 'off' and 'one'
        if (repeatButton.classList.contains("active")) {
            repeatButton.dataset.repeat = 'one'; // Set repeat mode to one
        } else {
            repeatButton.dataset.repeat = 'off'; // Set repeat mode to off
        }
    });

    // checks if the current page should exclude the 35-minute audio interruption functionality
    const excludeInterruption = document.body.getAttribute('data-exclude-interruption') === 'true';

    if (!excludeInterruption) {
        // Define short audio element
        const shortAudioPlayer = document.getElementById('short-audio');
        // const intervalDuration = 35 * 60; 
        let nextPauseTime = intervalDuration; 
        let hasPausedForShortAudio = false;

        // Function to handle the time update and check for the interval mark
        function handleTimeUpdate() {
            // if (!currentSong) {
            //     console.log('No current audio playing');
            //     return;
            // }

            const currentTime = Math.floor(audioPlayer.currentTime);
            console.log(`Current time: ${currentTime} seconds`);

            if (currentTime >= nextPauseTime && !hasPausedForShortAudio) {
                console.log('Pausing main audio and playing short audio');
                hasPausedForShortAudio = true;

                audioPlayer.pause();
                shortAudioPlayer.play();

                shortAudioPlayer.addEventListener('ended', resumeMainAudioOnce, { once: true });
            }
        }

        // Function to resume the main audio
        function resumeMainAudioOnce() {
            console.log('Short audio ended, resuming main audio');

            if (audioPlayer) {
                audioPlayer.play();
            }
            hasPausedForShortAudio = false;
            nextPauseTime += intervalDuration;
        }

        audioPlayer.addEventListener('timeupdate', handleTimeUpdate);
    }

}
