async function validateSignupForm(event) {
    event.preventDefault();

    const username = document.getElementById("user").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("Cpassword").value;
    const errorMessage = document.getElementById("error");

    // Check if passwords match
    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/frontend/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        if (!response.ok) {
            errorMessage.textContent = data.message || "Signup failed";
        } else {
            alert(data.message);
            window.location.href = "login.html"; // Redirect to login page after successful signup
        }
    } catch (err) {
        errorMessage.textContent = "Server error. Please try again later.";
    }
}
