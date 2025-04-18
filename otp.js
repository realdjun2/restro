import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Replace with your real project keys
const supabase = createClient(
  "https://pzmjrsqltbsuuunocbvu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6bWpyc3FsdGJzdXV1bm9jYnZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MzI4MzUsImV4cCI6MjA2MDMwODgzNX0.Rh40SalOAVZQm-CLdOgmsf5EANli5be319BM8sI8zYQ"
);

window.verifyCaptcha = async function () {
  const recaptchaResponse = grecaptcha.getResponse();  // Get the reCAPTCHA response from the widget
  const message = document.getElementById("message");
  message.textContent = "";

  if (!recaptchaResponse) {
    message.textContent = "Please complete the CAPTCHA to proceed.";
    return;
  }

  // Verify reCAPTCHA response with Google
  const verifyResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
    method: "POST",
    body: new URLSearchParams({
      secret: "your-secret-key-here",  // Replace with your secret key
      response: recaptchaResponse
    }),
  });
  
  const data = await verifyResponse.json();

  if (!data.success) {
    message.textContent = "reCAPTCHA verification failed. Please try again.";
    return;
  }

  // Proceed to your verification logic (e.g., mark as verified)
  const userId = localStorage.getItem("verify_user_id");
  if (!userId) {
    message.textContent = "Session expired. Please log in again.";
    return;
  }

  // Proceed with the logic, e.g., updating the database, etc.
  // Example: Mark user as verified after CAPTCHA
  await supabase
    .from("users")
    .update({ is_verified: true })
    .eq("id", userId);

  message.style.color = "green";
  message.textContent = "Verification successful! Redirecting...";

  setTimeout(() => {
    window.location.href = "dashboard.html";  // Redirect after success
  }, 1500);
};
