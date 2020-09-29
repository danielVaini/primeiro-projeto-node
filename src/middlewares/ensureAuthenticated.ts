import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authconfig from '../config/auth';

import AppError from '../errors/AppError';

interface tokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Validação do token JWT

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  // Bearer

  const [, token] = authHeader.split(' ');

  const { secret } = authconfig.jwt;

  try {
    const decoded = verify(token, secret);

    const { sub } = decoded as tokenPayload;

    req.user = {
      id: sub,
    };

    return next();
  } catch (err) {
    throw new Error('Invalid JWT token');
  }
}
