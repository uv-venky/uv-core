'use client';
import { usePathname } from '../../../components/core/hooks/usePathname';
import { useEffect } from 'react';
import { breadcrumbsState } from '../../../components/breadcrumbs';
export default function usePageTitle(title) {
    const pathname = usePathname();
    const search = typeof window !== 'undefined' ? window.location.search.slice(1) : '';
    const href = `${pathname}${search ? `?${search}` : ''}`;
    // useInsertionEffect(() => {
    //   if (pathname) {
    //     clientLogger.resetTrackId();
    //   }
    // }, [pathname]);
    useEffect(() => {
        const isClientDashboard = pathname === '/dashboard' || pathname.startsWith('/dashboard/');
        if (isClientDashboard) {
            breadcrumbsState.breadcrumbs = [
                {
                    title,
                    href,
                },
            ];
        }
        else {
            const index = breadcrumbsState.breadcrumbs.findIndex((breadcrumb) => breadcrumb.href?.startsWith(pathname));
            if (index === -1) {
                breadcrumbsState.breadcrumbs.push({
                    title,
                    href,
                });
            }
            else {
                breadcrumbsState.breadcrumbs[index] = {
                    title,
                    href,
                };
                breadcrumbsState.breadcrumbs = breadcrumbsState.breadcrumbs.slice(0, index + 1);
            }
        }
        document.title = title;
        setTimeout(() => {
            document.title = title;
        }, 600);
    }, [href, pathname, title]);
    return null;
}
//# sourceMappingURL=usePageTitle.js.map