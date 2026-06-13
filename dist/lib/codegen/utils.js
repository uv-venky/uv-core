import { normalizePgTypeBase } from './db.js';
export function camelCase(str) {
    return str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
        .replace(/^([A-Z])/, (_, chr) => chr.toLowerCase());
}
export function kebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}
export function startCase(str) {
    const camel = camelCase(str);
    return camel
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (m) => m.toUpperCase());
}
export function getAttributeType(pgType, maxLength) {
    const { base, isArray } = normalizePgTypeBase(pgType);
    if (isArray) {
        if (base === 'character varying' || base === 'character' || base === 'text') {
            return 'TextArray';
        }
        return null;
    }
    switch (base) {
        case 'integer':
        case 'smallint':
        case 'bigint':
        case 'numeric':
        case 'double precision':
        case 'real':
            return 'Number';
        case 'boolean':
            return 'Boolean';
        case 'timestamp with time zone':
        case 'timestamp without time zone':
        case 'date':
            return 'Date';
        case 'time without time zone':
            return 'Time';
        case 'jsonb':
            return 'JSON';
        case 'character varying':
        case 'character':
            return maxLength === 1 ? 'YN' : 'Text';
        case 'text':
            return 'Text';
        case 'uuid':
            return 'UUID';
        case 'polygon':
            return 'Polygon';
        case 'vector':
            return 'Vector';
        default:
            return null;
    }
}
export function getDefaultOperatorForType(type) {
    switch (type) {
        case 'Date':
            return 'on';
        case 'Number':
            return 'eq';
        case 'Boolean':
            return 'istrue';
        case 'YN':
            return 'is';
        case 'TF':
            return 'is';
        default:
            return 'is';
    }
}
export function getAttributes(columns, index) {
    return columns
        .map((column) => {
        const type = getAttributeType(column.type, column.maxLength);
        const suffix = index != null ? String(index) : '';
        const primary = column.primary ? '\n      primary: true,' : '';
        const optional = !column.nullable ? '\n      optional: false,' : '';
        const allowDecimals = column.allowDecimals ? '\n      allowDecimals: true,' : '';
        const excludeTime = column.excludeTime && type === 'Date' ? '\n      excludeTime: true,' : '';
        const maxLength = column.maxLength ? '\n      maxLength: ' + column.maxLength + ',' : '';
        const defaultValue = column.primary && type === 'UUID' ? `\n      defaultValue: 'UUID',` : '';
        return `
    {
      ...DefaultAttribute,
      code: '${camelCase(column.name)}${suffix}',
      name: '${startCase(column.name)}${suffix}',
      type: ${type ? `'${type}'` : `'Text' /* NOT SUPPORTED: ${column.type} */`},
      column: '${column.name}',${maxLength}${primary}${optional}${allowDecimals}${excludeTime}${defaultValue}
    }`;
    })
        .join(',');
}
//# sourceMappingURL=utils.js.map