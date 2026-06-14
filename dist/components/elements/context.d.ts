import type { ComponentProps } from 'react';
import type { AppUsage } from '@/lib/chat/usage';
type ContextProps = ComponentProps<'button'> & {
    /** Optional full usage payload to enable breakdown view */
    usage?: AppUsage;
};
type ContextIconProps = {
    percent: number;
};
export declare const ContextIcon: ({ percent }: ContextIconProps) => import("react/jsx-runtime").JSX.Element;
export declare const Context: ({ className, usage, ...props }: ContextProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=context.d.ts.map