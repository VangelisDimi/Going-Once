import {useMemo,useRef} from 'react';
import {MapContainer,TileLayer,Marker,Popup,useMapEvents} from 'react-leaflet'
import { Icon } from 'leaflet'
import './leaflet.css'
import 'leaflet/dist/leaflet.css'
import icon from 'leaflet/dist/images/marker-icon.png';

function CreationMap({position,setPosition}){
    const map = useRef();

    setTimeout(function(){
        map.current.invalidateSize();
    });

    const customIcon = new Icon({
        iconUrl: icon,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -41]
    })

    function CustomMarker(){
        useMapEvents({
            click(event) {                                
                setPosition({lat: event.latlng.lat.toFixed(6), lng: event.latlng.lng.toFixed(6)});
            },
        })

        const eventHandlers = useMemo(() => ({
            dragend(event) {
                setPosition({lat: event.target.getLatLng().lat.toFixed(6), lng: event.target.getLatLng().lng.toFixed(6)});
            },
        }),[])

        return (
            position ? 
                <Marker           
                    position={position}
                    draggable={true}
                    icon={customIcon}
                    eventHandlers={eventHandlers}
                >
                    <Popup>
                    Auction location.
                    </Popup>
                </Marker>
            : null
        );   
    }

    return(
        <MapContainer
            className="map"
            center={[38.754083, 23.181152]} 
            zoom={6} 
            scrollWheelZoom={true}
            doubleClickZoom = {false}
            ref={map}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <CustomMarker/>
        </MapContainer>
    );
}

export {CreationMap};