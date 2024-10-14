import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UserDocument } from '../schemas/user.schema';

@Injectable()
export class PermitGuard implements CanActivate {
    constructor(private readonly requiredRoles: string[]) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const user = request.user as UserDocument;

        if (!user || !this.requiredRoles.includes(user.role)) {
            return false;
        }

        return true;
    }
}
