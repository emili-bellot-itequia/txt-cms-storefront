import React, { createContext, useContext, useEffect, useState } from 'react';
import { getActivePartners, type StorefrontPartner } from '../services/partnerService';

const PartnersContext = createContext<StorefrontPartner[]>([]);

export const PartnersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [partners, setPartners] = useState<StorefrontPartner[]>([]);

  useEffect(() => {
    getActivePartners()
      .then(setPartners)
      .catch(() => {/* use empty */});
  }, []);

  return (
    <PartnersContext.Provider value={partners}>
      {children}
    </PartnersContext.Provider>
  );
};

export const usePartners = () => useContext(PartnersContext);
