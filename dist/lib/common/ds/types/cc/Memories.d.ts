import type { ISODateTimeString } from '../../../../../lib/core/common/ds/types/Base';
export interface Memories {
    category?: string | null;
    chatId?: string | null;
    chatMessageId?: string | null;
    kind?: string | null;
    content: string;
    createdAt: ISODateTimeString;
    createdBy: string;
    domainId?: string | null;
    embedding?: number[] | null;
    expiresAt?: ISODateTimeString | null;
    lastUsedAt?: ISODateTimeString | null;
    memoryId: string;
    relevanceScore: number;
    scope: string;
    scopeRefId?: string | null;
    tags?: string[] | null;
    updatedAt: ISODateTimeString;
    updatedBy: string;
    usageCount: number;
}
//# sourceMappingURL=Memories.d.ts.map