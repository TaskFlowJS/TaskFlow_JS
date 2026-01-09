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
