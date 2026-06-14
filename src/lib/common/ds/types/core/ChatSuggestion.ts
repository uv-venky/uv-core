/* Copyright (c) 2024-present Wayvo Corp. */

import type { ISODateTimeString } from '@/lib/core/common/ds/types/DataSource';

export interface ChatSuggestion {
  createdAt: ISODateTimeString;
  description?: string | null;
  documentCreatedAt: ISODateTimeString;
  documentId: string;
  id: string;
  chatId: string;
  isResolved: boolean;
  originalText: string;
  suggestedText: string;
  userName: string;
}
