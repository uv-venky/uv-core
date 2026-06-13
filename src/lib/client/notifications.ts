export interface ConfirmWithUserArgs {
  title: string;
  content: string;
  cancelButtonLabel?: string;
  confirmButtonLabel?: string;
  confirmationText?: string;
}

export interface NotificationProvider {
  showError(title: string | Error, props?: { description?: string }): void;
  showSuccess(title: string, props?: { description?: string }): void;
  showWarning(title: string, props?: { description?: string }): void;
  confirmWithUser(args: ConfirmWithUserArgs): Promise<boolean>;
}

const defaultProvider: NotificationProvider = {
  showError(title: string | Error) {
    const msg = typeof title === 'string' ? title : title.message;
    console.error('[UV-Core] Error:', msg);
  },
  showSuccess(title: string) {
    console.info('[UV-Core] Success:', title);
  },
  showWarning(title: string) {
    console.warn('[UV-Core] Warning:', title);
  },
  confirmWithUser(_args: ConfirmWithUserArgs): Promise<boolean> {
    return Promise.resolve(false);
  },
};

let _notificationProvider: NotificationProvider = defaultProvider;

export function setNotificationProvider(provider: NotificationProvider) {
  _notificationProvider = provider;
}

export function getNotificationProvider(): NotificationProvider {
  return _notificationProvider;
}

export function showError(title: string | Error, props?: { description?: string }): void {
  _notificationProvider.showError(title, props);
}

export function showSuccess(title: string, props?: { description?: string }): void {
  _notificationProvider.showSuccess(title, props);
}

export function showWarning(title: string, props?: { description?: string }): void {
  _notificationProvider.showWarning(title, props);
}
