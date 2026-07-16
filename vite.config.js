import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        compiler: resolve(__dirname, 'compiler.html'),
        python: resolve(__dirname, 'python-tutorial.html'),
        cpp: resolve(__dirname, 'cpp-tutorial.html'),
        java: resolve(__dirname, 'java-tutorial.html'),
        vhdl: resolve(__dirname, 'vhdl-tutorial.html')
      }
    }
  }
});
