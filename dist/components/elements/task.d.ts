import type { ComponentProps } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/ui/collapsible';
type TaskItemFileProps = ComponentProps<'div'>;
export declare const TaskItemFile: ({ children, className, ...props }: TaskItemFileProps) => import("react/jsx-runtime").JSX.Element;
type TaskItemProps = ComponentProps<'div'>;
export declare const TaskItem: ({ children, className, ...props }: TaskItemProps) => import("react/jsx-runtime").JSX.Element;
type TaskProps = ComponentProps<typeof Collapsible>;
export declare const Task: ({ defaultOpen, className, ...props }: TaskProps) => import("react/jsx-runtime").JSX.Element;
type TaskTriggerProps = ComponentProps<typeof CollapsibleTrigger> & {
    label: React.ReactNode;
    icon?: React.ReactNode;
};
export declare const TaskTrigger: ({ children, className, label, icon, ...props }: TaskTriggerProps) => import("react/jsx-runtime").JSX.Element;
type TaskContentProps = ComponentProps<typeof CollapsibleContent>;
export declare const TaskContent: ({ children, className, ...props }: TaskContentProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=task.d.ts.map