// contrseña para inicia sesion
const validUsername = "admin";
const validPassword = "admin";

// formulario y al mensaje
const form = document.getElementById("loginForm");
const message = document.getElementById("message");

// Manejo del evento submit
form.addEventListener("submit", function(event) {
    event.preventDefault(); // Evitar recarga de la página

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === validUsername && password === validPassword) {
        message.style.color = "green";
        message.textContent = "Login successful!";
        // manda a otra pagina
        window.location.href="1.html";
    } else {
        message.style.color = "red";
        message.textContent = "el usuario o contraseña es incorrecto";
    }
});
