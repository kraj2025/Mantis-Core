// vite.config.js
import { defineConfig, loadEnv } from "file:///C:/Users/Admin/Desktop/Shareable/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Admin/Desktop/Shareable/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\Admin\\Desktop\\Shareable";
var vite_config_default = ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    mode: "development",
    plugins: [react()],
    resolve: {
      alias: {
        "@app": path.resolve(__vite_injected_original_dirname, "./src"),
        "@store": path.resolve(__vite_injected_original_dirname, "./src/store"),
        "@components": path.resolve(__vite_injected_original_dirname, "./src/components"),
        "@modules": path.resolve(__vite_injected_original_dirname, "./src/modules"),
        "@pages": path.resolve(__vite_injected_original_dirname, "./src/pages")
      }
    },
    server: {
      proxy: {
        "/CRMCOREAPI": {
          target: process.env.VITE_APP_REACT_APP_BASE_URL,
          changeOrigin: true,
          secure: false,
        },
        // "/CRMCOREAPI": {
        //   target: process.env.VITE_APP_REACT_APP_BASE_URL,
        //   changeOrigin: true,
        //   secure: false,
        // },
      }
    }
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxBZG1pblxcXFxEZXNrdG9wXFxcXFNoYXJlYWJsZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQWRtaW5cXFxcRGVza3RvcFxcXFxTaGFyZWFibGVcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0FkbWluL0Rlc2t0b3AvU2hhcmVhYmxlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHsgbW9kZSB9KSA9PiB7XHJcbiAgcHJvY2Vzcy5lbnYgPSB7IC4uLnByb2Nlc3MuZW52LCAuLi5sb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCkpIH07XHJcblxyXG4gIHJldHVybiBkZWZpbmVDb25maWcoe1xyXG4gICAgbW9kZTogXCJkZXZlbG9wbWVudFwiLFxyXG4gICAgcGx1Z2luczogW3JlYWN0KCldLFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBhbGlhczoge1xyXG4gICAgICAgIFwiQGFwcFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxyXG4gICAgICAgIFwiQHN0b3JlXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmMvc3RvcmVcIiksXHJcbiAgICAgICAgXCJAY29tcG9uZW50c1wiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjL2NvbXBvbmVudHNcIiksXHJcbiAgICAgICAgXCJAbW9kdWxlc1wiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjL21vZHVsZXNcIiksXHJcbiAgICAgICAgXCJAcGFnZXNcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy9wYWdlc1wiKSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgcHJveHk6IHtcclxuICAgICAgICAvLyBcIi9DUk1DT1JFQVBJXCI6IHtcclxuICAgICAgICAvLyAgIHRhcmdldDogcHJvY2Vzcy5lbnYuVklURV9BUFBfUkVBQ1RfQVBQX0JBU0VfVVJMLFxyXG4gICAgICAgIC8vICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIC8vICAgc2VjdXJlOiBmYWxzZSxcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIC8vIFwiL0NSTUNPUkVBUElcIjoge1xyXG4gICAgICAgIC8vICAgdGFyZ2V0OiBwcm9jZXNzLmVudi5WSVRFX0FQUF9SRUFDVF9BUFBfQkFTRV9VUkwsXHJcbiAgICAgICAgLy8gICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgLy8gICBzZWN1cmU6IGZhbHNlLFxyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0pO1xyXG59O1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRSLFNBQVMsY0FBYyxlQUFlO0FBQ2xVLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFGakIsSUFBTSxtQ0FBbUM7QUFJekMsSUFBTyxzQkFBUSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQzNCLFVBQVEsTUFBTSxFQUFFLEdBQUcsUUFBUSxLQUFLLEdBQUcsUUFBUSxNQUFNLFFBQVEsSUFBSSxDQUFDLEVBQUU7QUFFaEUsU0FBTyxhQUFhO0FBQUEsSUFDbEIsTUFBTTtBQUFBLElBQ04sU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLElBQ2pCLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLFFBQVEsS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxRQUN2QyxVQUFVLEtBQUssUUFBUSxrQ0FBVyxhQUFhO0FBQUEsUUFDL0MsZUFBZSxLQUFLLFFBQVEsa0NBQVcsa0JBQWtCO0FBQUEsUUFDekQsWUFBWSxLQUFLLFFBQVEsa0NBQVcsZUFBZTtBQUFBLFFBQ25ELFVBQVUsS0FBSyxRQUFRLGtDQUFXLGFBQWE7QUFBQSxNQUNqRDtBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLE9BQU87QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BV1A7QUFBQSxJQUNGO0FBQUEsRUFDRixDQUFDO0FBQ0g7IiwKICAibmFtZXMiOiBbXQp9Cg==
