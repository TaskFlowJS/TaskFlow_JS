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

    // ❌ Error → Toast de error
    if (!isValid) {
        e.preventDefault();
        showToast("Error", "Please fix the form errors", "error");
        return;
    }

    // ✅ Éxito → Toast de éxito
    e.preventDefault(); // quítalo si vas a enviar a backend
    showToast("Success", "Task created successfully", "success");

    // form.submit(); ← si luego lo conectas a backend
})

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

