/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F28A43',
          hover: '#E07730',
          light: '#FDF3ED',
        },
        secondary: {
          DEFAULT: '#76D1C4',
          hover: '#5CBFB2',
          light: '#E6FAF7',
        },
        dark: '#1F2937',
        light: '#F9FAFB',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        logo: ['Fredoka', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.08)',
        'float': '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
        'qobo': '0 18px 45px -24px rgba(17, 24, 39, 0.28)',
        'orange': '0 16px 32px -16px rgba(242, 138, 67, 0.65)',
        'orange-soft': '0 14px 28px -20px rgba(242, 138, 67, 0.75)',
      },
      backgroundImage: {
        'qobo-gradient': 'linear-gradient(135deg, #F28A43 0%, #76D1C4 100%)',
        'qobo-light': 'linear-gradient(135deg, #FDF3ED 0%, #E6FAF7 100%)',
      }
    }
  },
  plugins: []
};
