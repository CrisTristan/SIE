// Obtener el número de control de la URL
const urlParams = new URLSearchParams(window.location.search);
const control = urlParams.get('control');

// Elementos para actividades y categorías
let allActivities = [];
let selectedCategoria = '';

function renderActivityRadios(activities, selectedActividad) {
  const actividadRadios = document.getElementById('actividadRadios');
  actividadRadios.innerHTML = '';
  activities.forEach(activity => {
    const radioId = `actividad_radio_${activity.id}`;
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'actividad_radio';
    radio.value = activity.nombre;
    radio.id = radioId;
    if (activity.nombre === selectedActividad) radio.checked = true;
    const label = document.createElement('label');
    label.htmlFor = radioId;
    label.textContent = activity.nombre;
    actividadRadios.appendChild(radio);
    actividadRadios.appendChild(label);
    actividadRadios.appendChild(document.createElement('br'));
  });
}

// Fetch actividades y renderiza radios y categorías
function fetchAndRenderActivities(selectedActividad, selectedCategoria) {
  fetch('http://localhost:3000/actividades')
    .then(res => res.json())
    .then(activities => {
      allActivities = activities;
      // Filtrar por categoría si está seleccionada
      let filtered = activities;
      if (selectedCategoria) {
        filtered = activities.filter(a => a.categoria === selectedCategoria);
      }
      renderActivityRadios(filtered, selectedActividad);
    });
}

// Renderiza el select de categorías
function renderCategoriaSelect(selectedCategoria) {
  const categorias = ['deportivas', 'artisticas', 'academicas'];
  let select = document.getElementById('categoriaSelect');
  if (!select) {
    select = document.createElement('select');
    select.id = 'categoriaSelect';
    select.name = 'categoriaSelect';
    select.style.marginBottom = '10px';
    // Insertar antes de los radios
    const actividadLabel = document.querySelector('label[for="actividadRadios"]') || document.getElementById('actividadRadios').previousElementSibling;
    actividadLabel.parentNode.insertBefore(select, actividadLabel.nextSibling);
  }
  select.innerHTML = `<option value="">Todas las categorías</option>` +
    categorias.map(cat => `<option value="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</option>`).join('');
  select.value = selectedCategoria || '';
  select.onchange = function() {
    fetchAndRenderActivities(document.querySelector('input[name="actividad_radio"]:checked')?.value || '', this.value);
  };
}

// Al cargar estudiante, renderiza radios y select
fetch(`http://localhost:3000/student/${control}`)
  .then(res => {
    if(!res.ok){
        throw new Error('Error al cargar los datos del estudiante.');
    }
    return res.json()
    })
  .then(student => {
    document.getElementById('matricula').value = student.usuario.matricula || '';
    document.getElementById('nombres').value = student.usuario.nombres || '';
    document.getElementById('apellidos').value = student.usuario.apellidos || '';
    document.getElementById('carrera').value = student.carrera.nombre || '';
    document.getElementById('categoria').value = student.curso.actividad.categoria || '';
    // Renderiza select y radios
    renderCategoriaSelect(student.curso.actividad.categoria);
    // Crea el contenedor de radios si no existe
    let actividadRadios = document.getElementById('actividadRadios');
    if (!actividadRadios) {
      actividadRadios = document.createElement('div');
      actividadRadios.id = 'actividadRadios';
      const actividadLabel = document.querySelector('label[for="actividad"]');
      actividadLabel.parentNode.insertBefore(actividadRadios, actividadLabel.nextSibling);
    }
    fetchAndRenderActivities(student.curso.actividad.nombre, student.curso.actividad.categoria);

    // Actualiza el input de actividad al seleccionar radio
    document.addEventListener('change', function(e) {
      if (e.target && e.target.name === 'actividad_radio') {
        document.getElementById('actividad').value = e.target.value;
      }
    });
  })
  .catch((e) => {
    console.error(e);
  });

// Guardar cambios
document.getElementById('editStudentForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const data = {
    nombres: document.getElementById('nombres').value,
    apellidos: document.getElementById('apellidos').value,
    carrera: document.getElementById('carrera').value,
    actividad: document.getElementById('actividad').value,
    categoria: document.getElementById('categoria').value
  };
  fetch(`http://localhost:3000/students/${control}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(res => {
    if (!res.ok) throw new Error();
    alert('Estudiante actualizado correctamente.');
    window.close();
  })
  .catch(() => alert('Error al actualizar el estudiante.'));
});
