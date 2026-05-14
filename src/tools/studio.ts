/*
Copyright 2026 anonyme-afk

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import express from 'express';
import { createServer } from 'node:http';
import { resolve } from 'node:path';
import { promises as fs } from 'node:fs';
import { parseUniFile } from '../parser/uniParser.js';

export interface StudioOptions {
  port: number;
  entryFile: string;
}

const DEFAULT_CODE = `unistack app "MyApp" version 1.0 {
  config:
    port = 3000;

  html-ui:
    <div class="container">
      <h1>Hello, UniStack Studio</h1>
      <p>Edit this code on the left to see a live preview.</p>
    </div>;

  css:
    body { font-family: sans-serif; background: #f8fafc; }
    .container { max-width: 600px; margin: 80px auto; text-align: center; }
    h1 { color: #8b5cf6; }

  routes:
    GET /api/hello {
      return py:greet();
    }

  py-logic:
    def greet():
      return {"message": "Hello from Python!"}
}
`;

function buildStudioHtml(initialCode: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UniStack Studio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0b0f1a;
      --surface: #131929;
      --surface-2: #1e2d45;
      --border: #1e293b;
      --primary: #8b5cf6;
      --secondary: #38bdf8;
      --success: #34d399;
      --error: #f87171;
      --text: #f1f5f9;
      --text-dim: #64748b;
      --keyword: #c084fc;
      --string: #86efac;
      --number: #fcd34d;
      --section: #38bdf8;
    }

    body {
      font-family: 'Inter', sans-serif;
      background: var(--bg);
      color: var(--text);
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* --- Toolbar --- */
    .toolbar {
      height: 56px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      padding: 0 20px;
      gap: 16px;
      flex-shrink: 0;
    }

    .logo {
      font-size: 1.1rem;
      font-weight: 800;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.02em;
    }

    .toolbar-sep { flex: 1; }

    .file-label {
      font-size: 0.75rem;
      color: var(--text-dim);
      background: var(--surface-2);
      padding: 4px 12px;
      border-radius: 6px;
      border: 1px solid var(--border);
    }

    .btn {
      padding: 8px 18px;
      border-radius: 8px;
      border: none;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: var(--primary);
      color: white;
      box-shadow: 0 0 20px rgba(139,92,246,0.4);
    }

    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 0 30px rgba(139,92,246,0.6); }

    .btn-secondary {
      background: var(--surface-2);
      color: var(--text);
      border: 1px solid var(--border);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--text-dim);
      transition: background 0.3s;
    }
    .status-dot.ok { background: var(--success); box-shadow: 0 0 8px var(--success); }
    .status-dot.error { background: var(--error); box-shadow: 0 0 8px var(--error); }
    .status-dot.loading { background: var(--number); animation: pulse 1s infinite; }

    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

    .status-text { font-size: 0.75rem; color: var(--text-dim); }

    /* --- Main Layout --- */
    .main {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      overflow: hidden;
    }

    /* --- Editor Panel --- */
    .editor-panel {
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--border);
      background: var(--surface);
    }

    .panel-header {
      padding: 10px 16px;
      background: var(--surface-2);
      border-bottom: 1px solid var(--border);
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--text-dim);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .panel-header::before {
      content: '';
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--primary);
    }

    .editor-wrapper {
      flex: 1;
      display: flex;
      overflow: hidden;
      position: relative;
    }

    .line-numbers {
      padding: 16px 8px 16px 16px;
      background: transparent;
      color: var(--text-dim);
      font-family: 'Fira Code', monospace;
      font-size: 13px;
      line-height: 1.7;
      user-select: none;
      text-align: right;
      min-width: 48px;
      border-right: 1px solid var(--border);
      counter-reset: line;
      overflow: hidden;
    }

    textarea#editor {
      flex: 1;
      background: transparent;
      color: var(--section);
      border: none;
      padding: 16px;
      font-family: 'Fira Code', monospace;
      font-size: 13px;
      line-height: 1.7;
      outline: none;
      resize: none;
      tab-size: 2;
      caret-color: var(--primary);
      overflow-y: auto;
    }

    /* --- Diagnostics --- */
    .diagnostics {
      border-top: 1px solid var(--border);
      height: 100px;
      background: var(--bg);
      overflow-y: auto;
      padding: 8px 16px;
      font-family: 'Fira Code', monospace;
      font-size: 0.75rem;
      flex-shrink: 0;
    }

    .diag-item { color: var(--error); padding: 2px 0; }
    .diag-ok { color: var(--success); }

    /* --- AST Panel --- */
    .ast-panel {
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--border);
      overflow: hidden;
    }

    /* --- Preview Panel --- */
    .preview-panel {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .preview-panel iframe {
      flex: 1;
      border: none;
      background: white;
    }

    .ast-content {
      flex: 1;
      overflow: auto;
      padding: 16px;
      font-size: 0.75rem;
      font-family: 'Fira Code', monospace;
      color: var(--text-dim);
      line-height: 1.6;
    }

    .ast-section-node {
      background: var(--surface-2);
      border-left: 3px solid var(--primary);
      padding: 8px 12px;
      margin-bottom: 8px;
      border-radius: 0 6px 6px 0;
    }

    .ast-kind { color: var(--secondary); font-weight: 700; font-size: 0.7rem; text-transform: uppercase; }
    .ast-detail { color: var(--text-dim); font-size: 0.7rem; }

    .resizer {
      width: 4px;
      background: var(--border);
      cursor: col-resize;
      transition: background 0.2s;
    }
    .resizer:hover { background: var(--primary); }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--text-dim); }
  </style>
</head>
<body>
  <div class="toolbar">
    <div class="logo">UniStack Studio</div>
    <span class="file-label" id="fileLabel">src/app.uni</span>
    <div class="toolbar-sep"></div>
    <div class="status-dot" id="statusDot"></div>
    <span class="status-text" id="statusText">Ready</span>
    <button class="btn btn-secondary" onclick="resetCode()">Reset</button>
    <button class="btn btn-primary" onclick="runBuild()">Run &amp; Preview</button>
  </div>

  <div class="main" id="mainLayout">
    <!-- Editor -->
    <div class="editor-panel" style="display:flex; flex-direction:column; overflow:hidden;">
      <div class="panel-header">Editor — .uni</div>
      <div class="editor-wrapper">
        <div class="line-numbers" id="lineNumbers"></div>
        <textarea id="editor" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">${initialCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
      </div>
      <div class="diagnostics" id="diagnostics">
        <span class="diag-ok">No errors. Ready to build.</span>
      </div>
    </div>

    <!-- Preview + AST -->
    <div style="display:flex; flex-direction:column; overflow:hidden;">
      <div class="panel-header">Live Preview</div>
      <div style="flex:1; overflow:hidden; display:flex; flex-direction:column;">
        <div class="ast-content" id="astView">
          <p style="color:var(--text-dim)">Press "Run & Preview" to parse and visualize the AST.</p>
        </div>
      </div>
    </div>
  </div>

  <script>
    const editor = document.getElementById('editor');
    const lineNumbers = document.getElementById('lineNumbers');
    const diagnostics = document.getElementById('diagnostics');
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const astView = document.getElementById('astView');

    // --- Line numbers ---
    function updateLineNumbers() {
      const lines = editor.value.split('\\n').length;
      lineNumbers.innerHTML = Array.from({length: lines}, (_, i) => i + 1).join('\\n');
      lineNumbers.scrollTop = editor.scrollTop;
    }

    editor.addEventListener('input', updateLineNumbers);
    editor.addEventListener('scroll', () => { lineNumbers.scrollTop = editor.scrollTop; });
    editor.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 2;
        updateLineNumbers();
      }
    });

    updateLineNumbers();

    // --- Set status ---
    function setStatus(state, msg) {
      statusDot.className = 'status-dot ' + state;
      statusText.textContent = msg;
    }

    // --- Reset ---
    async function resetCode() {
      const res = await fetch('/api/default-code');
      const data = await res.json();
      editor.value = data.code;
      updateLineNumbers();
      diagnostics.innerHTML = '<span class="diag-ok">Code reset to default.</span>';
    }

    // --- Run Build ---
    async function runBuild() {
      setStatus('loading', 'Parsing...');
      diagnostics.innerHTML = '';

      const code = editor.value;

      try {
        const res = await fetch('/api/parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });

        const data = await res.json();

        if (data.error) {
          setStatus('error', 'Parse error');
          diagnostics.innerHTML = '<span class="diag-item">ERROR: ' + escapeHtml(data.error) + '</span>';
          return;
        }

        // Save code
        await fetch('/api/code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });

        setStatus('ok', 'Parsed successfully');
        diagnostics.innerHTML = '<span class="diag-ok">Parse OK — ' + data.sections.length + ' sections found, ' + code.length + ' bytes.</span>';
        renderAst(data);

      } catch (err) {
        setStatus('error', 'Error');
        diagnostics.innerHTML = '<span class="diag-item">ERROR: ' + err.message + '</span>';
      }
    }

    // --- Render AST ---
    function renderAst(data) {
      const sectionColors = {
        config: '#fcd34d', html: '#f472b6', css: '#a78bfa',
        py: '#4ade80', js: '#fb923c', routes: '#38bdf8',
        db: '#e879f9', imports: '#94a3b8', env: '#f59e0b',
        middleware: '#06b6d4', default: '#8b5cf6'
      };

      let html = '<div style="margin-bottom:12px; color:var(--secondary); font-weight:700;">';
      html += 'App: ' + escapeHtml(data.name) + ' v' + escapeHtml(data.version);
      html += ' <span style="color:var(--text-dim); font-weight:400;">(' + data.sections.length + ' sections)</span></div>';

      for (const section of data.sections) {
        const color = sectionColors[section.kind] || sectionColors.default;
        html += '<div class="ast-section-node" style="border-left-color:' + color + '">';
        html += '<div class="ast-kind" style="color:' + color + '">' + section.kind + '</div>';
        html += '<div class="ast-detail">' + getSectionDetail(section) + '</div>';
        html += '</div>';
      }

      astView.innerHTML = html;
    }

    function getSectionDetail(section) {
      if (section.kind === 'config' && section.entries) {
        return section.entries.map(e => escapeHtml(e.key) + ' = ' + escapeHtml(String(e.value?.value ?? ''))).join(', ');
      }
      if (section.kind === 'routes' && section.routes) {
        return section.routes.map(r => r.method + ' ' + escapeHtml(r.path)).join(', ');
      }
      if (section.kind === 'py' && section.chunks) {
        const lines = (section.chunks[0]?.code || '').split('\\n').filter(l => l.match(/^def /)).map(l => l.trim());
        return lines.length ? 'Functions: ' + lines.map(l => escapeHtml(l.replace('def ', '').replace(':', ''))).join(', ') : 'Python code block';
      }
      if (section.kind === 'db' && section.tables) {
        return 'Tables: ' + section.tables.map(t => escapeHtml(t.name)).join(', ');
      }
      if (section.kind === 'html') return 'HTML UI block';
      if (section.kind === 'css') return 'CSS block';
      return JSON.stringify(section).slice(0, 80) + '...';
    }

    function escapeHtml(s) {
      return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    // Auto-save on Ctrl+S / Cmd+S
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        runBuild();
      }
    });
  </script>
</body>
</html>`;
}

/**
 * UniStack Studio - Interactive Live Preview Environment
 */
export async function startStudio(options: StudioOptions): Promise<void> {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: '5mb' }));

  // Endpoint to get current file content
  app.get('/api/code', async (req, res) => {
    try {
      const content = await fs.readFile(options.entryFile, 'utf8');
      res.json({ code: content });
    } catch {
      res.json({ code: DEFAULT_CODE });
    }
  });

  // Endpoint to get default code
  app.get('/api/default-code', (req, res) => {
    res.json({ code: DEFAULT_CODE });
  });

  // Endpoint to save current code
  app.post('/api/code', async (req, res) => {
    const { code } = req.body;
    try {
      await fs.writeFile(options.entryFile, code, 'utf8');
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Endpoint to parse and return the AST
  app.post('/api/parse', async (req, res) => {
    const { code } = req.body;
    try {
      const ast = parseUniFile(code, 'studio.uni');
      res.json({
        name: ast.name,
        version: ast.version,
        sections: ast.sections.map(s => ({ ...s }))
      });
    } catch (err) {
      res.json({ error: (err as Error).message });
    }
  });

  // Serve the Studio UI
  app.get('/', async (req, res) => {
    let initialCode = DEFAULT_CODE;
    try {
      initialCode = await fs.readFile(options.entryFile, 'utf8');
    } catch {}
    res.send(buildStudioHtml(initialCode));
  });

  server.listen(options.port, () => {
    console.log(`UniStack Studio running at http://localhost:${options.port}`);
    console.log(`Editing: ${resolve(options.entryFile)}`);
  });
}
