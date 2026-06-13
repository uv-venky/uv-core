import type { DataSource } from './types.js';
import type { AuthenticatedRequest } from '../auth/auth.middleware.js';
export declare function hasAccess<T extends object>(ds: DataSource<T>, auth: AuthenticatedRequest, accessType: 'Query' | 'Update' | 'Insert' | 'Delete' | 'Export' | 'Audit'): Promise<boolean>;
//# sourceMappingURL=hasAccess.d.ts.map