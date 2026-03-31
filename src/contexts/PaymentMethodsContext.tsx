import React, { createContext, useContext, useEffect, useState } from 'react';
import { getActivePaymentMethods, type StorefrontPaymentMethod } from '../services/paymentMethodService';

const PaymentMethodsContext = createContext<StorefrontPaymentMethod[]>([]);

export const PaymentMethodsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [methods, setMethods] = useState<StorefrontPaymentMethod[]>([]);

  useEffect(() => {
    getActivePaymentMethods()
      .then(setMethods)
      .catch(() => {/* use empty */});
  }, []);

  return (
    <PaymentMethodsContext.Provider value={methods}>
      {children}
    </PaymentMethodsContext.Provider>
  );
};

export const usePaymentMethods = () => useContext(PaymentMethodsContext);
