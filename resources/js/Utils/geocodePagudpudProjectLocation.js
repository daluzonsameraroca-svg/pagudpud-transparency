const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const PAGUDPUD_BOUNDS = {
    south: 18.4,
    west: 120.63,
    north: 18.68,
    east: 120.93,
};

let requestQueue = Promise.resolve();
let lastRequestAt = 0;

function waitForRateLimit(signal) {
    const delay = Math.max(0, 1100 - (Date.now() - lastRequestAt));

    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            signal.removeEventListener('abort', onAbort);
            resolve();
        }, delay);
        const onAbort = () => {
            clearTimeout(timeout);
            reject(new DOMException('Address lookup cancelled.', 'AbortError'));
        };

        if (signal.aborted) {
            onAbort();
            return;
        }

        signal.addEventListener('abort', onAbort, { once: true });
    });
}

export default function geocodePagudpudProjectLocation(location, signal) {
    const request = requestQueue.then(async () => {
        await waitForRateLimit(signal);
        lastRequestAt = Date.now();

        const params = new URLSearchParams({
            format: 'jsonv2',
            addressdetails: '1',
            limit: '1',
            countrycodes: 'ph',
            viewbox: '120.63,18.68,120.93,18.4',
            bounded: '1',
            q: `${location}, Pagudpud, Ilocos Norte, Philippines`,
        });
        const response = await fetch(`${NOMINATIM_URL}?${params}`, {
            signal,
        });

        if (!response.ok) {
            throw new Error('Pagudpud address lookup is unavailable.');
        }

        const results = await response.json();
        const result = results[0];

        if (!result || result.address?.country_code !== 'ph') {
            return null;
        }

        const municipality = [
            result.address.town,
            result.address.municipality,
            result.address.city,
            result.address.county,
        ].some((name) => name?.toLowerCase() === 'pagudpud');
        const latitude = Number(result.lat);
        const longitude = Number(result.lon);

        if (
            !municipality ||
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            latitude < PAGUDPUD_BOUNDS.south ||
            latitude > PAGUDPUD_BOUNDS.north ||
            longitude < PAGUDPUD_BOUNDS.west ||
            longitude > PAGUDPUD_BOUNDS.east
        ) {
            return null;
        }

        return {
            latitude: Number(latitude.toFixed(7)),
            longitude: Number(longitude.toFixed(7)),
        };
    });

    requestQueue = request.catch(() => undefined);

    return request;
}
