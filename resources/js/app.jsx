
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Enable real-time updates only when Reverb is configured.
// Temporarily disable Reverb while developing login and registration.
window.Echo = null;

createInertiaApp({
    title: (title) => `${title} - Pagudpud Transparency`,

    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx')
        ),

    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
