const fetchAllActivities = ()=> {
    return fetch('http://localhost:3000/actividades')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.error('Error fetching activities:', error);
        });
}

fetchAllActivities()
    .then((activities) => {
        const actividadRadios = document.getElementById('actividadRadios');
        const actividadHidden = document.getElementById('actividad');
        actividadRadios.innerHTML = '';
        activities.forEach((activity) => {
            // Create a radio button for each activity
            const radioId = `actividad_radio_${activity.id}`;
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'actividad_radio';
            radio.value = activity.nombre;
            radio.id = radioId;
            radio.addEventListener('change', function() {
                actividadHidden.value = this.value;
            });
            const label = document.createElement('label');
            label.htmlFor = radioId;
            label.textContent = `${activity.nombre} (${activity.categoria})`;
            actividadRadios.appendChild(radio);
            actividadRadios.appendChild(label);
            actividadRadios.appendChild(document.createElement('br'));
        });
    })
    .catch((error) => {
        console.error('Error:', error);
});

function fillProfesorName(matricula) {
    if (!matricula || matricula.length !== 8) return;
    fetch(`http://localhost:3000/profesores/${matricula}`)
        .then(response => {
            if (!response.ok) throw new Error('No se encontró el profesor');
            return response.json();
        })
        .then(profesor => {
            // Busca el input deshabilitado que muestra el nombre
            const nombreInput = document.querySelector('input[placeholder="Buscando Profesor con esa matricula ..."]');
            if (nombreInput) {
                nombreInput.value = profesor.usuario.nombres ? profesor.usuario.nombres+" "+profesor.usuario.apellidos : 'Profesor no encontrado';
            }
        })
        .catch(() => {
            const nombreInput = document.querySelector('input[placeholder="Buscando Profesor con esa matricula ..."]');
            if (nombreInput) {
                nombreInput.value = 'Profesor no encontrado';
            }
        });
}

document.addEventListener('DOMContentLoaded', function() {
    fetchAllActivities();
    // ...existing code...
    const matriculaInput = document.getElementById('matriculaProfesor');
    if (matriculaInput) {
        matriculaInput.addEventListener('input', function() {
            if (this.value.length === 8) {
                fillProfesorName(this.value);
            } else {
                const nombreInput = document.querySelector('input[placeholder="Buscando Profesor con esa matricula ..."]');
                if (nombreInput) nombreInput.value = '';
            }
        });
    }
});