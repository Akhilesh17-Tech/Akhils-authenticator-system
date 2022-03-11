// home controller
module.exports.home = function (req, res) {
  //   return res.end("<h1> Hello Akhilesh </h1>");
  res.render("signUp", {
    title: "Authenticator | Sing up ",
  });
};
