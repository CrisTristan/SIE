document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const actividadRadios = document.getElementById("actividadRadios");
  const actividadHidden = document.getElementById("actividad");

  // Obtener todas las actividades disponibles
  fetch("http://localhost:3000/actividades")
    .then(response => {
      if (!response.ok) throw new Error("Error al obtener actividades");
      return response.json();
    })
    .then(actividades => {
      console.log("Actividades disponibles:", actividades);
      // Poblar los radio buttons
      actividadRadios.innerHTML = '';
      actividades.forEach(act => {
        const radioId = `actividad_radio_${act.id}`;
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'actividad_radio';
        radio.value = act.nombre;
        radio.id = radioId;

        // Selecciona el radio si coincide con el valor actual
        if (actividadHidden.value && actividadHidden.value === act.nombre) {
          radio.checked = true;
        }

        radio.addEventListener('change', function() {
          actividadHidden.value = this.value;
        });

        const label = document.createElement('label');
        label.htmlFor = radioId;
        label.textContent = `${act.nombre} (${act.categoria})`;

        actividadRadios.appendChild(radio);
        actividadRadios.appendChild(label);
        actividadRadios.appendChild(document.createElement('br'));
      });
    })
    .catch(error => {
      console.error("Error al obtener actividades:", error);
    });

  const fillForm = () => {
    // Obtener los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    
    // Rellenar cada campo del formulario con los datos de la URL
    document.getElementById("nombre").value = urlParams.get("nombre") || "";
    actividadHidden.value = urlParams.get("actividad") || "";
    document.getElementById("profesor").value = urlParams.get("profesor") || "";
    document.getElementById("periodo").value = urlParams.get("periodo") || "";

    // Solo la parte de la fecha para los inputs tipo date
    const inicio = urlParams.get("inicio");
    document.getElementById("inicio").value = inicio ? inicio.split('T')[0] : "";

    const fin = urlParams.get("fin");
    document.getElementById("fin").value = fin ? fin.split('T')[0] : "";

    document.getElementById("espacios_disponibles").value = urlParams.get("espacios_disponibles") || "";
  };

  // Llamar a fillForm cuando se carga la página
  fillForm();

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita que el formulario se envíe de manera tradicional
     const urlParams = new URLSearchParams(window.location.search);
    // Obtener los valores del formulario (inputs tipo date)
    const formData = {
      matricula: urlParams.get("matricula"),
      curso: {
        nombre: document.getElementById("nombre").value,
        periodo: document.getElementById("periodo").value,
        inicio: document.getElementById("inicio").value, // formato yyyy-mm-dd
        fin: document.getElementById("fin").value,       // formato yyyy-mm-dd
        espacios: document.getElementById("espacios_disponibles").value,
        actividadNombre: actividadHidden.value,
        profesorNombre: document.getElementById("profesor").value
        }
      };

    try {
      const response = await fetch("http://localhost:3000/editOneCourse", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.statusText);
      }

      const result = await response.json();
      alert("Datos enviados con éxito: " + JSON.stringify(result));
    } catch (error) {
      console.error("Hubo un problema con el envío:", error);
      alert("Error al enviar los datos.");
    }
  });
});