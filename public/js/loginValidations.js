const form =document.querySelector("form");

form.addEventListener("submit",e => {

        const email =document.getElementById("email").value.trim();

        const password =document.getElementById("password").value.trim();

        if (email === "" || password === "") {

            e.preventDefault();

            alert("Completá todos los campos");

            return;
        }

        const regex =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regex.test(email)) {
            e.preventDefault();
            alert("Ingresá un email válido");
        }
    }
);