'use client';
import { createNewChat } from '../../app/(secure)/(chat)/chat/[[...id]]/state';
import { useRouter } from '../../components/core/hooks/useRouter';
import { showError } from '../core/common';
import { usePathname } from 'next/navigation';
export function useSidebarActions() {
    const router = useRouter();
    const pathname = usePathname();
    return (actionName, path) => {
        switch (actionName) {
            case 'createNewChat': {
                // For command center, stay in the current domain slug
                let newChatPath = path || '/chat';
                if (path === '/command-center') {
                    const segments = pathname.split('/').filter(Boolean);
                    if (segments[0] === 'command-center' &&
                        segments.length >= 2 &&
                        !['dashboards', 'settings', 'monitoring', 'approvals'].includes(segments[1])) {
                        newChatPath = `/command-center/${segments[1]}`;
                    }
                }
                createNewChat(router, newChatPath);
                break;
            }
            default:
                showError(`Unknown sidebar action: ${actionName}`);
                break;
        }
    };
}
export function isSidebarItemActive(pathname, item, team) {
    const fullUrl = `${team.teamPath}${item.pagePath}`;
    if (pathname === fullUrl || (item.pagePath !== '' && pathname.startsWith(`${fullUrl}/`))) {
        return true;
    }
    const isParentPageActive = team.oneLevelNav.some((p) => item.pagePath === p.parentPagePath &&
        (pathname === `${team.teamPath}${p.pagePath}` || pathname.startsWith(`${team.teamPath}${p.pagePath}/`)));
    return isParentPageActive;
}
//# sourceMappingURL=actions.js.map