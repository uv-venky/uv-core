import * as React from 'react';
export interface NewPasswordPageOptions {
    title?: string;
    brandName?: string;
    logo?: string | React.ReactNode;
    backgroundUrl?: string;
    apiPath?: string;
    loginPath?: string;
}
export declare const NewPasswordPage: React.FC<NewPasswordPageOptions>;
export declare function renderNewPasswordPage(options?: NewPasswordPageOptions): string;
//# sourceMappingURL=new-password-page.d.ts.map