/* Copyright (c) 2024-present Wayvo Corp. */

export interface ChatVote {
  chatId: string;
  isUpvoted: boolean;
  messageId: string;
  feedbackText?: string | null;
}
