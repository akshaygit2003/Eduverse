import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  
  const processEnvValues = {
    "process.env.NODE_ENV": JSON.stringify(mode),
    "process.env.REACT_APP_BASE_URL": JSON.stringify(
      env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1"
    ),
  };

  Object.keys(env).forEach((key) => {
    if ((key.startsWith("REACT_APP_") || key.startsWith("VITE_")) && /^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
      processEnvValues[`process.env.${key}`] = JSON.stringify(env[key]);
    }
  });

  return {
    plugins: [react()],
    define: processEnvValues,
    server: {
      port: 3000,
      host: true,
    },
    build: {
      outDir: "build",
    },
    esbuild: {
      loader: "jsx",
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
      },
    },
  };
});
