import * as React from 'react';
import type { Team } from '../lib/auth/sidebar.js';
import type { AuthUser } from '../lib/auth/types.js';
export interface SidebarRenderOptions {
    activeTeam: Team | null;
    teams: Team[];
    activePath: string;
    user: AuthUser;
    brandName?: string;
    logo?: string | React.ReactNode;
    contentHtml?: string;
    theme?: 'dark' | 'light';
    tokenStorageKey?: string;
    logoutApiPath?: string;
}
export declare const SidebarLayout: React.FC<SidebarRenderOptions>;
export declare function renderSidebar(options: SidebarRenderOptions): string;
//# sourceMappingURL=sidebar-component.d.ts.map