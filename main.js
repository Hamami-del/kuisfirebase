// Import modul dari Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Konfigurasi Firebase kamu
const firebaseConfig = {
  apiKey: "AIzaSyB35RYpFoHPFOFbQhr6rtbAWiWdGbta0I4",
  authDomain: "kuis-hamami.firebaseapp.com",
  databaseURL: "https://kuis-hamami-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kuis-hamami",
  storageBucket: "kuis-hamami.firebasestorage.app",
  messagingSenderId: "955115071133",
  appId: "1:955115071133:web:c42d2f365082c74bf39674",
  measurementId: "G-91K8FL32W4"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Fungsi untuk kirim nama ke database
window.kirimNama = function() {
  const nama = document.getElementById("nama").value.trim();
  if (nama === "") return alert("Isi nama dulu ya!");
  
  push(ref(db, "pemain"), {
    nama: nama,
    waktu: Date.now()
  });

  document.getElementById("nama").value = "";
};

// Menampilkan daftar pemain secara real-time
onValue(ref(db, "pemain"), (snapshot) => {
  const data = snapshot.val();
  const daftar = document.getElementById("daftarPemain");
  daftar.innerHTML = "";

  for (let id in data) {
    const li = document.createElement("li");
    li.textContent = data[id].nama;
    daftar.appendChild(li);
  }
});
