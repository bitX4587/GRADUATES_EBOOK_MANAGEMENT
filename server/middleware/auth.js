const isLogin = async (req, res, next) => {
  try {
    if (req.session.user_id) {
      return next(); // User is logged in, continue to the next middleware
    } else {
      return res.redirect("/login"); // Redirect to login if user is not logged in
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "An error occurred" });
  }
};

const isLogout = async (req, res, next) => {
  try {
    if (req.session.user_id) {
      return res.redirect("/home"); // Redirect to home if already logged in
    }
    next(); // Proceed to the next middleware if not logged in
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "An error occurred" });
  }
};

export { isLogin, isLogout };
