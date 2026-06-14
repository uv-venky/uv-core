import type { ISODateTimeString } from '../../../../../lib/core/common/ds/types/Base';
export interface KbChunks {
    chunkId: string;
    docId: string;
    kbId: string;
    chunkIndex: number;
    content: string;
    embedding?: number[] | null;
    pageNumber?: number | null;
    sectionTitle?: string | null;
    metadata?: Record<string, unknown> | null;
    createdAt: ISODateTimeString;
    createdBy: string;
    updatedAt: ISODateTimeString;
    updatedBy: string;
}
//# sourceMappingURL=KbChunks.d.ts.map