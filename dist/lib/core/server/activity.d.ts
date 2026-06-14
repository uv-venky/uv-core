import type { Activity } from '../common/types/Activity.js';
import type { AccessDeniedResourceType } from '../common/types/AccessDenied.js';
export declare function logActivity(activity: Activity): Promise<void>;
export declare function logAccessDenied(params: {
    userName: string;
    roles: string[];
    sessionId: string;
    domainId?: string;
    resourceType: AccessDeniedResourceType;
    resource: string;
    reason: string;
}): Promise<void>;
//# sourceMappingURL=activity.d.ts.map