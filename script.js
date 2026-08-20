const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible'));
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const heroVideo = document.querySelector('.hero video');
if(heroVideo) document.addEventListener('visibilitychange', () => document.hidden ? heroVideo.pause() : heroVideo.play().catch(() => {}));

const video = document.querySelector('#featureVideo');
const play = document.querySelector('.play');
const title = document.querySelector('#reelTitle');
const type = document.querySelector('#reelType');
const number = document.querySelector('#reelNo');
const reelButtons = [...document.querySelectorAll('.reel-list button')];

if(video&&play){
  function togglePlay(){
    if(video.paused){ video.play(); play.textContent='Ⅱ'; }
    else { video.pause(); play.textContent='▶'; }
  }
  play.addEventListener('click', togglePlay);
  video.addEventListener('click', togglePlay);
  reelButtons.forEach((button, index) => button.addEventListener('click', () => {
    reelButtons.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    video.src = button.dataset.video;
    title.textContent = button.dataset.title;
    type.textContent = button.dataset.type;
    number.textContent = String(index + 1).padStart(2, '0');
    video.play(); play.textContent='Ⅱ';
  }));
}
