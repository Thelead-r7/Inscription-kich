// Configuration Firebase (REMPLACE avec les valeurs de TON projet)
const firebaseConfig = {
  apiKey: "AIzaSyAd5gqzLhq3eJHm1n_kZZGfLqzWQIvSaa4",
  authDomain: "ich-inscription.firebaseapp.com",
  projectId: "ich-inscription",
  storageBucket: "ich-inscription.appspot.com",
  messagingSenderId: "155306193375",
  appId: "1:155306193375:web:2b0fb492f87fabaec3d46a",
  measurementId: "G-ELNVGE77HD"
};

// Initialisation Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics(); // Si analytics est activé
const db = firebase.firestore();

// Étapes
function goToStep(stepNumber) {
  const currentStep = document.querySelector(".step:not([style*='none'])");
  const inputs = currentStep.querySelectorAll("input, select");

  for (let input of inputs) {
    if (!input.value.trim()) {
      alert("Veuillez remplir tous les champs avant de continuer.");
      return;
    }
  }

  currentStep.style.display = "none";
  document.getElementById("step" + stepNumber).style.display = "block";
}

// Afficher les champs selon le statut
function afficherChamps() {
  const statut = document.getElementById("statut").value;
  const etudes = document.getElementById("etudes");
  const autre = document.getElementById("autreDomaine");

  if (statut === "élève" || statut === "étudiant") {
    etudes.style.display = "block";
    autre.style.display = "none";
  } else if (statut === "autre") {
    autre.style.display = "block";
    etudes.style.display = "none";
  } else {
    etudes.style.display = "none";
    autre.style.display = "none";
  }
}

// Envoi du formulaire
document.getElementById("formulaire").addEventListener("submit", function(e) {
  e.preventDefault();

  const nom = document.getElementById("nom").value.trim();
  const age = document.getElementById("age").value.trim();
  const genre = document.getElementById("genre").value;
  const commune = document.getElementById("commune").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const statut = document.getElementById("statut").value;

  const etablissement = document.getElementById("etablissement").value.trim();
  const niveau = document.getElementById("niveau").value.trim();
  const domaine = document.getElementById("domaine").value.trim();

  if (!statut) return alert("Veuillez sélectionner un statut.");
  if ((statut === "élève" || statut === "étudiant") && (!etablissement || !niveau)) {
    return alert("Veuillez renseigner l'établissement et le niveau scolaire.");
  }
  if (statut === "autre" && !domaine) {
    return alert("Veuillez renseigner votre domaine d'activité.");
  }

  // Préparation des données
  const data = {
    nom,
    age,
    genre,
    commune,
    contact,
    statut,
    etablissement: (statut !== "autre") ? etablissement : null,
    niveau: (statut !== "autre") ? niveau : null,
    domaine: (statut === "autre") ? domaine : null,
    date: new Date()
  };

  // Envoi vers Firebase Firestore
  db.collection("inscriptions").add(data)
    .then(() => {
      alert("✅ Formulaire envoyé avec succès !");
      localStorage.setItem("inscriptionOK", "true");
window.location.href = "félicitations.html";
    })
    .catch((error) => {
      console.error("Erreur Firebase :", error);
      alert("❌ Une erreur est survenue lors de l'envoi.");
    });
});
