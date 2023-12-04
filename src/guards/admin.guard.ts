import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../entities/user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());
        if (roles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!(user && user.role && user.role.includes(UserRole.Admin))) {
            throw new UnauthorizedException('Unauthorized access');
        }
        return true;
    }
}
