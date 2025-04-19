import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase client
const supabase = createClient(
  "https://pzmjrsqltbsuuunocbvu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6bWpyc3FsdGJzdXV1bm9jYnZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MzI4MzUsImV4cCI6MjA2MDMwODgzNX0.Rh40SalOAVZQm-CLdOgmsf5EANli5be319BM8sI8zYQ"
);

const form = document.getElementById("loginForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  message.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const robotCheckbox = document.getElementById("robotCheckbox").checked;

  if (!email || !password) {
    message.textContent = "Please fill in all fields.";
    return;
  }

  if (!robotCheckbox) {
    message.textContent = "Please verify that you are not a robot.";
    return;
  }

  try {
    // Attempt to sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      message.textContent = error.message;
      return;
    }

    if (!data.user.email_confirmed_at) {
      localStorage.setItem("pendingEmail", email);
      await supabase.auth.signOut();
      window.location.href = "verify.html";
      return;
    }

    window.location.href = "dashboard.html"; // Redirect to dashboard or homepage
  } catch (err) {
    message.textContent = "Unexpected error.";
    console.error(err);
  }
});
