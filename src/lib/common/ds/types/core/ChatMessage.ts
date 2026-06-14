import type { ISODateTimeString } from '@/lib/core/common/ds/types/DataSource';

export interface ChatMessage {
  attachments: unknown[]; // json
  chatId: string;
  createdAt: ISODateTimeString | Date;
  id: string;
  parts: any[]; // json
  role: 'system' | 'user' | 'assistant';
}
