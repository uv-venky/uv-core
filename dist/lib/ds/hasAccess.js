export async function hasAccess(ds, auth, accessType) {
    if (!ds.access || ds.access.length === 0) {
        return false;
    }
    // Check if the user has access to the data source based on their roles
    return ds.access.some((a) => {
        if (a.roleCode === 'all_users' && auth.user.userName !== 'guest') {
            // Allowed for all registered users
        }
        else if (!auth.user.roles.includes(a.roleCode)) {
            return false;
        }
        switch (accessType) {
            case 'Query':
                return !!a.query;
            case 'Update':
                return !!a.update;
            case 'Insert':
                return !!a.insert;
            case 'Delete':
                return !!a.delete;
            case 'Export':
                return !!a.export;
            case 'Audit':
                return !!a.audit;
        }
        return false;
    });
}
//# sourceMappingURL=hasAccess.js.map