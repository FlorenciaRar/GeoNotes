import { useEffect, useState } from "react";
import { NoteSchema, NoteFormProps, searchResults, LocationData } from "../models/";
import * as Location from "expo-location";

export default function useLocationSearch() {
  const [location, setLocation] = useState<LocationData | null>(null);

  const [searchResults, setSearchResults] = useState<searchResults[]>([]);
  const [menuShown, setMenuShown] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");

  const getCurrentLocation: () => Promise<LocationData | void> = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permiso de ubicación denegado");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    const [address] = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    const addressName: string = `${address.street ?? ""} ${address.name ?? ""}, ${address.city ?? ""}, ${address.region ?? ""}, ${
      address.country ?? ""
    }`;
    const newLocation: LocationData = { address: addressName, latitude, longitude };
    setLocation(newLocation);

    return newLocation;
  };

  const fetchAddress: () => Promise<void> = async () => {
    if (!searchText.trim().length) {
      setLocation(null);
      return;
    }
    const url: string = `https://nominatim.openstreetmap.org/search?q=${searchText}&format=json&addressdetails=1&limit=3&countrycodes=ar`;

    try {
      const resp: Response = await fetch(url, {
        headers: {
          "User-Agent": "tu-app/1.0 (tuemail@dominio.com)", // requerido por OSM
        },
      });
      const json: searchResults[] = await resp.json();
      setSearchResults(json);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchAddress();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [searchText]);

  return {
    getCurrentLocation,
    location,
    searchText,
    setSearchText,
    searchResults,
    menuShown,
    setMenuShown,
    setLocation,
  };
}
