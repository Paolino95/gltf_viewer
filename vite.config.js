import { defineConfig } from 'vite';
import path from 'path';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
    server: {
        https: true,
    },
    plugins: [mkcert()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    base: '',
});
