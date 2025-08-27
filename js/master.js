const slidermusic = document.querySelector('swiper-container');
const favoritesContainers = document.querySelectorAll('.favorites'); // چندتا کانتینر برای ریسپانسیو
const url = 'https://688e8b97f21ab1769f870518.mockapi.io/music/music';
const sidebar=document.getElementById("side-bar");
const favbtn=document.querySelector(".sidebar");
const close=document.querySelector('.close-fav-sidebar');
let i = 0
let a = 0
favbtn.addEventListener( 'click' ,()=>{
  i++
  if(i==1){
    sidebar.style.left="0px"
    sidebar.style.transition='0.8s'
  }
    close.addEventListener('click' , ()=>{
      i=0
     sidebar.style.left="-1000px"
    })
  
})


// پلیر صوتی
const audioPlayer = new Audio();
let currentIndex = -1;
let playlist = [];

// عناصر پلیر
const player = document.getElementById('player');
const playerCover = document.getElementById('player-cover');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const playerProgress = document.getElementById('player-progress');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const vol = document.querySelector('.vol');
const volumeControl = document.getElementById('volume-control');

// علاقه‌مندی‌ها از localStorage
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
function saveFavorites() {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

// 📌 ساخت آیتم علاقه‌مندی
function createFavItem({ cover, name, artist, music }, starRef = null) {
  const favItem = document.createElement('div');
  favItem.classList.add(
    'fav-item', 'w-full', 'h-[80px]', 'flex', 'flex-wrap',
    'bg-white/10', 'rounded-lg', 'transition-all', 'duration-300', 'cursor-pointer'
  );
  favItem.dataset.name = name;

  favItem.innerHTML = `
    <img src="${cover}" class="w-1/5 h-full rounded-md object-cover">
    <div class="w-4/5 flex justify-center items-center my-1">
       <div class="w-4/5 h-full flex flex-wrap">
         <p class="pl-2 w-full text-white text-xl font-semibold">${name}</p>
         <p class="hidden md:block pl-2 text-gray-300 text-lg">${artist}</p>
       </div>
       <span class="remove-btn w-1/5 text-xl text-red-600 flex justify-end pr-2 cursor-pointer">❤︎</span>
    </div>
  `;

  // 📌 پخش آهنگ از علاقه‌مندی
  favItem.addEventListener('click', (e) => {
    if (!e.target.classList.contains('remove-btn')) {
      const index = playlist.findIndex(s => s.name === name);
      if (index !== -1) loadSong(index);
    }
  });

  // 📌 حذف از علاقه‌مندی
  favItem.querySelector('.remove-btn').addEventListener('click', () => {
    favorites = favorites.filter(f => f.name !== name);
    saveFavorites();
    document.querySelectorAll(`.fav-item[data-name="${name}"]`).forEach(el => el.remove());
    if (starRef) starRef.style.color = 'white';
  });

  // 📌 اضافه کردن به همه کانتینرهای Favorites (ریسپانسیو)
  favoritesContainers.forEach(container => container.appendChild(favItem.cloneNode(true)));
}

// 📌 لود آهنگ در پلیر
function loadSong(index) {
  const song = playlist[index];
  if (!song) return;

  playerCover.src = song.cover;
  playerTitle.textContent = song.name;
  playerArtist.textContent = song.artist;
  audioPlayer.src = song.music;

  player.classList.remove('hidden');
  audioPlayer.play();

  currentIndex = index;
  playBtn.textContent = '⏸';
}

// 📌 کنترل پخش / توقف
function togglePlay() {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playBtn.textContent = '⏸';
  } else {
    audioPlayer.pause();
    playBtn.textContent = '▶';
  }
}

// 📌 آهنگ بعدی
function nextSong() {
  currentIndex = (currentIndex + 1) % playlist.length;
  loadSong(currentIndex);
}

// 📌 آهنگ قبلی
function prevSong() {
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  loadSong(currentIndex);
}

// 📌 برو جلو / عقب با Progress
audioPlayer.addEventListener('timeupdate', () => {
  playerProgress.value = (audioPlayer.currentTime / audioPlayer.duration) * 100 || 0;
});
playerProgress.addEventListener('input', () => {
  audioPlayer.currentTime = (playerProgress.value / 100) * audioPlayer.duration;
});

// 📌 تنظیم صدا

vol.addEventListener('click', () => {
  if (volumeControl.classList.contains('opacity-0')) {
    volumeControl.classList.remove('opacity-0', 'pointer-events-none', '-translate-x-10');
    volumeControl.classList.add('opacity-100', 'pointer-events-auto', 'translate-x-2');
  } else {
    volumeControl.classList.remove('opacity-100', 'pointer-events-auto', 'translate-x-2');
    volumeControl.classList.add('opacity-0', 'pointer-events-none', '-translate-x-10');
  }
});
volumeControl.addEventListener('input', () => {
  audioPlayer.volume = volumeControl.value;
});

// 📌 اتصال دکمه‌ها
playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);

// 📌 لود علاقه‌مندی‌های قبلی
favorites.forEach(item => createFavItem(item));

// 📌 گرفتن دیتا از API
fetch(url)
  .then(res => res.ok ? res.json() : Promise.reject(res.status))
  .then(data => {
    playlist = data;
    data.forEach(val => {
      let art = document.createElement('swiper-slide');
      art.classList.add(
        'bg-center', 'bg-cover', 'bg-white/10',
        'w-[200px]', 'h-[250px]', 'md:w-[300px]', 'md:h-[300px]',
        'border', 'rounded-3xl', 'flex', 'flex-wrap', 'cursor-pointer'
      );

      art.innerHTML = `
        <img class="block w-full h-8/12 rounded-tl-3xl rounded-tr-3xl" src="${val.cover}" />
        <div class="favstar w-full flex">
          <h3 class="text-white w-4/5 pl-2 mt-2">${val.name}</h3>
          <span class="star w-1/5 text-xl rounded-md text-white flex justify-center items-center cursor-pointer">❤︎</span>
        </div>
        <h5 class="text-white w-4/5 pl-2">${val.artist}</h5>
        <h5 class="text-white w-1/5 flex justify-end pr-2">${val.time}</h5>
      `;

      slidermusic.appendChild(art);

      const star = art.querySelector('.star');

      // 📌 کلیک روی کارت → پخش
      art.addEventListener('click', (e) => {
        if (!e.target.classList.contains('star')) {
          const index = playlist.indexOf(val);
          loadSong(index);
        }
      });

      // 📌 کلیک روی قلب → افزودن / حذف
      star.addEventListener('click', (e) => {
        e.stopPropagation();
        const isFav = favorites.some(f => f.name === val.name);

        if (isFav) {
          favorites = favorites.filter(f => f.name !== val.name);
          saveFavorites();
          document.querySelectorAll(`.fav-item[data-name="${val.name}"]`).forEach(el => el.remove());
          star.style.color = 'white';
        } else {
          const favData = { cover: val.cover, name: val.name, artist: val.artist, music: val.music };
          favorites.push(favData);
          saveFavorites();
          createFavItem(favData, star);
          star.style.color = 'red';
        }
      });
    });
  })
  .catch(err => console.log("خطا در دریافت دیتا:", err));