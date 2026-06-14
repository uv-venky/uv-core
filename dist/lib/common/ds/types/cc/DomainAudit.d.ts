import type { ISODateTimeString } from '../../../../../lib/core/common/ds/types/Base';
/**
 * Read-only projection of `wv_user_activity` restricted to the audit-trail
 * event types ('Access Denied', 'CC Interaction') and joined to `cc_domains`
 * for the domain name/slug. Backs the domain-filtered audit log (AU-08).
 */
export interface DomainAudit {
    appId: string;
    activityId: number;
    createdAt: ISODateTimeString;
    userName: string;
    eventType: string;
    eventId: string;
    sessionId?: string | null;
    metadata?: unknown | null;
    domainId?: string | null;
    domainName?: string | null;
    domainSlug?: string | null;
}
//# sourceMappingURL=DomainAudit.d.ts.map