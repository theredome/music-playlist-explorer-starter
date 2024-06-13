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

            // Get like state from localStorage
            const savedSongState = getLikeState(song.songID);
            if (savedSongState && savedSongState.liked) {
                song.liked = savedSongState.liked;
                if (song.liked) {
                    songLikeIcon.classList.add('liked');
                }
            }

            songLikeIcon.onclick = function() {
                song.liked = !song.liked;
                if (song.liked) {
                    songLikeIcon.classList.add('liked');
                } else {
                    songLikeIcon.classList.remove('liked');
                }

                // Save song like state to localStorage
                saveLikeState(song.songID, { liked: song.liked });
            };

            modalBody.appendChild(songDiv);
        });
    }

    displayRandomSongs(randomPlaylist);

    // Function to display playlists
    function displayPlaylists(playlistsToDisplay) {
        const container = document.querySelector('.playlist-cards');
        container.innerHTML = ''; // Clear existing playlists
        playlistsToDisplay.forEach(playlist => {
            const playlistCard = document.createElement('div');
            playlistCard.className = 'playlist-card';
            playlistCard.innerHTML = `
                <img src="${playlist.playlist_art}" alt="${playlist.playlist_name}">
                <h3>${playlist.playlist_name}</h2>
                <p>${playlist.playlist_creator}</p>
            `;
            playlistCard.onclick = () => showModal(playlist);
            container.appendChild(playlistCard);
        });
    }

    // Function to filter playlists based on search query
    function filterPlaylists(query) {
        const filteredPlaylists = data.playlists.filter(playlist => 
            playlist.playlist_name.toLowerCase().includes(query.toLowerCase()) ||
            playlist.playlist_creator.toLowerCase().includes(query.toLowerCase())
        );
        displayPlaylists(filteredPlaylists);
    }

    // Event listener for search input
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', (event) => {
        const query = event.target.value;
        filterPlaylists(query);
    });
});
