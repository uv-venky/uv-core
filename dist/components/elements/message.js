import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { cn } from '@/lib/chat/utils';
export const Message = ({ className, from, ...props }) => (_jsx("div", { className: cn('group flex w-full items-end justify-end gap-2 py-4', from === 'user' ? 'is-user' : 'is-assistant flex-row-reverse justify-end', '[&>div]:max-w-[80%]', className), ...props }));
export const MessageContent = ({ children, className, ...props }) => (_jsx("div", { className: cn('flex flex-col gap-2 overflow-hidden rounded-lg px-4 py-3 text-foreground text-sm', 'group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground', 'group-[.is-assistant]:bg-secondary group-[.is-assistant]:text-foreground', 'is-user:dark', className), ...props, children: children }));
export const MessageAvatar = ({ src, name, className, ...props }) => (_jsxs(Avatar, { className: cn('size-8 ring-1 ring-border', className), ...props, children: [_jsx(AvatarImage, { alt: "", className: "my-0", src: src }), _jsx(AvatarFallback, { children: name?.slice(0, 2) || 'ME' })] }));
//# sourceMappingURL=message.js.map