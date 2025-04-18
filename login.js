import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

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

  if (!email || !password) {
    message.textContent = "Please fill in all fields.";
    return;
  }

  try {
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

    // ✅ Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 🔐 Insert OTP to verifications table
    const { error: insertError } = await supabase.from("verifications").insert({
      user_id: data.user.id,
      code: otp,
    });

    if (insertError) {
      message.textContent = "Failed to generate OTP.";
      return;
    }

    // ✉️ Simulate sending OTP via email (log it to console for now)
    console.log("Your OTP is:", otp);
    localStorage.setItem("verify_user_id", data.user.id);
    window.location.href = "otp.html";

  } catch (err) {
    message.textContent = "Unexpected error.";
    console.error(err);
  }
});
