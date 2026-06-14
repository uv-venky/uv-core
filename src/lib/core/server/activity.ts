import logger from './logger.js';
import type { Activity } from '../common/types/Activity.js';
import type { AccessDeniedResourceType } from '../common/types/AccessDenied.js';

export async function logActivity(activity: Activity): Promise<void> {
  logger.info(`[Activity] ${activity.eventType}: ${activity.eventId}`, {
    userName: activity.userName,
    metadata: activity.metadata,
    pageUrl: activity.pageUrl,
    dataSource: activity.dataSource,
    elapsedTimeMs: activity.elapsedTimeMs,
    rowCount: activity.rowCount,
  });
}

export async function logAccessDenied(params: {
  userName: string;
  roles: string[];
  sessionId: string;
  domainId?: string;
  resourceType: AccessDeniedResourceType;
  resource: string;
  reason: string;
}): Promise<void> {
  logger.warn(`[Access Denied] User ${params.userName} denied access to ${params.resourceType}: ${params.resource}. Reason: ${params.reason}`);
}
