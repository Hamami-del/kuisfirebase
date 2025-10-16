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

// Nama & level pemain
const playerName = prompt("Masukkan nama kamu:") || "Anonim";
const level = prompt("Pilih level: easy / medium / hard") || "easy";

// Soal (nanti bisa diimpor dari soal.js)
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

function tampilSoal() {
  const soal = questions[level];
  if (indexSoal < soal.length) {
    questionEl.textContent = soal[indexSoal].q;
  } else {
    questionEl.textContent = "🎉 Kuis selesai!";
    submitBtn.disabled = true;
    // simpan ke Firebase
    push(ref(db, "players"), { name: playerName, level, score });
  }
}
tampilSoal();

// Cek jawaban
submitBtn.addEventListener("click", () => {
  const jawaban = answerEl.value.trim().toLowerCase();
  const benar = questions[level][indexSoal].a.toLowerCase();
  if (jawaban === benar) {
    score += 10;
    scoreEl.textContent = score;
    new Audio("https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3").play();
  } else {
    new Audio("https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-buzzer-2969.mp3").play();
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
    sorted.forEach(p => {
      const div = document.createElement("div");
      div.classList.add("player");
      div.innerHTML = `<span>${p.name} (${p.level})</span> <span>${p.score}</span>`;
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
