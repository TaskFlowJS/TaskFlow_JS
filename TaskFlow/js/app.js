/* Modo Oscuro */

const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Verificar si el modo oscuro está activado en el almacenamiento local
if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
    darkModeToggle.checked = true;
}

// Alternar el modo oscuro al hacer clic en el interruptor

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    if(body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        darkModeToggle.textContent = '☀️';
    }   else {
        localStorage.setItem('darkMode', 'disabled');
        darkModeToggle.textContent = '🌙';
    }
});

/* Form validations errors  */
const title = document.getElementById('titulo');
const description = document.getElementById('descripcion');
const titleError = document.getElementById('tituloError');
const descriptionError = document.getElementById('descripcionError');
const form = document.getElementById('taskForm');

form.addEventListener ('submit', (e) => {
    let isValid = true;

    titleError.textContent = '';
    descriptionError.textContent = '';
    title.classList.remove('error-input');
    description.classList.remove('error-input');

    if (!title) {
        titleError.textContent = 'Title cant be empty';
        title.classList.add('error-input');
        isValid = false;
    }

    else if (title.value.trim().length < 3) {
        titleError.textContent = 'Title must have al least 3 characters';
        title.classList.add('error-input');
        isValid = false;
    }

    if (!description) {
        descriptionError.textContent = 'Description is mandatory';
        description.classList.add ('error-input');
        isValid = false;
    } 
    
    else if (description.value.trim().length < 5) {
        descriptionError.textContent = 'Description must have more than 5 characters';
        description.classList.add('error-input');
        isValid = false;
    } 

    // Toast de error
    if (!isValid) {
        e.preventDefault();
        showToast("Error", "Please fix the form errors", "error");
        return;
    }

    // Toast de éxito
    e.preventDefault();
    showToast("Success", "Task created successfully", "success");

})

// Errors notifications //

function showToast(title, message, type = "success") {
    const toastElement = document.getElementById("formToast");
    const toastTitle = document.getElementById("toastTitle");
    const toastBody = document.getElementById("toastBody");

    // Reset clases
    toastBody.className = "toast-body";

    // Asignar contenido
    toastTitle.textContent = title;
    toastBody.textContent = message;

    // Tipos de toast
    if (type === "success") {
        toastBody.classList.add("text-bg-success");
    } else if (type === "error") {
        toastBody.classList.add("text-bg-danger");
    } else if (type === "info") {
        toastBody.classList.add("text-bg-info");
    }

    const toast = new bootstrap.Toast(toastElement, {
        delay: 3000
    });

    toast.show();
}



// Elementos del DOM
const creartarea = document.getElementById('creartarea');
const apartadotarea = document.getElementById('taskList');

let idCounter = 0; 

// --- MAPEO DE CLASES CSS ---
const PRIORITY_CLASSES = {
    'baja': 'badge-baja',
    'media': 'badge-media', 
    'alta': 'badge-alta' 
};

const STATUS_CLASSES = {
    'en-proceso': 'border-en-proceso',
    'completada': 'border-completada',
    'pendiente': 'border-pendiente'
};
// -----------------------------

/**
 * Crea y renderiza una nueva tarjeta de tarea en el DOM.
 * @param {object} tareaData - Objeto que contiene todos los datos de la tarea.
 */
function crear(tareaData) { 
    const { 
        tituloTarea, 
        descripcionTarea, 
        prioridadTarea, 
        estadoTarea 
    } = tareaData;
    
    // DETERMINAMOS LAS CLASSES DE CSS CON LOS COLORES A ASIGNAR
    const priorityKey = prioridadTarea.toLowerCase(); 
    const priorityClass = PRIORITY_CLASSES[priorityKey] || PRIORITY_CLASSES['media']; 
        
    // Función de formato para mostrar el texto en el badge con la primera letra en mayúscula
    const displayPriority = prioridadTarea.charAt(0).toUpperCase() + prioridadTarea.slice(1); // Capitaliza la primera letra del valor de prioridad (ej: 'alta' se convierte en 'Alta') para que se muestre con mejor formato en el badge de la interfaz.
        
    const statusClass = STATUS_CLASSES[estadoTarea] || STATUS_CLASSES['pendiente']; // Busca la clase CSS asociada al estado de la tarea (ej: 'border-en-proceso') en el mapeo STATUS_CLASSES. Si no encuentra el estado, aplica la clase del estado 'pendiente' por defecto.
        
    const traId = `id-${idCounter}`;                        

    // Contenido del select (opciones)
    const optionsHtml = Object.keys(STATUS_CLASSES).map(statusKey => { // Obtiene un array con los nombres de los estados ('en-proceso', 'completada', 'pendiente') y comienza a iterar sobre cada uno para generar el HTML del selector.
        const isSelected = statusKey === estadoTarea ? 'selected=""' : ''; 
        const optionClass = STATUS_CLASSES[statusKey];         
        const statusDisplay = statusKey.charAt(0).toUpperCase() + statusKey.slice(1).replace('-', ' '); // Formatea el texto del estado (ej: convierte 'en-proceso' a 'En proceso') para mostrarlo en la lista desplegable.
        return `<option value="${statusKey}" ${isSelected} class="${optionClass}">${statusDisplay}</option>`;
    }).join('');                                                // Concatena todos los elementos del array de <option> en una única cadena HTML para inyectarla en el DOM.

    apartadotarea.innerHTML += `
        <div class="col-12 col-md-6 col-lg-4 task-wrapper" id="${traId}">
            <div class="card task-card shadow-sm ${statusClass}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <span class="badge-prioridad ${priorityClass}">${displayPriority}</span>
                        <button class="btn btn-sm btn-delete" data-task-id="${traId}"><i class="bi bi-trash"></i></button>
                    </div>
                    <h5 class="card-title task-title fw-bold mb-2">${tituloTarea}</h5>
                    <p class="color">${descripcionTarea}</p>
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <i class="bi estado-icon bi-exclamation-circle icon-${estadoTarea}"></i>
                        <select class="form-select form-select-sm" data-task-id="${traId}">
                            ${optionsHtml}
                        </select>
                    </div>
                    <div class="text-muted small border-top pt-2">
                    <p class="color">Creada: ${new Date().toLocaleDateString('es-ES')}</p></div>
                </div>
            </div>
        </div>
    `;
    
    idCounter++; 
}


// CREACION DE TAREA
creartarea.addEventListener('click', (e) => {
    e.preventDefault();
    
    const titulo = document.getElementById('titulo').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const prioridad = document.getElementById('prioridad').value; 
    
    if (!titulo || !descripcion) {
        console.error("El título y la descripción son obligatorios.");
        return; 
    }
    
    const newtareaData = { 
        tituloTarea: titulo,
        descripcionTarea: descripcion,
        prioridadTarea: prioridad,
        estadoTarea: 'pendiente' 
    };

    crear(newtareaData); 
    
    // 3. Limpiar los campos del formulario
    document.getElementById('titulo').value = '';
    document.getElementById('descripcion').value = '';
    document.getElementById('prioridad').value = 'media'; 
});


// ELIMINAR TAREA
apartadotarea.addEventListener('click', (e) => {
    const deleteButton = e.target.closest('.btn-delete');
    
    if (deleteButton) {
        const traId = deleteButton.getAttribute('data-task-id'); 
        
        const tareaElement = document.getElementById(traId); 
        
        if (tareaElement) { 
            tareaElement.remove(); 
            console.log(`Tarea ${traId} eliminada.`);
        }
    }
    
    // APARTADO PARA CAMBIAR EL COLOR AL BORDER DE LA TAREA
    const statusSelect = e.target.closest('.form-select');
    if (statusSelect && statusSelect.dataset.taskId) {
        const traId = statusSelect.dataset.taskId; 
        const newStatus = statusSelect.value;
        const tareaWrapper = document.getElementById(traId); 
        
        if (tareaWrapper) { 
            // Eliminar todas las clases de estado antiguas
            Object.values(STATUS_CLASSES).forEach(cls => {
                tareaWrapper.querySelector('.task-card').classList.remove(cls); 
            });
            
            // Agregar la nueva clase de estado
            const newStatusClass = STATUS_CLASSES[newStatus];
            tareaWrapper.querySelector('.task-card').classList.add(newStatusClass); 

            const iconElement = tareaWrapper.querySelector('.estado-icon');
            if (iconElement) {
                // Remove existing icon classes (bi-exclamation-circle, icon-*)
                iconElement.classList.remove('icon-pendiente', 'icon-en-proceso', 'icon-completada');
                
                // Set the appropriate icon class
                iconElement.classList.add(`icon-${newStatus}`);
                
                // Optional: Change icon shape based on status
                if (newStatus === 'completada') {
                    iconElement.classList.remove('bi-exclamation-circle', 'bi-arrow-repeat');
                    iconElement.classList.add('bi-check-circle-fill');
                } else if (newStatus === 'en-proceso') {
                    iconElement.classList.remove('bi-check-circle-fill', 'bi-exclamation-circle');
                    iconElement.classList.add('bi-arrow-repeat');
                } else { // pendiente
                    iconElement.classList.remove('bi-check-circle-fill', 'bi-arrow-repeat');
                    iconElement.classList.add('bi-exclamation-circle');
                }
            }
        }
    }
});
