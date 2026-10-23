import { useCallback, useEffect, useRef, useState } from 'react';
import geocodePagudpudProjectLocation from '../Utils/geocodePagudpudProjectLocation';

export default function usePagudpudProjectGeocoder() {
    const requestRef = useRef(null);
    const [isLocating, setIsLocating] = useState(false);
    const [message, setMessage] = useState('');

    const cancelLookup = useCallback(() => {
        requestRef.current?.abort();
        requestRef.current = null;
        setIsLocating(false);
        setMessage('');
    }, []);

    const locate = useCallback(async (location, onFound) => {
        requestRef.current?.abort();
        requestRef.current = null;

        if (!location.trim()) {
            setIsLocating(false);
            setMessage('Select a barangay before locating the address.');
            return;
        }

        const controller = new AbortController();
        requestRef.current = controller;
        setIsLocating(true);
        setMessage('Looking up the address…');

        try {
            const coordinates = await geocodePagudpudProjectLocation(
                location,
                controller.signal,
            );

            if (requestRef.current !== controller) return;

            if (!coordinates) {
                setMessage(
                    'Address not found. Place the pin directly on the map.',
                );
                return;
            }

            onFound(coordinates);
            setMessage(
                'Approximate pin placed. Move it to the exact project site.',
            );
        } catch {
            if (requestRef.current === controller) {
                setMessage(
                    'Address lookup failed. Place the pin directly on the map.',
                );
            }
        } finally {
            if (requestRef.current === controller) {
                requestRef.current = null;
                setIsLocating(false);
            }
        }
    }, []);

    useEffect(
        () => () => {
            const controller = requestRef.current;
            requestRef.current = null;
            controller?.abort();
        },
        [],
    );

    return { locate, cancelLookup, isLocating, message };
}
