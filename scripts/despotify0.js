// despotify0.js:

// Variables globales para almacenar los datos de canciones y playlists
let songs = [];
let playlists = [];
let currentPlaylistId = 4; // Asumiendo que la última lista es la que tiene id 4

// Función para cargar las canciones y playlists al iniciar la aplicación
document.addEventListener('DOMContentLoaded', function() {
  loadSongs();
  loadPlaylists();
  //para rascar el 0.75
  loadUserPlaylist();
  calculateStatistics();

  // llamar a esta función al cargar la página
  initViewType(); 
});


// Funciones para cargar datos desde la API
function loadSongs() {
  fetch('https://my-json-server.typicode.com/luismiguel-fernandez/examen/songs')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      songs = data;
      renderSongsAsCards();
      initViewType(); // Asegúrate de inicializar la vista después de cargar las canciones
    })
    .catch(error => {
      console.error('Error fetching songs:', error);
    });
}

function loadPlaylists() {
  fetch('https://my-json-server.typicode.com/luismiguel-fernandez/examen/playlists')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      playlists = data;
      renderPlaylists();
      loadUserPlaylist(); // Asegúrate de cargar la playlist del usuario después de cargar las playlists
    })
    .catch(error => {
      console.error('Error fetching playlists:', error);
    });
}


// Funciones para renderizar las canciones y las playlists
function renderSongsAsCards() {
  const songListElement = document.getElementById('songList');
  songListElement.innerHTML = ''; // Limpiar el contenedor antes de renderizar
  songs.forEach(song => {
      const songCard = `
          <div class="col-md-2 card" style="width: 18rem;">
              <div class="card-body">
                  <h5 class="card-title">${song.title}</h5>
                  <p class="card-text">${song.artist}</p>
                  <p class="card-text">${song.length}</p>
                  <button onclick="addToPlaylist(${song.id})" class="btn btn-primary">Add to Playlist</button>
              </div>
          </div>`;
      songListElement.innerHTML += songCard;
  });
}

function renderSongsAsRows() {
  const songListElement = document.getElementById('songList');
  songListElement.innerHTML = ''; // Limpiar el contenedor antes de renderizar
  
  // Crear un contenedor para las filas si no existe
  let listContainer = document.createElement('div');
  listContainer.className = 'list-group';

  songs.forEach(song => {
      const songRow = `
          <a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
              <div class="d-flex w-100 justify-content-between">
                  <h5 class="mb-1">${song.title}</h5>
                  <small>${song.duration}</small>
              </div>
              <p class="mb-1">${song.artist}</p>
              <button onclick="addToPlaylist(${song.id})" class="btn btn-primary btn-sm">Add to Playlist</button>
          </a>`;
      listContainer.innerHTML += songRow;
  });

  songListElement.appendChild(listContainer);
}


function renderPlaylists() {
  const playlistsElement = document.getElementById('playlists').querySelector('.list-group');
  playlistsElement.innerHTML = ''; // Limpiar el contenedor antes de renderizar
  playlists.forEach(playlist => {
      const playlistItem = `
          <li class="list-group-item">${playlist.name} - ${playlist.songs.length} songs</li>`;
      playlistsElement.innerHTML += playlistItem;
  });
}


// Función para añadir canciones a la playlist con localStorage
function addToPlaylist(songId) {
  const playlist = playlists.find(p => p.id === currentPlaylistId);
  if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      alert("Song added to the playlist!");
      // Guardar la playlist actualizada en LocalStorage
      localStorage.setItem('userPlaylist', JSON.stringify(playlist.songs));
  } else {
      alert("This song is already in the playlist.");
  }
}



// Función para la búsqueda
function searchSongs(pattern) {
  const searchResult = songs.filter(song =>
      song.title.toLowerCase().includes(pattern.toLowerCase()) ||
      song.artist.toLowerCase().includes(pattern.toLowerCase())
  );
  songs = searchResult; // Actualizar el array de canciones con los resultados
  renderSongsAsCards(); // Volver a renderizar las tarjetas con los resultados
}


// Función para calcular y mostrar estadísticas
function calculateStatistics() {
  document.getElementById('stat1').innerText = songs.length;
  document.getElementById('stat2').innerText = playlists.length;
  document.getElementById('stat3').innerText = (songs.length / playlists.length).toFixed(2);
  // Asumiendo que tienes funciones o lógica para calcular los demás
  // Ejemplo:
  //document.getElementById('stat4').innerText = calculateNumberOfArtists();
  //document.getElementById('stat5').innerText = topSongByLength();
}


// Event listeners para el buscador y el interruptor de vista
document.querySelector('#search button').addEventListener('click', function() {
  const pattern = document.querySelector('#search input').value;
  searchSongs(pattern);
});

document.querySelector('#viewSwitch input').addEventListener('change', function() {
  if (this.checked) {
      renderSongsAsCards();
  } else {
      renderSongsAsRows(); // Necesitas implementar esta función según tus requisitos
  }
});

//modificar la función loadUserPlaylist para que cargue la playlist del usuario desde el LocalStorage
function loadUserPlaylist() {
  const storedPlaylist = localStorage.getItem('userPlaylist');
  if (storedPlaylist) {
      const playlistSongs = JSON.parse(storedPlaylist);
      // Encuentra la playlist y verifica que existe antes de asignarle las canciones
      const playlist = playlists.find(p => p.id === currentPlaylistId);
      if (playlist) {
          playlist.songs = playlistSongs;
      }
  }
}

//Cada vez que el usuario cambie el tipo de vista, guardo esta preferencia en el LocalStorage:
document.querySelector('#viewSwitch input').addEventListener('change', function() {
  if (this.checked) {
      renderSongsAsCards();
      localStorage.setItem('viewType', 'cards');
  } else {
      renderSongsAsRows();
      localStorage.setItem('viewType', 'rows');
  }
});
//Cargar el Tipo de Vista al Iniciar la Aplicación
function initViewType() {
  const viewType = localStorage.getItem('viewType');
  const viewSwitch = document.querySelector('#viewSwitch input');
  if (viewType === 'rows') {
      viewSwitch.checked = false;
      renderSongsAsRows();
  } else {
      // Por defecto o si está guardado como 'cards'
      viewSwitch.checked = true;
      renderSongsAsCards();
  }
}

