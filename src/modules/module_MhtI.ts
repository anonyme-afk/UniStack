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

/**
 * ui-engine.ts – "Beauty Injector" for UniStack
 *
 * Injects a default design system into generated HTML/CSS so that
 * even inexperienced developers produce visually pleasing applications.
 *
 * The design rules are based on a mathematical spacing scale, accessible
 * typography, and automatic dark/light theme switching.
 */

export class UIEngine {
  /**
   * Given a block of HTML, return a version that includes the default
   * design system (stylesheet link and theme script).
   */
  static injectDesign(html: string): string {
    const link = '<link rel="stylesheet" href="assets/base.css">';
    const themeScript = `
<script>
// simple dark/light toggler based on prefers-color-scheme
(function(){
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
})();
</script>
`;
    // if the HTML already has a <head> tag, insert there; otherwise prepend
    if (/<head[^>]*>/i.test(html)) {
      return html.replace(/(<head[^>]*>)/i, `$1\n    ${link}${themeScript}`);
    }
    return link + themeScript + html;
  }

  /**
   * Return default CSS rules for the design system.
   */
  static defaultCss(): string {
    return `
:root {
  --spacing-base: 8px;
  --font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
[data-theme="dark"] {
  --bg: #121212;
  --fg: #f0f0f0;
}
[data-theme="light"] {
  --bg: #ffffff;
  --fg: #000000;
}
body {
  margin:0;
  padding:0;
  font-family: var(--font-family);
  background: var(--bg);
  color: var(--fg);
}
.container { padding: calc(var(--spacing-base) * 2); }
`;
  }
}