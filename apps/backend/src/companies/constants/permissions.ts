/**
 * Company worker permissions
 * Using namespace:action pattern for better organization
 */
export enum Permission {
  // Package permissions
  PackageCreate = 'package:create',
  PackageEdit = 'package:edit',
  PackageDelete = 'package:delete',
  PackageView = 'package:view',

  // Worker management permissions
  WorkerInvite = 'worker:invite',
  WorkerEdit = 'worker:edit',
  WorkerRemove = 'worker:remove',
  WorkerView = 'worker:view',

  // Company management permissions
  CompanyCreate = 'company:create',
  CompanyEdit = 'company:edit',
  CompanyDelete = 'company:delete',
  CompanyView = 'company:view',

  // Installation permissions
  InstallationCreate = 'installation:create',
  InstallationEdit = 'installation:edit',
  InstallationDelete = 'installation:delete',
  InstallationView = 'installation:view',

  // Booking/Reservation permissions (for future use)
  BookingCreate = 'booking:create',
  BookingEdit = 'booking:edit',
  BookingCancel = 'booking:cancel',
  BookingView = 'booking:view',

  // Analytics permissions (for future use)
  AnalyticsView = 'analytics:view',
}

export const ALL_PERMISSIONS = Object.values(Permission);

/**
 * Default permission sets for common roles
 */
export const PERMISSION_PRESETS = {
  GUIDE: [
    Permission.PackageView,
    Permission.BookingView,
    Permission.CompanyView,
  ],
  MANAGER: [
    Permission.PackageCreate,
    Permission.PackageEdit,
    Permission.PackageView,
    Permission.WorkerView,
    Permission.CompanyView,
    Permission.InstallationView,
    Permission.BookingCreate,
    Permission.BookingEdit,
    Permission.BookingView,
    Permission.AnalyticsView,
  ],
  SALES: [
    Permission.PackageView,
    Permission.BookingCreate,
    Permission.BookingEdit,
    Permission.BookingView,
    Permission.CompanyView,
  ],
};
