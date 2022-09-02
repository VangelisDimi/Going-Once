import { useState,useEffect} from 'react';
import {MapContainer,TileLayer,Marker,Popup,useMapEvents} from 'react-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import icon from 'leaflet/dist/images/marker-icon.png';

function Map(){
    const customIcon = new Icon({
        iconUrl: icon,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -41]
    })
    
    const [map,setMap] = useState(null);
    const [position,setPosition] = useState(null);

    function RemoveMarkerButton(){
        function removeMarker(){
            setPosition(null);
        }

        return (
            <button onClick={removeMarker}>
                Remove position
            </button>
        );
    }

    function CustomMarker(){
        useMapEvents({
            click(event) {                                
                setPosition({lat: event.latlng.lat, lng: event.latlng.lng});                
            },            
        })

        return (
            position ? 
                <Marker           
                    position={position}
                    draggable={true}
                    icon={customIcon}
                >
                    <Popup>
                    Auction location.
                    </Popup>
                </Marker>
            : null
        );   
    }

    return(
        <>
        <RemoveMarkerButton/>
        <MapContainer 
            center={[38.754083, 23.181152]} 
            zoom={6} 
            scrollWheelZoom={true} 
            style = {{width: "800px", height: "500px"}}
            ref={setMap}
            doubleClickZoom = {false} 
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <CustomMarker/>
        </MapContainer>
        </>
    );
}

function AuctionManage(){
    return(
        <Map/>
    );
}

export default AuctionManage;