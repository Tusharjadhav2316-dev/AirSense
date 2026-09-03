import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Expose both standard VITE_ prefixes and BACKEND_ / API_ prefixes
    envPrefix: ['VITE_', 'BACKEND_', 'API_'],
    define: {
      'import.meta.env.BACKEND_URL': JSON.stringify(env.BACKEND_URL || process.env.BACKEND_URL || ''),
      'import.meta.env.API_URL': JSON.stringify(env.API_URL || process.env.API_URL || ''),
    },
  };
});
