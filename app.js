const POSTS = [
  {
    id: "godot-theme-checker",
    title: "Godot One Hour Game Jam — Theme Checker",
    date: "2024-12-12",
    excerpt: "A small Godot tool I made to explore which themes have been used in past One Hour Game Jams — quick input + submit indicates whether a word has already been used.",
    content: `
<p>I wanted to share a simple Godot project I created for myself, primarily to explore which theme topics have or haven't been used in past One Hour Game Jams. My goal was to explore Godot more and experiment with different ways to build things. While it's easy to check the Hyper Game Dev website for the themes used in past jams, which are updated weekly, I felt inspired to create a more interactive way to discover them.</p>

<p>This project lets you input a theme from previous jams and click a "Submit" button. If the theme has been used before, a text label will appear saying <strong>"Word already used."</strong> If the theme hasn't been used yet, another message will let you know the topic is still available. It's a fun, simple way to explore and discover new themes for the One Hour Game Jams.</p>

<p>Try it out below:</p>

<div style="position: relative; padding-bottom: 30.25%; height: 0; overflow: hidden; max-width: 552px;">
  <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" height="167" frameborder="0" src="https://itch.io/embed/3176194" width="552"><a href="https://nova-vertigo.itch.io/topic-theme-finder">Topic Theme Finder by Henry</a></iframe>
</div>

<p><strong>Project page:</strong> <a href="https://nova-vertigo.itch.io/topic-theme-finder" target="_blank" rel="noopener noreferrer">View on itch.io</a></p>

<p>I really appreciate how easy Godot makes it to create 2D user interfaces with text and effects, allowing for simple test games. While the main purpose of Godot is game development, it's also fun to explore creative ways to use the engine.</p>
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

<p>Below I have showcased my working main menu and the spinning button in action — everything should be functioning properly at the moment.</p>

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
  <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/7PLM-UMel90?si=g2HfCZBKv76oY3pB" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

<p><a href="https://youtu.be/7PLM-UMel90" target="_blank" rel="noopener noreferrer">Watch the demo video on YouTube</a></p>

<p>I'm not sure if I should share my project as an itch.io page or export my project as a Windows application. If you'd like to test the project and provide feedback, I'd love to hear from you!</p>
    `
  }
];

const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const app = $("#app");
const searchInput = document.getElementById("searchInput");
const menuToggle = document.getElementById("menuToggle");
const subMenu = document.getElementById("subMenu");

function init() {
  renderList();
  window.addEventListener("hashchange", handleRoute);
  searchInput.addEventListener("input", handleSearch);
  document.body.addEventListener("click", handleDelegate);
  menuToggle.addEventListener("click", toggleMenu);
  addEmojiEffects();
  handleRoute();
  initThemeToggle();
  initUsername();
}

function initThemeToggle() {
  const checkbox = document.getElementById('checkbox');
  const currentTheme = localStorage.getItem('theme');
  
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
    checkbox.checked = true;
  }
  
  checkbox.addEventListener('change', function() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
  });
}

function initUsername() {
  let username = localStorage.getItem('username');
  if (!username) {
    username = prompt('Please create a username to comment:');
    if (username && username.trim()) {
      localStorage.setItem('username', username.trim());
    } else {
      localStorage.setItem('username', 'Anonymous_' + Math.random().toString(36).substr(2, 5));
    }
  }
}

function initComments(postId) {
  const submitBtn = document.getElementById('submit-comment');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => handleCommentSubmit(postId));
  }
  renderComments(postId);
}

function handleCommentSubmit(postId) {
  const input = document.getElementById('comment-input');
  const commentsList = document.getElementById('comments-list');
  
  if (input.value.trim()) {
    const username = localStorage.getItem('username');
    const commentId = Date.now().toString();
    const comment = {
      id: commentId,
      username: username,
      text: input.value.trim(),
      date: new Date().toISOString(),
    };
    
    saveComment(postId, comment);
    
    input.value = '';
    renderComments(postId);
  }
}

function saveComment(postId, comment) {
  const comments = JSON.parse(localStorage.getItem(`comments_${postId}`) || '[]');
  comments.unshift(comment);
  localStorage.setItem(`comments_${postId}`, JSON.stringify(comments));
}

function editComment(postId, commentId, newText) {
  const comments = JSON.parse(localStorage.getItem(`comments_${postId}`) || '[]');
  const comment = comments.find(c => c.id === commentId);
  if (comment) {
    comment.text = newText;
    localStorage.setItem(`comments_${postId}`, JSON.stringify(comments));
    renderComments(postId);
  }
}

function deleteComment(postId, commentId) {
  const comments = JSON.parse(localStorage.getItem(`comments_${postId}`) || '[]');
  const updatedComments = comments.filter(c => c.id !== commentId);
  localStorage.setItem(`comments_${postId}`, JSON.stringify(updatedComments));
  renderComments(postId);
}

function renderComments(postId) {
  const commentsList = document.getElementById('comments-list');
  const comments = JSON.parse(localStorage.getItem(`comments_${postId}`) || '[]');
  
  commentsList.innerHTML = comments.map(comment => `
    <div class="comment" data-comment-id="${comment.id}">
      <div class="comment-header">
        <div class="comment-user">
          <span class="comment-username">${escapeHtml(comment.username)}</span>
          <span class="comment-date">${formatDate(comment.date)}</span>
        </div>
        <div class="comment-menu">
          <button class="comment-menu-btn">⋮</button>
          <div class="comment-menu-dropdown" style="display: none;">
            <button class="edit-comment-btn">Edit</button>
            <button class="delete-comment-btn">Delete</button>
          </div>
        </div>
      </div>
      <p class="comment-text">${escapeHtml(comment.text)}</p>
    </div>
  `).join('');
  
  $$('.comment-menu-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const menu = btn.nextElementSibling;
      menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });
  });
  
  $$('.edit-comment-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const commentDiv = e.target.closest('.comment');
      const commentId = commentDiv.dataset.commentId;
      const commentText = commentDiv.querySelector('.comment-text').textContent;
      const newText = prompt('Edit your comment:', commentText);
      if (newText && newText.trim()) {
        editComment(postId, commentId, newText.trim());
      }
    });
  });
  
  $$('.delete-comment-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const commentDiv = e.target.closest('.comment');
      const commentId = commentDiv.dataset.commentId;
      if (confirm('Are you sure you want to delete this comment?')) {
        deleteComment(postId, commentId);
      }
    });
  });
}

function handleRoute() {
  const hash = location.hash || "#home";
  if (hash.startsWith("#post/")) {
    const id = hash.split("/")[1];
    const post = POSTS.find(p => p.id === id);
    if (post) renderPost(post);
    else renderNotFound();
  } else if (hash === "#privacy") {
    renderPrivacy();
  } else if (hash === "#terms") {
    renderTerms();
  } else if (hash === "#about") {
    renderAbout();
  } else if (hash === "#contact") {
    renderContact();
  } else if (hash.startsWith("#archive/")) {
    const [year, month] = hash.split("/").slice(1);
    renderList("", `${year}-${month}`);
  } else {
    renderList();
  }
}

function renderList(filter = "", archiveFilter = "") {
  document.title = "mythicpulsestudios — Blog";
  app.innerHTML = `
    <section>
      <h2 style="margin:0 0 12px 0; font-size:1.25rem; color: #0f1724;">Latest Posts</h2>
      <div class="grid" id="postsGrid"></div>
    </section>
  `;
  const grid = $("#postsGrid");
  const matched = POSTS.filter(p => {
    if (!filter && !archiveFilter) return true;
    const f = filter.toLowerCase();
    const matchesSearch = !filter || p.title.toLowerCase().includes(f) || p.excerpt.toLowerCase().includes(f) || p.content.toLowerCase().includes(f);
    if (!archiveFilter) return matchesSearch;
    const [year, month] = archiveFilter.split("-");
    const d = new Date(p.date);
    return matchesSearch && d.getFullYear() == year && (d.getMonth() + 1) == month;
  });
  if (matched.length === 0) {
    grid.innerHTML = `<div class="card"><p class="excerpt">No posts match your search.</p></div>`;
    return;
  }
  grid.innerHTML = matched.map(p => cardHtml(p)).join("");
  renderSidebar(archiveFilter);
}

function cardHtml(p) {
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

function renderPost(p) {
  document.title = `${p.title} — mythicpulsestudios`;
  
  const postHtml = `
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

      <div class="comments-section" id="comments-container">
        <h3>Comments</h3>
        <div class="comment-form">
          <textarea id="comment-input" placeholder="What's on your mind, ${localStorage.getItem('username') || 'Anonymous'}?"></textarea>
          <button id="submit-comment" class="btn">Post Comment</button>
        </div>
        <div class="comments-list" id="comments-list">
        </div>
      </div>

      <div style="margin-top:18px;">
        <button class="btn" id="backBtn2">← Back to posts</button>
      </div>
    </article>
  `;
  
  app.innerHTML = postHtml;
  
  initComments(p.id);
  
  document.getElementById("backBtn").addEventListener("click", () => history.back());
  document.getElementById("backBtn2").addEventListener("click", () => location.hash = "#home");
  renderSidebar();
}

function renderAbout() {
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
  renderSidebar();
}

function renderContact() {
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
  renderSidebar();
}

function renderPrivacy() {
  document.title = "Privacy Policy — mythicpulsestudios";
  app.innerHTML = `
    <article class="post-article">
      <h1 class="post-title-big">Privacy Policy</h1>
      <section class="post-content">
        <h2>GitHub Pages Service</h2>
        <p>This website is hosted using GitHub Pages. Please note that GitHub may collect Technical Information from visitors, including logs of visitor IP addresses, to maintain the security and integrity of the website and service.</p>
      </section>
      <div style="margin-top:18px;">
        <button class="btn" onclick="history.back()">← Back</button>
      </div>
    </article>
  `;
  renderSidebar();
}

function renderTerms() {
  document.title = "Terms of Use — mythicpulsestudios";
  app.innerHTML = `
    <article class="post-article">
      <h1 class="post-title-big">Terms of Use</h1>
      <section class="post-content">
        <h2>GitHub Pages Terms</h2>
        <p>This website is hosted on GitHub Pages and follows GitHub's Terms of Service. By using this site, you agree to GitHub's acceptable use policies and terms available at github.com/terms.</p>
      </section>
      <div style="margin-top:18px;">
        <button class="btn" onclick="history.back()">← Back</button>
      </div>
    </article>
  `;
  renderSidebar();
}

function renderNotFound() {
  app.innerHTML = `
    <div class="card">
      <h3 class="post-title">Post not found</h3>
      <p class="excerpt">We couldn't locate the post you're looking for. <button class="btn" id="nfHome">Return home</button></p>
    </div>
  `;
  document.getElementById("nfHome").addEventListener("click", () => location.hash = "#home");
  renderSidebar();
}

function renderSidebar(archiveFilter = "") {
  const archiveList = $("#archiveList");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const archiveDates = [...new Set(POSTS.map(p => {
    const d = new Date(p.date);
    return `${d.getFullYear()}-${d.getMonth() + 1}`;
  }))].sort((a, b) => b.localeCompare(a));
  
  archiveList.innerHTML = archiveDates.map(date => {
    const [year, month] = date.split("-");
    const isActive = archiveFilter === date ? "active" : "";
    return `<li><a href="#archive/${year}/${month}" class="archive-link ${isActive}" data-route>${months[month - 1]} ${year}</a></li>`;
  }).join("");
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch (e) {
    return iso;
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function handleSearch(e) {
  const q = e.target.value.trim();
  renderList(q);
}

function handleDelegate(e) {
  if (e.target.matches('[data-route]')) {
    if (window.innerWidth <= 720) subMenu.style.display = "none";
  }
}

function toggleMenu() {
  const current = getComputedStyle(subMenu).display;
  subMenu.style.display = (current === "none" || current === "") ? "flex" : "none";
}

function addEmojiEffects() {
  const EMOJIS = ["🎮", "🕹️", "😄", "✨", "🔥", "🏆", "👾", "🎯", "💥"];

  document.addEventListener("click", (e) => {
    if (e.target.closest('.btn') || e.target.closest('button') || e.target.matches('[data-route]') || e.target.closest('[data-route]')) {
      spawnEmojiAt(e.clientX, e.clientY, EMOJIS);
    }
  });
}

function spawnEmojiAt(x, y, list) {
  const el = document.createElement('span');
  el.className = 'emoji-pop';
  el.textContent = list[Math.floor(Math.random() * list.length)];
  const rot = (Math.random() * 40) - 20;
  el.style.setProperty('--rot', `${rot}deg`);
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 950);
}

document.addEventListener("DOMContentLoaded", init);