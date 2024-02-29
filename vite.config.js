import { defineConfig } from 'vite';
import path from 'path';
import mkcert from'vite-plugin-mkcert';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    server: {
        https: true
    },
    plugins: [vue(), mkcert()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    base: '',
});
