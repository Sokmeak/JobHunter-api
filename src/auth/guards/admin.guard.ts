import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Retrieve request object
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Log to verify what is in the user object
    console.log('User in AdminGuard:', user);

    // Check if user exists and has the role of 'admin'
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    if (user.role !== "ADMIN") {
      // If the user does not have the admin role, throw a ForbiddenException
      throw new ForbiddenException(
        'Only admins are allowed to access this resource',
      );
    }

    return true;
  }
}
