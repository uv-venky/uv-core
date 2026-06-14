import type { WorkflowExecutionStatus } from '../../../../../lib/common/ds/types/core/WorkflowExecutions';
import type { ISODateTimeString } from '../../../../../lib/core/common/ds/types/DataSource';
export interface WorkflowExecutionLogs {
    id: string;
    executionId: string;
    appId: string;
    nodeId: string;
    branchKey?: string | null;
    nodeName: string;
    nodeType: string;
    status: WorkflowExecutionStatus;
    input?: unknown | null;
    output?: unknown | null;
    error?: string | null;
    startedAt: ISODateTimeString;
    completedAt?: ISODateTimeString | null;
    duration?: number | null;
    retryCount: number;
    nextRetryAt?: ISODateTimeString | null;
    timestamp: ISODateTimeString;
    createdAt: ISODateTimeString;
    createdBy: string;
    updatedAt: ISODateTimeString;
    updatedBy: string;
}
//# sourceMappingURL=WorkflowExecutionLogs.d.ts.map