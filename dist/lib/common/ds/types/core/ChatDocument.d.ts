import type { ArtifactKind } from '@/components/chat/artifact';
import type { ISODateTimeString } from '../../../../../lib/core/common/ds/types/DataSource';
export interface ChatDocument {
    content?: string | null;
    createdAt: ISODateTimeString;
    id: string;
    chatId: string;
    kind: ArtifactKind;
    title: string;
    userName: string;
}
//# sourceMappingURL=ChatDocument.d.ts.map