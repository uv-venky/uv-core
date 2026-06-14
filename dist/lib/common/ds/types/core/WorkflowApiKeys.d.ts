import type { ISODateTimeString } from '../../../../../lib/core/common/ds/types/DataSource';
export interface WorkflowApiKeys {
    id: string;
    userName: string;
    appId: string;
    name?: string | null;
    keyHash: string;
    keyPrefix: string;
    createdAt: ISODateTimeString;
    createdBy: string;
    updatedAt: ISODateTimeString;
    updatedBy: string;
    lastUsedAt?: ISODateTimeString | null;
}
//# sourceMappingURL=WorkflowApiKeys.d.ts.map