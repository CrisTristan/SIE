document.addEventListener('DOMContentLoaded', function() {
  let profesoresData = [];

  function renderProfesoresTable(profesores) {
    const tbody = document.getElementById('profesores-tbody');
    tbody.innerHTML = '';
    profesores.forEach(prof => {
      const actividades = (prof.cursos || []).map(c => c.actividad?.nombre).filter(Boolean).join(', ');
      const cursos = (prof.cursos || []).map(c => c.nombre).filter(Boolean).join(', ');
      const categoria = (prof.cursos && prof.cursos.length > 0 && prof.cursos[0].actividad?.categoria) || '';
      let categoriaTag = '';
      if (categoria.toLowerCase() === 'deportivas') {
        categoriaTag = `<span class="tag deportiva">Deportiva</span>`;
      } else if (categoria.toLowerCase() === 'artisticas') {
        categoriaTag = `<span class="tag artistica">Artística</span>`;
      } else if (categoria.toLowerCase() === 'academicas') {
        categoriaTag = `<span class="tag academica">Académica</span>`;
      } else {
        categoriaTag = `<span class="tag">${categoria}</span>`;
      }
      const evaluacion = '<span class="green">--</span>';
      tbody.innerHTML += `
        <tr>
          <td>${prof.usuario.nombres} ${prof.usuario.apellidos}</td>
          <td>${prof.especialidad || ''}</td>
          <td>${categoriaTag}</td>
          <td>${actividades}</td>
          <td>${cursos}</td>
          <td>${evaluacion}</td>
          <td>
            <button class="edit-btn" title="Editar">✏️</button>
            <button class="delete-btn" title="Borrar">🗑️</button>
          </td>
        </tr>
      `;
    });
  }

  fetch('http://localhost:3000/profesores')
    .then(res => res.json())
    .then(profesores => {
      profesoresData = profesores;
      renderProfesoresTable(profesoresData);
    })
    .catch(err => {
      document.getElementById('profesores-tbody').innerHTML = '<tr><td colspan="7">No se pudieron cargar los profesores.</td></tr>';
      console.error('Error al cargar profesores:', err);
    });

  // Modal nuevo profesor
  const btnNuevo = document.getElementById('btnNuevoProfesor');
  const modal = document.getElementById('modalNuevoProfesor');
  const cerrarModal = document.getElementById('cerrarModalProfesor');
  const formNuevo = document.getElementById('formNuevoProfesor');
  btnNuevo.addEventListener('click', function() {
    modal.style.display = 'flex';
  });
  cerrarModal.addEventListener('click', function() {
    modal.style.display = 'none';
  });
  formNuevo.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = {
      nombres: document.getElementById('nuevoNombre').value,
      apellidos: document.getElementById('nuevoApellidos').value,
      correo: document.getElementById('nuevoCorreo').value,
      telefono: document.getElementById('nuevoTelefono').value,
      matricula: document.getElementById('nuevoMatricula').value,
      especialidad: document.getElementById('nuevoEspecialidad').value
    };
    fetch('http://localhost:3000/profesores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(res => {
      if (!res.ok) throw new Error('Error al crear profesor');
      return res.json();
    })
    .then(() => {
      modal.style.display = 'none';
      location.reload();
    })
    .catch(() => alert('Error al crear profesor'));
  });

  // Buscar profesor por nombre
  const buscarInput = document.getElementById('buscarProfesor');
  buscarInput.addEventListener('input', function() {
    const search = buscarInput.value.trim().toLowerCase();
    const filtered = profesoresData.filter(prof =>
      `${prof.usuario.nombres} ${prof.usuario.apellidos}`.toLowerCase().includes(search)
    );
    renderProfesoresTable(filtered);
  });
});
