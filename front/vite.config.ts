import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import { nodePolyfills } from "vite-plugin-node-polyfills";

const resolvePath = (p: string) => path.resolve(__dirname, p);

export default defineConfig({
    plugins: [react(), svgr(), nodePolyfills()],
    resolve: {
        alias: {
            "@shared": resolvePath("./src/shared"),
            "@app": resolvePath("./src/app"),
            "@features": resolvePath("./src/features"),
            "@widgets": resolvePath("./src/widgets"),
            "@entities": resolvePath("./src/entities"),
            "@pages": resolvePath("./src/pages")
        }
    }
});
