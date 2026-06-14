/* Copyright (c) 2024-present Wayvo Corp. */

import type { ISODateTimeString } from '@/lib/core/common/ds/types/DataSource';

export type WorkflowExecutionStatus =
  | 'pending'
  | 'running'
  | 'paused'
  | 'success'
  | 'error'
  | 'rejected'
  | 'expired'
  | 'cancelled';

export interface WorkflowExecutions {
  id: string; // uuid
  workflowId: string; // uuid
  workflowName?: string | null; // name from workflows table (via Reference)
  appId: string; // app_id varchar(128) - multi-app isolation
  schedulerId: string; // scheduler_id varchar(128) - local dev scheduler isolation
  userName: string; // user_name varchar(128) - maps from user_id in flow
  status: WorkflowExecutionStatus;
  error?: string | null;
  startedAt: ISODateTimeString;
  completedAt?: ISODateTimeString | null;
  duration?: number | null; // Duration in milliseconds
  retryCount: number; // integer
  maxRetries: number; // integer
  nextRetryAt?: ISODateTimeString | null; // timestamptz
  lastError?: string | null; // text
  checkpointData?: Record<string, unknown> | null; // jsonb - stores input, outputs, results, completedNodes for resumability
  createdAt: ISODateTimeString;
  createdBy: string;
  updatedAt: ISODateTimeString;
  updatedBy: string;
}
