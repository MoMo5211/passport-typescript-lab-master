import { Request, Response, NextFunction } from 'express';
import { User } from '../models/userModel';

interface RequestWithUser extends Request {
    user?: User;
    isAdmin?: boolean;
  }
  
  const isAdmin = (req: RequestWithUser, res: Response, next: NextFunction) => {
    req.isAdmin = req.isAuthenticated() && req.user && req.user.role === 'admin';
    next();
  };
  
  export default isAdmin;