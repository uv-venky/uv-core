/* Copyright (c) 2024-present Wayvo Corp. */

import type { ISODateTimeString } from '@/lib/core/common/ds/types/Base';

export interface DomainSchemaColumn {
  name: string;
  type?: string; // e.g., "uuid", "varchar(256)", "integer", "numeric(12,2)"
  description?: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  foreignKey?: { table: string; column: string };
  nullable?: boolean;
  default?: string;
  enumValues?: string[]; // allowed values — inline, replaces separate enums array
  sampleValues?: string[]; // 3-5 representative values for LLM context
  synonyms?: string[]; // alternative names users might use ("revenue" → "sales")
}

export interface DomainSchemaTable {
  name: string;
  columns?: DomainSchemaColumn[];
  description?: string;
}

export interface DomainSchemaView {
  name: string;
  description: string;
  columns?: string[]; // column names available in this view
  preferOver?: string; // "Use instead of joining ms_products + ms_inventory"
}

export interface DomainSchemaRelationship {
  from: string;
  to: string;
  via: string;
  type?: 'one-to-one' | 'one-to-many' | 'many-to-many';
  description?: string;
}

export interface DomainSchemas {
  schemaId: string;
  domainId: string;
  name: string;
  description?: string | null;
  tablePrefix?: string | null;
  tables: DomainSchemaTable[];
  views: DomainSchemaView[];
  relationships: DomainSchemaRelationship[];
  queryGuidelines?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: ISODateTimeString;
  createdBy: string;
  updatedAt: ISODateTimeString;
  updatedBy: string;
}
