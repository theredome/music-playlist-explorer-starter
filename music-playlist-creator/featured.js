document.addEventListener('DOMContentLoaded', () => {
    // Function to save like state to localStorage
function saveLikeState(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Function to get like state from localStorage
function getLikeState(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

    const playlists = data.playlists;
    const randomPlaylist = playlists[Math.floor(Math.random() * playlists.length)];
    
    const featuredImage = document.querySelector('.playlistImg');
    const featuredName = document.querySelector('.playlistName');
    const featuredCreator = document.getElementById('featured-creator');
    
    featuredImage.src = randomPlaylist.playlist_art;
    featuredName.textContent = randomPlaylist.playlist_name;
    featuredCreator.innerText = `by ${randomPlaylist.playlist_creator}`;

    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = ''; // Clear existing content

    function displayRandomSongs(playlist) {
        playlist.songs.forEach(song => {
            const songDiv = document.createElement('div');
            songDiv.className = 'modal-song';
            songDiv.innerHTML = `
                <div class="modal-song-img">
                    <img src="${song.cover_art}" alt="${song.title}">
                </div>
                <div class="modal-song-info">
                    <div class="song-details">
                        <h3 class="song-title">${song.title}</h3>
                        <p class="song-artist">${song.artist}</p>
                    </div>
                    <div class="song-album">
                        <p>${song.album}</p>
                    </div>
                    <div>
                        <i class="fa-regular fa-heart song-like" data-song-id="${song.songID}"></i>
                    </div>
                </div>
                <div class="modal-song-duration">
                    <p>${song.duration}</p>
                </div>
            `;

            const songLikeIcon = songDiv.querySelector('.song-like');
        if (song.liked) {
            songLikeIcon.classList.add('liked');
        }

        songLikeIcon.onclick = function() {
            song.liked = !song.liked;
            if (song.liked) {
                songLikeIcon.classList.add('liked');
            } else {
                songLikeIcon.classList.remove('liked');
            }
        };

            modalBody.appendChild(songDiv);
        });
    }

    displayRandomSongs(randomPlaylist);
});
