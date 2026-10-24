import {
    MapContainer,
    Marker,
    TileLayer,
    useMap,
    useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

const PAGUDPUD_CENTER = [18.56, 120.79];

const projectMarker = L.divIcon({
    className: 'project-map-marker',
    html: '<span></span>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

function MapClickHandler({ onChange }) {
    useMapEvents({
        click(event) {
            onChange({
                latitude: Number(event.latlng.lat.toFixed(7)),
                longitude: Number(event.latlng.lng.toFixed(7)),
            });
        },
    });

    return null;
}

function MapFocus({ coordinates }) {
    const map = useMap();

    useEffect(() => {
        if (!coordinates) return;

        map.setView(
            [coordinates.latitude, coordinates.longitude],
            Math.max(map.getZoom(), 14),
        );
    }, [coordinates, map]);

    return null;
}

export default function ProjectLocationMap({
    latitude,
    longitude,
    onChange,
    interactive = false,
    projectName = 'Project location',
    error,
    emptyMessage = 'No map pin selected.',
    address = '',
    onLocate,
    isLocating = false,
    lookupMessage = '',
    focusCoordinates = null,
}) {
    const hasCoordinates =
        latitude !== null &&
        latitude !== undefined &&
        longitude !== null &&
        longitude !== undefined &&
        Number.isFinite(Number(latitude)) &&
        Number.isFinite(Number(longitude));
    const position = hasCoordinates
        ? [Number(latitude), Number(longitude)]
        : null;

    return (
        <div>
            {interactive && (
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-slate-600">
                        Selecting a barangay places an approximate pin. Drag
                        the pin or click the map to refine it.
                    </p>
                    <button
                        type="button"
                        onClick={onLocate}
                        disabled={isLocating || !address}
                        className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-800 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLocating ? 'Locating…' : 'Locate address'}
                    </button>
                </div>
            )}
            {lookupMessage && (
                <p className="mb-2 text-xs text-slate-600" role="status">
                    {lookupMessage}
                </p>
            )}
            {error && (
                <p className="mb-2 text-xs text-red-600" role="alert">
                    {error}
                </p>
            )}
            <MapContainer
                center={position || PAGUDPUD_CENTER}
                zoom={position ? 14 : 12}
                scrollWheelZoom={false}
                className="relative z-[60] h-72 w-full rounded-xl sm:h-80"
                aria-label={projectName}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {interactive && <MapClickHandler onChange={onChange} />}
                {interactive && <MapFocus coordinates={focusCoordinates} />}
                {position && (
                    <Marker
                        position={position}
                        icon={projectMarker}
                        draggable={interactive}
                        eventHandlers={
                            interactive
                                ? {
                                      dragend(event) {
                                          const point =
                                              event.target.getLatLng();
                                          onChange({
                                              latitude: Number(
                                                  point.lat.toFixed(7),
                                              ),
                                              longitude: Number(
                                                  point.lng.toFixed(7),
                                              ),
                                          });
                                      },
                                  }
                                : undefined
                        }
                    />
                )}
            </MapContainer>
            {position ? (
                <p className="mt-2 text-xs text-slate-500">
                    Pin: {Number(latitude).toFixed(6)}, {Number(longitude).toFixed(6)}
                </p>
            ) : (
                <p className="mt-2 text-xs text-slate-500">
                    {emptyMessage}
                </p>
            )}
        </div>
    );
}
