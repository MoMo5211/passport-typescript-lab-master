import { Strategy as GitHubStrategy, Profile as GitHubProfile } from 'passport-github2';
import { PassportStrategy } from '../../interfaces/index';
import { Request } from 'express';
import { VerifyCallback } from 'passport-oauth2';
import { userModel } from "../../models/userModel";
import passport from 'passport';



const githubStrategy: GitHubStrategy = new GitHubStrategy(
    {
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: "http://127.0.0.1:4000/auth/github/callback",
    passReqToCallback: true,
    },
    
   
    async (req: Request, accessToken: string, refreshToken: string, profile: GitHubProfile, done: VerifyCallback) => {
        // Use the GitHub ID to find or create the user
        try {
          const user = userModel.findOrCreateUserByGithubId(profile.id, {
            id: profile.id,
            displayName: profile.displayName,
            username: profile.username,
            profileUrl: profile.profileUrl,
            emails: profile.emails,
            photos: profile.photos,
          });
         return done(null, user);
        } catch (error) {
           return done(new Error(error instanceof Error ? error.message : "An unknown error occurred"));
        }
      }
);

passport.use(githubStrategy);


const passportGitHubStrategy: PassportStrategy = {
    name: 'github',
    strategy: githubStrategy,
};

export default passportGitHubStrategy;
