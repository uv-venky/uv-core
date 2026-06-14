/* Copyright (c) 2024-present Wayvo Corp. */

import type { ISODateTimeString } from '@/lib/core/common/ds/types/DataSource';

export interface WorkflowApiKeys {
  id: string; // uuid
  userName: string; // user_name varchar(128) - maps from user_id in flow
  appId: string; // app_id varchar(128) - multi-app isolation
  name?: string | null; // Optional label for the API key
  keyHash: string; // Store hashed version of the key
  keyPrefix: string; // Store first few chars for display (e.g., "wf_abc...")
  createdAt: ISODateTimeString;
  createdBy: string;
  updatedAt: ISODateTimeString;
  updatedBy: string;
  lastUsedAt?: ISODateTimeString | null;
}
