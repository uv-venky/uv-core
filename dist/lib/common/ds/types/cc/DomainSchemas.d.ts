import type { ISODateTimeString } from '../../../../../lib/core/common/ds/types/Base';
export interface DomainSchemaColumn {
    name: string;
    type?: string;
    description?: string;
    isPrimaryKey?: boolean;
    isForeignKey?: boolean;
    foreignKey?: {
        table: string;
        column: string;
    };
    nullable?: boolean;
    default?: string;
    enumValues?: string[];
    sampleValues?: string[];
    synonyms?: string[];
}
export interface DomainSchemaTable {
    name: string;
    columns?: DomainSchemaColumn[];
    description?: string;
}
export interface DomainSchemaView {
    name: string;
    description: string;
    columns?: string[];
    preferOver?: string;
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
//# sourceMappingURL=DomainSchemas.d.ts.map