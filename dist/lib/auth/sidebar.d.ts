import type { AuthUser } from './types.js';
export interface PageItem {
    title: string;
    pagePath: string;
    icon: string;
    retainSearchParams?: boolean;
    hidden?: boolean;
    parentPagePath?: string;
    onClickAction?: string;
}
export interface ServerPageItem extends PageItem {
    roles: string[];
    isHidden?: (roles: string[]) => boolean;
}
export interface PageGroup {
    title: string;
    groupPath: string;
    icon: string;
    isExpanded?: boolean;
    pages: PageItem[];
}
export interface ServerPageGroup extends PageGroup {
    pages: ServerPageItem[];
}
export interface ModuleMenuItems {
    title: string;
    modulePath: string;
    pageGroups: PageGroup[];
}
export interface ServerModuleMenuItems extends ModuleMenuItems {
    pageGroups: ServerPageGroup[];
}
export interface Team {
    name: string;
    menuTitle?: string;
    logo: string;
    teamPath: string;
    modules: ModuleMenuItems[];
    oneLevelNav: PageItem[];
}
export interface ServerTeam extends Team {
    modules: ServerModuleMenuItems[];
    oneLevelNav: ServerPageItem[];
}
export declare function getUserTeams(user: AuthUser, serverTeams?: ServerTeam[]): Promise<Team[]>;
export declare function checkPageAccess(user: AuthUser, pathname: string, serverTeams?: ServerTeam[]): Promise<boolean>;
//# sourceMappingURL=sidebar.d.ts.map