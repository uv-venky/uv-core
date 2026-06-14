import type { ComponentProps } from 'react';
import { Button } from '../../components/ui/button';
import { ScrollArea } from '../../components/ui/scroll-area';
type SuggestionsProps = ComponentProps<typeof ScrollArea>;
export declare const Suggestions: ({ className, children, ...props }: SuggestionsProps) => import("react/jsx-runtime").JSX.Element;
type SuggestionProps = Omit<ComponentProps<typeof Button>, 'onClick'> & {
    suggestion: string | {
        label: string;
        text: string;
    };
    onClick?: (suggestion: string, label?: string) => void;
};
export declare const Suggestion: ({ suggestion, onClick, className, variant, size, children, ...props }: SuggestionProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=suggestion.d.ts.map