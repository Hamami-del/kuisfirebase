import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { firebaseConfig } from "./firebaseConfig.js";

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const submitBtn = document.getElementById("submitAnswer");
const scoreEl = document.getElementById("score");
const playerList = document.getElementById("playerList");

const playerName = prompt("Masukkan nama kamu:") || "Anonim";
const level = prompt("Pilih level: easy / medium / hard") || "easy";

// Soal (sementara, bisa diimpor dari soal.js)
const questions = {
  easy: [
    { q: "Kitab suci umat Islam?", a: "Al-Qur'an" },
    { q: "Bulan puasa?", a: "Ramadhan" },
    { q: "Arah kiblat?", a: "Ka'bah" },
  ],
  medium: [
    { q: "Nabi terakhir umat Islam adalah?", a: "Muhammad SAW" },
    { q: "Nama gua tempat turunnya wahyu pertama?", a: "Hira" },
  ],
  hard: [
    { q: "Berapa jumlah rakaat salat wajib sehari semalam?", a: "17" },
    { q: "Nama lain dari malam Lailatul Qadar?", a: "Malam Kemuliaan" },
  ]
};

let score = 0;
let indexSoal = 0;
let animasiAktif = false;

// Fungsi tampil soal
function tampilSoal() {
  const soal = questions[level];
  if (indexSoal < soal.length) {
    questionEl.textContent = soal[indexSoal].q;
  } else {
    questionEl.textContent = "🎉 Kuis selesai!";
    submitBtn.disabled = true;
    push(ref(db, "players"), { name: playerName, level, score });
  }
}
tampilSoal();

// Fungsi animasi skor
function animasiSkor(dari, ke, durasi = 500) {
  if (animasiAktif) return; // cegah bentrok animasi
  animasiAktif = true;
  const mulai = performance.now();

  function update(waktuSekarang) {
    const progress = Math.min((waktuSekarang - mulai) / durasi, 1);
    const nilai = Math.floor(dari + (ke - dari) * progress);
    scoreEl.textContent = nilai;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      animasiAktif = false;
    }
  }
  requestAnimationFrame(update);
}

// Cek jawaban
submitBtn.addEventListener("click", () => {
  const jawaban = answerEl.value.trim().toLowerCase();
  const benar = questions[level][indexSoal].a.toLowerCase();

  if (jawaban === benar) {
    const skorLama = score;
    score += 10;
    animasiSkor(skorLama, score);
    new Audio("https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3").play();

    // efek visual
    scoreEl.parentElement.style.transform = "scale(1.1)";
    scoreEl.parentElement.style.transition = "transform 0.2s ease";
    setTimeout(() => (scoreEl.parentElement.style.transform = "scale(1)"), 200);
  } else {
    new Audio("https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-buzzer-2969.mp3").play();
    scoreEl.parentElement.style.color = "#c62828";
    setTimeout(() => (scoreEl.parentElement.style.color = "#2e7d32"), 500);
  }

  answerEl.value = "";
  indexSoal++;
  tampilSoal();
});

// Leaderboard realtime
onValue(ref(db, "players"), (snapshot) => {
  playerList.innerHTML = "";
  const data = snapshot.val();
  if (data) {
    const sorted = Object.values(data).sort((a, b) => b.score - a.score);
    sorted.forEach((p, i) => {
      const div = document.createElement("div");
      div.classList.add("player");
      div.innerHTML = `
        <span>${i + 1}. ${p.name} (${p.level})</span>
        <span><b>${p.score}</b></span>
      `;
      playerList.appendChild(div);
    });
  }
});

// Pop-up donasi
const popup = document.getElementById("popup");
document.getElementById("donasi").addEventListener("click", () => {
  popup.style.display = "flex";
});
window.tutupPopup = () => {
  popup.style.display = "none";
};
