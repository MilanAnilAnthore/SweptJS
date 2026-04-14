import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import webExtension from 'vite-plugin-web-extension';

export default defineConfig({
    publicDir: 'public',
    plugins: [
        svelte(),
        webExtension({
            manifest: 'manifest.json',
        }),
    ],
});
