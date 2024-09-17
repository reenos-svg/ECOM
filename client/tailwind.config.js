/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        flip: {
          "0%": { transform: "perspective(400px) rotateY(0deg)" },
          "50%": { transform: "perspective(400px) rotateY(180deg)" },
          "100%": { transform: "perspective(400px) rotateY(360deg)" },
        },
        "slide-in": {
          from: {
            transform: "translateX(-200%)",
          },
          to: {
            transform: "translateX(0)",
          },
        },
        "slide-out": {
          from: {
            transform: "translateX(0)",
          },
          to: {
            transform: "translateX(-200%)",
          },
        },  
      },
      animation: {
        flip: "flip 2s infinite",
      },
      fontFamily: {
        ubuntu: ["Ubuntu", "sans-serif"],
      },
      borderColor: {
        "tab-bg-color": "#6357de",
        disabled: "#C3AEAE",
        success: "#10CE66",
        "table-card-border": "#86816D",
        "dark-purple": "#6357DE",
      },
      textColor: {
        "tab-text-color": "#6357de",
        RoyalBlue: "#6357de",
        "isRequired-color": "#FF3A51",
        desc: "#6F6767",
        success: "#91E6B6",
        "table-headers": "#A4A4A4",
        "btn-text": "#6357DE",
        "light-purple": "#EFEEFC",
      },
      backgroundColor: {
        success: "#cbf1da",
        "success-grn": "#10CE66",
        "table-card-bg": "#EFEEFC",
        "grey-bg": "#DBDBDB",
        "nav-color": "#F5F5F5",
        "sec-grey": "#CFCFCF",
        "chat-bg": "#E4DCD3",
        "dark-purple": "#6357DE",
        "light-purple": "#EFEEFC",
        "light-green": "#A7DAB5",
        "dark-yellow": "#FFDD5A",
        "light-blue": "#B2DEF8",
        MustardYellow: "#FFDD5A",
      },
    },
  },
  plugins: [],
};
