import { executeQuery } from '../database/postgres.js';
import { APPS_TABLE, USER_ROLES_TABLE, ROLES_TABLE } from '../common/constants.js';
import { getConfig } from '../common/config.js';
async function getAppsFromDatabase(currentAppId, userName) {
    try {
        const result = await executeQuery(`SELECT a.app_id, a.name, a.full_url, a.icon 
       FROM ${APPS_TABLE} a
       WHERE a.app_id != $1 
         AND EXISTS (
           SELECT 1
           FROM ${USER_ROLES_TABLE} ur
           INNER JOIN ${ROLES_TABLE} r ON ur.role_code = r.role_code
           WHERE r.app_id = a.app_id
             AND ur.user_name = $2
             AND ur.start_date <= now() 
             AND (ur.end_date IS NULL OR ur.end_date >= now())
             AND r.start_date <= now() 
             AND (r.end_date IS NULL OR r.end_date >= now())
         )
       ORDER BY a.name`, [currentAppId, userName]);
        return result.rows.map((app) => ({
            name: app.name,
            menuTitle: app.name,
            logo: app.icon || 'MiniLogo',
            teamPath: app.full_url,
            modules: [],
            oneLevelNav: [],
        }));
    }
    catch (err) {
        // Return empty array if the table doesn't exist yet or query fails
        return [];
    }
}
export async function getUserTeams(user, serverTeams = []) {
    const roles = [...user.roles];
    if (!roles.includes('user')) {
        roles.push('user');
    }
    const currentAppId = getConfig().appId;
    // Get apps from database - only return apps where user has at least one role
    const dbApps = await getAppsFromDatabase(currentAppId, user.userName);
    const clientTeams = serverTeams.map((team) => ({
        ...team,
        modules: team.modules
            .map((module) => ({
            ...module,
            pageGroups: module.pageGroups
                .map((group) => ({
                ...group,
                pages: group.pages
                    .filter((page) => page.roles.some((role) => roles.includes(role)))
                    .map((page) => {
                    const { roles: _unused, isHidden, ...rest } = page;
                    if (isHidden) {
                        return { ...rest, hidden: isHidden(roles) };
                    }
                    return rest;
                }),
            }))
                .filter((group) => group.pages.length > 0),
        }))
            .filter((module) => module.pageGroups.length > 0),
        oneLevelNav: team.oneLevelNav
            .filter((nav) => nav.roles.some((role) => roles.includes(role)))
            .map((nav) => {
            const { roles: _unused, isHidden, ...rest } = nav;
            if (isHidden) {
                return { ...rest, hidden: isHidden(roles) };
            }
            return rest;
        }),
    }));
    return [...clientTeams, ...dbApps];
}
const ACCESS_CHECK_EXEMPT_PREFIXES = [
    '/login',
    '/access-denied',
    '/404',
    '/home',
    '/gen',
    '/no-access',
    '/force-password-change',
    '/go',
    '/api',
];
export async function checkPageAccess(user, pathname, serverTeams = []) {
    if (pathname === '/' ||
        ACCESS_CHECK_EXEMPT_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
        return true;
    }
    const teams = await getUserTeams(user, serverTeams);
    if (teams.length === 0) {
        return true;
    }
    const hasOneLevelNavAccess = teams.some((team) => team.oneLevelNav.some((nav) => pathname.startsWith(`${team.teamPath}${nav.pagePath}`)));
    if (hasOneLevelNavAccess) {
        return true;
    }
    const hasModuleAccess = teams.some((team) => team.modules.some((module) => module.pageGroups.some((group) => group.pages.some((page) => pathname.startsWith(`${module.modulePath}${group.groupPath}${page.pagePath}`)))));
    return hasModuleAccess;
}
//# sourceMappingURL=sidebar.js.map