import type { ISODateTimeString } from '../../../../../lib/core/common/ds/types/Base';
export interface SkillTool {
    name: string;
    description: string;
    input_schema: Record<string, unknown>;
    handler: 'sql_query' | 'http_request' | 'workflow';
    handler_config: Record<string, unknown>;
}
export interface Skills {
    skillId: string;
    name: string;
    description: string;
    category: string;
    descriptionEmbedding?: number[] | null;
    tools: SkillTool[];
    systemPrompt?: string | null;
    requiredRoles: string[];
    agentIds: string[];
    isActive: boolean;
    domainId?: string | null;
    orgId?: string | null;
    createdAt: ISODateTimeString;
    createdBy: string;
    updatedAt: ISODateTimeString;
    updatedBy: string;
}
//# sourceMappingURL=Skills.d.ts.map