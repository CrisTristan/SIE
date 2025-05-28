// Mapa de días a números según Date.getDay()
const diasMap = {
  "Domingo": 0,
  "Lunes": 1,
  "Martes": 2,
  "Miércoles": 3,
  "Jueves": 4,
  "Viernes": 5,
  "Sabado": 6
};

// Función para obtener fechas según el día de la semana
function obtenerFechasPorDia(inicioStr, finStr, diaTexto) {
  const fechas = [];
  const inicio = new Date(inicioStr);
  const fin = new Date(finStr);
  const diaObjetivo = diasMap[diaTexto];
  console.log("diaObjetivo"+diaObjetivo);

  const actual = new Date(inicio);
  while (actual <= fin) {
    if (actual.getDay() === diaObjetivo) {
      fechas.push(new Date(actual));
    }
    
    actual.setDate(actual.getDate() + 1);
  }

  return fechas;
}

// Función para generar la tabla de asistencia
function generarTablaAsistencia(curso, alumnos) {
  // Agrega la leyenda arriba de la tabla si no existe
  let leyenda = document.getElementById("leyenda-selectivo");
  if (!leyenda) {
    leyenda = document.createElement("div");
    leyenda.id = "leyenda-selectivo";
    leyenda.style.marginBottom = "10px";
    leyenda.innerHTML = `<span style="display:inline-block;width:16px;height:16px;background:#2196f3;border-radius:3px;vertical-align:middle;margin-right:6px;"></span> <span style="vertical-align:middle;">Estudiante en selectivo</span>`;
    const contenedor = document.getElementById("asistencia-container");
    contenedor.parentNode.insertBefore(leyenda, contenedor);
  }

  const fechas = obtenerFechasPorDia(curso.inicio, curso.fin, curso.dias);
  const contenedor = document.getElementById("asistencia-container");
  contenedor.innerHTML = ""; // Limpia tabla anterior

  const tabla = document.createElement("table");

  // Cabecera
  const thead = document.createElement("thead");
  const filaEncabezado = document.createElement("tr");

  const thNombre = document.createElement("th");
  thNombre.textContent = "Alumno";
  filaEncabezado.appendChild(thNombre);

  const thMatricula = document.createElement("th");
  thMatricula.textContent = "Matrícula";
  filaEncabezado.appendChild(thMatricula);

  fechas.forEach(fecha => {
    const th = document.createElement("th");
    th.textContent = fecha.toLocaleDateString("es-MX", { day: '2-digit', month: 'short' });
    filaEncabezado.appendChild(th);
  });

  thead.appendChild(filaEncabezado);
  tabla.appendChild(thead);

  // Cuerpo
  const tbody = document.createElement("tbody");
  alumnos.forEach(alumno => {
    const fila = document.createElement("tr");
    // Si el alumno está en selectivo, resalta la fila en azul claro
    if (alumno.selectivo === true) {
      fila.style.backgroundColor = "#e3f2fd";
    }
    const tdNombre = document.createElement("td");
    tdNombre.textContent = alumno.usuario.nombres + " " + alumno.usuario.apellidos;
    fila.appendChild(tdNombre);

    const tdMatricula = document.createElement("td");
    tdMatricula.textContent = alumno.usuario.matricula || "";
    fila.appendChild(tdMatricula);

    fechas.forEach(fecha => {
      const td = document.createElement("td");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      // Marcar si existe asistencia para esa fecha
      if (Array.isArray(alumno._asistencias)) {
        const asistencia = alumno._asistencias.find(a => a.dia === fecha.toISOString().split('T')[0]);
        if (asistencia && asistencia.asistio) {
          checkbox.checked = true;
        }
      }
      td.appendChild(checkbox);
      fila.appendChild(td);
    });

    tbody.appendChild(fila);
  });

  tabla.appendChild(tbody);
  contenedor.appendChild(tabla);

  // Botón para guardar asistencias
  let guardarBtn = document.getElementById("guardar-asistencias-btn");
  if (!guardarBtn) {
    guardarBtn = document.createElement("button");
    guardarBtn.id = "guardar-asistencias-btn";
    guardarBtn.textContent = "Guardar asistencias";
    guardarBtn.style.marginTop = "16px";
    guardarBtn.style.padding = "10px 20px";
    guardarBtn.style.background = "#1B396A";
    guardarBtn.style.color = "#fff";
    guardarBtn.style.border = "none";
    guardarBtn.style.borderRadius = "6px";
    guardarBtn.style.cursor = "pointer";
    contenedor.appendChild(guardarBtn);
  }

  guardarBtn.onclick = async function () {
    const resultados = [];
    const filas = tabla.querySelectorAll("tbody tr");
    filas.forEach((fila, idx) => {
      const tds = fila.querySelectorAll("td");
      const nombre = tds[0].textContent.trim();
      const matricula = tds[1].textContent.trim();
      const asistencias = [];
      fechas.forEach((fecha, i) => {
        const checkbox = tds[2 + i].querySelector("input[type='checkbox']");
        asistencias.push({
          dia: fecha.toISOString().split('T')[0],
          asistio: checkbox.checked
        });
      });
      // Obtener idCurso desde el alumno
      const idCurso = alumnos[idx]?.idCurso || alumnos[idx]?.curso?.id || '';
      resultados.push({
        idCurso,
        nombre,
        matricula,
        asistencias
      });
    });
    console.log(resultados);

    // Enviar cada estudiante al backend
    try {
      for (const estudiante of resultados) {
        await fetch('http://localhost:3000/asistencias/registrar-asistencia', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(estudiante)
        });
      }
      alert("Asistencias registradas correctamente.");
    } catch (err) {
      alert("Error al registrar asistencias.");
      console.error(err);
    }
  };
}

// Lógica para obtener datos del curso y alumnos
async function cargarCurso(matricula, cursoNombre) {
  try {
    const response = await fetch(`http://localhost:3000/curso/${matricula}`);
    const curso = await response.json();
    console.log(curso);

    // Obtener alumnos inscritos
    const responseAlumnos = await fetch(`http://localhost:3000/students/${cursoNombre}`);
    const alumnos = await responseAlumnos.json();
    console.log(alumnos);

    // Obtener asistencias por curso
    let asistenciasPorAlumno = [];
    try {
      const responseAsistencias = await fetch(`http://localhost:3000/asistencias/${curso.id}`);
      if (responseAsistencias.ok) {
        asistenciasPorAlumno = await responseAsistencias.json();
      }
    } catch (e) {
      asistenciasPorAlumno = [];
    }

    // Mapear asistencias a los alumnos
    alumnos.forEach(alumno => {
      const asistenciaAlumno = asistenciasPorAlumno.find(a => a.matricula === alumno.usuario.matricula);
      if (asistenciaAlumno) {
        alumno._asistencias = asistenciaAlumno.asistencias;
      } else {
        alumno._asistencias = [];
      }
    });

    generarTablaAsistencia(curso, alumnos);
  } catch (error) {
    console.error("Error al cargar el curso:", error);
  }
}

// Ejecutar al cargar la página
// Cambia esto por una matrícula real o hazlo dinámico con un input

document.addEventListener('DOMContentLoaded', function() {
  // Obtener los query params de la URL
  const params = new URLSearchParams(window.location.search);
  const matricula = params.get('matricula');
  const nombreCurso = params.get('nombreCurso');
  const idCurso = params.get('idCurso');
  // Llama a cargarCurso con los parámetros obtenidos
  cargarCurso(matricula, nombreCurso);
});
