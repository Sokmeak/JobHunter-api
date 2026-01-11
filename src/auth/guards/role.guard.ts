// import {
//   Injectable,
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { log } from 'console';
// import { RoleType } from 'src/roles/enum/role.enum';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(
//     private readonly reflector: Reflector,
//     private readonly jwtService: JwtService,
//   ) {}

//   canActivate(context: ExecutionContext): boolean {
//     const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(
//       'roles',
//       [context.getHandler(), context.getClass()],
//     );

//     log(requiredRoles);

//     if (!requiredRoles) {
//       return true; // No roles required, allow access
//     }
//     const request = context.switchToHttp().getRequest();

//     const authorizationHeader = request.headers['authorization'];

//     if (!authorizationHeader) {
//       throw new UnauthorizedException('No Authorization header provided');
//     }

//     const token = authorizationHeader.split(' ')[1];
//     if (!token) {
//       throw new UnauthorizedException('No token found in Authorization header');
//     }

//     try {
//       const decodedToken = this.jwtService.verifyAsync(token, {
//         secret: process.env.JWT_SECRET,
//       });
//       request.user = decodedToken;
//       log('correct token');
//       console.log(request.user);
//     } catch (error) {
//       throw new UnauthorizedException('Invalid or expired token');
//     }

//     const user = request.user;

//     console.log('User in RolesGuard:', user); // Optional debug lo

//     log(user);

//     if (!user || !user.role) {
//       throw new ForbiddenException(
//         'Access denied: User not logged in or no role assigned',
//       );
//     }

//     const hasRole = requiredRoles.includes(user.role);
//     if (!hasRole) {
//       throw new ForbiddenException('Access denied: Insufficient role');
//     }

//     return true;
//   }
// }
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { RoleENUM } from '../../roles/interface/roles.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get required roles metadata from the handler and class
    const requiredRoles = this.reflector.getAllAndOverride<RoleENUM[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    // If no roles are required, allow access
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];

    // Check if Authorization header is present
    if (!authorizationHeader) {
      throw new UnauthorizedException('No Authorization header provided');
    }

    const token = authorizationHeader.split(' ')[1];

    // Check if token is provided in the header
    if (!token) {
      throw new UnauthorizedException('No token found in Authorization header');
    }

    try {
      // Verify the token asynchronously and attach user info to request
      const decodedToken = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = decodedToken;
    } catch (error) {
      // If token is invalid or expired
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = request.user;

    // Ensure user exists and has a role assigned
    if (!user || !user.role_id) {
      throw new ForbiddenException(
        'Access denied: User not logged in or no role assigned',
      );
    }

    // Check if the user's role is one of the required roles
    const hasRole = requiredRoles.includes(user.role_id);
    if (!hasRole) {
      throw new ForbiddenException('Access denied: Insufficient role');
    }

    // Allow access if role matches
    return true;
  }
}
