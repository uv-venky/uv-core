export function isUserActiveSync(user) {
    if (user.locked) {
        return false;
    }
    const now = new Date();
    if (user.start_date > now) {
        return false;
    }
    if (user.end_date && user.end_date < now) {
        return false;
    }
    return true;
}
//# sourceMappingURL=user-utils.js.map