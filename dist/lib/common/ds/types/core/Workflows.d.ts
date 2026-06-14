import type { ISODateTimeString } from '../../../../../lib/core/common/ds/types/DataSource';
import type { WorkflowEdge, WorkflowNode } from '@/lib/workflow-store';
export type WorkflowVisibility = 'private' | 'public';
export interface Workflows {
    appId: string;
    createdAt: ISODateTimeString;
    createdBy: string;
    description?: string | null;
    edges: WorkflowEdge[];
    id: string;
    name: string;
    nodes: WorkflowNode[];
    updatedAt: ISODateTimeString;
    updatedBy: string;
    userName: string;
    visibility: WorkflowVisibility;
}
//# sourceMappingURL=Workflows.d.ts.map