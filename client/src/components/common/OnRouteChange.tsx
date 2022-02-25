import React, { FC, useEffect } from 'react';
import { LocationProvider, useLocation, WindowLocation } from "@reach/router";
import { usePrevious } from "../../util/hooks/usePrevious.hook";

export const OnRouteChangeWorker: FC<{ action: (location: WindowLocation) => void }> = ({ action }) => {
  const location = useLocation();
  const prevLocation = usePrevious(location);

  useEffect(() => {
    if (location?.pathname !== prevLocation?.pathname) {
      action(location);
    }
  }, [location, prevLocation, action]);

  return null;
}

export const OnRouteChange: FC<{ action: (location: WindowLocation) => void }> = ({ action }) => {
  return (
    <LocationProvider>
      <OnRouteChangeWorker action={action}  />
    </LocationProvider>
  );
}