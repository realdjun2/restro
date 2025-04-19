const fetch = require('node-fetch');
const express = require('express');
const app = express();

app.use(express.json()); // This will parse JSON in request bodies

app.post('/verify-recaptcha', async (req, res) => {
  const { recaptchaResponse } = req.body;
  const secretKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6bWpyc3FsdGJzdXV1bm9jYnZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MzI4MzUsImV4cCI6MjA2MDMwODgzNX0.Rh40SalOAVZQm-CLdOgmsf5EANli5be319BM8sI8zYQ'; // Your reCAPTCHA secret key

  // Send request to Google reCAPTCHA API to verify the response
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`,
    { method: 'POST' }
  );
  
  const result = await response.json();
  
  // Check if the reCAPTCHA validation succeeded
  if (result.success) {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'reCAPTCHA validation failed.' });
  }
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
