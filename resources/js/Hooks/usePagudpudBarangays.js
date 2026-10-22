import { useCallback, useEffect, useRef, useState } from 'react';

const BARANGAYS_URL =
    'https://psgc.gitlab.io/api/cities-municipalities/012815000/barangays/';

export default function usePagudpudBarangays({ enabled = true } = {}) {
    const [barangays, setBarangays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const controllerRef = useRef(null);

    const loadBarangays = useCallback(async (signal) => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(BARANGAYS_URL, { signal });

            if (!response.ok) {
                throw new Error('The barangay list could not be loaded.');
            }

            const records = await response.json();
            const options = records
                .filter(
                    (barangay) =>
                        typeof barangay.code === 'string' &&
                        typeof barangay.name === 'string',
                )
                .sort((first, second) =>
                    first.name.localeCompare(second.name),
                );

            if (options.length === 0) {
                throw new Error('The barangay list is currently unavailable.');
            }

            setBarangays(options);
        } catch (requestError) {
            if (requestError.name !== 'AbortError') {
                setError(
                    'Unable to load Pagudpud barangays. Check your connection and try again.',
                );
            }
        } finally {
            if (!signal.aborted) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        if (!enabled) {
            setLoading(false);

            return undefined;
        }

        const controller = new AbortController();
        controllerRef.current = controller;
        loadBarangays(controller.signal);

        return () => {
            controller.abort();
            controllerRef.current = null;
        };
    }, [enabled, loadBarangays]);

    const retry = useCallback(() => {
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;
        loadBarangays(controller.signal);
    }, [loadBarangays]);

    return { barangays, loading, error, retry };
}
