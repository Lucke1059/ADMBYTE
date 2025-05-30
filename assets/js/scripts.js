// Cargar el header y footer en las páginas HTML
document.addEventListener("DOMContentLoaded", function () {
    // Incluir el header
    fetch('includes/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        })
        .catch(err => console.error('Error al cargar el header:', err));

    // Incluir el footer
    fetch('includes/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(err => console.error('Error al cargar el footer:', err));
});
