import * as React from 'react';
export interface ResetPasswordPageOptions {
    title?: string;
    brandName?: string;
    logo?: string | React.ReactNode;
    backgroundUrl?: string;
    apiPath?: string;
    loginPath?: string;
    termsUrl?: string;
    privacyUrl?: string;
}
export declare const ResetPasswordPage: React.FC<ResetPasswordPageOptions>;
export declare function renderResetPasswordPage(options?: ResetPasswordPageOptions): string;
//# sourceMappingURL=reset-password-page.d.ts.map