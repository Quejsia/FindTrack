import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBVh_L9rnFwYJ8V0en1SG7uVwXAfJFoZG8",
  authDomain: "findtrack-17dee.firebaseapp.com",
  projectId: "findtrack-17dee",
  storageBucket: "findtrack-17dee.firebasestorage.app",
  messagingSenderId: "855009692879",
  appId: "1:855009692879:web:cb680475e9446491353bba"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 
/* Complete auth with FULL validation for login & signup */
document.addEventListener("DOMContentLoaded", ()=>{
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");

  if(signupForm){
    signupForm.addEventListener("submit", e=>{
      e.preventDefault();
      
      const name = document.getElementById("signupName").value.trim();
      const email = document.getElementById("signupEmail").value.trim().toLowerCase();
      const contact = document.getElementById("signupContact")?.value.trim() || "";
      const pass = document.getElementById("signupPass").value;
      
      // VALIDATION: Full Name (at least 2 words)
      if(name.split(' ').filter(w => w.length > 0).length < 2) {
        alert("❌ Please enter your full name (first and last name)");
        return;
      }
      
      // VALIDATION: Email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRegex.test(email)) {
        alert("❌ Please enter a valid email address");
        return;
      }
      
      // VALIDATION: Phone number (if provided, must be at least 10 digits)
      if(contact && contact.replace(/\D/g, '').length < 10) {
        alert("❌ Please enter a valid phone number (at least 10 digits)");
        return;
      }
      
      // VALIDATION: Password strength (min 6 characters)
      if(pass.length < 6) {
        alert("❌ Password must be at least 6 characters long");
        return;
      }
      
      let users = [];
      try { users = JSON.parse(localStorage.getItem("users")||"[]"); } catch { users = []; }
      
      // Check if email already exists
      if(users.find(u=>u.email===email)){ 
        alert("❌ Email already registered. Please login instead."); 
        return; 
      }
      
      const user = { id: 'u'+Date.now(), name, email, contact, pass };
      users.push(user);
      localStorage.setItem("users", JSON.stringify(users));
      
      // Create session and profile
      localStorage.setItem("sessionUser", JSON.stringify({ id:user.id, name:user.name, email:user.email }));
      localStorage.setItem("userProfile", JSON.stringify({ name:user.name, email:user.email, contact:user.contact, avatar:"" }));
      
      alert("✅ Account created successfully!");
      window.location.href = "app.html";
    });
  }

  if(loginForm){
    loginForm.addEventListener("submit", e=>{
      e.preventDefault();
      
      const email = document.getElementById("loginEmail").value.trim().toLowerCase();
      const pass = document.getElementById("loginPass").value;
      
      // VALIDATION: Email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRegex.test(email)) {
        alert("❌ Please enter a valid email address");
        return;
      }
      
      let users = [];
      try { users = JSON.parse(localStorage.getItem("users")||"[]"); } catch { users = []; }
      
      const matched = users.find(u=>u.email===email && u.pass===pass);
      if(matched){
        localStorage.setItem("sessionUser", JSON.stringify({ id:matched.id, name:matched.name, email:matched.email }));
        
        // Ensure userProfile exists
        const prof = { name: matched.name, email: matched.email, contact:"", avatar:"" };
        localStorage.setItem("userProfile", JSON.stringify(prof));
        
        alert("✅ Login successful!");
        window.location.href = "app.html";
      } else {
        alert("❌ Invalid email or password. Please try again.");
      }
    });
  }
});
