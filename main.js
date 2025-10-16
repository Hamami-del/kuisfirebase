import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB35RYpFoHPFOFbQhr6rtbAWiWdGbta0I4",
  authDomain: "kuis-hamami.firebaseapp.com",
  databaseURL: "https://kuis-hamami-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kuis-hamami",
  storageBucket: "kuis-hamami.firebasestorage.app",
  messagingSenderId: "955115071133",
  appId: "1:955115071133:web:c42d2f365082c74bf39674"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const namaInput = document.getElementById("namaInput");
const btnKirim = document.getElementById("btnKirim");
const daftarPemain = document.getElementById("daftarPemain");
const kuisContainer = document.getElementById("kuisContainer");
const soalText = document.getElementById("soalText");
const jawabanInput = document.getElementById("jawabanInput");
const btnJawab = document.getElementById("btnJawab");
const hasil = document.getElementById("hasil");
const levelSelect = document.getElementById("levelSelect");

let namaPemain = "";
let indexSoal = 0;
let levelDipilih = "easy";

btnKirim.onclick = () => {
  namaPemain = namaInput.value.trim();
  levelDipilih = levelSelect.value;
  if (namaPemain === "") return alert("Isi nama dulu!");

  push(ref(db, "pemain/"), { nama: namaPemain, level: levelDipilih });
  document.getElementById("formNama").style.display = "none";
  kuisContainer.style.display = "block";
  tampilkanSoal();
};

onValue(ref(db, "pemain/"), (snapshot) => {
  daftarPemain.innerHTML = "";
  snapshot.forEach((child) => {
    const val = child.val();
    const li = document.createElement("li");
    li.textContent = `${val.nama} (${val.level})`;
    daftarPemain.appendChild(li);
  });
});

function tampilkanSoal() {
  const soal = data[levelDipilih];
  if (indexSoal < soal.length) {
    soalText.textContent = soal[indexSoal].q;
    jawabanInput.value = "";
    hasil.textContent = "";
  } else {
    soalText.textContent = `Kuis ${levelDipilih} selesai! Terima kasih, ${namaPemain}! 🎉`;
    jawabanInput.style.display = "none";
    btnJawab.style.display = "none";
  }
}

btnJawab.onclick = () => {
  const soal = data[levelDipilih];
  const jawaban = jawabanInput.value.trim().toLowerCase();
  if (jawaban === soal[indexSoal].a.toLowerCase()) {
    hasil.textContent = "✅ Benar!";
  } else {
    hasil.textContent = `❌ Salah! Jawaban: ${soal[indexSoal].a}`;
  }

  indexSoal++;
  setTimeout(tampilkanSoal, 1000);
};
