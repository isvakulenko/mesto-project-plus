import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface SessionRequest extends Request {
  user?: string | JwtPayload;}

export interface OwnerRequest extends Request {
    user?: {
      _id: string;
    }
  }
