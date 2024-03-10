import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserByEmailIdAndPassword, getUserById, isUserValid} from "../../controllers/userController";
import { PassportStrategy } from '../../interfaces/index';
import { User, userModel } from "../../models/userModel";

declare module 'passport' {
  interface Authenticator {
    serializeUser<TID>(fn: (user: User, done: (err: any, id?: TID) => void) => void): void;
  }
}

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
  },
  async (req, email, password, done) => {
    try {
      const user = await userModel.findOne(email);
      if (!user) {
        // User not found by email
        req.flash('error_msg', `Couldn't find user with the email: "${email}"`);
        return done(null, false);
      }
      if (!isUserValid(user, password)) {
        // Password does not match
        req.flash('error_msg', 'Password is incorrect');
        return done(null, false);
      }
      // Successful authentication
      return done(null, user);
    } catch (error) {
      console.error('Authentication error: ', error);
      req.flash('error_msg', 'An unexpected error occurred');
      return done(null, false);
    }
  }
);


passport.serializeUser((user: User, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: number, done: (err: any, user?: User | null) => void) => {
  try {
    const user = userModel.findById(id);
    if (user) {
      done(null, user);
    } else {
      done(new Error("User not found"), null);
    }
  } catch (error) {
    done(error);
  }
});

const passportLocalStrategy: PassportStrategy = {
  name: 'local',
  strategy: localStrategy,
};

export default passportLocalStrategy;
