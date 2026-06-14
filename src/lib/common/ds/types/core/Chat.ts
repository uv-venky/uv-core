/* Copyright (c) 2024-present Wayvo Corp. */

import type { VisibilityType } from '@/components/chat/visibility-selector';
import type { AppUsage } from '@/lib/chat/usage';
import type { ISODateTimeString } from '@/lib/core/common/ds/types/DataSource';

export interface Chat {
  appId: string;
  createdAt: ISODateTimeString;
  createdBy: string;
  id: string;
  agent: string;
  domainId?: string | null;
  domainSlug?: string | null;
  lastContext?: AppUsage | null; // jsonb
  metadata?: Record<string, unknown> | null; // jsonb
  title: string;
  visibility: VisibilityType;
  isFavorite?: boolean;
}
