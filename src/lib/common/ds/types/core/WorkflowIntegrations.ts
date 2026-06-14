/* Copyright (c) 2024-present Wayvo Corp. */

import type { ISODateTimeString } from '@/lib/core/common/ds/types/DataSource';
import type { IntegrationType } from '@/lib/types/integration';

export interface WorkflowIntegrations {
  id: string; // uuid
  userName: string; // user_name varchar(128) - maps from user_id in flow
  appId: string; // app_id varchar(128) - multi-app isolation
  name: string;
  type: IntegrationType;
  config: Record<string, unknown>; // jsonb
  createdAt: ISODateTimeString;
  createdBy: string;
  updatedAt: ISODateTimeString;
  updatedBy: string;
}
