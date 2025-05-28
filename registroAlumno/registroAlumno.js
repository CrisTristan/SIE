const obtenerCarreras = ()=>{
    fetch('http://localhost:3000/carrera')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
            console.log("Respuesta del servidor:", data);

            const contenedor = document.getElementById('lista-carreras')

            data.forEach(carrera => {
            const radio = document.createElement("input");
            radio.type = "radio";
            radio.id = `carrera-${carrera.id}`;
            radio.name = "carrera";  // Mismo nombre para agruparlos
            radio.value = carrera.id;

            const label = document.createElement("label");
            label.htmlFor = radio.id;
            label.textContent = carrera.nombre;

            const div = document.createElement("div");
            div.appendChild(radio);
            div.appendChild(label);

            contenedor.appendChild(div);
        });

    })
        .catch(error => {
            console.error("Error en la petición:", error);
    });

}

function obtenerActividades() {
    fetch('http://localhost:3000/actividades')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Actividades obtenidas:", data);
        const form = document.getElementById('registrationForm');
        // Crear contenedor para radios si no existe
        let actividadesDiv = document.getElementById('actividades-radios');
        if (!actividadesDiv) {
            actividadesDiv = document.createElement('div');
            actividadesDiv.id = 'actividades-radios';
            actividadesDiv.className = 'form-group full-width';
            // Insertar antes del grupo de carreras (form-group de carreras)
            const carrerasFormGroup = document.querySelector('#lista-carreras').closest('.form-group');
            if (carrerasFormGroup && carrerasFormGroup.parentNode) {
                carrerasFormGroup.parentNode.insertBefore(actividadesDiv, carrerasFormGroup);
            } else {
                // Si no se encuentra, simplemente agregar al final del formulario
                form.appendChild(actividadesDiv);
            }
        }
        actividadesDiv.innerHTML = '<label><i class="fas fa-futbol"></i> Actividad</label>';
        data.forEach(act => {
            const radioId = `actividad-${act.id}`;
            const radio = document.createElement("input");
            radio.type = "radio";
            radio.id = radioId;
            radio.name = "actividad";
            radio.value = act.id;
            const label = document.createElement("label");
            label.htmlFor = radioId;
            label.textContent = `${act.nombre} (${act.categoria})`;
            actividadesDiv.appendChild(radio);
            actividadesDiv.appendChild(label);
            actividadesDiv.appendChild(document.createElement("br"));
        });
    })
    .catch(error => {
        console.error("Error al obtener actividades:", error);
    });
}

document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const nombres = document.getElementById("nombres").value;
    const apellidos = document.getElementById("apellidos").value;
    const correo = document.getElementById("correo").value;
    const matricula = document.getElementById("matricula").value;
    const telefono = document.getElementById("telefono").value;
    const semestre = document.getElementById("semestre").value;
    const carrera = document.querySelector('input[name="carrera"]:checked');
    const actividad = document.querySelector('input[name="actividad"]:checked');

    fetch("http://localhost:3000/student", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'nombres': nombres,
            'apellidos': apellidos,
            'correo': correo,
            'matricula': matricula,
            'telefono': telefono,
            'estudiante': {
                'semestre': semestre,
                'carrera': carrera.value,
                'actividad': actividad ? actividad.value : null // Aquí se manda el id de la actividad
            }
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
        })
        .catch(error => {
            console.error("Error en la petición:", error);
        });

    alert('Formulario enviado');
});

obtenerCarreras();
obtenerActividades();