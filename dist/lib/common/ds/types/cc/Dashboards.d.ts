import type { ISODateTimeString } from '../../../../../lib/core/common/ds/types/Base';
export interface Dashboards {
    dashboardId: string;
    name: string;
    description?: string | null;
    scope: string;
    scopeRefId: string;
    ownerId: string;
    sharedWithRoles: string[];
    layout: {
        i: string;
        x: number;
        y: number;
        w: number;
        h: number;
    }[];
    visibility: string;
    sharedWithUsers: string[];
    isActive: boolean;
    createdAt: ISODateTimeString;
    createdBy: string;
    updatedAt: ISODateTimeString;
    updatedBy: string;
}
//# sourceMappingURL=Dashboards.d.ts.map