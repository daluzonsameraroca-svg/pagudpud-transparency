
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Enable real-time updates only when Reverb is configured.
const reverbKey = import.meta.env.VITE_REVERB_APP_KEY;
const reverbHost = import.meta.env.VITE_REVERB_HOST;
const reverbPort = import.meta.env.VITE_REVERB_PORT;

if (reverbKey && reverbHost && reverbPort) {
    window.Pusher = Pusher;

    window.Echo = new Echo({
        broadcaster: 'reverb',
        key: reverbKey,
        wsHost: reverbHost,
        wsPort: Number(reverbPort),
        wssPort: Number(reverbPort),
        forceTLS: true,
        enabledTransports: ['ws', 'wss'],
    });
} else {
    window.Echo = null;
}

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
