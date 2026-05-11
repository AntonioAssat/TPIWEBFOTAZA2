export const home = (req, res) => {
    res.render("pages/home", { titulo: "Fotaza 2" });
};
export const showHome = (req, res) => {

    res.render("pages/home");

};