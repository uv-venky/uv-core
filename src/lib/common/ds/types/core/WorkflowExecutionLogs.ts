/* Copyright (c) 2024-present Wayvo Corp. */

import type { WorkflowExecutionStatus } from '@/lib/common/ds/types/core/WorkflowExecutions';
import type { ISODateTimeString } from '@/lib/core/common/ds/types/DataSource';

export interface WorkflowExecutionLogs {
  id: string; // uuid
  executionId: string; // uuid
  appId: string; // app_id varchar(128) - multi-app isolation
  nodeId: string;
  branchKey?: string | null; // Fork branch key; null = main path
  nodeName: string;
  nodeType: string;
  status: WorkflowExecutionStatus;
  input?: unknown | null; // jsonb
  output?: unknown | null; // jsonb
  error?: string | null;
  startedAt: ISODateTimeString;
  completedAt?: ISODateTimeString | null;
  duration?: number | null; // Duration in milliseconds
  retryCount: number; // integer
  nextRetryAt?: ISODateTimeString | null; // timestamptz
  timestamp: ISODateTimeString;
  createdAt: ISODateTimeString;
  createdBy: string;
  updatedAt: ISODateTimeString;
  updatedBy: string;
}
