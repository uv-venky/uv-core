import type { ComponentProps } from 'react';
import { Button } from '../../components/ui/button';
type ActionsProps = ComponentProps<'div'>;
export declare const Actions: ({ className, children, ...props }: ActionsProps) => import("react/jsx-runtime").JSX.Element;
type ActionProps = ComponentProps<typeof Button> & {
    tooltip?: string;
    label?: string;
};
export declare const Action: ({ tooltip, children, label, className, variant, size, ...props }: ActionProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=actions.d.ts.map