import { useState, useEffect, useRef } from "react";

function useGeolocation(options = {}) {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    let isMounted = true;

    if (!navigator.geolocation) {
      if (isMounted) {
        setError("Geolocalização não é suportada pelo seu navegador.");
        setLoading(false);
      }
      return;
    }

    const handleSuccess = (position) => {
      if (isMounted) {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
        setError(null);
        setLoading(false);
      }
    };

    const handleError = (error) => {
      if (isMounted) {
        //... (tratamento de erro detalhado com switch case)
        setError("Não foi possível obter a localização.");
        setLocation(null);
        setLoading(false);
      }
    };

    const finalOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      ...optionsRef.current,
    };

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      finalOptions
    );

    return () => {
      isMounted = false;
    };
  }, []);

  return { location, error, loading };
}

export default useGeolocation;
