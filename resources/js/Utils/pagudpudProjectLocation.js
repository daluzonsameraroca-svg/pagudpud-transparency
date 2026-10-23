export function formatPagudpudProjectLocation(sitio, barangay) {
    if (!barangay) return '';

    const details = sitio.trim();
    const location = details ? `${details}, ${barangay}` : barangay;

    return `${location}, Pagudpud, Ilocos Norte`;
}

export function parsePagudpudProjectLocation(location, barangays) {
    const parts = String(location ?? '')
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean);

    if (parts.at(-1)?.toLowerCase() === 'ilocos norte') {
        parts.pop();
    }

    if (parts.at(-1)?.toLowerCase() === 'pagudpud') {
        parts.pop();
    }

    const barangayIndex = parts.findLastIndex((part) =>
        barangays.some(
            (barangay) =>
                barangay.name.toLowerCase() === part.toLowerCase() ||
                `barangay ${barangay.name}`.toLowerCase() ===
                    part.toLowerCase(),
        ),
    );

    if (barangayIndex === -1) {
        return { sitio: '', barangay: '' };
    }

    return {
        sitio: parts.slice(0, barangayIndex).join(', '),
        barangay: barangays.find(
            (barangay) =>
                barangay.name.toLowerCase() ===
                    parts[barangayIndex].toLowerCase() ||
                `barangay ${barangay.name}`.toLowerCase() ===
                    parts[barangayIndex].toLowerCase(),
        ).name,
    };
}
