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