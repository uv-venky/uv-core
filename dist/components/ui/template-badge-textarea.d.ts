import { type TemplateExtraOption } from './template-badge-input';
export interface TemplateBadgeTextareaProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    id?: string;
    rows?: number;
    /** Extra template options (e.g. runtime context placeholders) shown in the @ autocomplete */
    extraTemplateOptions?: TemplateExtraOption[];
}
/**
 * A textarea component that renders template variables as styled badges
 * Converts {{@nodeId:DisplayName.field}} to badges showing "DisplayName.field"
 */
export declare function TemplateBadgeTextarea({ value, onChange, placeholder, disabled, className, id, rows, extraTemplateOptions, }: TemplateBadgeTextareaProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=template-badge-textarea.d.ts.map