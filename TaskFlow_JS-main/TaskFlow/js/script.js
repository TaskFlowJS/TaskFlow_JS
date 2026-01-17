//VARIABLES GLOBALES -----------------------------------------------------------------------------------------------------
let tasks = [];


// ELEMENTOS DEL DOM ------------------------------------------------------------------------------------------------------
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const emptyMessage = document.getElementById('emptyMessage');
const darkModeToggle = document.getElementById('darkModeToggle');

const tituloInput = document.getElementById('titulo');
const descripcionInput = document.getElementById('descripcion');
const prioridadSelect = document.getElementById('prioridad');

const tituloError = document.getElementById('tituloError');
const descripcionError = document.getElementById('descripcionError');

const statTotal = document.getElementById('statTotal');
const statPendientes = document.getElementById('statPendientes');
const statEnProceso = document.getElementById('statEnProceso');
const statCompletadas = document.getElementById('statCompletadas');

const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// INICIALIZACIÓN---------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    loadDarkModePreference();
    updateStats();
    updateEmptyMessage();
});

// LOCAL STORAGE----------------------------------------------------------------------------------------------------------
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadFromLocalStorage() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderAllTasks();
    }
}

function loadDarkModePreference() {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'true') {
        document.body.classList.add('dark-mode');
    }
}

function saveDarkModePreference(isDark) {
    localStorage.setItem('darkMode', isDark);
}

// MODO OSCURO ------------------------------------------------------------------------------------------------------------
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    saveDarkModePreference(isDark);
});

// FORMULARIO - CREAR TAREA -----------------------------------------------------------------------------------------------

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Limpiar errores previos -------------------------------------------------------------------------------------------
    tituloError.textContent = '';
    descripcionError.textContent = '';

    // Validación --------------------------------------------------------------------------------------------------------
    let isValid = true;

    if (tituloInput.value.trim().length < 3) {
        tituloError.textContent = 'El título debe tener al menos 3 caracteres';
        isValid = false;
    }

    if (descripcionInput.value.trim().length < 5) {
        descripcionError.textContent = 'La descripción debe tener al menos 5 caracteres';
        isValid = false;
    }

    if (!isValid) {
        showToast('Formulario inválido', 'error');
        return;
    }

    // Crear nueva tarea -------------------------------------------------------------------------------------------------
    const newTask = {
        id: generateId(),
        titulo: tituloInput.value.trim(),
        descripcion: descripcionInput.value.trim(),
        prioridad: prioridadSelect.value,
        estado: 'pendiente'
    };

    tasks.push(newTask);
    saveToLocalStorage();
    renderTask(newTask);
    updateStats();
    updateEmptyMessage();

    // Resetear formulario -----------------------------------------------------------------------------------------------
    taskForm.reset();
    showToast('Tarea creada exitosamente', 'success');
});

// RENDERIZADO DE TAREAS -------------------------------------------------------------------------------------------------
function renderAllTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => renderTask(task));
}

function renderTask(task) {
    const taskCard = document.createElement('div');
    taskCard.className = `task-card border-${task.estado}`;
    taskCard.setAttribute('data-id', task.id);

    taskCard.innerHTML = `
        <div class="task-header">
            <span class="badge-prioridad badge-${task.prioridad}">
                ${capitalize(task.prioridad)}
            </span>
            <div class="status-icon ${task.estado}">
            </div>
        </div>
        
        <h3 class="task-title">${escapeHtml(task.titulo)}</h3>
        <p class="task-description">${escapeHtml(task.descripcion)}</p>
        
        <select class="task-status-select" data-id="${task.id}">
            <option value="pendiente" ${task.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
            <option value="en-proceso" ${task.estado === 'en-proceso' ? 'selected' : ''}>En proceso</option>
            <option value="completada" ${task.estado === 'completada' ? 'selected' : ''}>Completada</option>
        </select>
        
        <button class="delete-btn" data-id="${task.id}">
            Eliminar
        </button>
    `;

    taskList.appendChild(taskCard);
}

// EVENTOS DE TAREAS ----------------------------------------------------------------------------------------------------
taskList.addEventListener('click', (e) => {
    // Eliminar tarea ----------------------------------------------------------------------------------------------------
    if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
        const button = e.target.classList.contains('delete-btn') ? e.target : e.target.closest('.delete-btn');
        const taskId = button.getAttribute('data-id');
        deleteTask(taskId);
    }
});

taskList.addEventListener('change', (e) => {
    // Cambiar estado de tarea -------------------------------------------------------------------------------------------
    if (e.target.classList.contains('task-status-select')) {
        const taskId = e.target.getAttribute('data-id');
        const newStatus = e.target.value;
        updateTaskStatus(taskId, newStatus);
    }
});

// FUNCIONES DE TAREAS ---------------------------------------------------------------------------------------------------
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);

    const taskCard = document.querySelector(`[data-id="${taskId}"]`);
    if (taskCard) {
        taskCard.remove();
    }

    saveToLocalStorage();
    updateStats();
    updateEmptyMessage();
    showToast('Tarea eliminada', 'success');
}

function updateTaskStatus(taskId, newStatus) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.estado = newStatus;

        // Actualizar borde de la tarjeta ---------------------------------------------------------------------------------
        const taskCard = document.querySelector(`.task-card[data-id="${taskId}"]`);
        if (taskCard) {
            taskCard.className = `task-card border-${newStatus}`;

            // Actualizar icono de estado ---------------------------------------------------------------------------------
            const statusIcon = taskCard.querySelector('.status-icon');
            if (statusIcon) {
                statusIcon.className = `status-icon ${newStatus}`;
            }
        }

        saveToLocalStorage();
        updateStats();
        showToast('Estado actualizado', 'success');
    }
}

// ESTADÍSTICAS ----------------------------------------------------------------------------------------------------------
function updateStats() {
    const total = tasks.length;
    const pendientes = tasks.filter(t => t.estado === 'pendiente').length;
    const enProceso = tasks.filter(t => t.estado === 'en-proceso').length;
    const completadas = tasks.filter(t => t.estado === 'completada').length;

    statTotal.textContent = total;
    statPendientes.textContent = pendientes;
    statEnProceso.textContent = enProceso;
    statCompletadas.textContent = completadas;
}

// MENSAJE VACÍO ---------------------------------------------------------------------------------------------------------
function updateEmptyMessage() {
    if (tasks.length === 0) {
        emptyMessage.classList.add('show');
        taskList.style.display = 'none';
    } else {
        emptyMessage.classList.remove('show');
        taskList.style.display = 'grid';
    }
}

// TOAST (NOTIFICACIONES) ------------------------------------------------------------------------------------------------
let toastTimeout;

function showToast(message, type = 'success') {
    // Limpiar timeout anterior si existe -------------------------------------------------------------------------------
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }

    // Configurar mensaje y tipo -----------------------------------------------------------------------------------------
    toastMessage.textContent = message;
    toast.className = `toast ${type}`;

    // Mostrar toast -----------------------------------------------------------------------------------------------------
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Ocultar en 5 segundos ---------------------------------------------------------------------------------------------
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

// UTILIDADES ------------------------------------------------------------------------------------------------------------
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
