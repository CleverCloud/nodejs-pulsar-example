module.exports = {
  purge: [
    './public/**/*.html',
    './assets/**/*.js',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
        colors: {
            clever: {
                '500': '#DE233C',
                '600': '#CB1C42',
                '700': '#A51050',
            },
        },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
