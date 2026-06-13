export interface ColumnMeta {
  name: string;
  type: string;
  maxLength: number | null;
  nullable: boolean;
  allowDecimals: boolean;
  excludeTime: boolean;
  primary?: boolean;
}

export interface TableMeta {
  table_schema: string;
  table_name: string;
  table_type: string;
}

export interface CodegenState {
  moduleCode: string;
  subModuleCode?: string;
  tableName: string;
  schemaName: string;
  dsName: string;
  editable: boolean;
  template: 'simple' | 'page-layout' | 'table-with-search';
  columns: ColumnMeta[];
  createPage: boolean;
  pageRouteName: string;
  columnOrder: string[];
  /** Optional index suffix for multi-instance datasources */
  index?: number;
}

export interface TemplateOption {
  name: string;
  value: string;
  description?: string;
}

export type GenerateCodeFn = (state: CodegenState) => string;
