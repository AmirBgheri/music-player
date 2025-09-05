// 🎵 گرفتن کانتینر اصلی اسلایدر
const slidermusic = document.querySelector('swiper-container');

// 📌 همه کانتینرهای favorite (ریسپانسیو: دسکتاپ + سایدبار موبایل)
const favoritesContainers = document.querySelectorAll('.favorites');

// 📌 API
const url = 'https://688e8b97f21ab1769f870518.mockapi.io/music/music';

// 📌 دکمه‌های سایدبار علاقه‌مندی‌ها
const favBtn = document.querySelector('.fav-btn');
const sideBar = document.getElementById('side-bar');
const closeBtn = sideBar.querySelector('.close-fav-sidebar');

// 🎵 پلیر صوتی
const audioPlayer = new Audio();
let currentIndex = -1;
let playlist = [];

// 📌 عناصر پلیر
const player = document.getElementById('player');
const playerCover = document.getElementById('player-cover');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const playerProgress = document.getElementById('player-progress');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const vols = document.querySelectorAll('.vol');
const volumeControls = document.querySelectorAll('.volume-control');
const bgtoggle = document.getElementById('bg-toggle');
const mainbg = document.getElementById('main-bg');
const bgtogglebtn = document.getElementById('bg-togglebtn');
const dark = document.querySelectorAll('.dark');
let i = 0;
const slider = document.querySelector('.slider');
const overlay = document.getElementById("overlay");
const playNow = document.getElementById("play-now");
const header = document.getElementById("header");
const main = document.getElementById("main-part");
const vid = document.getElementById("videobg");
const topsongcolor = document.getElementById("top-songcolor");
console.log(topsongcolor);

// نمایش
function showOverlay() {
  overlay.classList.remove("hidden");
  setTimeout(() => overlay.classList.add("opacity-100"), 10);
}

// مخفی شدن
// مخفی شدن اوورلی
playNow.addEventListener("click", () => {
  overlay.classList.remove("opacity-100");

  // بعد 500ms اوورلی حذف شه
  setTimeout(() => {
    overlay.classList.add("hidden");
    vid.style.opacity = '0'
  }, 300);
  setTimeout(() => vid.pause(), 1000);

  // بعد 600ms هدر بیاد سر جاش
  setTimeout(() => {
    header.style.translate = "0px";
  }, 600);

  // بعد 700ms مین اسکیل شه
  setTimeout(() => {
    main.classList.add("scale-100");
  }, 700);

  setTimeout(() => {
    slider.style.translate = "0px";
  }, 900);
});




bgtoggle.addEventListener('click', () => {
  if (i == 0) {
    mainbg.style.backgroundImage = "url('img/white bg.jpg')";
    bgtoggle.style.left = "0px";
    bgtogglebtn.style.backgroundImage = "linear-gradient(to right, #DEDEDE, #3D1600)";
    bgtoggle.style.background = "white";
    dark[0].style.color = 'black';
    dark[1].style.color = 'black';
    dark[2].style.color = 'black';
    topsongcolor.style.color = 'black';
    i = 1;
  } else {
    mainbg.style.backgroundImage = "url('img/Moderne\ woonkamer\ met\ open\ haard.png')";
    bgtoggle.style.left = "40px";
    dark[0].style.color = 'white';
    dark[1].style.color = 'white';
    dark[2].style.color = 'white';
    topsongcolor.style.color = 'white';
    bgtoggle.style.background = "#733F00";
    i = 0;
  }
})
// 📌 علاقه‌مندی‌ها از localStorage
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
function saveFavorites() {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

// =========================
// 🎵 مدیریت سایدبار موبایل
// =========================
favBtn.addEventListener('click', () => {
  sideBar.style.opacity='1'
  sideBar.classList.remove('-translate-x-full');
  sideBar.classList.add('translate-x-0');
});
closeBtn.addEventListener('click', () => {
  sideBar.classList.remove('translate-x-0');
  sideBar.classList.add('-translate-x-full');
});

// =========================
// 🎵 ساخت آیتم علاقه‌مندی
// =========================
function createFavItem({ cover, name, artist, music }, starRef = null) {
  const favItemHTML = `
    <div class="fav-item w-full h-[80px] flex flex-wrap
                bg-white/10 rounded-lg transition-all duration-300 cursor-pointer"
         data-name="${name}">
      <img src="${cover}" class="w-1/5 h-full rounded-md object-cover">
      <div class="w-4/5 flex justify-center items-center my-1">
         <div class="w-4/5 h-full flex flex-wrap">
           <p class="pl-2 w-full text-white text-xl font-semibold">${name}</p>
           <p class="pl-2 text-gray-300 text-lg">${artist}</p>
         </div>
         <span class="remove-btn w-1/5 text-xl text-red-600 flex justify-end pr-2 cursor-pointer">❤︎</span>
      </div>
    </div>
  `;

  // اضافه کردن به همه کانتینرها (دسکتاپ + موبایل)
  favoritesContainers.forEach(container => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = favItemHTML;
    const favItem = wrapper.firstElementChild;

    // 📌 پخش آهنگ با کلیک روی آیتم
    favItem.addEventListener('click', (e) => {
      if (!e.target.classList.contains('remove-btn')) {
        const index = playlist.findIndex(s => s.name === name);
        if (index !== -1) loadSong(index);
      }
    });

    // 📌 حذف از علاقه‌مندی‌ها
    favItem.querySelector('.remove-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      favorites = favorites.filter(f => f.name !== name);
      saveFavorites();
      document.querySelectorAll(`.fav-item[data-name="${name}"]`).forEach(el => el.remove());
      if (starRef) starRef.style.color = 'white';
    });

    container.appendChild(favItem);
  });
}

// =========================
// 🎵 لود آهنگ در پلیر
// =========================
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
  // دکمه Pause نشون داده بشه
  playBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" 
         viewBox="0 -960 960 960" width="24px" fill="#fff">
      <path d="M320-200v-560h120v560H320Zm200 0v-560h120v560H520Z"/>
    </svg>
  `;
}

// =========================
// 🎵 کنترل پخش / توقف
// =========================
function togglePlay() {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" 
           viewBox="0 -960 960 960" width="24px" fill="#fff">
        <path d="M320-200v-560h120v560H320Zm200 0v-560h120v560H520Z"/>
      </svg>
    `;
  } else {
    audioPlayer.pause();
    playBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" 
           viewBox="0 -960 960 960" width="24px" fill="#fff">
        <path d="M320-200v-560l440 280-440 280Z"/>
      </svg>
    `;
  }
}

// =========================
// 🎵 آهنگ بعدی و قبلی
// =========================
function nextSong() {
  currentIndex = (currentIndex + 1) % playlist.length;
  loadSong(currentIndex);
}
function prevSong() {
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  loadSong(currentIndex);
}

// =========================
// 🎵 Progress Bar
// =========================
audioPlayer.addEventListener('timeupdate', () => {
  playerProgress.value = (audioPlayer.currentTime / audioPlayer.duration) * 100 || 0;
});
playerProgress.addEventListener('input', () => {
  audioPlayer.currentTime = (playerProgress.value / 100) * audioPlayer.duration;
});

// =========================
// 🎵 کنترل صدا (موبایل + دسکتاپ)
// =========================
vols.forEach((vol, index) => {
  const volumeControl = volumeControls[index];

  vol.addEventListener('click', () => {
    if (volumeControl.classList.contains('opacity-0')) {
      volumeControl.classList.remove('opacity-0', 'pointer-events-none');
      volumeControl.classList.add('opacity-100', 'pointer-events-auto');
    } else {
      volumeControl.classList.remove('opacity-100', 'pointer-events-auto');
      volumeControl.classList.add('opacity-0', 'pointer-events-none');
    }
  });

  volumeControl.addEventListener('input', () => {
    audioPlayer.volume = parseFloat(volumeControl.value);
  });
});

// =========================
// 🎵 اتصال دکمه‌ها
// =========================
playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);

// =========================
// 🎵 لود علاقه‌مندی‌های قبلی
// =========================
favorites.forEach(item => createFavItem(item));

// =========================
// 🎵 گرفتن دیتا از API
// =========================
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
      // اگه آهنگ توی favorites باشه → قلب قرمز
      if (favorites.some(f => f.name === val.name)) {
        star.style.color = 'red';
      }

      // 📌 کلیک روی کارت → پخش
      art.addEventListener('click', (e) => {
        if (!e.target.classList.contains('star')) {
          const index = playlist.indexOf(val);
          loadSong(index);
        }
      });

      // 📌 کلیک روی قلب → افزودن / حذف
      star.addEventListener('click', (e) => {
        e.stopPropagation(); // جلوگیری از پخش آهنگ
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

