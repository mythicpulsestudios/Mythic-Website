/* app.js
   Simple SPA blog using hash routing.
   - Index lists posts with excerpts
   - Clicking a post shows full content and updates hash to #post/slug
   - Back (and browser back) returns to list
   - Search filter included
   - Emoji click effects added (only new feature)
*/

/* ======= Data: add/modify posts here ======= */
const POSTS = [
  {
    id: "godot-theme-checker",
    title: "Godot One Hour Game Jam — Theme Checker",
    date: "2024-12-12",
    excerpt: "A small Godot tool I made to explore which themes have been used in past One Hour Game Jams — quick input + submit indicates whether a word has already been used.",
    content: `
<p>I wanted to share a simple Godot project I created for myself, primarily to explore which theme topics have or haven't been used in past One Hour Game Jams. My goal was to explore Godot more and experiment with different ways to build things. While it's easy to check the Hyper Game Dev website for the themes used in past jams, which are updated weekly, I felt inspired to create a more interactive way to discover them.</p>

<p>This project lets you input a theme from previous jams and click a "Submit" button. If the theme has been used before, a text label will appear saying <strong>"Word already used."</strong> If the theme hasn't been used yet, another message will let you know the topic is still available. It's a fun, simple way to explore and discover new themes for the One Hour Game Jams.</p>

<p>I really appreciate how easy Godot makes it to create 2D user interfaces with text and effects, allowing for simple test games. While the main purpose of Godot is game development, it's also fun to explore creative ways to use the engine.</p>

<p><strong>Project page:</strong> <a href="https://nova-vertigo.itch.io/topic-theme-finder" target="_blank" rel="noopener noreferrer">View on itch.io</a></p>
    `
  },
  {
    id: "theme-randomizer",
    title: "Godot Theme Randomizer — Spin for a Jam Topic",
    date: "2024-07-23",
    excerpt: "A theme randomizer that spins for a topic. Over 200 words compiled and expanding. Considering itch.io or a Windows build — feedback welcome!",
    content: `
<p>I've developed a game jam theme randomizer tool with Godot that lets you spin for a topic theme. Currently, I've compiled over 200 word lists and I'm actively adding more.</p>

<p>My aim was to keep the words simple yet relevant across all game genres. Whether you enjoy racing games or other genres, I've included words that align with these terms. Instead of using complicated language, I've focused on words that can inspire and define potential game jam themes effectively.</p>

<p>Below I have showcased my working main menu and the spinning button in action — everything should be functioning properly at the moment. I'm not sure if I should share my project as an itch.io page or export my project as a Windows application.</p>

<p><a href="https://youtu.be/7PLM-UMel90" target="_blank" rel="noopener noreferrer">Watch the demo video on YouTube</a></p>

<p>If you'd like to test the project and provide feedback, I'd love to hear from you!</p>
    `
  }
];

/* ======= Helpers ======= */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const app = $("#app");
const searchInput = document.getElementById("searchInput");
const menuToggle = document.getElementById("menuToggle");
const subMenu = document.getElementById("subMenu");

/* initialize */
function init(){
  renderList();              // show list by default
  window.addEventListener("hashchange", handleRoute);
  searchInput.addEventListener("input", handleSearch);
  document.body.addEventListener("click", handleDelegate);
  menuToggle.addEventListener("click", toggleMenu);
  // emoji effects: spawn when clicking buttons or menu links
  addEmojiEffects();
  // initial route if any
  handleRoute();
}

/* routing: uses hash like #post/id or #home */
function handleRoute(){
  const hash = location.hash || "#home";
  if(hash.startsWith("#post/")){
    const id = hash.split("/")[1];
    const post = POSTS.find(p => p.id === id);
    if(post) renderPost(post);
    else renderNotFound();
  } else if(hash === "#about"){
    renderAbout();
  } else if(hash === "#contact"){
    renderContact();
  } else {
    renderList();
  }
}

/* Render blog list */
function renderList(filter=""){
  document.title = "mythicpulsestudios — Blog";
  app.innerHTML = `
    <section>
      <h2 style="margin:0 0 12px 0; font-size:1.25rem; color: #0f1724;">Latest Posts</h2>
      <div class="grid" id="postsGrid"></div>
    </section>
  `;
  const grid = $("#postsGrid");
  const matched = POSTS.filter(p => {
    if(!filter) return true;
    const f = filter.toLowerCase();
    return p.title.toLowerCase().includes(f) || p.excerpt.toLowerCase().includes(f) || p.content.toLowerCase().includes(f);
  });
  if(matched.length === 0){
    grid.innerHTML = `<div class="card"><p class="excerpt">No posts match your search.</p></div>`;
    return;
  }
  grid.innerHTML = matched.map(p => cardHtml(p)).join("");
}

/* small card for each post */
function cardHtml(p){
  return `
    <article class="card" data-id="${p.id}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <div class="post-meta">${formatDate(p.date)}</div>
          <h3 class="post-title">${escapeHtml(p.title)}</h3>
          <p class="excerpt">${escapeHtml(p.excerpt)}</p>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end;">
          <a class="btn" href="#post/${p.id}" data-route>Read</a>
          <small style="color:var(--muted);font-size:0.8rem;">post</small>
        </div>
      </div>
    </article>
  `;
}

/* Render single post view */
function renderPost(p){
  document.title = `${p.title} — mythicpulsestudios`;
  app.innerHTML = `
    <article class="post-article">
      <div class="post-header">
        <div>
          <h1 class="post-title-big">${escapeHtml(p.title)}</h1>
          <div class="post-date">${formatDate(p.date)}</div>
        </div>
        <div class="controls">
          <button class="btn" id="backBtn">← Back</button>
          <a class="btn" href="#home" id="homeBtn">Home</a>
        </div>
      </div>

      <hr style="margin:14px 0; border:none; border-top:1px solid rgba(16,24,40,0.06)">

      <section class="post-content">
        ${p.content}
      </section>

      <div style="margin-top:18px;">
        <button class="btn" id="backBtn2">← Back to posts</button>
      </div>
    </article>
  `;
  // wire up back buttons
  document.getElementById("backBtn").addEventListener("click", () => history.back());
  document.getElementById("backBtn2").addEventListener("click", () => location.hash = "#home");
}

/* About page */
function renderAbout(){
  document.title = "About — mythicpulsestudios";
  app.innerHTML = `
    <article class="post-article">
      <h1 class="post-title-big">About Me</h1>
      <p>
        <strong>mythicpulsestudios</strong>, also known as Henry, is a small indie developer who has spent over 2 years creating games.
        Henry has always wanted to play around with creating a game even when he was younger.
        After high school Henry finally went into the gaming field and discovered his love for coding and learning.
      </p>
      <div style="margin-top:18px;">
        <button class="btn" onclick="history.back()">← Back</button>
      </div>
    </article>
  `;
}

/* Contact page */
function renderContact(){
  document.title = "Contact — mythicpulsestudios";
  app.innerHTML = `
    <article class="post-article">
      <h1 class="post-title-big">Contact</h1>
      <form action="https://formspree.io/f/mwppykrr" method="POST" class="contact-form">
        <label>Email:<br>
          <input type="email" name="email" required placeholder="Your email">
        </label><br><br>
        <label>Name:<br>
          <input type="text" name="name" required placeholder="Your name">
        </label><br><br>
        <label>Comment:<br>
          <textarea name="message" rows="6" required placeholder="Write your comment here..."></textarea>
        </label><br><br>
        <button class="btn" type="submit">Submit</button>
      </form>
      <div style="margin-top:18px;">
        <button class="btn" onclick="history.back()">← Back</button>
      </div>
    </article>
  `;
}

/* Not found page */
function renderNotFound(){
  app.innerHTML = `
    <div class="card">
      <h3 class="post-title">Post not found</h3>
      <p class="excerpt">We couldn't locate the post you're looking for. <button class="btn" id="nfHome">Return home</button></p>
    </div>
  `;
  document.getElementById("nfHome").addEventListener("click", () => location.hash = "#home");
}

/* helpers */
function formatDate(iso){
  try{
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year:"numeric", month:"short", day:"numeric" });
  }catch(e){
    return iso;
  }
}
function escapeHtml(str){
  return String(str)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;");
}
function handleSearch(e){
  const q = e.target.value.trim();
  renderList(q);
}
function handleDelegate(e){
  // close menu on small screens if user clicks a sub-menu link
  if(e.target.matches('[data-route]')){
    // ensure hash change triggers route handling (it will)
    // close mobile menu
    if(window.innerWidth <= 720) subMenu.style.display = "none";
  }
}
function toggleMenu(){
  const current = getComputedStyle(subMenu).display;
  subMenu.style.display = (current === "none" || current === "") ? "flex" : "none";
}

/* =========================
   Emoji Click Effects
   - spawns emoji at click position for buttons and menu links
   ========================= */
function addEmojiEffects(){
  const EMOJIS = ["🎮","🕹️","😄","✨","🔥","🏆","👾","🎯","💥"];

  document.addEventListener("click", (e) => {
    // spawn for .btn clicks, actual <button> elements, hamburger, and data-route links
    if (e.target.closest('.btn') || e.target.closest('button') || e.target.matches('[data-route]') || e.target.closest('[data-route]')) {
      spawnEmojiAt(e.clientX, e.clientY, EMOJIS);
    }
  });
}

function spawnEmojiAt(x, y, list){
  const el = document.createElement('span');
  el.className = 'emoji-pop';
  el.textContent = list[Math.floor(Math.random() * list.length)];
  // random rotation to look lively
  const rot = (Math.random() * 40) - 20; // -20deg .. +20deg
  el.style.setProperty('--rot', `${rot}deg`);
  // position near click
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  document.body.appendChild(el);
  // remove after animation
  setTimeout(()=> el.remove(), 950);
}

/* init on DOM ready */
document.addEventListener("DOMContentLoaded", init);

document.addEventListener('DOMContentLoaded', function () {
    // Navigation buttons
    const homeBtn = document.getElementById('homeBtn');
    const blogBtn = document.getElementById('blogBtn');
    const aboutBtn = document.getElementById('aboutBtn');
    const contactBtn = document.getElementById('contactBtn');

    // Sections
    const homeSection = document.getElementById('home');
    const blogSection = document.getElementById('blog');
    const aboutSection = document.getElementById('about');
    const contactSection = document.getElementById('contact');

    // Function to show only one section at a time
    function showSection(section) {
        homeSection.style.display = 'none';
        blogSection.style.display = 'none';
        aboutSection.style.display = 'none';
        contactSection.style.display = 'none';
        section.style.display = 'block';
    }

    // Default view
    showSection(homeSection);

    // Event listeners for navigation
    homeBtn.addEventListener('click', () => showSection(homeSection));
    blogBtn.addEventListener('click', () => showSection(blogSection));
    aboutBtn.addEventListener('click', () => showSection(aboutSection));
    contactBtn.addEventListener('click', () => showSection(contactSection));

    // BLOG TWO EMBEDDED VIDEO (NEW)
    const blogTwoContainer = document.getElementById('blogTwoContent');
    if (blogTwoContainer) {
        blogTwoContainer.innerHTML += `
            <div style="margin-top:15px;">
                <iframe width="560" height="315" 
                    src="https://www.youtube.com/embed/VIDEO_ID_HERE" 
                    title="YouTube video player" frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>
        `;
    }

    // CONTACT FORM SUBMIT
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            window.location.href = `mailto:henryicy89@gmail.com?subject=Contact from ${name}&body=${message}%0A%0AFrom: ${email}`;
        });
    }
});