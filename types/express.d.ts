import { User as UserModel } from '../models/userModel';
import 'express';
import "express-session";
import { PassportStatic } from 'passport';
import { SessionData } from 'express-session';
import session from 'express-session';
import { RequestHandler } from 'express';


declare namespace Express {
    export interface Request {
      flash(message: string, format?: any): any;
    }
  }


declare global {
  namespace Express {
    interface User extends UserModel {}
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    flash(type: string, message?: any): any;
  }
}

declare module "express-session" {
  interface SessionStore {
    all(callback: (err: any, sessions: { [sid: string]: Express.SessionData }) => void): void;

    
  }
}

declare module "express-session" {
  interface SessionData {
    isAdminSession?: boolean;
    adminInfo?: {
      name: string;
      id: number;
    };
  }
}


declare module 'express-session' {
  interface SessionData {
    passport?: {
      user?: any; 
    };
  }
}


