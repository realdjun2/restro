import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Replace with your real project keys
const supabase = createClient(
  "https://pukbullejohkrxcgvwud.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1a2J1bGxlam9oa3J4Y2d2d3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MjIwNTUsImV4cCI6MjA1OTM5ODA1NX0.ovymArfcov-lwFQM5_NqLWO8tly-Az8emHps80e2tqo"
);

window.verifyOTP = async function () {
  const otpInput = document.getElementById("otp").value.trim();
  const message = document.getElementById("message");
  message.textContent = "";

  if (!/^\d{6}$/.test(otpInput)) {
    message.textContent = "Please enter a valid 6-digit code.";
    return;
  }

  const userId = localStorage.getItem("verify_user_id");
  if (!userId) {
    message.textContent = "Session expired. Please log in again.";
    return;
  }

  const { data, error } = await supabase
    .from("verifications")
    .select("*")
    .eq("user_id", userId)
    .eq("code", otpInput)
    .eq("used", false)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    message.textContent = "Invalid or expired code.";
    return;
  }

  // ✅ Mark code as used
  await supabase
    .from("verifications")
    .update({ used: true })
    .eq("id", data.id);

  message.style.color = "green";
  message.textContent = "OTP verified! Redirecting...";

  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 1500);
};
