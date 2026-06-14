import type { ISODateTimeString } from '../../../../../lib/core/common/ds/types/Base';
export interface WVAiInvocations {
    /**
     * Per-user-turn correlation ID. One UUID per "user message -> assistant
     * reply" cascade; matches the `agent_run_id` on all `wv_agent_tool_calls`
     * rows fired during the same turn. Nullable for rows written before the
     * Wave 1 migration landed.
     */
    agentRunId?: string | null;
    /** Tenant scope. Defaults to 'core' for the open-source/demo deployment. */
    appId?: string | null;
    agentId?: string | null;
    apiName?: string | null;
    cacheReadTokens?: number | null;
    cacheWriteTokens?: number | null;
    cancelled: boolean;
    chatId: string;
    costUsd?: number | null;
    createdAt: ISODateTimeString;
    domainId?: string | null;
    /** From cc_domains join; present when query includes the join. */
    domainSlug?: string | null;
    elapsedMs?: number | null;
    error?: string | null;
    finishReason?: string | null;
    firstTokenMs?: number | null;
    invocationId: string;
    messageId?: string | null;
    mode: string;
    modelId: string;
    params?: unknown | null;
    provider: string;
    providerRequestId?: string | null;
    reasoningTokens?: number | null;
    requestTokens?: number | null;
    responseMeta?: unknown | null;
    responseText?: string | null;
    responseTokens?: number | null;
    sessionId?: string | null;
    source: string;
    stepIndex: number;
    systemPromptHash?: string | null;
    toolNames?: string[] | null;
    trackId?: string | null;
    userName?: string | null;
}
//# sourceMappingURL=WVAiInvocations.d.ts.map