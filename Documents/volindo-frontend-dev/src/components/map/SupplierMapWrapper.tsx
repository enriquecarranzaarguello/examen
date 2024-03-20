import config from '@config';
import { useTranslation } from 'next-i18next';
import React from 'react';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from '@react-google-maps/api';
import mapPinwhiteIcon from '@icons/map-pingwhite.svg';
import { darkModeStyles } from '.';
import IconCloseBlack from '@icons/close-black.svg';
import Image from 'next/image';
import { Loader } from 'rsuite';
import { SupplierMapProps } from '@typing/proptypes';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '20px',
};

const center = {
  lat: 19.42847,
  lng: -99.12766,
};
const SupplierMapWrapper = ({
  onSelectLocation,
  onClose,
}: SupplierMapProps) => {
  const [map, setMap] = React.useState(null);
  const [marker, setMarker] = React.useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [infoWindow, setInfoWindow] = React.useState<{
    lat: number;
    lng: number;
    address: string;
    city: string;
    country: string;
  } | null>(null);

  const { i18n, t } = useTranslation();
  const [userLocation, setUserLocation] = React.useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userLocation);
          setMarker({
            lat: userLocation.lat,
            lng: userLocation.lng,
          });
        },
        error => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const { isLoaded, loadError } = useLoadScript({
    language: i18n.language,
    googleMapsApiKey: config.google_maps_api_key || '',
    libraries: ['places'],
  });

  const searchBoxRef = React.createRef<HTMLInputElement>();
  const [searchResult, setSearchResult] =
    React.useState<google.maps.places.PlaceResult | null>(null);
  const onLoad = (mapInstance: google.maps.Map) => {
    if (searchBoxRef.current) {
      const autoComplete = new window.google.maps.places.Autocomplete(
        searchBoxRef.current
      );
      autoComplete.bindTo('bounds', mapInstance);
      autoComplete.addListener('place_changed', () => {
        const place = autoComplete.getPlace();
        setSearchResult(place);
        if (place.geometry) {
          const { address, city, country, lat, lng } = getAddressInfo(place);
          setMarker({ lat: lat!, lng: lng! });
          setInfoWindow({
            lat: lat!,
            lng: lng!,
            address: address!,
            city,
            country,
          });
        }
      });
    }
  };

  const getAddressInfo = (place: google.maps.places.PlaceResult) => {
    const address = place.formatted_address;
    const lat = place.geometry?.location?.lat() ?? null;
    const lng = place.geometry?.location?.lng() ?? null;
    const address_components = place.address_components ?? [];
    const cityComponent = address_components.find(component =>
      component.types.includes('locality')
    );
    const countryComponent = address_components.find(component =>
      component.types.includes('country')
    );
    const city = cityComponent?.long_name ?? 'Unknown City';
    const country = countryComponent?.long_name ?? 'Unknown Country';
    return { address, city, country, lat, lng };
  };
  const onUnmount = React.useCallback(() => {
    setMap(null);
  }, []);
  const handleClick = async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarker({ lat, lng });

      if (searchResult && searchResult.geometry) {
        const { address, city, country, lat, lng } =
          getAddressInfo(searchResult);
        setInfoWindow({
          lat: lat!,
          lng: lng!,
          address: address!,
          city,
          country,
        });
      } else {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results) {
            const { address, city, country, lat, lng } = getAddressInfo(
              results[0]
            );
            setInfoWindow({
              lat: lat!,
              lng: lng!,
              address: address!,
              city,
              country,
            });
          }
        });
      }
    }
  };

  const handleSelectLocation = () => {
    if (infoWindow) {
      onSelectLocation({
        address: infoWindow.address,
        city: infoWindow.city,
        country: infoWindow.country,
        lat: infoWindow.lat,
        lng: infoWindow.lng,
      });
    }
    onClose();
  };

  React.useEffect(() => {
    if (isLoaded) {
      getUserLocation();
    }
  }, [isLoaded]);

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <Loader content="Loading map..." vertical />;
  }

  const checkWL = config.WHITELABELNAME === 'Volindo';

  return (
    <div className="fixed inset-0 bg-[#23262F]/[.8] flex justify-center items-center z-50">
      <div className="relative bg-[#141416] shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] w-full h-full  md:w-[544px] md:h-[432px] md:rounded-[16px] p-10 md:p-2 object-cover">
        <button
          className="absolute right-0 top-[2px] md:-top-5 md:-right-6"
          onClick={onClose}
        >
          <Image alt="icon" src={IconCloseBlack} />
        </button>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation || center}
          onLoad={onLoad}
          zoom={12}
          onUnmount={onUnmount}
          onClick={handleClick}
          options={{
            disableDefaultUI: false,
            clickableIcons: false,
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: true,
            styles: darkModeStyles,
          }}
        >
          {marker && <Marker icon={mapPinwhiteIcon.src} position={marker} />}
          {infoWindow && (
            <InfoWindow
              position={infoWindow}
              onCloseClick={() => setInfoWindow(null)}
            >
              <div className=" text-black w-auto h-auto flex flex-col gap-y-3 my-3 p-1 justify-center items-center text-base overflow-y-scroll scrollbar-hide">
                <p>{infoWindow.address}</p>
                <button
                  className={`text-white px-3 rounded-full py-1 ${
                    checkWL
                      ? 'bg-[var(--primary-background)]'
                      : 'bg-[var(--blue-color)]'
                  }`}
                  onClick={handleSelectLocation}
                >
                  {t('suppliers.select-location')}
                </button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
        <div className="absolute top-4 left-4">
          <input
            ref={searchBoxRef}
            type="text"
            placeholder="Search your address"
            style={{
              backgroundColor: `white`,
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `240px`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `14px`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default SupplierMapWrapper;
