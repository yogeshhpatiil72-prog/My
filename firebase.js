import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAoDWEwBikrd6M1S3XRBFsQdxnuGenAwsM",
  authDomain: "patill-neo.firebaseapp.com",
  projectId: "patill-neo",
  storageBucket: "patill-neo.firebasestorage.app",
  messagingSenderId: "1016370117356",
  appId: "1:1016370117356:web:7ce18142910de0112483c9",
  measurementId: "G-GV7V87PE5H"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadMovies() {
  const grid = document.getElementById("movieGrid");

  try {
    const moviesQuery = query(
      collection(db, "movies"),
      where("published", "==", true)
    );

    const snapshot = await getDocs(moviesQuery);

    window.patilNeoMovies = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    displayMovies();
  } catch (error) {
    console.error("Firebase error:", error);
    grid.innerHTML =
      '<p class="muted">Movies load hot nahit. Firebase rules check kara.</p>';
  }
}

window.displayMovies = function () {
  const search = document
    .getElementById("search")
    .value.toLowerCase();

  const grid = document.getElementById("movieGrid");

  const movies = window.patilNeoMovies || [];

  const filtered = movies.filter(movie =>
    (movie.title || "").toLowerCase().includes(search)
  );

  if (!filtered.length) {
    grid.innerHTML = '<p class="muted">No movies found.</p>';
    return;
  }

  grid.innerHTML = "";

  filtered.forEach(movie => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = movie.poster || "";
    img.alt = movie.title || "Movie poster";

    const info = document.createElement("div");
    info.className = "info";

    const title = document.createElement("h3");
    title.textContent = movie.title || "Untitled";

    const category = document.createElement("p");
    category.className = "muted";
    category.textContent = movie.category || "Movie";

    const watch = document.createElement("button");
    watch.textContent = "Watch";

    watch.onclick = () => {
      if (movie.watchUrl) {
        window.open(movie.watchUrl, "_blank", "noopener,noreferrer");
      } else {
        alert("Watch link available nahi.");
      }
    };

    info.append(title, category, watch);
    card.append(img, info);
    grid.appendChild(card);
  });
};

document.getElementById("search")
  .addEventListener("input", window.displayMovies);

loadMovies();
