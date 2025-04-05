
import { supabase } from './supabaseClient.js';


async function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");
  
    message.textContent = "";
  
    if (!email || !password) {
      message.textContent = "Please fill in all fields.";
      return;
    }
  
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        message.textContent = error.message;
        return;
      }
  
      // Optional: redirect after success
      message.style.color = "green";
      message.textContent = "Login successful! Redirecting...";
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1500);
    } catch (err) {
      message.textContent = "An error occurred.";
      console.error(err);
    }
  }
  