import type { ISODateTimeString } from '../../../../../lib/core/common/ds/types/Base';
/** Stored in cc_domains.chat_suggestions (JSON array). */
export type DomainChatSuggestion = string | {
    label: string;
    text: string;
};
export interface Domains {
    domainId: string;
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
    /** Empty-state headline; optional placeholders: {name}, {slug} */
    chatGreetingHeadline?: string | null;
    /** Empty-state subline; optional placeholders: {name}, {slug}, {description} */
    chatGreetingSubline?: string | null;
    /** Starter suggestion chips; strings use same text for label and message */
    chatSuggestions?: DomainChatSuggestion[] | null;
    allowedRoles: string[];
    basePrompt: string;
    toolIds: string[];
    isActive: boolean;
    sortOrder: number;
    orgId?: string | null;
    createdAt: ISODateTimeString;
    createdBy: string;
    updatedAt: ISODateTimeString;
    updatedBy: string;
}
//# sourceMappingURL=Domains.d.ts.map