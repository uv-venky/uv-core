import type { ISODateTimeString } from '../../../../../lib/core/common/ds/types/Base';
export interface BusinessRules {
    ruleId: string;
    domainId: string;
    schemaId?: string | null;
    scope: string;
    scopeTarget?: string | null;
    term: string;
    definition: string;
    sqlExpression?: string | null;
    synonyms: string[];
    testQuestion: string | null;
    testExpectedSql: string | null;
    predicateColumns: string[] | null;
    priority: number;
    status: string;
    source: string;
    embedding?: number[] | null;
    usageCount: number;
    lastUsedAt?: ISODateTimeString | null;
    isActive: boolean;
    proposedBy?: string | null;
    proposedAt?: ISODateTimeString | null;
    approvedBy?: string | null;
    approvedAt?: ISODateTimeString | null;
    rejectedReason?: string | null;
    originChatId?: string | null;
    originMessageId?: string | null;
    originFailedSql?: string | null;
    createdAt: ISODateTimeString;
    createdBy: string;
    updatedAt: ISODateTimeString;
    updatedBy: string;
}
//# sourceMappingURL=BusinessRules.d.ts.map