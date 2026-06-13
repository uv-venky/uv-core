import * as React from 'react';
export interface CodegenModuleOption {
    value: string;
    label: string;
}
export interface CodegenPageOptions {
    title?: string;
    description?: string;
    modules?: CodegenModuleOption[];
    subModules?: CodegenModuleOption[];
    tablesApiPath?: string;
    columnsApiPath?: string;
    generateApiPath?: string;
}
export declare const CodegenPageContent: React.FC<CodegenPageOptions>;
export declare function renderCodegenContentHtml(options?: CodegenPageOptions): string;
//# sourceMappingURL=codegen-page.d.ts.map