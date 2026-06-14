import type { UIMessage } from 'ai';
import type { ComponentProps, HTMLAttributes } from 'react';
import { Avatar } from '../../components/ui/avatar';
type MessageProps = HTMLAttributes<HTMLDivElement> & {
    from: UIMessage['role'];
};
export declare const Message: ({ className, from, ...props }: MessageProps) => import("react/jsx-runtime").JSX.Element;
type MessageContentProps = HTMLAttributes<HTMLDivElement>;
export declare const MessageContent: ({ children, className, ...props }: MessageContentProps) => import("react/jsx-runtime").JSX.Element;
type MessageAvatarProps = ComponentProps<typeof Avatar> & {
    src: string;
    name?: string;
};
export declare const MessageAvatar: ({ src, name, className, ...props }: MessageAvatarProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=message.d.ts.map