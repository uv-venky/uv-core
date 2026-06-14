import type { ISODateTimeString } from '../../../../../lib/core/common/ds/types/Base';
export interface KnowledgeBases {
    kbId: string;
    name: string;
    description?: string | null;
    descriptionEmbedding?: number[] | null;
    kbType: string;
    ownerId: string;
    domainId?: string | null;
    orgId?: string | null;
    teamId?: string | null;
    requiredRoles: string[];
    isActive: boolean;
    /** Populated on read; number of rows in cc_kb_documents for this KB. */
    documentCount?: number | null;
    createdAt: ISODateTimeString;
    createdBy: string;
    updatedAt: ISODateTimeString;
    updatedBy: string;
}
//# sourceMappingURL=KnowledgeBases.d.ts.map