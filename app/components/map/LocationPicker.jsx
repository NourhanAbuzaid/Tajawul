'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import styles from '@/forms.module.css';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function LocationPicker({ 
  onLocationSelect, 
  initialLocation = { lng: 0, lat: 0, address: '' } 
}) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!showModal || !mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [initialLocation.lng || 0, initialLocation.lat || 0],
      zoom: initialLocation.lng ? 8 : 1.5,
      minZoom: -10,
      maxZoom: 10,
      projection: 'globe',
      antialias: true,
      renderWorldCopies: false
    });

    mapRef.current = map;

    // Initialize marker with proper coordinates
    const markerEl = document.createElement('div');
    markerEl.className = styles.customMarker;
    const marker = new mapboxgl.Marker({
      element: markerEl,
      anchor: 'bottom'
    });
    
    // Only set marker if we have valid coordinates
    if (initialLocation.lng && initialLocation.lat) {
      marker.setLngLat([initialLocation.lng, initialLocation.lat]).addTo(map);
    }
    markerRef.current = marker;

    // 3D effects
    map.on('style.load', () => {
      map.setFog({});
      if (initialLocation.lng) {
        map.flyTo({
          center: [initialLocation.lng, initialLocation.lat],
          zoom: 12,
          pitch: 45
        });
      }
    });

    // Click handler with proper coordinate validation
    map.on('click', async (e) => {
      try {
        setIsLoading(true);
        const { lng, lat } = e.lngLat;
        
        // Validate coordinates
        if (typeof lng !== 'number' || typeof lat !== 'number') {
          throw new Error('Invalid coordinates');
        }

        // Update marker position
        markerRef.current.setLngLat([lng, lat]).addTo(map);
        
        // Fly to location
        map.flyTo({
          center: [lng, lat],
          zoom: 12,
          speed: 1.2,
          curve: 1.5
        });

        // Geocoding
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
        );
        const data = await response.json();
        const address = data.features[0]?.place_name || 'Selected Location';
        
        new mapboxgl.Popup({ 
          closeButton: false,
          className: styles.customPopup,
        })
          .setLngLat([lng, lat])
          .setHTML(`<div>${address}</div>`)
          .addTo(map);
        
        onLocationSelect({
          lng: lng.toFixed(6),
          lat: lat.toFixed(6),
          address
        });
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    });

    map.on('load', () => setIsLoading(false));

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, [showModal, initialLocation.lng, initialLocation.lat]);

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  return (
    <div className={styles.mapIconContainer}>
      <button
        onClick={() => setShowModal(true)}
        className={styles.mapIconButton}
        aria-label="Select location on map"
      >
        <AddLocationAltIcon sx={{ 
          fontSize: '37px',
          color: 'var(--Green-Perfect)',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.1)',
            color: 'var(--Green-Hover)'
          }
        }} />
      </button>

      {showModal && (
        <div className={styles.mapModal}>
          <div className={styles.mapModalContent}>
            <button 
              onClick={() => setShowModal(false)}
              className={styles.closeButton}
              aria-label="Close map"
            >
              <HighlightOffIcon sx={{ fontSize: 24, color: '#666' }} />
            </button>
            
            <div className={styles.mapWrapper}>
              {isLoading && <div className={styles.mapLoading}>Loading map...</div>}
              <div ref={mapContainer} className={styles.mapContainer} />
              
              {/* Zoom controls */}
              <div style={{
                position: 'absolute',
                right: '20px',
                bottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                zIndex: 10
              }}>
                <button 
                  onClick={handleZoomIn}
                  style={{
                    background: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  <AddCircleOutlineIcon sx={{ color: '#333' }} />
                </button>
                <button 
                  onClick={handleZoomOut}
                  style={{
                    background: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  <RemoveCircleOutlineIcon sx={{ color: '#333' }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}