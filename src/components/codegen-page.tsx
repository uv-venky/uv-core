import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

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

const DEFAULT_MODULES: CodegenModuleOption[] = [
  { value: 'app', label: 'App' },
  { value: 'admin', label: 'Admin' },
];

const DEFAULT_SUB_MODULES: CodegenModuleOption[] = [
  { value: 'config', label: 'Configuration' },
  { value: 'maintenance', label: 'Maintenance' },
];

function buildCodegenScript(options: Required<Pick<CodegenPageOptions, 'tablesApiPath' | 'columnsApiPath' | 'generateApiPath'>>): string {
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
        statusEl.style.background = type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)';
        statusEl.style.color = type === 'error' ? '#fca5a5' : '#86efac';
        statusEl.style.border = '1px solid ' + (type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)');
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
        el.style.display = visible ? (id.endsWith('Field') ? 'flex' : 'block') : 'none';
      }

      function updateGenerateButton() {
        var hasTable = !!state.tableName;
        var hasDsName = !!document.getElementById('dsName').value.trim();
        var hasRoute = !!document.getElementById('pageRouteName').value.trim();
        var hasPrimary = state.columns.some(function (c) { return c.primary; });
        var enabled = hasTable && hasDsName && hasRoute && hasPrimary;
        generateBtn.disabled = !enabled;
        generateBtn.style.opacity = enabled ? '1' : '0.5';
        generateBtn.style.cursor = enabled ? 'pointer' : 'not-allowed';
      }

      function renderPkColumns() {
        var container = document.getElementById('pkColumns');
        container.innerHTML = '';
        state.columns
          .filter(function (c) { return canBePrimaryKey(c.type, c.maxLength); })
          .forEach(function (column) {
            var label = document.createElement('label');
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.gap = '0.5rem';
            label.style.color = 'var(--text-white)';
            label.style.fontSize = '0.875rem';
            var input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = !!column.primary;
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
          row.style.display = 'flex';
          row.style.alignItems = 'center';
          row.style.gap = '0.5rem';
          row.style.padding = '0.5rem 0.75rem';
          row.style.border = '1px solid rgba(255,255,255,0.08)';
          row.style.borderRadius = '8px';
          row.style.background = 'rgba(0,0,0,0.2)';

          var label = document.createElement('span');
          label.textContent = name;
          label.style.flex = '1';
          label.style.color = 'var(--text-white)';
          label.style.fontSize = '0.875rem';

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

          ['Up', 'Down'].forEach(function (dir, i) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = dir;
            btn.style.padding = '0.25rem 0.5rem';
            btn.style.borderRadius = '6px';
            btn.style.border = '1px solid rgba(255,255,255,0.1)';
            btn.style.background = 'rgba(255,255,255,0.05)';
            btn.style.color = 'var(--text-white)';
            btn.style.cursor = 'pointer';
            btn.addEventListener('click', function () { move(i === 0 ? -1 : 1); });
            row.appendChild(btn);
          });

          row.insertBefore(label, row.firstChild);
          container.appendChild(row);
        });
      }

      function showTableDetails(show) {
        ['schemaField', 'dsNameField', 'createPageField', 'editableField', 'pageRouteField', 'templateField', 'pkField', 'columnOrderField'].forEach(function (id) {
          setVisible(id, show);
        });
      }

      async function loadColumns() {
        if (!state.tableName) return;
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
            empty.style.padding = '0.75rem';
            empty.style.color = 'var(--text-muted)';
            empty.style.fontSize = '0.875rem';
            tableResults.appendChild(empty);
          } else {
            data.tables.forEach(function (table) {
              var item = document.createElement('button');
              item.type = 'button';
              item.textContent = table.table_schema + '.' + table.table_name + ' (' + table.table_type + ')';
              item.style.display = 'block';
              item.style.width = '100%';
              item.style.textAlign = 'left';
              item.style.padding = '0.65rem 0.75rem';
              item.style.border = 'none';
              item.style.background = 'transparent';
              item.style.color = 'var(--text-white)';
              item.style.cursor = 'pointer';
              item.addEventListener('mouseenter', function () { item.style.background = 'rgba(255,255,255,0.06)'; });
              item.addEventListener('mouseleave', function () { item.style.background = 'transparent'; });
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

      document.getElementById('createPage').addEventListener('change', function (event) {
        var checked = event.target.checked;
        setVisible('editableField', checked && !!state.tableName);
        setVisible('pageRouteField', checked && !!state.tableName);
        setVisible('templateField', checked && !!state.tableName);
        setVisible('columnOrderField', checked && !!state.tableName);
        updateGenerateButton();
      });

      generateBtn.addEventListener('click', async function () {
        hideStatus();
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
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
          showStatus('Files generated successfully.', 'success');
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

export const CodegenPageContent: React.FC<CodegenPageOptions> = ({
  title = 'Code Generator',
  description = 'Generate DataSource, types, store, and page files from database tables.',
  modules = DEFAULT_MODULES,
  subModules = DEFAULT_SUB_MODULES,
  tablesApiPath = '/api/codegen/tables',
  columnsApiPath = '/api/codegen/columns',
  generateApiPath = '/api/codegen/generate',
}) => {
  const labelStyle = { fontSize: '0.875rem', color: 'var(--text-muted)' };

  return (
    <div className="codegen-page" style={{ animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
      <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.5rem', fontWeight: 300, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
        {title}
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem' }}>{description}</p>

      <div style={{ background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', padding: '2rem', borderRadius: '12px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)' }}>
        <div id="codegen-status" role="status" style={{ display: 'none', marginBottom: '1rem', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.875rem' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Module</span>
            <select id="moduleCode" style={{ padding: '0.65rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.25)', color: 'var(--text-white)' }}>
              {modules.map((module) => (
                <option key={module.value} value={module.value}>
                  {module.label}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Sub Module</span>
            <select id="subModuleCode" style={{ padding: '0.65rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.25)', color: 'var(--text-white)' }}>
              {subModules.map((subModule) => (
                <option key={subModule.value} value={subModule.value}>
                  {subModule.label}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative' }}>
            <span style={labelStyle}>Table Name</span>
            <input
              id="tableSearch"
              type="text"
              placeholder="Search tables (min 2 chars)"
              autoComplete="off"
              style={{ padding: '0.65rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.25)', color: 'var(--text-white)' }}
            />
            <div
              id="tableResults"
              style={{ display: 'none', position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20, marginTop: '0.25rem', maxHeight: '220px', overflow: 'auto', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15,23,42,0.95)' }}
            />
          </label>

          <label id="schemaField" style={{ display: 'none', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={labelStyle}>Schema Name</span>
            <input
              id="schemaName"
              type="text"
              readOnly
              style={{ padding: '0.65rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.15)', color: 'var(--text-muted)' }}
            />
          </label>

          <label id="dsNameField" style={{ display: 'none', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={labelStyle}>Data Source Name</span>
            <input id="dsName" type="text" style={{ padding: '0.65rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.25)', color: 'var(--text-white)' }} />
          </label>

          <label id="createPageField" style={{ display: 'none', flexDirection: 'column', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <span style={labelStyle}>Create Page</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minHeight: '42px' }}>
              <input id="createPage" type="checkbox" defaultChecked />
              <span style={{ color: 'var(--text-white)', fontSize: '0.875rem' }}>Generate page files</span>
            </label>
          </label>

          <label id="editableField" style={{ display: 'none', flexDirection: 'column', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <span style={labelStyle}>Editable</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minHeight: '42px' }}>
              <input id="editable" type="checkbox" />
              <span style={{ color: 'var(--text-white)', fontSize: '0.875rem' }}>Allow editing records</span>
            </label>
          </label>

          <label id="pageRouteField" style={{ display: 'none', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={labelStyle}>Page Route Name</span>
            <input id="pageRouteName" type="text" style={{ padding: '0.65rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.25)', color: 'var(--text-white)' }} />
          </label>

          <label id="templateField" style={{ display: 'none', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 3' }}>
            <span style={labelStyle}>Template</span>
            <select id="template" defaultValue="page-layout" style={{ padding: '0.65rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.25)', color: 'var(--text-white)' }}>
              <option value="simple">Simple</option>
              <option value="page-layout">Page Layout - table with edit form</option>
              <option value="table-with-search">Table with Search - table only</option>
            </select>
          </label>

          <div id="pkField" style={{ display: 'none', gridColumn: 'span 3' }}>
            <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Primary Key Columns</span>
            <div id="pkColumns" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }} />
          </div>

          <div id="columnOrderField" style={{ display: 'none', gridColumn: 'span 3' }}>
            <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Column Order</span>
            <div id="columnOrderList" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button
            id="generateBtn"
            type="button"
            disabled
            style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', background: '#0ea5e9', color: 'white', fontWeight: 500, cursor: 'pointer', opacity: 0.5 }}
          >
            Generate
          </button>
        </div>

        <pre
          id="generatedFiles"
          style={{ display: 'none', marginTop: '1.5rem', color: '#a5f3fc', fontFamily: 'monospace', fontSize: '0.875rem', whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}
        />
      </div>

      <script dangerouslySetInnerHTML={{ __html: buildCodegenScript({ tablesApiPath, columnsApiPath, generateApiPath }) }} />
    </div>
  );
};

export function renderCodegenContentHtml(options: CodegenPageOptions = {}): string {
  return renderToStaticMarkup(<CodegenPageContent {...options} />);
}
