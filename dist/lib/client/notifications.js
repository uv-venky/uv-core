const defaultProvider = {
    showError(title) {
        const msg = typeof title === 'string' ? title : title.message;
        console.error('[UV-Core] Error:', msg);
    },
    showSuccess(title) {
        console.info('[UV-Core] Success:', title);
    },
    showWarning(title) {
        console.warn('[UV-Core] Warning:', title);
    },
    confirmWithUser(_args) {
        return Promise.resolve(false);
    },
};
let _notificationProvider = defaultProvider;
export function setNotificationProvider(provider) {
    _notificationProvider = provider;
}
export function getNotificationProvider() {
    return _notificationProvider;
}
export function showError(title, props) {
    _notificationProvider.showError(title, props);
}
export function showSuccess(title, props) {
    _notificationProvider.showSuccess(title, props);
}
export function showWarning(title, props) {
    _notificationProvider.showWarning(title, props);
}
//# sourceMappingURL=notifications.js.map