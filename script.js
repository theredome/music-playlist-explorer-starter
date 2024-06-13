document.addEventListener("DOMContentLoaded", () => {
    // Function to save like state to localStorage
    function saveLikeState(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    // Function to get like state from localStorage
    function getLikeState(key) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }

    // Get the modal
    const modal = document.getElementById("modal-playlist");

    // Get all elements with the class "playlist-card"
    const playlistCards = document.querySelectorAll(".playlist-card");

    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName("close")[0];

    // When the user clicks on any playlist card, open the modal
    playlistCards.forEach(card => {
        card.onclick = function() {
            modal.style.display = "block";
        }
    });

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    const playlistLikeIcon = document.querySelector(".playlist-like");
    const likeCountSpan = document.querySelector("#playlist-like-count");

    function showModal(playlist) {
        // Set playlist image, name, and creator
        document.querySelector('.playlistImg').src = playlist.playlist_art;
        document.querySelector('.playlistImg').alt = playlist.playlist_name;
        document.querySelector('.playlistName').innerText = playlist.playlist_name;
        document.querySelector('.playlistCreator').innerText = `by ${playlist.playlist_creator}`;
        playlist.likeCount = Math.floor((Math.random() * 130000));
        console.log(playlist.likeCount);
        likeCountSpan.textContent = playlist.likeCount;

        // Get like state from localStorage
        const savedState = getLikeState(playlist.playlist_name);
        if (savedState) {
            playlist.liked = savedState.liked;
            playlist.likeCount = savedState.likeCount;
        }

        // Update the like icon state
        if (playlist.liked) {
            playlistLikeIcon.classList.add('liked');
        } else {
            playlistLikeIcon.classList.remove('liked');
        }

        // Event listener for the playlist like icon
        playlistLikeIcon.onclick = function() {
            playlist.liked = !playlist.liked;
            if (playlist.liked) {
                playlist.likeCount++;
                playlistLikeIcon.classList.add('liked');
            } else {
                playlist.likeCount--;
                playlistLikeIcon.classList.remove('liked');
            }
            likeCountSpan.textContent = playlist.likeCount;

            // Save like state to localStorage
            saveLikeState(playlist.playlist_name, {
                liked: playlist.liked,
                likeCount: playlist.likeCount
            });
        }

        // Populate songs in the modal body
        populateSongs(playlist.songs);

        modal.style.display = "block";
    }

    function populateSongs(songs) {
        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = ''; // Clear existing content
        songs.forEach(song => {
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
                // Save song like state to localStorage
                saveLikeState(song.songID, { liked: song.liked });
            };

            // Get song like state from localStorage
            const savedSongState = getLikeState(song.songID);
            if (savedSongState && savedSongState.liked) {
                song.liked = savedSongState.liked;
                songLikeIcon.classList.add('liked');
            }

            modalBody.appendChild(songDiv);
        });
    }

    // Function to shuffle an array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Event listener for the shuffle button
    const shuffleButton = document.getElementById("shuffle-button");
    shuffleButton.addEventListener("click", function() {
        const playlist = getCurrentPlaylist(); // Get the currently displayed playlist
        const shuffledSongs = shuffleArray([...playlist.songs]); // Shuffle a copy of the songs array
        populateSongs(shuffledSongs); // Update the modal with shuffled songs
    });

    function getCurrentPlaylist() {
        // Get the name of the currently displayed playlist
        const playlistName = document.querySelector('.playlistName').innerText;
        // Find the playlist object in data that matches the playlist name
        return data.playlists.find(playlist => playlist.playlist_name === playlistName);
    }

    // Function to iterate and display playlist cards
    function playlistIterator() {
        const container = document.querySelector('.playlist-cards');
        data.playlists.forEach(playlist => {
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

    playlistIterator();

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
