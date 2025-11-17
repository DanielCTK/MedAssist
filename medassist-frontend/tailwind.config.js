/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    // Thêm dòng này để quét tất cả các file .jsx trong thư mục src
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      // (Tùy chọn) Bạn có thể thêm font 'Inter' vào đây sau nếu muốn
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        Open_Sans: ['"Open Sans"','sans-serif']
      },
    },
  },
  plugins: [],
}
