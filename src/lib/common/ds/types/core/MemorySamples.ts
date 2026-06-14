/* Copyright (c) 2024-present Wayvo Corp. */

import type { ISODateString } from '@/lib/core/common/ds/types/DataSource';

export interface MemorySamples {
  sampleId: number;
  appId: string;
  nodeId: string;
  pid: number;
  ts: ISODateString;
  uptimeSec: number;
  sampleKind: string;
  rssMb: number;
  heapUsedMb: number;
  heapTotalMb: number;
  externalMb: number;
  arrayBuffersMb: number;
  cpuUsagePct?: number | null;
  pgWritableTotal?: number | null;
  pgWritableIdle?: number | null;
  pgWritableWaiting?: number | null;
  pgReadonlyTotal?: number | null;
  pgReadonlyIdle?: number | null;
  pgReadonlyWaiting?: number | null;
  sseClients?: number | null;
  extra?: Record<string, unknown> | null;
}
