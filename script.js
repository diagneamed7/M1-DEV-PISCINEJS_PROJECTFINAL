//================ Project Final avec Supabase ==================
const SupaBaseURL = "https://ittslevsxyrnersfgzdn.supabase.co";
const supaBaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0dHNsZXZzeHlybmVyc2ZnemRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNjczMjgsImV4cCI6MjA3NDY0MzMyOH0.EtGkWZlqA_niKArbl2l9taPNRzEAlvEdllUhA-b7dME";

const client = window.supabase.createClient(SupaBaseURL, supaBaseKey);

//================= Gestion de la navigation ===================
// Fonction pour afficher une seule section et cacher les autres
function showSection(id) {
  document.querySelectorAll(".card").forEach(section => {
    if (section.id === id) {
      section.style.display = "block";
      section.classList.add("active");
    } else {
      section.style.display = "none";
      section.classList.remove("active");
    }
  });
}

//================= Système de Validation Avancé ===================

/**
 * Affiche un message d'erreur sous un champ de formulaire
 * @param {string} fieldId - ID du champ
 * @param {string} message - Message d'erreur à afficher
 */
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const existingError = field.parentNode.querySelector('.field-error');
  
  // Supprimer l'ancienne erreur si elle existe
  if (existingError) {
    existingError.remove();
  }
  
  // Créer le message d'erreur
  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error';
  errorDiv.textContent = message;
  
  // Ajouter le message après le champ
  field.parentNode.appendChild(errorDiv);
  
  // Ajouter la classe d'erreur au champ
  field.classList.add('error');
}

/**
 * Supprime le message d'erreur d'un champ
 * @param {string} fieldId - ID du champ
 */
function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  const existingError = field.parentNode.querySelector('.field-error');
  
  if (existingError) {
    existingError.remove();
  }
  
  field.classList.remove('error');
}

/**
 * Valide le format d'un email
 * @param {string} email - Email à valider
 * @returns {boolean} - True si valide
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valide la force d'un mot de passe
 * @param {string} password - Mot de passe à valider
 * @returns {object} - {isValid: boolean, message: string}
 */
function validatePassword(password) {
  if (password.length < 6) {
    return { isValid: false, message: "Le mot de passe doit contenir au moins 6 caractères" };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: "Pour plus de sécurité, utilisez au moins 8 caractères" };
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  let strength = 0;
  if (hasUpperCase) strength++;
  if (hasLowerCase) strength++;
  if (hasNumbers) strength++;
  if (hasSpecialChar) strength++;
  
  if (strength < 2) {
    return { isValid: false, message: "Le mot de passe doit contenir au moins 2 types de caractères (majuscules, minuscules, chiffres, symboles)" };
  }
  
  return { isValid: true, message: "Mot de passe sécurisé" };
}

/**
 * Valide un nom d'utilisateur
 * @param {string} username - Nom d'utilisateur à valider
 * @returns {object} - {isValid: boolean, message: string}
 */
function validateUsername(username) {
  if (username.length < 3) {
    return { isValid: false, message: "Le nom d'utilisateur doit contenir au moins 3 caractères" };
  }
  
  if (username.length > 20) {
    return { isValid: false, message: "Le nom d'utilisateur ne peut pas dépasser 20 caractères" };
  }
  
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return { isValid: false, message: "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores" };
  }
  
  return { isValid: true, message: "Nom d'utilisateur valide" };
}

/**
 * Valide tous les champs d'un formulaire
 * @param {string} formType - Type de formulaire ('signin', 'signup', 'profile')
 * @returns {boolean} - True si tous les champs sont valides
 */
function validateForm(formType) {
  let isValid = true;
  
  if (formType === 'signin') {
    const email = document.getElementById('signin-email').value.trim();
    const password = document.getElementById('signin-password').value.trim();
    
    // Validation email
    if (!email) {
      showFieldError('signin-email', 'L\'email est requis');
      isValid = false;
    } else if (!isValidEmail(email)) {
      showFieldError('signin-email', 'Format d\'email invalide');
      isValid = false;
    } else {
      clearFieldError('signin-email');
    }
    
    // Validation mot de passe
    if (!password) {
      showFieldError('signin-password', 'Le mot de passe est requis');
      isValid = false;
    } else {
      clearFieldError('signin-password');
    }
  }
  
  else if (formType === 'signup') {
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const username = document.getElementById('signup-username').value.trim();
    
    // Validation email
    if (!email) {
      showFieldError('signup-email', 'L\'email est requis');
      isValid = false;
    } else if (!isValidEmail(email)) {
      showFieldError('signup-email', 'Format d\'email invalide');
      isValid = false;
    } else {
      clearFieldError('signup-email');
    }
    
    // Validation mot de passe
    if (!password) {
      showFieldError('signup-password', 'Le mot de passe est requis');
      isValid = false;
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        showFieldError('signup-password', passwordValidation.message);
        isValid = false;
      } else {
        clearFieldError('signup-password');
      }
    }
    
    // Validation nom d'utilisateur
    if (!username) {
      showFieldError('signup-username', 'Le nom d\'utilisateur est requis');
      isValid = false;
    } else {
      const usernameValidation = validateUsername(username);
      if (!usernameValidation.isValid) {
        showFieldError('signup-username', usernameValidation.message);
        isValid = false;
      } else {
        clearFieldError('signup-username');
      }
    }
  }
  
  else if (formType === 'profile') {
    const username = document.getElementById('profile-username').value.trim();
    const bio = document.getElementById('profile-bio').value.trim();
    
    // Validation nom d'utilisateur
    if (!username) {
      showFieldError('profile-username', 'Le nom d\'utilisateur est requis');
      isValid = false;
    } else {
      const usernameValidation = validateUsername(username);
      if (!usernameValidation.isValid) {
        showFieldError('profile-username', usernameValidation.message);
        isValid = false;
      } else {
        clearFieldError('profile-username');
      }
    }
    
    // La bio est optionnelle, pas de validation nécessaire
    clearFieldError('profile-bio');
  }
  
  return isValid;
}

//================= Système de Messages Élégants ===================

/**
 * Affiche un message de succès élégant
 * @param {string} message - Message à afficher
 * @param {number} duration - Durée d'affichage en ms (défaut: 3000)
 */
function showSuccessMessage(message, duration = 3000) {
  // Supprimer les anciens messages
  removeAllMessages();
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'success-message-elegant';
  messageDiv.innerHTML = `
    <div class="message-content">
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(messageDiv);
  
  // Animation d'apparition
  setTimeout(() => messageDiv.classList.add('show'), 100);
  
  // Suppression automatique
  setTimeout(() => {
    messageDiv.classList.remove('show');
    setTimeout(() => messageDiv.remove(), 300);
  }, duration);
}

/**
 * Affiche un message d'erreur élégant
 * @param {string} message - Message à afficher
 * @param {number} duration - Durée d'affichage en ms (défaut: 5000)
 */
function showErrorMessage(message, duration = 5000) {
  // Supprimer les anciens messages
  removeAllMessages();
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'error-message-elegant';
  messageDiv.innerHTML = `
    <div class="message-content">
      <i class="fas fa-exclamation-triangle"></i>
      <span>${message}</span>
      <button class="close-message" onclick="this.parentElement.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  
  document.body.appendChild(messageDiv);
  
  // Animation d'apparition
  setTimeout(() => messageDiv.classList.add('show'), 100);
  
  // Suppression automatique
  setTimeout(() => {
    messageDiv.classList.remove('show');
    setTimeout(() => messageDiv.remove(), 300);
  }, duration);
}

/**
 * Supprime tous les messages affichés
 */
function removeAllMessages() {
  document.querySelectorAll('.success-message-elegant, .error-message-elegant').forEach(msg => {
    msg.classList.remove('show');
    setTimeout(() => msg.remove(), 300);
  });
}

//================= Gestion des États de Chargement ===================

/**
 * Active l'état de chargement d'un bouton
 * @param {string} buttonId - ID du bouton
 * @param {string} loadingText - Texte à afficher pendant le chargement
 */
function setButtonLoading(buttonId, loadingText = 'Chargement...') {
  const button = document.getElementById(buttonId);
  if (!button) return;
  
  // Sauvegarder le contenu original
  button.dataset.originalText = button.innerHTML;
  button.dataset.originalDisabled = button.disabled;
  
  // Mettre le bouton en état de chargement
  button.disabled = true;
  button.innerHTML = `
    <i class="fas fa-spinner loading"></i>
    ${loadingText}
  `;
  button.classList.add('loading-state');
}

/**
 * Désactive l'état de chargement d'un bouton
 * @param {string} buttonId - ID du bouton
 */
function clearButtonLoading(buttonId) {
  const button = document.getElementById(buttonId);
  if (!button) return;
  
  // Restaurer l'état original
  button.disabled = button.dataset.originalDisabled === 'true';
  button.innerHTML = button.dataset.originalText || button.innerHTML;
  button.classList.remove('loading-state');
  
  // Nettoyer les données temporaires
  delete button.dataset.originalText;
  delete button.dataset.originalDisabled;
}

/**
 * Affiche un indicateur de chargement global
 * @param {string} message - Message à afficher
 */
function showGlobalLoading(message = 'Chargement...') {
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'global-loading';
  loadingDiv.className = 'global-loading';
  loadingDiv.innerHTML = `
    <div class="loading-content">
      <div class="loading-spinner"></div>
      <p>${message}</p>
    </div>
  `;
  
  document.body.appendChild(loadingDiv);
  setTimeout(() => loadingDiv.classList.add('show'), 100);
}

/**
 * Masque l'indicateur de chargement global
 */
function hideGlobalLoading() {
  const loadingDiv = document.getElementById('global-loading');
  if (loadingDiv) {
    loadingDiv.classList.remove('show');
    setTimeout(() => loadingDiv.remove(), 300);
  }
}

//================= Gestion Authentification ===================

// Fonction SignUp
async function signUp(email, password, username) {
  // Validation des champs avant traitement
  if (!validateForm('signup')) {
    return; // Arrêter si la validation échoue
  }

  email = (email || "").trim();
  password = (password || "").trim();
  username = (username || "").trim();

  // Activer l'état de chargement
  setButtonLoading("signup-btn", "Création du compte...");

  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  // Désactiver l'état de chargement
  clearButtonLoading("signup-btn");

  if (error) {
    const msg = (error.message || "").toLowerCase();
    if (msg.includes("already") || msg.includes("duplicate") || msg.includes("registered")) {
      showErrorMessage("Ce mail existe déjà ! Veuillez utiliser un autre email.");
      return;
    }
    showErrorMessage(error.message || "Erreur lors de l'inscription. Veuillez réessayer.");
    return;
  }

  // Afficher la page connecté
  showSection("connected");
  showSuccessMessage("Inscription réussie ! Bienvenue dans votre espace personnel.");
  console.log("Inscription réussie", data);
}

// Fonction SignIn
async function signIn(email, password) {
  // Validation des champs avant traitement
  if (!validateForm('signin')) {
    return; // Arrêter si la validation échoue
  }

  email = (email || "").trim();
  password = (password || "").trim();

  // Activer l'état de chargement
  setButtonLoading("signin-btn", "Connexion...");

  const { data, error } = await client.auth.signInWithPassword({ email, password });

  // Désactiver l'état de chargement
  clearButtonLoading("signin-btn");

  if (error) {
    if (error.message.toLowerCase().includes("invalid login")) {
      showErrorMessage("Email ou mot de passe incorrect. Vérifiez vos identifiants.");
      return;
    }
    showErrorMessage(error.message || "Erreur de connexion. Veuillez réessayer.");
    return;
  }

  showSection("connected");
  showSuccessMessage("Connexion réussie ! Bienvenue dans votre espace personnel.");
  console.log("Connexion réussie", data);
}

// Fonction SignOut
async function signOut() {
  // Activer l'état de chargement
  setButtonLoading("signout-btn", "Déconnexion...");

  const { error } = await client.auth.signOut();
  
  // Désactiver l'état de chargement
  clearButtonLoading("signout-btn");

  if (error) { 
    showErrorMessage("Erreur lors de la déconnexion. Veuillez réessayer.");
    return; 
  }

  // Retour à la page d'accueil
  showSection("home");

  // Réinitialiser les champs
  ["signin-email","signin-password","signup-email","signup-password","signup-username","profile-username","profile-bio"]
    .forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.value = "";
        clearFieldError(id);
      }
    });
  
  showSuccessMessage("Déconnexion réussie ! À bientôt.");
}

//============== Gestion des Profils ===================

// Charger le profil de l'utilisateur connecté
async function loadProfile() {
  try {
    // Afficher le chargement global
    showGlobalLoading("Chargement de votre profil...");

    const { data: { user }, error: userError } = await client.auth.getUser();
    if (userError || !user) throw new Error("Impossible de récupérer l'utilisateur connecté");

    const { data: profile, error: profileError } = await client
      .from("profiles")
      .select("username, bio")
      .eq("id", user.id)
      .single();

    if (profileError) throw profileError;

    // Masquer le chargement global
    hideGlobalLoading();

    // Afficher la page profil en mode lecture seule
    showSection("profile");
    document.getElementById("profile-username").value = profile.username;
    document.getElementById("profile-bio").value = profile.bio || "";
    
    // Mettre les champs en lecture seule par défaut
    document.getElementById("profile-username").readOnly = true;
    document.getElementById("profile-bio").readOnly = true;
    
    // Changer le bouton pour "Modifier le profil"
    const updateBtn = document.getElementById("update-profile-btn");
    updateBtn.innerHTML = '<i class="fas fa-edit"></i> Modifier le profil';
    
    // Supprimer tous les anciens événements et ajouter le nouveau
    updateBtn.onclick = null;
    updateBtn.removeEventListener('click', updateProfile);
    updateBtn.addEventListener('click', enableProfileEdit);

  } catch (err) {
    hideGlobalLoading();
    showErrorMessage("Impossible de charger le profil: " + err.message);
  }
}

// Activer le mode édition du profil
function enableProfileEdit() {
  document.getElementById("profile-username").readOnly = false;
  document.getElementById("profile-bio").readOnly = false;
  
  // Changer le bouton pour "Sauvegarder"
  const updateBtn = document.getElementById("update-profile-btn");
  updateBtn.innerHTML = '<i class="fas fa-save"></i> Sauvegarder';
  
  // Supprimer l'ancien événement et ajouter le nouveau
  updateBtn.onclick = null;
  updateBtn.addEventListener('click', updateProfile);
}

// Mettre à jour le profil
async function updateProfile() {
  try {
    // Validation des champs avant traitement
    if (!validateForm('profile')) {
      return; // Arrêter si la validation échoue
    }

    const { data: { user }, error: userError } = await client.auth.getUser();
    if (userError || !user) throw new Error("Impossible de récupérer l'utilisateur");

    const newUsername = document.getElementById("profile-username").value.trim();
    const newBio = document.getElementById("profile-bio").value.trim();

    // Activer l'état de chargement
    setButtonLoading("update-profile-btn", "Sauvegarde...");

    const { data, error } = await client.from("profiles").update({ username: newUsername, bio: newBio }).eq("id", user.id).select();
    if (error) throw new Error(error.message);

    // Désactiver l'état de chargement
    clearButtonLoading("update-profile-btn");

    showSuccessMessage("Profil mis à jour avec succès !");
    console.log("Profil mis à jour :", data);
    
    // Remettre en mode lecture seule après sauvegarde
    document.getElementById("profile-username").readOnly = true;
    document.getElementById("profile-bio").readOnly = true;
    
    // Remettre le bouton en mode "Modifier"
    const updateBtn = document.getElementById("update-profile-btn");
    updateBtn.innerHTML = '<i class="fas fa-edit"></i> Modifier le profil';
    
    // Supprimer l'ancien événement et ajouter le nouveau
    updateBtn.onclick = null;
    updateBtn.removeEventListener('click', updateProfile);
    updateBtn.addEventListener('click', enableProfileEdit);

  } catch (err) { 
    clearButtonLoading("update-profile-btn");
    showErrorMessage("Erreur lors de la mise à jour: " + err.message); 
  }
}

//================= Gestion des boutons ===================

// Navigation page d'accueil → connexion/inscription
document.getElementById("go-signin").addEventListener("click", () => showSection("auth-signin"));
document.getElementById("go-signup").addEventListener("click", () => showSection("auth-signup"));

// Boutons retour → accueil
document.querySelectorAll(".back-btn").forEach(btn => btn.addEventListener("click", () => showSection("home")));

// Bouton retour spécifique du profil → page connectée
document.getElementById("back-to-connected").addEventListener("click", () => showSection("connected"));

// Auth actions
document.getElementById("signup-btn").addEventListener("click", () => {
  signUp(
    document.getElementById("signup-email").value,
    document.getElementById("signup-password").value,
    document.getElementById("signup-username").value
  );
});

document.getElementById("signin-btn").addEventListener("click", () => {
  signIn(
    document.getElementById("signin-email").value,
    document.getElementById("signin-password").value
  );
});

document.getElementById("signout-btn").addEventListener("click", () => signOut());
document.getElementById("view-profile").addEventListener("click", loadProfile);
// Le bouton update-profile-btn sera géré dynamiquement dans loadProfile() et enableProfileEdit()

//================= Améliorations UX ===================

/**
 * Ajoute des événements de validation en temps réel
 */
function setupRealTimeValidation() {
  // Validation en temps réel pour l'inscription
  const signupFields = ['signup-email', 'signup-password', 'signup-username'];
  signupFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener('blur', () => {
        if (fieldId === 'signup-email') {
          const email = field.value.trim();
          if (email && !isValidEmail(email)) {
            showFieldError(fieldId, 'Format d\'email invalide');
          } else {
            clearFieldError(fieldId);
          }
        } else if (fieldId === 'signup-password') {
          const password = field.value.trim();
          if (password) {
            const validation = validatePassword(password);
            if (!validation.isValid) {
              showFieldError(fieldId, validation.message);
            } else {
              clearFieldError(fieldId);
            }
          }
        } else if (fieldId === 'signup-username') {
          const username = field.value.trim();
          if (username) {
            const validation = validateUsername(username);
            if (!validation.isValid) {
              showFieldError(fieldId, validation.message);
            } else {
              clearFieldError(fieldId);
            }
          }
        }
      });
    }
  });

  // Validation en temps réel pour la connexion
  const signinFields = ['signin-email', 'signin-password'];
  signinFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener('blur', () => {
        if (fieldId === 'signin-email') {
          const email = field.value.trim();
          if (email && !isValidEmail(email)) {
            showFieldError(fieldId, 'Format d\'email invalide');
          } else {
            clearFieldError(fieldId);
          }
        } else {
          clearFieldError(fieldId);
        }
      });
    }
  });
}

/**
 * Améliore l'accessibilité des formulaires
 */
function setupAccessibility() {
  // Ajouter des attributs ARIA
  const forms = document.querySelectorAll('form, .card');
  forms.forEach((form, index) => {
    if (!form.getAttribute('role')) {
      form.setAttribute('role', 'form');
    }
  });

  // Améliorer les labels
  const labels = document.querySelectorAll('label');
  labels.forEach(label => {
    const input = label.querySelector('input, textarea');
    if (input && !input.getAttribute('aria-describedby')) {
      const id = input.id + '-label';
      label.id = id;
      input.setAttribute('aria-labelledby', id);
    }
  });
}

/**
 * Ajoute des raccourcis clavier
 */
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Échap pour fermer les messages
    if (e.key === 'Escape') {
      removeAllMessages();
    }
    
    // Entrée pour soumettre les formulaires
    if (e.key === 'Enter') {
      const activeElement = document.activeElement;
      if (activeElement && activeElement.tagName === 'INPUT') {
        const form = activeElement.closest('.card');
        if (form) {
          const submitBtn = form.querySelector('button[type="submit"], button:not(.back-btn)');
          if (submitBtn && !submitBtn.disabled) {
            submitBtn.click();
          }
        }
      }
    }
  });
}

/**
 * Initialise toutes les améliorations UX
 */
function initializeUXEnhancements() {
  setupRealTimeValidation();
  setupAccessibility();
  setupKeyboardShortcuts();
}

//================= Au chargement de la page ===================
showSection("home"); // Toujours afficher la page d'accueil au début

// Initialiser les améliorations UX
document.addEventListener('DOMContentLoaded', initializeUXEnhancements);
