export type TemplateStaticOption = {
    template: string;
    label: string;
    description?: string;
};
type TemplateAutocompleteProps = {
    isOpen: boolean;
    position: {
        top: number;
        left: number;
    };
    onSelect: (template: string) => void;
    onClose: () => void;
    currentNodeId?: string;
    filter?: string;
    /** Extra options (e.g. runtime context placeholders) shown at top of list; filter matches on label */
    staticOptions?: TemplateStaticOption[];
};
export declare function TemplateAutocomplete({ isOpen, position, onSelect, onClose, currentNodeId, filter, staticOptions, }: TemplateAutocompleteProps): import("react").ReactPortal | null;
export {};
//# sourceMappingURL=template-autocomplete.d.ts.map