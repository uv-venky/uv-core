export type TemplateExtraOption = {
    value: string;
    label: string;
};
export interface TemplateBadgeInputProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    id?: string;
    /** Extra template options (e.g. runtime context placeholders) shown in the @ autocomplete */
    extraTemplateOptions?: TemplateExtraOption[];
}
/** Get display label for a runtime context placeholder (e.g. {{approvalRequestId}} -> "Approval Request ID") */
export declare function getDisplayTextForStaticTemplate(template: string, extraOptions: TemplateExtraOption[] | undefined): string;
/**
 * An input component that renders template variables as styled badges
 * Converts {{@nodeId:DisplayName.field}} to badges showing "DisplayName.field"
 */
export declare function TemplateBadgeInput({ value, onChange, placeholder, disabled, className, id, extraTemplateOptions, }: TemplateBadgeInputProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=template-badge-input.d.ts.map