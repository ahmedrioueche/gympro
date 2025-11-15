# Roles and Permissions System

This document explains the roles and permissions system used in the GymPro backend for access control.

## Overview

The system uses two complementary approaches:

1. **Role-Based Access Control (RBAC)** - Checks if a user has a specific role
2. **Permission-Based Access Control (PBAC)** - Checks if a user has a specific permission

## User Roles

The system defines the following user roles (from `@gympro/client/types/user.ts`):

- **Owner** - Full system access, can manage everything
- **Manager** - Can manage members, subscriptions, and staff
- **Staff** - Limited access, typically for reception/admin tasks
- **Coach** - Can assign training programs to members
- **Member** - Basic user access

## Permissions Structure

Permissions are defined in `@gympro/client/roles/permissions.ts` and follow this structure:

```typescript
export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  owner: {
    canManageMembers: true,
    canManageSubscriptions: true,
    canManageStaff: true,
    canViewFinancials: true,
    canAssignPrograms: true,
    canManageAppSubscriptions: true,
    canCustomizePermissions: true,
  },
  manager: {
    canManageMembers: true,
    canManageSubscriptions: true,
    canManageStaff: true,
    canAssignPrograms: true,
    canManageAppSubscriptions: true,
    canCustomizePermissions: true,
  },
  staff: {},
  coach: {
    canAssignPrograms: true,
  },
  member: {},
};
```

### Available Permissions

- `canManageMembers` - Can view, update, activate/deactivate members
- `canManageSubscriptions` - Can manage gym subscriptions
- `canManageStaff` - Can manage staff members
- `canViewFinancials` - Can view financial reports
- `canAssignPrograms` - Can assign training programs to members
- `canManageAppSubscriptions` - Can manage app-level subscriptions
- `canCustomizePermissions` - Can modify user roles and permissions

## Guards

### RolesGuard

The `RolesGuard` restricts access based on user roles. It checks if the authenticated user has one of the required roles.

#### Usage

```typescript
import { Roles, RolesGuard } from './guards/roles.guard';
import { UserRole } from '@gympro/client';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  @Delete(':id')
  @Roles(UserRole.Owner) // Only Owner can access this endpoint
  async delete(@Param('id') id: string) {
    // ...
  }

  @Patch(':id/role')
  @Roles(UserRole.Owner) // Only Owner can change roles
  async updateRole(@Param('id') id: string, @Body('role') newRole: UserRole) {
    // ...
  }
}
```

#### When to Use RolesGuard

Use `RolesGuard` when:

- An action should be restricted to a specific role (e.g., only Owner can delete users)
- The restriction is role-based, not permission-based
- You need simple role checking without granular permissions

### PermissionsGuard

The `PermissionsGuard` restricts access based on specific permissions. It checks if the authenticated user has the required permission(s) based on their role.

#### Usage

```typescript
import {
  PermissionsGuard,
  RequirePermission,
} from './guards/permissions.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  @Get()
  @RequirePermission('canManageMembers') // Requires canManageMembers permission
  async findAll() {
    // This will allow Owner and Manager (both have canManageMembers)
    // ...
  }

  @Patch(':id/activate')
  @RequirePermission('canManageMembers')
  async activate(@Param('id') id: string) {
    // Owner and Manager can activate users
    // ...
  }
}
```

#### When to Use PermissionsGuard

Use `PermissionsGuard` when:

- Multiple roles should have access (e.g., both Owner and Manager)
- You want granular permission control
- Permissions might change without changing roles
- You need to check specific capabilities rather than roles

## How It Works

### Authentication Flow

1. **JWT Authentication** (`JwtAuthGuard`)
   - Validates the JWT token
   - Extracts user information and attaches it to `req.user`
   - Required for all protected endpoints

2. **Role/Permission Check** (`RolesGuard` or `PermissionsGuard`)
   - Reads metadata from decorators (`@Roles` or `@RequirePermission`)
   - Checks the user's role/permissions from `req.user`
   - Throws `ForbiddenException` if check fails

### Request Object Structure

After authentication, `req.user` contains:

```typescript
{
  sub: string; // User ID
  email: string; // User email
  role: UserRole; // User role (owner, manager, staff, coach, member)
}
```

### Error Handling

Both guards throw `ForbiddenException` with:

```typescript
{
  message: 'Insufficient permissions',
  errorCode: UserErrorCode.INSUFFICIENT_PERMISSIONS
}
```

## Examples

### Example 1: Owner-Only Endpoint

```typescript
@Delete(':id')
@UseGuards(RolesGuard)
@Roles(UserRole.Owner)
async delete(@Param('id') id: string) {
  // Only Owner can delete users
  return this.usersService.delete(id);
}
```

### Example 2: Owner/Manager Endpoint

```typescript
@Get()
@UseGuards(PermissionsGuard)
@RequirePermission('canManageMembers')
async findAll() {
  // Owner and Manager both have canManageMembers permission
  return this.usersService.findAll();
}
```

### Example 3: Self-Access with Permission Override

```typescript
@Patch(':id/profile')
async updateProfile(@Param('id') id: string, @Body() profileData: any, @Req() req: any) {
  const currentUserId = req.user?.sub;
  const currentUserRole = req.user?.role;

  // Users can update their own profile
  if (id !== currentUserId) {
    // Or Owner/Manager can update any profile
    if (currentUserRole !== UserRole.Owner && currentUserRole !== UserRole.Manager) {
      throw new ForbiddenException({
        message: 'Insufficient permissions to update this profile',
        errorCode: UserErrorCode.INSUFFICIENT_PERMISSIONS,
      });
    }
  }

  return this.usersService.updateProfile(id, profileData);
}
```

## Best Practices

1. **Always use JwtAuthGuard first** - Authentication must happen before authorization
2. **Use PermissionsGuard for multi-role access** - When multiple roles need access, use permissions
3. **Use RolesGuard for single-role restrictions** - When only one role should have access
4. **Combine guards when needed** - You can use both guards on the same endpoint
5. **Handle self-access explicitly** - For endpoints where users can access their own data, add custom logic
6. **Use error codes from @gympro/client** - All errors should use `UserErrorCode` for frontend translation

## Permission Matrix

| Action                    | Owner | Manager | Staff | Coach | Member |
| ------------------------- | ----- | ------- | ----- | ----- | ------ |
| View own profile          | ✅    | ✅      | ✅    | ✅    | ✅     |
| View any profile          | ✅    | ✅      | ❌    | ❌    | ❌     |
| Update own profile        | ✅    | ✅      | ✅    | ✅    | ✅     |
| Update any profile        | ✅    | ✅      | ❌    | ❌    | ❌     |
| List all users            | ✅    | ✅      | ❌    | ❌    | ❌     |
| Activate/Deactivate users | ✅    | ✅      | ❌    | ❌    | ❌     |
| Change user roles         | ✅    | ❌      | ❌    | ❌    | ❌     |
| Delete users              | ✅    | ❌      | ❌    | ❌    | ❌     |
| Assign programs           | ✅    | ✅      | ❌    | ✅    | ❌     |

## Adding New Permissions

1. Add the permission to `@gympro/client/types/role.ts`:

   ```typescript
   export interface RolePermissions {
     // ... existing permissions
     canNewPermission?: boolean;
   }
   ```

2. Update `@gympro/client/roles/permissions.ts`:

   ```typescript
   export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
     owner: {
       // ... existing permissions
       canNewPermission: true,
     },
     // ... other roles
   };
   ```

3. Use in controllers:
   ```typescript
   @RequirePermission('canNewPermission')
   ```

## Troubleshooting

### "Insufficient permissions" error

- Check if the user has the required role/permission
- Verify the guard is properly applied
- Ensure `JwtAuthGuard` is applied before other guards
- Check that `req.user` is populated correctly

### Guard not working

- Ensure guards are registered in the module's `providers`
- Verify decorators are applied correctly
- Check that `SetMetadata` is used (not `Reflect.defineMetadata`)
- Ensure `Reflector` is injected in the guard constructor

## Related Files

- `backend/src/modules/users/guards/roles.guard.ts` - RolesGuard implementation
- `backend/src/modules/users/guards/permissions.guard.ts` - PermissionsGuard implementation
- `packages/client/roles/permissions.ts` - Permission definitions
- `packages/client/types/role.ts` - RolePermissions interface
- `packages/client/types/user.ts` - UserRole enum
