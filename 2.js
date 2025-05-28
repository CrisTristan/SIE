// Credenciales para inicio de sesión
const validUsername = "admin";
const validPassword = "admin";

// Elementos del DOM
const form = document.getElementById("loginForm");
const message = document.getElementById("message");
const togglePasswordBtn = document.getElementById("togglePassword");

// Función para mostrar/ocultar contraseña
togglePasswordBtn.addEventListener("click", function() {
    const passwordInput = document.getElementById("password");
    const icon = this.querySelector("i");
    
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
});

// Manejo del evento submit
form.addEventListener("submit", function(event) {
    event.preventDefault(); // Evitar recarga de la página

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    // Mostrar indicador de carga
    const submitBtn = this.querySelector("button[type='submit']");
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    submitBtn.disabled = true;
    
    // Limpiar mensajes anteriores
    message.textContent = "";
    message.className = "message-container";

    // Intento de inicio de sesión con la API
    fetch("http://localhost:3000/usuarios/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'matricula': username,
            'password': password
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Respuesta del servidor:", data);
        message.textContent = "Inicio de sesión exitoso. Redirigiendo...";
        message.classList.add("success");
        //{mensaje: 'Login exitoso', tipo_usuario: 'Profesor'}
        // Redirigir después de un breve retraso
        setTimeout(() => {
            //window.location.href = "1.html";
            if(data.tipo_usuario === 'Profesor') {
                window.location.href = "profesores/panelPrincipal/panelPrincipal.html?matricula=" + data.matricula;
            }else if(data.tipo_usuario === 'Estudiante' || undefined) {
                window.location.href = "estudiantes/dashboard/index.html";
            } else {
                window.location.href = "1.html";
            }
        }, 2000);
    })
    .catch(error => {
        console.error("Error en la petición:", error);
        message.textContent = "Usuario o contraseña incorrectos";
        message.classList.add("error");
        
        // Restaurar el botón
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    });

    // Alternativa sin API (comentada)
    /*
    if (username === validUsername && password === validPassword) {
        message.textContent = "Inicio de sesión exitoso. Redirigiendo...";
        message.classList.add("success");
        
        setTimeout(() => {
            window.location.href = "1.html";
        }, 1000);
    } else {
        message.textContent = "Usuario o contraseña incorrectos";
        message.classList.add("error");
        
        // Restaurar el botón
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
    */
});
