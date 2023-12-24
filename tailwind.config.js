/** @type {import("tailwindcss").Config} */

export default {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{vue,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        sm: ["0.875rem", "1.25rem"],
        base: ["1rem", "1.5rem"],
        lg: ["1.125rem", "1.75rem"],
        xl: ["1.25rem", "1.75rem"],
        "2xl": ["1.5rem", "2rem"],
        "3xl": ["1.875rem", "2.25rem"],
        "4xl": ["2.25rem", "2.5rem"],
        "5xl": ["3rem", "1"],
      },
      spacing: {
        px: "1px",
        0: "0",
        1: "0.25rem",
        2: "0.5rem",
        3: "0.75rem",
        4: "1rem",
        4.5: "1.125rem",
        5: "1.25rem",
        6: "1.5rem",
        8: "2rem",
        10: "2.5rem",
        12: "3rem",
        16: "4rem",
        18: "4.5rem",
        20: "5rem",
        22: "5.5rem",
        24: "6rem",
        32: "8rem",
        40: "10rem",
        48: "12rem",
        56: "14rem",
        64: "16rem",
      },
      colors: {
        "files-bg": "var(--files-bg)",
        "files-b": "var(--files-b)",
        "files-tab-ia": "var(--files-tab-ia)",
        "files-tab-bb": "var(--files-tab-bb)",
        "files-tab-bg": "var(--files-tab-bg)",
        "files-slider-bg": "var(--files-slider-bg)",
        "file-select": "var(--file-select)",
        "file-hover": "var(--file-hover)",
        "form-bt": "var(--form-bt)",
        "form-inner": "var(--form-inner)",
        "form-bb": "var(--form-bb)",
        "image-bg": "var(--image-bg)",
        "image-status-bar-bg": "var(--image-status-bar-bg)",
        "image-logo-bg": "var(--image-logo-bg)",
        "image-logo-a-bg": "var(--image-logo-a-bg)",
        "image-btn-hover": "var(--image-btn-hover)",
        "image-preview-item-bg": "var(--image-preview-item-bg)",
        "image-preview-item-hover-bg": "var(--image-preview-item-hover-bg)",
        "highlight": "var(--highlight)",
        "highlight-hover": "var(--highlight-hover)",
        "default": "var(--default)",
        "invert": "var(--invert)",
        "title": "var(--title)",
        "inactive": "var(--inactive)",
        "icon-inactive": "var(--icon-inactive)",
        "image-preview-bg": "var(--image-preview-bg)",
        "danger": "var(--danger)",
      },
    },
  },
  plugins: [],
};
