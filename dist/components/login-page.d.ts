export interface LoginPageOptions {
    title?: string;
    loginApiPath?: string;
    redirectUrl?: string;
    tokenStorageKey?: string;
    brandName?: string;
    logo?: string;
    backgroundUrl?: string;
    googleAuthEnabled?: boolean;
    googleAuthUrl?: string;
    ssoEnabled?: boolean;
    ssoUrl?: string;
    ssoButtonText?: string;
    ssoDescription?: string;
    termsUrl?: string;
    privacyUrl?: string;
}
export declare function renderLoginPage(options?: LoginPageOptions): string;
//# sourceMappingURL=login-page.d.ts.map