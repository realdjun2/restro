import { supabase } from './supabaseClient.js';

document.getElementById("registerBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const name = document.getElementById("name").value.trim();
    const role = document.getElementById("role").value.trim();

    if (!email.endsWith("@nbsc.edu.ph")) {
        alert("Only @nbsc.edu.ph emails are allowed.");
        return;
    }
    

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { name, role }, // Custom user metadata
            emailRedirectTo: "http://localhost/Class%20Schedule%20System_nbsc/login.html"
        }
    });

    if (error) {
        alert("Registration error: " + error.message);
    } else {
        alert("Registration successful! Please check your email to confirm.");
    }
});
