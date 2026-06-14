import type { ComponentProps } from 'react';
import { StickToBottom } from 'use-stick-to-bottom';
import { Button } from '../../components/ui/button';
type ConversationProps = ComponentProps<typeof StickToBottom>;
export declare const Conversation: ({ className, ...props }: ConversationProps) => import("react/jsx-runtime").JSX.Element;
type ConversationContentProps = ComponentProps<typeof StickToBottom.Content>;
export declare const ConversationContent: ({ className, style, ...props }: ConversationContentProps) => import("react/jsx-runtime").JSX.Element;
type ConversationScrollButtonProps = ComponentProps<typeof Button>;
export declare const ConversationScrollButton: ({ className, ...props }: ConversationScrollButtonProps) => false | import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=conversation.d.ts.map