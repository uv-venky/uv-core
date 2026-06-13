import * as React from 'react';
export interface LoginPageOptions {
    title?: string;
    loginApiPath?: string;
    redirectUrl?: string;
    tokenStorageKey?: string;
    brandName?: string;
    logo?: string | React.ReactNode;
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
export declare const LoginPage: React.FC<LoginPageOptions>;
export declare function renderLoginPage(options?: LoginPageOptions): string;
//# sourceMappingURL=login-page.d.ts.map