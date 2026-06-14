/* Copyright (c) 2024-present Wayvo Corp. */

import type { ISODateTimeString } from '@/lib/core/common/ds/types/DataSource';
import type { WorkflowEdge, WorkflowNode } from '@/lib/workflow-store';

export type WorkflowVisibility = 'private' | 'public';

export interface Workflows {
  appId: string;
  createdAt: ISODateTimeString;
  createdBy: string;
  description?: string | null;
  edges: WorkflowEdge[]; // jsonb
  id: string;
  name: string;
  nodes: WorkflowNode[]; // jsonb
  updatedAt: ISODateTimeString;
  updatedBy: string;
  userName: string;
  visibility: WorkflowVisibility;
}
