/**
 * NotificationProvider provides a pluggable interface for UI notifications
 * and user confirmations. This decouples core client logic (store, queries)
 * from specific UI libraries (sonner, react-hot-toast, etc.).
 *
 * Usage:
 *   - Call `setNotificationProvider()` early in the app (e.g., in AppProvider)
 *   - If no provider is set, defaults to console-based logging (no-op for confirmations)
 */
/** Default provider that logs to console — used when no UI provider is set */
const defaultProvider = {
    showError(title) {
        const msg = typeof title === 'string' ? title : title.message;
        console.error('[Wayvo] Error:', msg);
    },
    showSuccess(title) {
        console.info('[Wayvo] Success:', title);
    },
    showWarning(title) {
        console.warn('[Wayvo] Warning:', title);
    },
    confirmWithUser(_args) {
        console.warn('[Wayvo] confirmWithUser called but no UI provider is set. Returning false.');
        return Promise.resolve(false);
    },
    touch() {
        // no-op by default
    },
};
let _notificationProvider = defaultProvider;
/**
 * Set the notification provider for the app.
 * Call this in your root layout/provider component.
 *
 * @example
 * // In AppProvider (Next.js with sonner)
 * import { setNotificationProvider } from '@wayvo-ai/core/client';
 * setNotificationProvider({
 *   showError: sonnerShowError,
 *   showSuccess: sonnerShowSuccess,
 *   showWarning: sonnerShowWarning,
 *   confirmWithUser: sonnerConfirmWithUser,
 *   touch: sonnerTouch,
 * });
 */
export function setNotificationProvider(provider) {
    _notificationProvider = provider;
}
/** Get the current notification provider */
export function getNotificationProvider() {
    return _notificationProvider;
}
// Convenience functions that delegate to the provider
export function showError(title, props) {
    _notificationProvider.showError(title, props);
}
export function showSuccess(title, props) {
    _notificationProvider.showSuccess(title, props);
}
export function showWarning(title, props) {
    _notificationProvider.showWarning(title, props);
}
export function confirmWithUser(args) {
    return _notificationProvider.confirmWithUser(args);
}
export function touch() {
    _notificationProvider.touch();
}
//# sourceMappingURL=notifications.js.map