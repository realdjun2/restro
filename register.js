window.register = async function (e) {
    e.preventDefault();
    
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = "";
    messageDiv.style.color = "red"; // default color for errors
  
    // Basic validation
    if (!name || !email || !password) {
      messageDiv.textContent = "Please fill in all fields.";
      return;
    }
  
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: window.location.origin + "/verify.html" // optional redirect for email
        },
      });
  
      if (error) {
        messageDiv.textContent = error.message;
        return;
      }
  
      messageDiv.style.color = "green";
      messageDiv.textContent = "Registered successfully! Please check your email to verify.";
    } catch (err) {
      messageDiv.textContent = "Something went wrong.";
      console.error(err);
    }
  };
  