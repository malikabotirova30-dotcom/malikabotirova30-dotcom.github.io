/* ===== 1. LOADING SCREEN ===== */
window.addEventListener("load", () => {
  setTimeout(() => document.getElementById("loader").classList.add("done"), 900);
});
document.getElementById("year").textContent = new Date().getFullYear();

/* ===== 2. DARK / LIGHT MODE (remembered if the browser allows it) ===== */
const themeBtn = document.getElementById("themeBtn");
try { if (localStorage.getItem("theme") === "light") document.body.classList.add("light"); } catch (e) {}
function updateThemeIcon() { themeBtn.textContent = document.body.classList.contains("light") ? "☀️" : "🌙"; }
updateThemeIcon();
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  try { localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark"); } catch (e) {}
  updateThemeIcon();
});

/* ===== 3. MOBILE MENU ===== */
const menu = document.getElementById("menu");
document.getElementById("burger").addEventListener("click", () => menu.classList.toggle("open"));
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => menu.classList.remove("open")));

/* ===== 4. TYPING EFFECT ===== */
const words = ["AI Developer", "Software Engineer"];
const typed = document.getElementById("typed");
let w = 0, c = 0, deleting = false;
function type() {
  const word = words[w];
  c += deleting ? -1 : 1;
  typed.textContent = word.slice(0, c);
  let delay = deleting ? 50 : 100;
  if (!deleting && c === word.length) { deleting = true; delay = 1400; }      // pause when word is complete
  else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 400; }
  setTimeout(type, delay);
}
type();

/* ===== 5. SCROLL REVEAL + SKILL BARS ===== */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("show");
    entry.target.querySelectorAll(".bar i").forEach(bar => bar.style.width = bar.dataset.level + "%");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

/* ===== 6. COURSE CARDS: click to expand ===== */
document.querySelectorAll(".course").forEach(card => {
  const toggle = () => card.classList.toggle("open");
  card.addEventListener("click", toggle);
  card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
});

/* ===== 7. 3D TILT HOVER (mouse only) ===== */
document.querySelectorAll(".tilt").forEach(card => {
  card.addEventListener("mousemove", e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;   // -0.5 to 0.5
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateY(-6px)`;
  });
  card.addEventListener("mouseleave", () => card.style.transform = "");
});

/* ===== 8. NETWORK DETECTIVE TERMINAL (types when visible) ===== */
const lines = ["> Analyzing Internet...", "> DNS resolution completed", "> Network protocols discovered", "> HTTPS security verified ✔"];
const term = document.getElementById("term");
let termStarted = false;
function typeLines(i = 0, j = 0) {
  if (i >= lines.length) { term.textContent += "\n> _"; return; }
  if (j < lines[i].length) { term.textContent += lines[i][j]; setTimeout(() => typeLines(i, j + 1), 35); }
  else { term.textContent += "\n"; setTimeout(() => typeLines(i + 1, 0), 450); }
}
new IntersectionObserver((entries, obs) => {
  if (entries[0].isIntersecting && !termStarted) { termStarted = true; typeLines(); obs.disconnect(); }
}, { threshold: 0.5 }).observe(term);

/* ===== 9. MINI AI ASSISTANT (keyword matching) ===== */
const log = document.getElementById("chatLog");
const input = document.getElementById("chatInput");
// Each answer has keywords to look for in the question
const answers = [
  { keys: ["who"], text: "Malika is a first-year IT student at Inha University in Tashkent who loves programming and AI." },
  { keys: ["study", "major", "course", "university"], text: "She studies Information Technology at Inha University in Tashkent: Programming, Computer Networks, Mathematics for IT, and Artificial Intelligence." },
  { keys: ["interest", "hobby", "like", "passion"], text: "Her interests are programming, artificial intelligence, networking, and building technology that helps people." },
  { keys: ["skill", "language"], text: "Her skills include Python, C++, JavaScript, Data Analysis, and Networking." },
  { keys: ["contact", "email"], text: "Scroll down to the Contact section to send her an email!" }
];
function addMsg(text, who) {
  const div = document.createElement("div");
  div.className = "msg " + who;
  div.textContent = text;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}
function ask(question) {
  addMsg(question, "user");
  const q = question.toLowerCase();
  const match = answers.find(a => a.keys.some(k => q.includes(k)));
  setTimeout(() => addMsg(match ? match.text : "I'm still learning! Try asking: who she is, what she studies, or her interests.", "bot"), 500);
}
document.getElementById("chatForm").addEventListener("submit", e => {
  e.preventDefault();
  if (input.value.trim()) ask(input.value.trim());
  input.value = "";
});
document.querySelectorAll(".quick button").forEach(b => b.addEventListener("click", () => ask(b.textContent)));

/* ===== 10. BACKGROUND PARTICLES (canvas) ===== */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let dots = [];
function resize() {
  canvas.width = innerWidth; canvas.height = innerHeight;
  dots = Array.from({ length: Math.min(70, Math.floor(innerWidth / 18)) }, () => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5, r: Math.random() * 2 + 1
  }));
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const light = document.body.classList.contains("light");
  ctx.fillStyle = light ? "rgba(90,70,200,.6)" : "rgba(34,211,238,.7)";
  dots.forEach((d, i) => {
    d.x = (d.x + d.vx + canvas.width) % canvas.width;
    d.y = (d.y + d.vy + canvas.height) % canvas.height;
    ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
    for (let j = i + 1; j < dots.length; j++) {            // connect nearby dots with lines
      const dist = Math.hypot(d.x - dots[j].x, d.y - dots[j].y);
      if (dist < 120) {
        ctx.strokeStyle = (light ? "rgba(90,70,200," : "rgba(139,92,246,") + (1 - dist / 120) * .35 + ")";
        ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(dots[j].x, dots[j].y); ctx.stroke();
      }
    }
  });
  requestAnimationFrame(draw);
}
addEventListener("resize", resize);
resize(); draw();