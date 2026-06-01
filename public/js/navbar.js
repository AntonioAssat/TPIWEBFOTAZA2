let lastScroll = 0;

const navbar =
document.querySelector(".navbar");

window.addEventListener(
    "scroll",
    () => {

        const currentScroll =
        window.pageYOffset;

        if (
            currentScroll > lastScroll &&
            currentScroll > 100
        ) {

            navbar.classList.add(
                "nav-hidden"
            );

            navbar.classList.remove(
                "nav-visible"
            );

        } else {

            navbar.classList.add(
                "nav-visible"
            );

            navbar.classList.remove(
                "nav-hidden"
            );
        }

        lastScroll =
        currentScroll;
    }
);