import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "./Button";
import { MapPin, Check, Search, Loader2 } from "lucide-react";

// Fix for default Leaflet marker icons in React
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface MapPickerProps {
    initialLat?: number;
    initialLng?: number;
    searchQuery?: string;
    onConfirm: (link: string) => void;
    onCancel: () => void;
}

function LocationMarker({ position, setPosition }: { position: L.LatLng | null, setPosition: (pos: L.LatLng) => void }) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={icon} />
    );
}

function MapUpdater({ center }: { center: L.LatLng | null }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            // Use flyTo for smooth animation, but ensure duration isn't too long
            map.flyTo(center, 14, { duration: 1.5 });
        }
    }, [center, map]);
    return null;
}

export default function MapPicker({ initialLat, initialLng, searchQuery, onConfirm, onCancel }: MapPickerProps) {
    const hasInitialCoords = initialLat && initialLng && initialLat !== 0;

    const [position, setPosition] = useState<L.LatLng | null>(
        hasInitialCoords ? new L.LatLng(initialLat, initialLng!) : new L.LatLng(9.9281, -84.0907)
    );
    const [mounted, setMounted] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!hasInitialCoords && searchQuery) {
            handleSearch(searchQuery);
        }
        return () => setMounted(false);
    }, []);

    const handleSearch = async (query: string) => {
        setIsSearching(true);
        try {
            // Prioritize Costa Rica or general search? Just general for now.
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const newPos = new L.LatLng(parseFloat(lat), parseFloat(lon));
                setPosition(newPos);
            }
        } catch (error) {
            console.error("Geocoding failed", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleConfirm = () => {
        if (position) {
            const link = `https://www.google.com/maps?q=${position.lat},${position.lng}`;
            onConfirm(link);
        }
    };

    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden shadow-2xl relative">
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                    <div>
                        <h3 className="text-white font-bold text-lg flex items-center gap-2">
                            <MapPin className="text-red-600" /> Seleccionar Ubicación
                        </h3>
                        <p className="text-zinc-400 text-sm">
                            {isSearching ? <span className="flex items-center gap-2 text-yellow-500"><Loader2 className="w-3 h-3 animate-spin" /> Buscando "{searchQuery}"...</span> : "Haz click en el mapa para marcar el punto exacto."}
                        </p>
                    </div>
                </div>

                <div className="flex-1 relative bg-zinc-900 z-10 isolate">
                    <MapContainer
                        center={position || [9.9281, -84.0907]}
                        zoom={13}
                        style={{ height: "100%", width: "100%", zIndex: 0 }}
                        className="isolate"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker position={position} setPosition={setPosition} />
                        <MapUpdater center={position} />
                    </MapContainer>
                </div>

                <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex justify-end gap-3">
                    <Button onClick={onCancel} variant="secondary" className="bg-zinc-800 text-white hover:bg-zinc-700">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!position}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 flex items-center gap-2"
                    >
                        <Check className="w-4 h-4" /> Confirmar Ubicación
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
}
