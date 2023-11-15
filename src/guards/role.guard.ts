// roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '../entities/user.entity';
import { Reflector } from '@nestjs/core';


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const userRoles = Object.values(UserRole) as string[];

        const { user } = context.switchToHttp().getRequest();

        if (!(user && user.role && userRoles.includes(user.role))) {
            throw new UnauthorizedException('Unauthorized access');
        }
        return true;
    }
}
