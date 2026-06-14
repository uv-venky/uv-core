/* Copyright (c) 2024-present Wayvo Corp. */

import type { ISODateTimeString } from '@/lib/core/common/ds/types/Base';

export interface DashboardWidgets {
  widgetId: string;
  dashboardId: string;
  title: string;
  widgetType: string;
  toolName?: string | null;
  toolParams: Record<string, any>;
  snapshot: Record<string, any>;
  snapshotAt?: ISODateTimeString | null;
  chatId?: string | null;
  chatMessageId?: string | null;
  refreshInterval?: string | null;
  refreshStatus: string;
  lastRefreshedAt?: ISODateTimeString | null;
  nextRefreshAt?: ISODateTimeString | null;
  refreshesSinceView: number;
  lastViewedAt?: ISODateTimeString | null;
  createdAt: ISODateTimeString;
  createdBy: string;
  updatedAt: ISODateTimeString;
  updatedBy: string;
}
