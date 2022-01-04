
exports.showLandingPage = (req, res) => {
  let msg = false;
  if (req.query.msg) {
    msg = req.query.msg;
  }
  
        res.render("login", {
          pageName: "Login",
          landingPage: true,
          layout: "page-form",
        });
};
