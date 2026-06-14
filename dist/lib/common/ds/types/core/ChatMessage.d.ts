import type { ISODateTimeString } from '../../../../../lib/core/common/ds/types/DataSource';
export interface ChatMessage {
    attachments: unknown[];
    chatId: string;
    createdAt: ISODateTimeString | Date;
    id: string;
    parts: any[];
    role: 'system' | 'user' | 'assistant';
}
//# sourceMappingURL=ChatMessage.d.ts.map