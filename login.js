import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://pukbullejohkrxcgvwud.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1a2J1bGxlam9oa3J4Y2d2d3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MjIwNTUsImV4cCI6MjA1OTM5ODA1NX0.ovymArfcov-lwFQM5_NqLWO8tly-Az8emHps80e2tqo"
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
