export interface ConfirmWithUserArgs {
    title: string;
    content: string;
    cancelButtonLabel?: string;
    confirmButtonLabel?: string;
    confirmationText?: string;
}
export interface NotificationProvider {
    showError(title: string | Error, props?: {
        description?: string;
    }): void;
    showSuccess(title: string, props?: {
        description?: string;
    }): void;
    showWarning(title: string, props?: {
        description?: string;
    }): void;
    confirmWithUser(args: ConfirmWithUserArgs): Promise<boolean>;
}
export declare function setNotificationProvider(provider: NotificationProvider): void;
export declare function getNotificationProvider(): NotificationProvider;
export declare function showError(title: string | Error, props?: {
    description?: string;
}): void;
export declare function showSuccess(title: string, props?: {
    description?: string;
}): void;
export declare function showWarning(title: string, props?: {
    description?: string;
}): void;
//# sourceMappingURL=notifications.d.ts.map