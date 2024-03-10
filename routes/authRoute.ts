import express, { Request, Response, NextFunction } from "express";
import passport from 'passport';
import { forwardAuthenticated } from "../middleware/checkAuth";

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => {
  const error_msg = req.flash('error_msg');
  res.render("login", { error_msg });
})

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: true 
  }), (req, res) => {
    if (req.user && req.user.role === 'admin') {
      // Redirect the admin user to the admin dashboard.
      req.session.isAdminSession = true;
      req.session.adminInfo = { name: req.user.name, id: req.user.id };
      res.redirect('/admin');
    } else {
      // Redirect a regular user to the user dashboard.
      res.redirect('/dashboard');
    }
  }
);


router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});


export default router;
