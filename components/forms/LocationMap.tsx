'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// แก้ปัญหารูปไอคอนหมุดไม่ขึ้นใน Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Component สำหรับจัดการการคลิกบนแผนที่
function MapEvents({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

// Component สำหรับเปลี่ยนจุดศูนย์กลางแผนที่เมื่อค่า lat/lng เปลี่ยน
function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
    }, [center, map]);
    return null;
}

interface LocationMapProps {
    latitude?: number | null; // รองรับ null
    longitude?: number | null; // รองรับ null
    onLocationSelect: (lat: number, lng: number) => void;
}

export default function LocationMap({ latitude, longitude, onLocationSelect }: LocationMapProps) {
    // ค่าเริ่มต้น: กรุงเทพ (อนุสาวรีย์ฯ) ถ้ายังไม่มีค่าส่งมา
    const defaultLat = 13.7649;
    const defaultLng = 100.5383;

    const center: [number, number] =
        (latitude && longitude) ? [latitude, longitude] : [defaultLat, defaultLng];

    return (
        <div className="rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 z-0 relative">
            <MapContainer
                center={center}
                zoom={13}
                style={{ height: '300px', width: '100%', zIndex: 0 }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker
                    position={center}
                    icon={icon}
                    draggable={true}
                    eventHandlers={{
                        dragend: (e) => {
                            const marker = e.target;
                            const position = marker.getLatLng();
                            onLocationSelect(position.lat, position.lng);
                        },
                    }}
                />

                <MapEvents onLocationSelect={onLocationSelect} />
                <ChangeView center={center} />
            </MapContainer>
        </div>
    );
}