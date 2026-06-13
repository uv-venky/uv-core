export class QueryBuilder {
    ds;
    session;
    selectFields = [];
    joinClauses = [];
    whereClauses = [];
    params = [];
    orderClause = '';
    limitClause = '';
    offsetClause = '';
    constructor(ds, session) {
        if (ds.type !== 'Table') {
            throw new Error('Cannot create QueryBuilder for non-table data source');
        }
        this.ds = ds;
        this.session = session;
    }
    applyQuery(query) {
        // 1. Compile SELECT fields
        const attributes = this.ds.getSelectableAttributes?.(this.session) ?? this.ds.attributes;
        const selectCodes = query.select ?? attributes.filter((a) => a.select !== false).map((a) => a.code);
        this.selectFields = [];
        for (const code of selectCodes) {
            const attr = attributes.find((a) => a.code === code);
            if (!attr)
                continue;
            const column = attr.column ?? attr.code;
            if (attr.calculated) {
                // Calculated/Joined field already has alias prefixed in column, e.g. "r.role_name"
                this.selectFields.push(`${column} AS "${String(code)}"`);
            }
            else {
                // Standard field belongs to main table "x"
                // Quote column name to preserve case if necessary
                const colRef = column.includes('.') ? column : `x.${column}`;
                this.selectFields.push(`${colRef} AS "${String(code)}"`);
            }
        }
        if (this.selectFields.length === 0) {
            this.selectFields = ['*'];
        }
        // 2. Compile JOINS
        this.joinClauses = [];
        if (this.ds.joins) {
            for (const join of this.ds.joins) {
                const onCondition = typeof join.on === 'function' ? join.on() : join.on;
                this.joinClauses.push(`${join.joinType} JOIN ${join.tableName} AS ${join.alias} ON ${onCondition}`);
            }
        }
        // 3. Compile WHERE filters
        this.whereClauses = [];
        this.params = [];
        // 3.1 Match equality filters
        if (query.match) {
            for (const [code, val] of Object.entries(query.match)) {
                const attr = this.ds.attributes.find((a) => a.code === code);
                if (!attr)
                    continue;
                const column = attr.column ?? attr.code;
                const colRef = attr.calculated || column.includes('.') ? column : `x.${column}`;
                if (val === null) {
                    this.whereClauses.push(`${colRef} IS NULL`);
                }
                else {
                    this.params.push(val);
                    this.whereClauses.push(`${colRef} = $${this.params.length}`);
                }
            }
        }
        // 3.2 Custom whereClause + whereClauseParamList
        if (query.whereClause) {
            const offset = this.params.length;
            // Shift placeholders ($1 -> $3 if offset is 2)
            const shifted = query.whereClause.replace(/\$(\d+)/g, (_, num) => {
                return `$${parseInt(num, 10) + offset}`;
            });
            this.whereClauses.push(shifted);
            if (query.whereClauseParamList) {
                this.params.push(...query.whereClauseParamList);
            }
        }
        // 4. Compile ORDER BY
        this.orderClause = '';
        if (query.orderBy) {
            this.orderClause = `ORDER BY ${query.orderBy}`;
        }
        else if (query.sort) {
            const sortParts = [];
            for (const [code, direction] of Object.entries(query.sort)) {
                const attr = this.ds.attributes.find((a) => a.code === code);
                if (!attr)
                    continue;
                const column = attr.column ?? attr.code;
                const colRef = attr.calculated || column.includes('.') ? column : `x.${column}`;
                sortParts.push(`${colRef} ${direction === -1 ? 'DESC' : 'ASC'}`);
            }
            if (sortParts.length > 0) {
                this.orderClause = `ORDER BY ${sortParts.join(', ')}`;
            }
        }
        // 5. Compile LIMIT / OFFSET
        this.limitClause = '';
        this.offsetClause = '';
        if (query.limit !== undefined) {
            this.params.push(query.limit);
            this.limitClause = `LIMIT $${this.params.length}`;
        }
        if (query.offset !== undefined) {
            this.params.push(query.offset);
            this.offsetClause = `OFFSET $${this.params.length}`;
        }
    }
    getQuery() {
        const fromClause = `${this.ds.schema ? `${this.ds.schema}.` : ''}${this.ds.tableName} AS x`;
        const joins = this.joinClauses.length > 0 ? '\n' + this.joinClauses.join('\n') : '';
        const where = this.whereClauses.length > 0 ? '\nWHERE ' + this.whereClauses.join(' AND ') : '';
        const order = this.orderClause ? '\n' + this.orderClause : '';
        const limit = this.limitClause ? '\n' + this.limitClause : '';
        const offset = this.offsetClause ? '\n' + this.offsetClause : '';
        return `SELECT ${this.selectFields.join(', ')}\nFROM ${fromClause}${joins}${where}${order}${limit}${offset}`;
    }
    getCountQuery() {
        const fromClause = `${this.ds.schema ? `${this.ds.schema}.` : ''}${this.ds.tableName} AS x`;
        const joins = this.joinClauses.length > 0 ? '\n' + this.joinClauses.join('\n') : '';
        const where = this.whereClauses.length > 0 ? '\nWHERE ' + this.whereClauses.join(' AND ') : '';
        return `SELECT COUNT(*)::integer AS count\nFROM ${fromClause}${joins}${where}`;
    }
    getParams() {
        return this.params;
    }
    getCountParams() {
        // For counts, we omit limit/offset parameters if they were added at the end
        // But since limit/offset params are added last, we can slice off the last 1 or 2 params
        // depending on whether limit and offset were set.
        let countParams = [...this.params];
        // If limit/offset were appended, they will match the last parameter bindings.
        // Let's keep it safe by checking if limitClause/offsetClause are present and dropping their values.
        if (this.offsetClause) {
            countParams.pop();
        }
        if (this.limitClause) {
            countParams.pop();
        }
        return countParams;
    }
}
//# sourceMappingURL=queryBuilder.js.map