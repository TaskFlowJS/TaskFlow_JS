const form = document.getElementById("taskForm");

function validateForm(titulo, descripcion ) {
    const tituloInput = document.getElementById("titulo");
    const descripcionInput = document.getElementById("descripcion");
    const tituloError = document.getElementById("tituloError");
    const descripcionError = document.getElementById("descripcionError");

    if (!titulo) {
        tituloInput.classList.add("is-invalid");
        tituloError.textContent = "El titulo debe tener almenos 3 caracteres";
        isValid = false;
    } else if (titulo.length < 3) {
        tituloInput.classList.add("is-invalid");
        tituloInput.textContent = "El título debe tener al menos 3 caracteres";
        isValid = false;
    } else {
        tituloInput.classList.remove("is-invalid");
    }

    if (!descripcion) {
        descripcionInput.classList.add('is-invalid');
        descripcionError.textContent = 'La descripción es obligatoria';
        isValid = false;
    } else if (descripcion.length < 5) {
        descripcionInput.classList.add('is-invalid');
        descripcionError.textContent = 'La descripción debe tener al menos 5 caracteres';
        isValid = false;
    } else {
        descripcionInput.classList.remove('is-invalid');
    }
    return isValid;
}


