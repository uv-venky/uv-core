import type { ISODateTimeString } from '../../../../../lib/core/common/ds/types/DataSource';
export type WorkflowExecutionStatus = 'pending' | 'running' | 'paused' | 'success' | 'error' | 'rejected' | 'expired' | 'cancelled';
export interface WorkflowExecutions {
    id: string;
    workflowId: string;
    workflowName?: string | null;
    appId: string;
    schedulerId: string;
    userName: string;
    status: WorkflowExecutionStatus;
    error?: string | null;
    startedAt: ISODateTimeString;
    completedAt?: ISODateTimeString | null;
    duration?: number | null;
    retryCount: number;
    maxRetries: number;
    nextRetryAt?: ISODateTimeString | null;
    lastError?: string | null;
    checkpointData?: Record<string, unknown> | null;
    createdAt: ISODateTimeString;
    createdBy: string;
    updatedAt: ISODateTimeString;
    updatedBy: string;
}
//# sourceMappingURL=WorkflowExecutions.d.ts.map