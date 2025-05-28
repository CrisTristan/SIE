document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('adminProfileForm');
    
    // Cargar datos del administrador (simulado)
    loadAdminData();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            const formData = getFormData();
            try {
                await updateAdminProfile(formData);
                showNotification('Perfil actualizado exitosamente', 'success');
            } catch (error) {
                showNotification('Error al actualizar el perfil', 'error');
                console.error('Error:', error);
            }
        }
    });
});

function loadAdminData() {
    // Simulación de carga de datos del administrador
    // En un caso real, esto vendría de una API
    const adminData = {
        nombre: 'Administrador',
        email: 'admin@ejemplo.com',
        telefono: '123-456-7890',
        cargo: 'Administrador'
    };

    // Llenar el formulario con los datos
    Object.keys(adminData).forEach(key => {
        const input = document.getElementById(key);
        if (input) {
            input.value = adminData[key];
        }
    });
}

function validateForm() {
    const password = document.getElementById('password').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!password) {
        showNotification('Por favor ingrese su contraseña actual', 'error');
        return false;
    }

    if (newPassword || confirmPassword) {
        if (newPassword !== confirmPassword) {
            showNotification('Las contraseñas nuevas no coinciden', 'error');
            return false;
        }
        if (newPassword.length < 6) {
            showNotification('La nueva contraseña debe tener al menos 6 caracteres', 'error');
            return false;
        }
    }

    return true;
}

function getFormData() {
    return {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        password: document.getElementById('password').value,
        newPassword: document.getElementById('newPassword').value
    };
}

async function updateAdminProfile(formData) {
    // Simulación de una llamada a la API
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Datos actualizados:', formData);
            resolve();
        }, 1000);
    });
}

function showNotification(message, type) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Estilos para la notificación
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '5px';
    notification.style.color = 'white';
    notification.style.zIndex = '1000';
    notification.style.animation = 'slideIn 0.5s ease-out';

    // Estilos según el tipo de notificación
    if (type === 'success') {
        notification.style.backgroundColor = '#2ecc71';
    } else {
        notification.style.backgroundColor = '#e74c3c';
    }

    // Agregar al DOM
    document.body.appendChild(notification);

    // Eliminar después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Agregar estilos para las animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style); 