import logger from './logger.js';
export async function logActivity(activity) {
    logger.info(`[Activity] ${activity.eventType}: ${activity.eventId}`, {
        userName: activity.userName,
        metadata: activity.metadata,
        pageUrl: activity.pageUrl,
        dataSource: activity.dataSource,
        elapsedTimeMs: activity.elapsedTimeMs,
        rowCount: activity.rowCount,
    });
}
export async function logAccessDenied(params) {
    logger.warn(`[Access Denied] User ${params.userName} denied access to ${params.resourceType}: ${params.resource}. Reason: ${params.reason}`);
}
//# sourceMappingURL=activity.js.map