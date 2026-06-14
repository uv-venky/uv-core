import type { ISODateTimeString } from '../../../../../lib/core/common/ds/types/Base';
export interface ExampleQueries {
    exampleId: string;
    domainId: string;
    schemaId?: string | null;
    question: string;
    sql: string;
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
//# sourceMappingURL=ExampleQueries.d.ts.map