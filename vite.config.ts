import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [react(),
  VitePWA({
    registerType: 'autoUpdate', manifest: {
      name: "Uploadify",
      short_name: "Uploadify",
      start_url: "/",
      display: "standalone",
      background_color: "#09090b",
      lang: "en",
      scope: "/"
    }
  })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
