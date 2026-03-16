# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Features

### Offline Queue
The Web Client includes a robust, automated Offline Order Queue system that ensures users never lose an order due to network instability.

**How it works:**
1. **Network Failure Interception**: When a user clicks "Place Grand Order", the application attempts to send the order to the backend API. If the request fails specifically due to a network connectivity issue (not an intentional API validation rejection), the system intercepts the error.
2. **Local Storage Persistence**: Instead of discarding the order, the system packages the order data along with a unique identifier and timestamp, then saves it to the browser's `localStorage`. This ensures the order is safely preserved even if the user closes the tab or restarts their browser.
3. **Online Event Listener**: The application actively listens for the browser's native `online` event (which fires when the device reconnects to a network).
4. **Background Processing**: As soon as the connection is restored, the Offline Queue service automatically triggers a retry for all pending orders in the background.
5. **Seamless Real-time Handoff**: When a queued order is successfully sent to the server, the service triggers an event. If the user is currently viewing the Cart, the UI intercepts this event and automatically establishes a WebSocket subscription for that specific order. The cart transitions back into its "Waiting" state, offering the exact same real-time feedback experience as a standard, online order.
6. **Queue Cleanup**: Upon a successful API submission, the order is permanently removed from `localStorage` to prevent duplication. If an order encounters an actual API error during the retry (e.g., an item went out of stock while the user was offline), the queue handles it gracefully without getting stuck.
