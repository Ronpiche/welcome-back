import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    // check if IsPublic is used in api
    if (isPublic) {
      // Allow public API access
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization;

    if (!token) {
      return false;
    }

    try {
      const decoded = this.jwtService.verify(token);
      request['decodedToken'] = decoded; // Attach the decoded user object to the request

      return true;
    } catch (error) {
      return false;
    }
  }
}