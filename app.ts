import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import { Request, Response } from "express";
import path from "path";
import passport from 'passport';
import passportMiddleware from './middleware/passportMiddleware';
import isAdmin  from "./middleware/isAdmin";
import flash from "connect-flash";

const port = process.env.PORT || 4000;

const app = express();


app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);


import authRoute from "./routes/authRoute";
import indexRoute from "./routes/indexRoute";

// Middleware for express
app.use(express.json());
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
passportMiddleware(app);
app.use(flash());

app.use((req, res, next) => {
  console.log(`User details are: `);
  console.log(req.user);

  console.log("Entire session object:");
  console.log(req.session);

  console.log(`Session details are: `);
  console.log((req.session as any).passport);
  next();
});

app.use("/", indexRoute);
app.use("/auth", authRoute);


app.get('/auth/github',passport.authenticate('github'));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect to dashboard.
    res.redirect('/dashboard');
  });

 
 
  // Admin dashboard with session listing
  app.get('/admin', isAdmin, (req: Request, res: Response) => {
    const store : any = req.sessionStore!;

    store.all((err: any, sessions: { [key: string]: any } | null) => {
        if (err) {
            console.error('Failed to retrieve sessions:', err);
            return res.status(500).send('Error fetching sessions');
        }
        console.log("Raw sessions from the store:", sessions);
        // Transform sessions into an array with additional info
        let sessionsArray: any[] = [];
        if (sessions) {
            sessionsArray = Object.entries(sessions).map(([sid, sessionData]) => {
         
                const userID = sessionData.passport ? sessionData.passport.user : undefined;
                return {
                    sid,
                    userID,
                    ...sessionData
                };
            });
        }
        console.log("Transformed sessions array:", sessionsArray);
        res.render('admin', {
            user: req.session.adminInfo, // Pass the adminInfo object to the view
            sessions: sessionsArray
        });
    });
});



  app.post('/admin/revoke-session', (req, res) => {
    const sessionId = req.body.sid; 
    const store = req.sessionStore;
    store.destroy(sessionId, (err) => {
        if (err) {
            return res.status(500).send('Error revoking session');
        }
        console.log(`Session ${sessionId} has been revoked.`);
        res.redirect('/admin'); 
    });
});

app.post('/logout', function(req, res) {
  // Check if the passport data exists in the session
  if (req.session.passport) {
    // Delete the user data from the session
    delete req.session.passport.user;
  }

  // Optionally, destroy the entire session
  req.session.destroy(function(err) {
    if (err) {
      console.error('Session destruction error:', err);
      return res.status(500).send('Error logging out');
    }

    // Redirect the user after logout
    res.redirect('/auth/login');
  });
});


app.listen(port, () => {
  console.log(`🚀 Server has started on port ${port}`);
});


