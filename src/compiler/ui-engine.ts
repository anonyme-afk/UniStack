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
  static runtimeScriptTag(): string {
    return `
<script>
(function(){
  const key = 'unistack-theme';
  const root = document.documentElement;
  let saved = null;
  try { saved = localStorage.getItem(key); } catch {}
  const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved === 'dark' || saved === 'light' ? saved : (systemDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);

  function setTheme(next){
    const value = next === 'dark' ? 'dark' : 'light';
    root.setAttribute('data-theme', value);
    try { localStorage.setItem(key, value); } catch {}
  }

  window.UniStackTheme = {
    get: function(){ return root.getAttribute('data-theme') || 'light'; },
    set: setTheme,
    toggle: function(){ setTheme(this.get() === 'dark' ? 'light' : 'dark'); }
  };

  function applyAnimationDirectives(){
    const animated = document.querySelectorAll('[uni-animate]');
    for (const el of animated) {
      const name = String(el.getAttribute('uni-animate') || '').trim();
      if (!name) continue;
      el.classList.add('uni-anim-' + name);
    }

    const scrollTargets = document.querySelectorAll('[on\\\\:scroll-visible]');
    if (scrollTargets.length === 0) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    for (const el of scrollTargets) {
      const name = String(el.getAttribute('on:scroll-visible') || 'reveal').trim();
      el.classList.add('uni-scroll-pending', 'uni-anim-' + name);
      el.setAttribute('data-uni-scroll', name);
      if (reduce) {
        el.classList.add('uni-inview');
      }
    }
    if (reduce || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('uni-inview');
        io.unobserve(entry.target);
      }
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    for (const el of scrollTargets) io.observe(el);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAnimationDirectives, { once: true });
  } else {
    applyAnimationDirectives();
  }

  window.UniStackViewTransition = function(callback){
    if (document.startViewTransition) {
      return document.startViewTransition(function(){ return callback && callback(); });
    }
    if (callback) callback();
    return null;
  };
})();
</script>
`;
  }

  /**
   * Given a block of HTML, return a version that includes the default
   * design system (stylesheet link and theme script).
   */
  static injectDesign(html: string): string {
    const link = '<link rel="stylesheet" href="assets/base.css">';
    const runtimeScript = UIEngine.runtimeScriptTag();
    // if the HTML already has a <head> tag, insert there; otherwise prepend
    if (/<head[^>]*>/i.test(html)) {
      return html.replace(/(<head[^>]*>)/i, `$1\n    ${link}${runtimeScript}`);
    }
    return link + runtimeScript + html;
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
html {
  scroll-behavior: smooth;
  overscroll-behavior-y: contain;
}
[data-theme="dark"] {
  --bg: #121212;
  --fg: #f0f0f0;
  --panel: #1b1b22;
}
[data-theme="light"] {
  --bg: #ffffff;
  --fg: #000000;
  --panel: #f5f7fb;
}
body {
  margin: 0;
  padding: 0;
  font-family: var(--font-family);
  background: var(--bg);
  color: var(--fg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
a, button, .card, .u-card, .u-card-feature, .primary, .u-button, .u-button-primary {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.uni-anim-float {
  animation: uniFloat 7s ease-in-out infinite alternate;
  will-change: transform;
}
.uni-anim-reveal {
  animation: uniReveal 700ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.uni-anim-pulse {
  animation: uniPulse 1400ms ease-in-out infinite alternate;
}
.uni-scroll-pending {
  opacity: 0;
  transform: translateY(22px);
}
.uni-scroll-pending.uni-inview {
  opacity: 1;
  transform: translateY(0);
}
.orb-a {
  animation: uniFloatSlowA 15s infinite alternate ease-in-out;
}
.orb-b {
  animation: uniFloatSlowB 20s infinite alternate ease-in-out;
  animation-delay: -2s;
}
.u-card-feature {
  animation: uniReveal 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.u-card-feature:nth-child(1) { animation-delay: 0.1s; }
.u-card-feature:nth-child(2) { animation-delay: 0.2s; }
.u-card-feature:nth-child(3) { animation-delay: 0.3s; }
@keyframes uniFloat {
  0% { transform: translateY(0); }
  100% { transform: translateY(-20px); }
}
@keyframes uniReveal {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes uniPulse {
  0% { transform: scale(1); opacity: 0.55; }
  100% { transform: scale(1.05); opacity: 0.9; }
}
@keyframes uniFloatSlowA {
  from { transform: translate(0, 0) rotate(0deg); }
  to { transform: translate(40px, 60px) rotate(10deg); }
}
@keyframes uniFloatSlowB {
  from { transform: translate(0, 0) rotate(0deg); }
  to { transform: translate(-36px, 48px) rotate(-8deg); }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
.container { padding: calc(var(--spacing-base) * 2); }
`;
  }
}
