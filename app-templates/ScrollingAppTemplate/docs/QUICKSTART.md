# Quick Start Guide

Get up and running with the Scrolling App Template in 5 minutes.

## Step 1: Copy the Template

Copy the entire `ScrollingAppTemplate` folder to your project directory or use it as a starting point for a new project.

## Step 2: Install Dependencies

```bash
cd ScrollingAppTemplate
npm install
# or
pnpm install
```

## Step 3: Set Up Your Project Structure

Create your main source folder:

```bash
mkdir -p src/i18n
```

## Step 4: Set Up i18n

Copy the i18n setup:

```bash
cp i18n.setup.example.ts src/i18n/index.ts
```

Update the import path in `src/i18n/index.ts`:

```typescript
import enCommon from '../locales/en/common.json';
// Change to:
import enCommon from '../../locales/en/common.json';
```

## Step 5: Create Your Main Entry Point

Create `src/main.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## Step 6: Create Your App

Copy the example app:

```bash
cp examples/App.example.tsx src/App.tsx
```

Update the imports in `src/App.tsx` to point to the template folder:

```tsx
import { ThemeProvider } from '../context';
import { Navigation, Section, ScrollProgress } from '../components';
import '../styles/scrolling.css';
import '../styles/theme.css';
```

## Step 7: Create Your Entry HTML

Create `index.html` in the root:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Scrolling App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## Step 8: Create Your Main CSS

Create `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Step 9: Update Vite Config (if needed)

Create `vite.config.ts` in the root:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

## Step 10: Start Development

```bash
npm run dev
```

Visit `http://localhost:5173` to see your app!

## Next Steps

1. **Customize Theme**: Edit `config/theme.ts`
2. **Add Sections**: Modify `src/App.tsx` to add your content
3. **Update Navigation**: Edit `config/navigation.ts`
4. **Add Translations**: Update `locales/en/common.json`
5. **Read the README**: Check `README.md` for full documentation

## Troubleshooting

### Import Errors

If you see import errors, check that your file paths are correct relative to the template folder structure.

### TypeScript Errors

Run type checking:

```bash
npm run type-check
```

### Styling Issues

Make sure you're importing the CSS files in the correct order:
1. Tailwind base styles
2. `scrolling.css`
3. `theme.css`

### i18n Not Working

Ensure you're importing `./i18n` in your `main.tsx` before rendering the app.

---

**You're all set!** Start building your scrolling app. 🚀
