/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    colors: {
      background: "#f8fafc",        // Fondo muy claro, casi blanco
      primary: "#2563eb",           // Azul vibrante para acciones principales
      "primary-hover": "#1e40af",   // Azul oscuro para hover principal
      secondary: "#059669",         // Verde para confirmaciones
      "secondary-hover": "#047857", // Hover de secundario
      warning: "#d97706",           // Naranja para alertas
      error: "#dc2626",             // Rojo para errores
      "text-primary": "#111827",    // Texto principal
      "text-secondary": "#6b7280",  // Texto secundario
      border: "#e5e7eb",            // Bordes suaves
      info: "#3b82f6",              // Azul claro para info y enlaces
      white: "#ffffff",             // Blanco para textos y fondos claros
    },
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
};
