// =============================================================================
//  🚀  SPACEX FLIGHT CONTROL CENTER
//  Centro de Control de Lanzamientos Espaciales
//
//  Proyecto de Desempeño · SENA Formación Complementaria 3406211
//  Módulo: JavaScript · Unidades 1 a 7
//
//  INSTRUCCIONES PARA EL APRENDIZ:
//  ─────────────────────────────────────────────────────────────────────────────
//  Este archivo está vacío. Tu tarea es implementar todas las funciones
//  necesarias para que la aplicación funcione de acuerdo al enunciado.
//
//  Pasos recomendados:
//    1. Lee el enunciado completo en ENUNCIADO.md
//    2. Abre spacex_control_vuelos.html en el navegador con F12 activo
//    3. Revisa el HTML para conocer los IDs disponibles
//    4. Revisa el CSS para conocer las clases que debes aplicar
//    5. Implementa las secciones de este archivo en orden
//
//  IMPORTANTE: No modifiques spacex_control_vuelos.html ni styles-vuelos.css
// =============================================================================


// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 1 — ALMACÉN DE DATOS
//
//  Declara aquí las variables que guardarán el estado global de la aplicación:
//  la colección de lanzamientos registrados y cualquier variable de control
//  que necesites para el funcionamiento de la interfaz.
//
//  Piensa en qué tipo de estructura de datos es más apropiada para
//  mantener una lista de registros, cada uno con múltiples propiedades.
// ─────────────────────────────────────────────────────────────────────────────

// Colección global de lanzamientos
let lanzamientos = [];

// Filtro de estado activo actualmente ("todos", "pendiente", "lanzado", "cancelado")
let filtroActivo = 'todos';

// ID del lanzamiento en edición (null si no está en modo edición)
let idEdicion = null;



// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 2 — FUNCIONES UTILITARIAS
//
//  Funciones de propósito general que pueden reutilizarse en distintas
//  partes del código. Considera qué operaciones se repiten frecuentemente
//  y valdría la pena encapsular como función auxiliar.
//
//  Por ejemplo: generar un identificador único para cada registro,
//  o transformar una fecha al formato que se mostrará en las tarjetas.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Genera un identificador único para cada registro.
 * Formato: SX-YYYY-RAND (donde YYYY es el año actual y RAND es un número aleatorio de 4 dígitos)
 */
const generarID = () => {
  const anio = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `SX-${anio}-${random}`;
};

/**
 * Formatea una fecha obtenida del input datetime-local a un formato amigable.
 * Entrada: "YYYY-MM-DDTHH:MM" -> Salida: "YYYY-MM-DD HH:MM"
 */
const formatearFecha = (fechaStr) => {
  if (!fechaStr) return '';
  return fechaStr.replace('T', ' ');
};



// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 3 — RENDERIZADO DE TARJETAS
//
//  Funciones que leen el almacén de datos y convierten cada lanzamiento
//  en un elemento HTML visible dentro del contenedor del grid.
//
//  La tarjeta debe construirse como un elemento del DOM con la estructura
//  documentada en el archivo HTML. Revisa los comentarios del grid para
//  conocer exactamente qué clases y atributos debe tener cada parte.
//
//  IDs relevantes del HTML:
//    · #grid-lanzamientos  → contenedor donde se insertan las tarjetas
//    · #estado-vacio       → se muestra cuando no hay tarjetas
//    · #contador-visibles  → muestra cuántas tarjetas son visibles
//    · #contador-lanzamientos → contador de vuelos en la topbar
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Crea programáticamente la estructura HTML de la tarjeta de un lanzamiento
 * utilizando únicamente métodos del DOM (no innerHTML de toda la tarjeta).
 */
const crearTarjetaDOM = (lanzamiento) => {
  // Crear contenedor principal
  const card = document.createElement('article');
  card.className = `organism-launch-card organism-launch-card--${lanzamiento.estado}`;
  card.setAttribute('data-id', lanzamiento.id);
  card.setAttribute('data-tipo', lanzamiento.tipo);
  card.setAttribute('data-estado', lanzamiento.estado);

  // 1. Cabecera (Header)
  const header = document.createElement('div');
  header.className = 'molecule-card-header';

  const idSpan = document.createElement('span');
  idSpan.className = 'molecule-card-header__id atom-mono';
  idSpan.textContent = lanzamiento.id;

  const badgeSpan = document.createElement('span');
  badgeSpan.className = `atom-badge atom-badge--${lanzamiento.estado}`;
  badgeSpan.textContent = lanzamiento.estado.toUpperCase();

  header.appendChild(idSpan);
  header.appendChild(badgeSpan);
  card.appendChild(header);

  // 2. Cuerpo (Body)
  const body = document.createElement('div');
  body.className = 'molecule-card-body';

  const nameDiv = document.createElement('div');
  nameDiv.className = 'molecule-card-body__name';
  nameDiv.textContent = lanzamiento.nombre;

  const typeDiv = document.createElement('div');
  typeDiv.className = 'molecule-card-body__type';
  const tipoMapeo = {
    'falcon': 'FALCON 9',
    'falcon-heavy': 'FALCON HEAVY',
    'starship': 'STARSHIP'
  };
  typeDiv.textContent = tipoMapeo[lanzamiento.tipo] || lanzamiento.tipo.toUpperCase();

  const objectiveDiv = document.createElement('div');
  objectiveDiv.className = 'molecule-card-body__objective';
  objectiveDiv.textContent = lanzamiento.objetivo;

  const dateDiv = document.createElement('div');
  dateDiv.className = 'molecule-card-body__date atom-mono';
  dateDiv.textContent = formatearFecha(lanzamiento.fecha);

  body.appendChild(nameDiv);
  body.appendChild(typeDiv);
  body.appendChild(objectiveDiv);
  body.appendChild(dateDiv);
  card.appendChild(body);

  // 3. Pie (Footer)
  const footer = document.createElement('div');
  footer.className = 'molecule-card-footer';

  const editBtn = document.createElement('button');
  editBtn.className = 'atom-btn atom-btn--secondary atom-btn--sm';
  editBtn.setAttribute('data-action', 'editar');
  editBtn.setAttribute('data-id', lanzamiento.id);
  editBtn.textContent = 'EDITAR';

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'atom-btn atom-btn--danger atom-btn--sm';
  cancelBtn.setAttribute('data-action', 'cancelar');
  cancelBtn.setAttribute('data-id', lanzamiento.id);
  cancelBtn.textContent = 'CANCELAR';

  //Mostrar los botones de acción únicamente si el lanzamiento está pendiente
  if (lanzamiento.estado !== 'pendiente') {
    editBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
  } else {
    //Conectar eventos clic directamente a las funciones controladoras
    editBtn.addEventListener('click', () => cargarEdicion(lanzamiento.id));
    cancelBtn.addEventListener('click', () => cancelarLanzamiento(lanzamiento.id));
  }

  footer.appendChild(editBtn);
  footer.appendChild(cancelBtn);
  card.appendChild(footer);

  // ───────────────────────────────────────────────────────────────────────────
  //  SECCIÓN 4 — ANIMACIONES DE TARJETAS (HOVER)
  // ───────────────────────────────────────────────────────────────────────────
  card.addEventListener('mouseover', () => {
    card.classList.add('is-hovered');
  });
  card.addEventListener('mouseout', () => {
    card.classList.remove('is-hovered');
  });

  return card;
};

/**
 * Lee el almacén de datos y actualiza la cuadrícula de tarjetas (grid)
 * aplicando el filtro activo y manejando el estado vacío.
 */
const renderizarTarjetas = () => {
  const grid = document.getElementById('grid-lanzamientos');
  const estadoVacio = document.getElementById('estado-vacio');

  // Filtrar según el estado seleccionado
  const filtrados = lanzamientos.filter(l => {
    if (filtroActivo === 'todos') return true;
    return l.estado === filtroActivo;
  });

  // Eliminar todas las tarjetas de lanzamientos existentes (evitando tocar #estado-vacio)
  const tarjetasExistentes = grid.querySelectorAll('.organism-launch-card');
  tarjetasExistentes.forEach(tarjeta => tarjeta.remove());

  // Controlar la visibilidad del estado vacío
  if (filtrados.length === 0) {
    estadoVacio.style.display = 'flex';
  } else {
    estadoVacio.style.display = 'none';
    
    // Crear y añadir cada tarjeta programáticamente
    filtrados.forEach(lanzamiento => {
      const tarjetaDOM = crearTarjetaDOM(lanzamiento);
      grid.appendChild(tarjetaDOM);
    });
  }

  // Actualizar el contador de registros visibles
  const contVisibles = document.getElementById('contador-visibles');
  contVisibles.textContent = `${filtrados.length} REGISTRO${filtrados.length !== 1 ? 'S' : ''}`;
};



// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 5 — FORMULARIO: REGISTRO Y EDICIÓN
//
//  Función que responde al evento de envío del formulario.
//  Debe leer el valor de cada campo, verificar que no estén vacíos,
//  construir el objeto del lanzamiento y añadirlo al almacén.
//  Si el campo oculto de edición contiene un ID, debe actualizar el
//  registro existente en lugar de crear uno nuevo.
//
//  IDs relevantes del HTML:
//    · #form-lanzamiento        → el elemento <form>
//    · #input-nombre-serie      → campo texto nombre
//    · #select-tipo-cohete      → campo selección tipo
//    · #input-fecha-lanzamiento → campo fecha y hora
//    · #input-objetivo-mision   → campo texto objetivo
//    · #input-id-edicion        → campo oculto con el ID en modo edición
//    · #btn-registrar           → botón principal del formulario
//    · #btn-cancelar-edicion    → botón para salir del modo edición
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Limpia los campos del formulario y restablece los valores predeterminados.
 */
const limpiarCamposFormulario = () => {
  document.getElementById('input-nombre-serie').value = '';
  document.getElementById('select-tipo-cohete').value = '';
  document.getElementById('input-fecha-lanzamiento').value = '';
  document.getElementById('input-objetivo-mision').value = '';
  document.getElementById('input-id-edicion').value = '';
};

/**
 * Cancela el modo edición restableciendo el formulario al estado de registro.
 */
const cancelarEdicion = () => {
  idEdicion = null;
  limpiarCamposFormulario();
  document.getElementById('btn-cancelar-edicion').style.display = 'none';
  document.getElementById('btn-registrar').innerHTML = '&#9654;&nbsp;REGISTRAR LANZAMIENTO';
};

/**
 * Procesa el envío del formulario para crear un nuevo registro o guardar cambios.
 */
const gestionarFormulario = (event) => {
  event.preventDefault();

  const nombreInput = document.getElementById('input-nombre-serie');
  const tipoSelect = document.getElementById('select-tipo-cohete');
  const fechaInput = document.getElementById('input-fecha-lanzamiento');
  const objetivoInput = document.getElementById('input-objetivo-mision');

  const nombre = nombreInput.value.trim();
  const tipo = tipoSelect.value;
  const fecha = fechaInput.value;
  const objetivo = objetivoInput.value.trim();

  try {
    // Validación de campos vacíos
    if (!nombre || !tipo || !fecha || !objetivo) {
      throw new Error('Todos los campos son obligatorios. Por favor complete el formulario.');
    }

    if (idEdicion) {
      // Modo Edición: actualizar registro existente
      const index = lanzamientos.findIndex(l => l.id === idEdicion);
      if (index !== -1) {
        lanzamientos[index].nombre = nombre;
        lanzamientos[index].tipo = tipo;
        lanzamientos[index].fecha = fecha;
        lanzamientos[index].objetivo = objetivo;
      }
      cancelarEdicion();
    } else {
      // Modo Registro: añadir nuevo objeto de lanzamiento
      const nuevoLanzamiento = {
        id: generarID(),
        nombre: nombre,
        tipo: tipo,
        fecha: fecha,
        objetivo: objetivo,
        estado: 'pendiente'
      };
      
      lanzamientos.push(nuevoLanzamiento);
      limpiarCamposFormulario();
    }

    // Actualizar la interfaz y las métricas
    actualizarEstadisticas();
    renderizarTarjetas();

  } catch (error) {
    alert(error.message);
  }
};



// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 6 — CAMBIOS DE ESTADO
//
//  Funciones que modifican un lanzamiento existente:
//    · Modo edición: cargar los datos del registro en el formulario
//    · Cancelación: cambiar el estado del registro a "cancelado"
//
//  Las tarjetas tienen botones con los atributos data-id y data-action.
//  Puedes usar estos atributos para saber qué registro modificar y
//  qué acción ejecutar cuando el usuario hace clic.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Carga los datos de un lanzamiento en el formulario para habilitar su edición.
 */
const cargarEdicion = (id) => {
  const lanzamiento = lanzamientos.find(l => l.id === id);
  if (!lanzamiento) return;

  // Solo se pueden editar lanzamientos en estado pendiente
  if (lanzamiento.estado !== 'pendiente') {
    alert('Solo se pueden editar lanzamientos con estado PENDIENTE.');
    return;
  }

  idEdicion = id;
  document.getElementById('input-id-edicion').value = id;
  
  document.getElementById('input-nombre-serie').value = lanzamiento.nombre;
  document.getElementById('select-tipo-cohete').value = lanzamiento.tipo;
  document.getElementById('input-fecha-lanzamiento').value = lanzamiento.fecha;
  document.getElementById('input-objetivo-mision').value = lanzamiento.objetivo;

  // Mostrar botón de cancelar edición y cambiar el texto del botón principal
  document.getElementById('btn-cancelar-edicion').style.display = 'block';
  document.getElementById('btn-registrar').innerHTML = '&#9998;&nbsp;GUARDAR CAMBIOS';
};

/**
 * Modifica el estado del lanzamiento seleccionado a "cancelado".
 */
const cancelarLanzamiento = (id) => {
  const lanzamiento = lanzamientos.find(l => l.id === id);
  if (!lanzamiento) return;

  // Solo se pueden cancelar lanzamientos en estado pendiente
  if (lanzamiento.estado !== 'pendiente') {
    alert('Solo se pueden cancelar lanzamientos con estado PENDIENTE.');
    return;
  }

  lanzamiento.estado = 'cancelado';

  // Si se cancela el vuelo que se está editando en este momento, salir del modo edición
  if (idEdicion === id) {
    cancelarEdicion();
  }

  actualizarEstadisticas();
  renderizarTarjetas();
};



// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 7 — FILTRADO POR ESTADO
//
//  Funciones que muestran u ocultan tarjetas según el filtro activo.
//  Al aplicar un filtro, solo deben verse las tarjetas que coincidan
//  con el estado seleccionado. El botón activo debe marcarse visualmente.
//
//  IDs relevantes del HTML:
//    · #grupo-filtros  → contenedor de los botones de filtro
//
//  Atributo en los botones de filtro: data-filter
//  Valores posibles: "todos" · "pendiente" · "lanzado" · "cancelado"
//
//  Clase CSS del botón activo: atom-btn--filter-active
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Filtra las tarjetas mostradas en pantalla según el estado seleccionado.
 */
const aplicarFiltro = (estado) => {
  filtroActivo = estado;

  // Actualizar el estado visual del botón activo
  const botonesFiltro = document.querySelectorAll('#grupo-filtros .atom-btn--filter');
  botonesFiltro.forEach(btn => {
    if (btn.getAttribute('data-filter') === estado) {
      btn.classList.add('atom-btn--filter-active');
    } else {
      btn.classList.remove('atom-btn--filter-active');
    }
  });

  renderizarTarjetas();
};



// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 8 — RELOJ Y MONITOREO AUTOMÁTICO
//
//  Un intervalo de tiempo que se ejecuta cada segundo y realiza dos tareas:
//
//    Tarea A: Reloj en tiempo real
//      Obtener la hora actual en UTC y mostrarla en el elemento del reloj
//      usando el formato HH:MM:SSZ (horas, minutos, segundos + letra Z).
//
//    Tarea B: Detección automática de lanzamientos
//      Recorrer el almacén y buscar registros con estado "pendiente"
//      cuya fecha programada ya se haya alcanzado o superado.
//      Cuando se detecte uno, cambiar su estado a "lanzado" y
//      actualizar la vista para reflejar el cambio.
//
//  ID relevante del HTML:
//    · #reloj-principal → elemento donde se despliega la hora
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Controla la actualización del reloj UTC y revisa el paso de fecha para lanzamientos.
 */
const actualizarRelojYMonitoreo = () => {
  const ahora = new Date();

  // Tarea A: Reloj UTC en tiempo real (HH:MM:SSZ)
  const hh = String(ahora.getUTCHours()).padStart(2, '0');
  const mm = String(ahora.getUTCMinutes()).padStart(2, '0');
  const ss = String(ahora.getUTCSeconds()).padStart(2, '0');
  
  const reloj = document.getElementById('reloj-principal');
  if (reloj) {
    reloj.textContent = `${hh}:${mm}:${ss}Z`;
  }

  // Tarea B: Monitoreo automático de lanzamientos pendientes
  let huboCambios = false;
  lanzamientos.forEach(l => {
    if (l.estado === 'pendiente') {
      const fechaProgramada = new Date(l.fecha);
      
      // Si la fecha programada ya se alcanzó o superó
      if (fechaProgramada <= ahora) {
        l.estado = 'lanzado';
        huboCambios = true;
        
        // Si el vuelo que se acaba de lanzar estaba en edición, salir de edición
        if (idEdicion === l.id) {
          cancelarEdicion();
        }
      }
    }
  });

  if (huboCambios) {
    actualizarEstadisticas();
    renderizarTarjetas();
  }
};



// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 9 — ESTADÍSTICAS
//
//  Función que recorre el almacén, cuenta los registros por estado
//  y actualiza los elementos del panel de estadísticas con los totales.
//
//  IDs relevantes del HTML:
//    · #stat-pendientes  → contador de lanzamientos pendientes
//    · #stat-lanzados    → contador de lanzamientos ejecutados
//    · #stat-cancelados  → contador de lanzamientos cancelados
//    · #stat-total       → total de registros en el sistema
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calcula y dibuja los contadores del panel izquierdo y de la barra superior.
 */
const actualizarEstadisticas = () => {
  const pendientes = lanzamientos.filter(l => l.estado === 'pendiente').length;
  const lanzados = lanzamientos.filter(l => l.estado === 'lanzado').length;
  const cancelados = lanzamientos.filter(l => l.estado === 'cancelado').length;
  const total = lanzamientos.length;

  document.getElementById('stat-pendientes').textContent = pendientes;
  document.getElementById('stat-lanzados').textContent = lanzados;
  document.getElementById('stat-cancelados').textContent = cancelados;
  document.getElementById('stat-total').textContent = total;

  // Actualizar contador global de la topbar (Vuelos Activos / Totales)
  document.getElementById('contador-lanzamientos').textContent = total;
};



// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 10 — INICIALIZACIÓN
//
//  Punto de arranque de la aplicación. Todo el código que necesita
//  interactuar con elementos del DOM debe ejecutarse aquí, dentro de
//  un mecanismo que garantice que la página ya terminó de cargar.
//
//  Desde aquí debes:
//    · Conectar los eventos del formulario y los botones
//    · Iniciar el intervalo del reloj y el monitor automático
//    · Hacer el primer renderizado y actualizar las estadísticas
// ─────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Ocultar botón de cancelar edición en la carga inicial
  const btnCancelarEdicion = document.getElementById('btn-cancelar-edicion');
  if (btnCancelarEdicion) {
    btnCancelarEdicion.style.display = 'none';
    btnCancelarEdicion.addEventListener('click', cancelarEdicion);
  }

  // Conectar el evento submit del formulario
  const form = document.getElementById('form-lanzamiento');
  if (form) {
    form.addEventListener('submit', gestionarFormulario);
  }

  // Conectar eventos para los botones de filtrado
  const botonesFiltro = document.querySelectorAll('#grupo-filtros .atom-btn--filter');
  botonesFiltro.forEach(btn => {
    btn.addEventListener('click', () => {
      const filtro = btn.getAttribute('data-filter');
      aplicarFiltro(filtro);
    });
  });

  // Lanzar el reloj y monitoreo y programar su actualización cada segundo
  actualizarRelojYMonitoreo();
  setInterval(actualizarRelojYMonitoreo, 1000);

  // Inicializar el almacén con datos de prueba generados dinámicamente
  lanzamientos = [
    {
      nombre: 'STARLINK-GROUP-9-1',
      tipo: 'falcon',
      fecha: '2026-05-28T10:00',
      objetivo: 'Despliegue de 22 satélites Starlink a órbita baja terrestre.',
      estado: 'lanzado'
    },
    {
      nombre: 'STARLINK-GROUP-9-2',
      tipo: 'falcon',
      fecha: '2026-05-30T14:00',
      objetivo: 'Despliegue constelación Starlink v2 Mini.',
      estado: 'pendiente'
    },
    {
      nombre: 'STARSHIP-TEST-FLIGHT-4',
      tipo: 'starship',
      fecha: '2026-05-20T08:00',
      objetivo: 'Vuelo de prueba integrado del vehículo Starship desde Starbase.',
      estado: 'lanzado'
    },
    {
      nombre: 'STARSHIP-TEST-FLIGHT-5',
      tipo: 'starship',
      fecha: '2026-06-15T12:00',
      objetivo: 'Prueba de captura de la primera etapa Super Heavy en la torre.',
      estado: 'pendiente'
    },
    {
      nombre: 'FALCON-HEAVY-PSYCHE',
      tipo: 'falcon-heavy',
      fecha: '2026-04-10T16:30',
      objetivo: 'Envío de sonda científica hacia el asteroide metálico Psyche.',
      estado: 'lanzado'
    },
    {
      nombre: 'STARLINK-GROUP-9-3',
      tipo: 'falcon',
      fecha: '2026-05-25T11:00',
      objetivo: 'Despliegue de satélites Starlink. Abortado en T-10s por telemetría.',
      estado: 'cancelado'
    },
    {
      nombre: 'STARLINK-GROUP-9-4',
      tipo: 'falcon',
      fecha: '2026-06-01T09:00',
      objetivo: 'Inyección orbital de satélites de banda ancha Starlink.',
      estado: 'pendiente'
    },
    {
      nombre: 'CREW-9-MISSION',
      tipo: 'falcon',
      fecha: '2026-08-18T20:00',
      objetivo: 'Transporte de tripulación a la Estación Espacial Internacional.',
      estado: 'pendiente'
    },
    {
      nombre: 'FALCON-HEAVY-GOES-U',
      tipo: 'falcon-heavy',
      fecha: '2026-05-15T17:00',
      objetivo: 'Lanzamiento de satélite meteorológico avanzado para la NOAA.',
      estado: 'cancelado'
    },
    {
      nombre: 'STARSHIP-CARGO-MARS',
      tipo: 'starship',
      fecha: '2026-10-22T05:00',
      objetivo: 'Misión no tripulada de envío de suministros preliminares a Marte.',
      estado: 'pendiente'
    }
  ].map(l => ({ ...l, id: generarID() }));
  
  // Dibujar estado inicial de las estadísticas y tarjetas
  actualizarEstadisticas();
  renderizarTarjetas();
});

