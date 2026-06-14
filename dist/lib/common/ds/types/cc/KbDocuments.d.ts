import type { ISODateTimeString } from '../../../../../lib/core/common/ds/types/Base';
export interface KbDocuments {
    docId: string;
    kbId: string;
    fileName: string;
    fileType: string;
    fileSizeBytes?: number | null;
    fileUrl?: string | null;
    pageCount?: number | null;
    status: string;
    transcribeJobName?: string | null;
    processingStartedAt?: ISODateTimeString | null;
    errorMessage?: string | null;
    createdAt: ISODateTimeString;
    createdBy: string;
    updatedAt: ISODateTimeString;
    updatedBy: string;
}
//# sourceMappingURL=KbDocuments.d.ts.map