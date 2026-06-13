import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { renderToStaticMarkup } from 'react-dom/server';
const DEFAULT_MODULES = [
    { value: 'app', label: 'App' },
    { value: 'admin', label: 'Admin' },
];
const DEFAULT_SUB_MODULES = [
    { value: '', label: '(none)' },
    { value: 'config', label: 'Configuration' },
    { value: 'maintenance', label: 'Maintenance' },
];
function buildCodegenScript(options) {
    return `
    (function () {
      var apiPaths = ${JSON.stringify(options)};

      var state = {
        tableName: '',
        schemaName: '',
        dsName: '',
        columns: [],
        columnOrder: [],
      };

      var tableSearch = document.getElementById('tableSearch');
      var tableResults = document.getElementById('tableResults');
      var statusEl = document.getElementById('codegen-status');
      var generateBtn = document.getElementById('generateBtn');
      var searchTimer = null;

      function showStatus(message, type) {
        statusEl.style.display = 'block';
        statusEl.textContent = message;
        statusEl.className = 'codegen-status codegen-status--' + (type === 'error' ? 'error' : 'success');
      }

      function hideStatus() {
        statusEl.style.display = 'none';
      }

      function camelCase(value) {
        return value.replace(/[_-](\\w)/g, function (_, c) { return c.toUpperCase(); }).replace(/^\\w/, function (c) { return c.toLowerCase(); });
      }

      function startCase(value) {
        return value
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          .replace(/[_-]+/g, ' ')
          .replace(/\\b\\w/g, function (c) { return c.toUpperCase(); });
      }

      function kebabCase(value) {
        return value
          .replace(/([a-z])([A-Z])/g, '$1-$2')
          .replace(/[_\\s]+/g, '-')
          .toLowerCase();
      }

      function defaultDsName(tableName) {
        var name = startCase(camelCase(tableName)).replace(/\\s+/g, '');
        if (name.length > 3 && (name.charAt(2) === name.charAt(2).toUpperCase() || name.charAt(3) === name.charAt(3).toUpperCase())) {
          name = name.slice(0, 3).toUpperCase() + name.slice(3);
        }
        return name;
      }

      function canBePrimaryKey(type, maxLength) {
        var base = type.split('(')[0].trim().toLowerCase();
        if (['integer', 'smallint', 'numeric', 'bigint', 'uuid'].indexOf(base) !== -1) return true;
        if (base === 'character varying' || base === 'character') {
          return maxLength == null || (maxLength > 3 && maxLength <= 256);
        }
        return false;
      }

      function setVisible(id, visible) {
        var el = document.getElementById(id);
        if (!el) return;
        el.style.display = visible ? 'block' : 'none';
      }

      function setFlexVisible(id, visible) {
        var el = document.getElementById(id);
        if (!el) return;
        el.style.display = visible ? 'flex' : 'none';
      }

      function updateGenerateButton() {
        var hasTable = !!state.tableName;
        var hasDsName = !!document.getElementById('dsName').value.trim();
        var hasRoute = !document.getElementById('createPage').checked || !!document.getElementById('pageRouteName').value.trim();
        var hasPrimary = state.columns.some(function (c) { return c.primary; });
        var enabled = hasTable && hasDsName && hasRoute && hasPrimary;
        generateBtn.disabled = !enabled;
        generateBtn.classList.toggle('codegen-btn--disabled', !enabled);
      }

      function renderPkColumns() {
        var container = document.getElementById('pkColumns');
        container.innerHTML = '';
        var pkCols = state.columns.filter(function (c) { return canBePrimaryKey(c.type, c.maxLength); });
        if (pkCols.length === 0) {
          container.innerHTML = '<span style="color:var(--text-muted);font-size:0.85rem">No eligible primary key columns found.</span>';
          return;
        }
        pkCols.forEach(function (column) {
          var label = document.createElement('label');
          label.className = 'pk-label';
          var input = document.createElement('input');
          input.type = 'checkbox';
          input.checked = !!column.primary;
          input.className = 'pk-checkbox';
          input.addEventListener('change', function () {
            column.primary = input.checked;
            updateGenerateButton();
          });
          label.appendChild(input);
          label.appendChild(document.createTextNode(column.name));
          container.appendChild(label);
        });
      }

      function renderColumnOrder() {
        var container = document.getElementById('columnOrderList');
        container.innerHTML = '';
        state.columnOrder.forEach(function (name, index) {
          var row = document.createElement('div');
          row.className = 'col-order-row';

          var label = document.createElement('span');
          label.textContent = name;
          label.className = 'col-order-label';

          function move(delta) {
            var next = index + delta;
            if (next < 0 || next >= state.columnOrder.length) return;
            var copy = state.columnOrder.slice();
            var temp = copy[index];
            copy[index] = copy[next];
            copy[next] = temp;
            state.columnOrder = copy;
            renderColumnOrder();
          }

          ['▲', '▼'].forEach(function (symbol, i) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = symbol;
            btn.className = 'col-order-btn';
            btn.title = i === 0 ? 'Move up' : 'Move down';
            btn.addEventListener('click', function () { move(i === 0 ? -1 : 1); });
            row.appendChild(btn);
          });

          row.insertBefore(label, row.firstChild);
          container.appendChild(row);
        });
      }

      function showTableDetails(show) {
        ['pkSection', 'dsNameSection', 'createPageSection', 'schemaSection'].forEach(function (id) {
          setVisible(id, show);
        });
        updatePageSections();
      }

      function updatePageSections() {
        var createPage = document.getElementById('createPage').checked;
        var hasTable = !!state.tableName;
        ['editableSection', 'pageRouteSection', 'templateSection', 'columnOrderSection'].forEach(function (id) {
          setVisible(id, createPage && hasTable);
        });
        updateGenerateButton();
      }

      async function loadColumns() {
        if (!state.tableName) return;
        var schemaInput = document.getElementById('schemaName');
        var url = apiPaths.columnsApiPath + '?tableName=' + encodeURIComponent(state.tableName) + '&schemaName=' + encodeURIComponent(state.schemaName || 'public');
        var res = await fetch(url);
        var data = await res.json();
        if (data.status !== 'SUCCESS') {
          showStatus(data.message || 'Failed to load columns', 'error');
          return;
        }
        state.columns = data.columns.map(function (c) {
          return Object.assign({}, c, { primary: false });
        });
        state.columnOrder = state.columns.map(function (c) { return c.name; }).sort();
        renderPkColumns();
        renderColumnOrder();
        showTableDetails(true);
        updateGenerateButton();
      }

      function selectTable(table) {
        state.tableName = table.table_name;
        state.schemaName = table.table_schema;
        tableSearch.value = table.table_schema + '.' + table.table_name + ' (' + table.table_type + ')';
        tableResults.style.display = 'none';
        document.getElementById('schemaName').value = state.schemaName;
        document.getElementById('dsName').value = defaultDsName(state.tableName);
        document.getElementById('pageRouteName').value = kebabCase(state.tableName);
        hideStatus();
        loadColumns();
      }

      tableSearch.addEventListener('input', function () {
        clearTimeout(searchTimer);
        var filter = tableSearch.value.trim();
        if (filter.length < 2) {
          tableResults.style.display = 'none';
          return;
        }
        searchTimer = setTimeout(async function () {
          var res = await fetch(apiPaths.tablesApiPath + '?filter=' + encodeURIComponent(filter));
          var data = await res.json();
          if (data.status !== 'SUCCESS') {
            showStatus(data.message || 'Failed to search tables', 'error');
            return;
          }
          tableResults.innerHTML = '';
          if (!data.tables.length) {
            var empty = document.createElement('div');
            empty.textContent = 'No tables found';
            empty.className = 'table-result-empty';
            tableResults.appendChild(empty);
          } else {
            data.tables.forEach(function (table) {
              var item = document.createElement('button');
              item.type = 'button';
              item.textContent = table.table_schema + '.' + table.table_name + ' (' + table.table_type + ')';
              item.className = 'table-result-item';
              item.addEventListener('mouseenter', function () { item.classList.add('table-result-item--hover'); });
              item.addEventListener('mouseleave', function () { item.classList.remove('table-result-item--hover'); });
              item.addEventListener('click', function () { selectTable(table); });
              tableResults.appendChild(item);
            });
          }
          tableResults.style.display = 'block';
        }, 250);
      });

      document.addEventListener('click', function (event) {
        if (!tableResults.contains(event.target) && event.target !== tableSearch) {
          tableResults.style.display = 'none';
        }
      });

      ['dsName', 'pageRouteName'].forEach(function (id) {
        document.getElementById(id).addEventListener('input', updateGenerateButton);
      });

      document.getElementById('createPage').addEventListener('change', function () {
        updatePageSections();
      });

      generateBtn.addEventListener('click', async function () {
        hideStatus();
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
        document.getElementById('generatedFiles').style.display = 'none';

        var payload = {
          moduleCode: document.getElementById('moduleCode').value,
          subModuleCode: document.getElementById('subModuleCode').value,
          tableName: state.tableName,
          schemaName: state.schemaName,
          dsName: document.getElementById('dsName').value.trim(),
          editable: document.getElementById('editable').checked,
          template: document.getElementById('template').value,
          columns: state.columns,
          createPage: document.getElementById('createPage').checked,
          pageRouteName: document.getElementById('pageRouteName').value.trim(),
          columnOrder: state.columnOrder,
        };

        try {
          var res = await fetch(apiPaths.generateApiPath, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          var data = await res.json();
          if (data.status !== 'SUCCESS') {
            showStatus(data.message || 'Generation failed', 'error');
            return;
          }
          showStatus('Files generated successfully! ' + data.files.length + ' file(s) written.', 'success');
          var filesEl = document.getElementById('generatedFiles');
          filesEl.style.display = 'block';
          filesEl.textContent = data.files.join('\\n');
        } catch (error) {
          showStatus(error && error.message ? error.message : 'Generation failed', 'error');
        } finally {
          generateBtn.textContent = 'Generate';
          updateGenerateButton();
        }
      });
    })();
  `;
}
export const CodegenPageContent = ({ title = 'Code Generator', description = 'Generate DataSource, types, store, and page files from database tables.', modules = DEFAULT_MODULES, subModules = DEFAULT_SUB_MODULES, tablesApiPath = '/api/codegen/tables', columnsApiPath = '/api/codegen/columns', generateApiPath = '/api/codegen/generate', }) => {
    const fieldStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    };
    const labelStyle = { fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 };
    const inputStyle = {
        padding: '0.6rem 0.75rem',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(0,0,0,0.25)',
        color: 'var(--text-white)',
        fontSize: '0.875rem',
        width: '100%',
        boxSizing: 'border-box',
    };
    const sectionStyle = {
        marginTop: '1.25rem',
        padding: '1rem',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(0,0,0,0.15)',
    };
    const sectionTitleStyle = {
        fontSize: '0.8rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: 'var(--text-muted)',
        marginBottom: '0.75rem',
    };
    return (_jsxs("div", { className: "codegen-page", style: { animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' }, children: [_jsx("style", { dangerouslySetInnerHTML: {
                    __html: `
          .codegen-status {
            display: none;
            margin-bottom: 1rem;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            font-size: 0.875rem;
          }
          .codegen-status--error {
            background: rgba(239,68,68,0.15);
            color: #fca5a5;
            border: 1px solid rgba(239,68,68,0.3);
          }
          .codegen-status--success {
            background: rgba(34,197,94,0.15);
            color: #86efac;
            border: 1px solid rgba(34,197,94,0.3);
          }
          .codegen-section { display: none; }
          .codegen-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
          @media (max-width: 900px) { .codegen-grid { grid-template-columns: repeat(2, 1fr); } }
          @media (max-width: 600px) { .codegen-grid { grid-template-columns: 1fr; } }
          .codegen-btn {
            padding: 0.7rem 1.75rem;
            border-radius: 8px;
            border: none;
            background: #0ea5e9;
            color: white;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: background 0.15s;
          }
          .codegen-btn:hover:not(.codegen-btn--disabled) { background: #0284c7; }
          .codegen-btn--disabled { opacity: 0.45; cursor: not-allowed; }
          .pk-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--text-white);
            font-size: 0.875rem;
            padding: 0.35rem 0.65rem;
            border-radius: 6px;
            border: 1px solid rgba(255,255,255,0.08);
            background: rgba(0,0,0,0.2);
            cursor: pointer;
          }
          .pk-label:hover { border-color: rgba(14,165,233,0.4); }
          .pk-checkbox { accent-color: #0ea5e9; }
          .col-order-row {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.45rem 0.65rem;
            border: 1px solid rgba(255,255,255,0.07);
            border-radius: 7px;
            background: rgba(0,0,0,0.18);
          }
          .col-order-label { flex: 1; color: var(--text-white); font-size: 0.875rem; }
          .col-order-btn {
            padding: 0.2rem 0.5rem;
            border-radius: 5px;
            border: 1px solid rgba(255,255,255,0.1);
            background: rgba(255,255,255,0.05);
            color: var(--text-white);
            cursor: pointer;
            font-size: 0.8rem;
            transition: background 0.1s;
          }
          .col-order-btn:hover { background: rgba(255,255,255,0.12); }
          .table-result-item {
            display: block;
            width: 100%;
            text-align: left;
            padding: 0.6rem 0.75rem;
            border: none;
            background: transparent;
            color: var(--text-white);
            cursor: pointer;
            font-size: 0.875rem;
            transition: background 0.1s;
          }
          .table-result-item--hover { background: rgba(255,255,255,0.07); }
          .table-result-empty { padding: 0.75rem; color: var(--text-muted); font-size: 0.875rem; }
          .toggle-row { display: flex; align-items: center; gap: 0.65rem; }
          .toggle-row input[type=checkbox] { accent-color: #0ea5e9; width: 1rem; height: 1rem; }
          .toggle-row label { color: var(--text-white); font-size: 0.875rem; cursor: pointer; }
        `
                } }), _jsx("h1", { style: { fontFamily: "'Outfit', sans-serif", fontSize: '2.5rem', fontWeight: 300, marginBottom: '0.5rem', letterSpacing: '-0.02em' }, children: title }), _jsx("p", { style: { color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem' }, children: description }), _jsxs("div", { style: { background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', padding: '2rem', borderRadius: '12px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)' }, children: [_jsx("div", { id: "codegen-status", role: "status", className: "codegen-status" }), _jsxs("div", { className: "codegen-grid", children: [_jsxs("label", { style: fieldStyle, children: [_jsx("span", { style: labelStyle, children: "Module" }), _jsx("select", { id: "moduleCode", style: inputStyle, children: modules.map((m) => (_jsx("option", { value: m.value, children: m.label }, m.value))) })] }), _jsxs("label", { style: fieldStyle, children: [_jsx("span", { style: labelStyle, children: "Sub Module" }), _jsx("select", { id: "subModuleCode", style: inputStyle, children: subModules.map((m) => (_jsx("option", { value: m.value, children: m.label }, m.value))) })] }), _jsxs("label", { style: { ...fieldStyle, position: 'relative' }, children: [_jsx("span", { style: labelStyle, children: "Table Name" }), _jsx("input", { id: "tableSearch", type: "text", placeholder: "Search tables (min 2 chars)", autoComplete: "off", style: inputStyle }), _jsx("div", { id: "tableResults", style: { display: 'none', position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20, marginTop: '0.25rem', maxHeight: '220px', overflow: 'auto', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15,23,42,0.97)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' } })] })] }), _jsxs("div", { id: "dsNameSection", className: "codegen-section", style: sectionStyle, children: [_jsx("div", { style: sectionTitleStyle, children: "Data Source Options" }), _jsxs("div", { className: "codegen-grid", children: [_jsxs("label", { style: fieldStyle, children: [_jsx("span", { style: labelStyle, children: "Schema Name" }), _jsx("input", { id: "schemaName", type: "text", readOnly: true, style: { ...inputStyle, color: 'var(--text-muted)', background: 'rgba(0,0,0,0.1)' } })] }), _jsxs("label", { style: fieldStyle, children: [_jsx("span", { style: labelStyle, children: "Data Source Name *" }), _jsx("input", { id: "dsName", type: "text", style: inputStyle, placeholder: "e.g. Customer" })] }), _jsxs("div", { style: { ...fieldStyle, justifyContent: 'flex-end' }, children: [_jsx("span", { style: labelStyle, children: "Create Page" }), _jsxs("div", { className: "toggle-row", style: { minHeight: '38px' }, children: [_jsx("input", { id: "createPage", type: "checkbox", defaultChecked: true }), _jsx("label", { htmlFor: "createPage", children: "Generate page files" })] })] })] })] }), _jsxs("div", { id: "pkSection", className: "codegen-section", style: sectionStyle, children: [_jsx("div", { style: sectionTitleStyle, children: "Primary Key Columns *" }), _jsx("div", { id: "pkColumns", style: { display: 'flex', flexWrap: 'wrap', gap: '0.6rem' } })] }), _jsx("div", { id: "schemaSection", className: "codegen-section", style: { display: 'none' } }), _jsxs("div", { id: "editableSection", className: "codegen-section", style: sectionStyle, children: [_jsx("div", { style: sectionTitleStyle, children: "Page Options" }), _jsxs("div", { className: "codegen-grid", children: [_jsxs("label", { style: fieldStyle, children: [_jsx("span", { style: labelStyle, children: "Page Route Name *" }), _jsx("input", { id: "pageRouteName", type: "text", style: inputStyle, placeholder: "e.g. customers" })] }), _jsxs("div", { style: { ...fieldStyle, justifyContent: 'flex-end' }, children: [_jsx("span", { style: labelStyle, children: "Editable" }), _jsxs("div", { className: "toggle-row", style: { minHeight: '38px' }, children: [_jsx("input", { id: "editable", type: "checkbox" }), _jsx("label", { htmlFor: "editable", children: "Allow editing records" })] })] }), _jsx("label", { id: "pageRouteSection", style: fieldStyle })] })] }), _jsxs("div", { id: "templateSection", className: "codegen-section", style: sectionStyle, children: [_jsx("div", { style: sectionTitleStyle, children: "Template" }), _jsxs("select", { id: "template", defaultValue: "page-layout", style: { ...inputStyle, maxWidth: '520px' }, children: [_jsx("option", { value: "simple", children: "Simple" }), _jsx("option", { value: "page-layout", children: "Page Layout \u2013 table with edit form" }), _jsx("option", { value: "table-with-search", children: "Table with Search \u2013 table only" })] })] }), _jsxs("div", { id: "columnOrderSection", className: "codegen-section", style: sectionStyle, children: [_jsx("div", { style: sectionTitleStyle, children: "Column Order" }), _jsx("p", { style: { fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }, children: "Drag the columns into the order you want them displayed in the table and form." }), _jsx("div", { id: "columnOrderList", style: { display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '320px', overflowY: 'auto' } })] }), _jsx("div", { style: { display: 'flex', justifyContent: 'flex-end', marginTop: '1.75rem' }, children: _jsx("button", { id: "generateBtn", type: "button", disabled: true, className: "codegen-btn codegen-btn--disabled", children: "Generate" }) }), _jsx("pre", { id: "generatedFiles", style: { display: 'none', marginTop: '1.5rem', color: '#a5f3fc', fontFamily: 'monospace', fontSize: '0.85rem', whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' } })] }), _jsx("script", { dangerouslySetInnerHTML: { __html: buildCodegenScript({ tablesApiPath, columnsApiPath, generateApiPath }) } })] }));
};
export function renderCodegenContentHtml(options = {}) {
    return renderToStaticMarkup(_jsx(CodegenPageContent, { ...options }));
}
//# sourceMappingURL=codegen-page.js.map