import type { DataSourceAccess } from './types.js';
import type { TableDataSource } from './types.js';
import type { Attribute } from './types.js';

export const DefaultDataSource: Omit<
  TableDataSource<any>,
  'id' | 'description' | 'tableName' | 'attributes' | 'access' | 'externalType' | 'externalId'
> = {
  type: 'Table',
  logLevel: 'ERROR' as const,
  skipQueryForUpdate: false,
  readOnly: false,
  rowType: [],
};

export const DefaultAttribute: Omit<Attribute<any>, 'code' | 'name'> = {
  type: 'Text',
  insert: true,
  update: true,
  select: true,
  export: true,
  query: true,
  audit: true,
  optional: true,
};

export const DefaultCalculatedAttribute: Omit<Attribute<any>, 'code' | 'name'> = {
  type: 'Text',
  insert: false,
  update: false,
  select: true,
  export: true,
  query: true,
  audit: false,
  optional: true,
  calculated: true,
};

export const DefaultFullAccess: Omit<DataSourceAccess, 'roleCode'> = {
  query: true,
  insert: true,
  update: true,
  delete: true,
  export: true,
};

export const DefaultReadOnlyAccess: Omit<DataSourceAccess, 'roleCode'> = {
  query: true,
};
