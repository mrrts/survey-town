import { SetMetadata } from '@nestjs/common';
import { USER_ROLES } from '../users/entities/user.entity';

export interface RolesConfig {
  requireOne?: USER_ROLES[];
  requireAll?: USER_ROLES[];
}

export const Roles = (rolesConfig: RolesConfig) =>
  SetMetadata('roles', rolesConfig);
