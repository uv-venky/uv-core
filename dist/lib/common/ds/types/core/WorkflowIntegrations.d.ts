import type { ISODateTimeString } from '../../../../../lib/core/common/ds/types/DataSource';
import type { IntegrationType } from '@/lib/types/integration';
export interface WorkflowIntegrations {
    id: string;
    userName: string;
    appId: string;
    name: string;
    type: IntegrationType;
    config: Record<string, unknown>;
    createdAt: ISODateTimeString;
    createdBy: string;
    updatedAt: ISODateTimeString;
    updatedBy: string;
}
//# sourceMappingURL=WorkflowIntegrations.d.ts.map