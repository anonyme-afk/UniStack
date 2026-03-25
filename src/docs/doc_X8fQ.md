<!--
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
-->

# UniStack Design System

## Overview

Every UniStack application automatically includes a modern, responsive CSS design system that provides beautiful default styling out of the box. The `base.css` design system is automatically injected into generated HTML files and includes:

- **CSS Custom Properties** for theming and consistency
- **Responsive Grid Layout** (container, row, col classes)
- **Component Classes** (buttons, cards, alerts, forms, tables, navigation)
- **Utility Classes** for spacing, text, and layout
- **Smooth Animations** (fadeIn, slideIn transitions)
- **Mobile Responsive** with automatic breakpoint handling

## Quick Start

Simply use the design system classes in your HTML:

```uni
unistack app "MyApp" version 1.0 {
  html:
    <div class="container">
      <header class="navbar">
        <h1>Welcome</h1>
      </header>
      
      <main>
        <section class="card">
          <h2>Featured Content</h2>
          <p>This card already looks beautiful with base.css</p>
          <button class="btn-primary">Learn More</button>
        </section>
      </main>
    </div>
  
  routes:
    GET / { return py:home; }
}
```

## CSS Variables (Theming)

The design system uses CSS custom properties for easy customization:

```css
--primary: #20b7e8        /* Primary brand color */
--secondary: #333         /* Secondary color */
--danger: #f00            /* Alert/danger color */
--success: #4ade80        /* Success color */
--shadow: 0 2px 8px rgba(0,0,0,0.1)
--shadow-lg: 0 4px 16px rgba(0,0,0,0.2)
--transition: all 0.3s ease
```

Override in your own CSS:

```css
:root {
  --primary: #ff6b35;     /* Custom brand color */
  --shadow-lg: 0 8px 20px rgba(0,0,0,0.3);
}
```

## Component Classes

### Buttons

```html
<button class="btn-primary">Primary</button>
<button class="btn-success">Success</button>
<button class="btn-danger">Delete</button>
```

Features:
- Padding and border-radius built-in
- Hover effects with dark overlay
- Smooth transitions on all states
- Disabled state support

### Cards

```html
<div class="card">
  <h2>Card Title</h2>
  <p>Card content goes here</p>
</div>
```

Features:
- White background (dark theme friendly)
- Subtle shadow
- Hover lift effect (translateY -2px)
- Smooth transitions

### Alerts

```html
<div class="alert-primary">Information message</div>
<div class="alert-success">Success message</div>
<div class="alert-danger">Error message</div>
```

Features:
- Colored left border
- Appropriate text coloring
- Padding for readability
- Semantic color coding

### Forms

```html
<input type="text" placeholder="Name" />
<textarea placeholder="Message"></textarea>
<select>
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

Features:
- Full-width by default
- Consistent padding
- Focus states with color change
- Smooth transitions
- Dark border on focus

### Tables

```html
<table>
  <thead>
    <tr>
      <th>Column 1</th>
      <th>Column 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
```

Features:
- Subtle alternating row colors
- Hover highlighting on rows
- Centered header text
- Clear spacing

### Navigation

```html
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>
```

Features:
- Flex layout (horizontal by default)
- Smooth color transitions
- Active state support (add `.active` class)

## Layout System

### Container

```html
<div class="container">
  <!-- Content is centered with max-width 1200px -->
</div>
```

### Grid (Row/Col)

```html
<div class="row">
  <div class="col">Column 1</div>
  <div class="col">Column 2</div>
  <div class="col">Column 3</div>
</div>
```

Features:
- Flexbox-based layout
- Automatic wrapping
- Equal width columns
- 16px gap between columns
- Responsive on mobile (full width)

## Utility Classes

### Spacing

```html
<!-- Margins top (mt), bottom (mb), horizontal (mx), vertical (my) -->
<p class="mt-1">Small top margin</p>
<p class="mb-2">Medium bottom margin</p>
<p class="mt-3">Large top margin</p>

<!-- Padding follows same pattern: pt, pb, px, py -->
<div class="px-2">Horizontal padding</div>
```

Sizes: 1 (4px), 2 (8px), 3 (16px)

### Text Alignment & Styling

```html
<p class="text-center">Centered text</p>
<p class="text-right">Right-aligned text</p>
<p class="text-lg">Larger text</p>
<p class="text-sm">Smaller text</p>
```

### Display & Flexbox

```html
<div class="d-flex">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<div class="d-grid">Grid layout</div>
```

### Gaps

```html
<!-- Control spacing between flex items -->
<div class="d-flex gap-1">
  <button>Button 1</button>
  <button>Button 2</button>
</div>
```

## Animations

### FadeIn

```css
animation: fadeIn 0.3s ease-in;
```

Built-in fadeIn animation for smooth appearance transitions.

### SlideIn

```css
animation: slideIn 0.3s ease-out;
```

SlideIn animation that combines vertical translation with fade effect.

## Responsive Design

The design system automatically adapts to mobile devices with a breakpoint at **768px**:

- **Mobile (< 768px)**
  - Full-width containers
  - Stacked columns and rows
  - Single-column grid layout
  - Smaller padding/margins
  
- **Desktop (≥ 768px)**
  - Constrained container width (1200px)
  - Multi-column layouts supported
  - Full spacing values

## Dark Mode Support

The design system is dark-theme ready. Colors are chosen for good contrast and visibility:

- Light text on dark backgrounds
- Subtle shadows
- Color-coded alerts
- Accessible color contrast ratios

## Integration

The `base.css` design system is **automatically injected** into every generated `.html` file:

```html
<link rel="stylesheet" href="/assets/base.css" />
```

The CSS file is copied to the `dist/assets/` directory during the build process.

## Customization

To override the design system, add your own CSS in your UniStack file:

```uni
unistack app "MyApp" version 1.0 {
  style:
    :root {
      --primary: #my-color;
    }
    .btn-primary {
      font-weight: bold;
    }
  
  html:
    <button class="btn-primary">Custom Button</button>
}
```

Your custom CSS will be appended after `base.css`, allowing you to override any defaults.

## Performance

- **~300 lines of CSS** covering all components
- Minimal specificity to allow easy overrides
- CSS custom properties for theme consistency
- No dependencies or external libraries
- Inline stylesheet in HTML for critical CSS
- Asset link for additional optimization

## Complete CSS Variable Reference

```css
--primary: #20b7e8         /* Main brand color */
--secondary: #333          /* Secondary text/borders */
--danger: #f00             /* Error/delete actions */
--success: #4ade80         /* Success messages */
--shadow: 0 2px 8px rgba(0,0,0,0.1)
--shadow-lg: 0 4px 16px rgba(0,0,0,0.2)
--transition: all 0.3s ease
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid support required
- Flexbox support required
- CSS Custom Properties support required
- Graceful degradation for older browsers

## See Also

- [GUIDE_COMPLET.md](GUIDE_COMPLET.md) - Full language guide
- [DATA_ABSTRACTION.md](DATA_ABSTRACTION.md) - SQL query building
- [WASM_GUIDE.md](WASM_GUIDE.md) - WebAssembly compilation
