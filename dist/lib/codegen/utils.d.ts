import type { ColumnMeta } from './types.js';
export declare function camelCase(str: string): string;
export declare function kebabCase(str: string): string;
export declare function startCase(str: string): string;
export declare function getAttributeType(pgType: string, maxLength: number | null): string | null;
export declare function getDefaultOperatorForType(type: string): string;
export declare function getAttributes(columns: ColumnMeta[], index?: number): string;
//# sourceMappingURL=utils.d.ts.map