// roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../entities/user.entity'; // Assurez-vous d'importer votre énumération UserRole

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());

        if (!requiredRoles) {
            // Aucun rôle requis, autorise l'accès
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        // Vérifie si l'utilisateur possède au moins l'un des rôles requis
        return requiredRoles.some((role) => user.roles.includes(role));
    }
}
