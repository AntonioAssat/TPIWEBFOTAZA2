const form = document.getElementById("registerForm");

const errorAlert = document.getElementById("errorAlert");

form.addEventListener("submit", (e) => {

    errorAlert.classList.add("d-none");

    const username =
        document.getElementById("username").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;
    // USERNAME
  
    if (username.length < 3) {

        e.preventDefault();

        showError(
            "El usuario debe tener al menos 3 caracteres"
        );

        return;
    }
    // PASSWORD

    if (password.length < 6) {

        e.preventDefault();

        showError(
            "La contraseña debe tener al menos 6 caracteres"
        );

        return;
    }

    // PASSWORDS IGUALES
    if (password !== confirmPassword) {

        e.preventDefault();

        showError(
            "Las contraseñas no coinciden"
        );

        return;
    }

});
// MOSTRAR ERROR

function showError(message) {

    errorAlert.textContent = message;

    errorAlert.classList.remove("d-none");
}