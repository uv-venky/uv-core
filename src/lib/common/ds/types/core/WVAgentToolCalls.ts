/* Copyright (c) 2024-present Wayvo Corp. */

import type { ISODateTimeString } from '@/lib/core/common/ds/types/Base';

/**
 * One row per Command Center tool-call execution. Append-only audit table
 * created in Wave 1 (Primitive #10). Joins to `wv_ai_invocations` through
 * `agent_run_id` so a full user turn — LLM steps and tool invocations —
 * can be replayed end-to-end.
 *
 * Writes are protected by a Postgres immutability trigger in Wave 1,
 * Commit 2 (`wv_agent_tool_calls_immutable`).
 */
export interface WVAgentToolCalls {
  id: string;
  appId: string;
  /** Per-user-turn correlation. Matches `wv_ai_invocations.agent_run_id`. */
  agentRunId: string;
  chatId: string;
  messageId?: string | null;
  /** Provider-issued unique ID for this tool call within the chat. */
  toolCallId: string;
  toolName: string;
  /**
   * 'read' | 'write' | null. Populated in Wave 2 when WayvoTool gains a
   * scope flag (#6 action scoping).
   */
  scope?: string | null;
  /** Tool input — the validated args object the model produced. */
  args?: unknown | null; // jsonb
  /** Tool output — only present when status='success'. */
  result?: unknown | null; // jsonb
  status: 'success' | 'error';
  errorMessage?: string | null;
  /**
   * Nullable. Set in Wave 2 (#7 approval gates) to the
   * `wv_workflow_approval_requests.id` that gated this call.
   */
  approvalRequestId?: string | null;
  userName: string;
  startedAt: ISODateTimeString;
  completedAt: ISODateTimeString;
  durationMs: number;
  createdAt: ISODateTimeString;
}
