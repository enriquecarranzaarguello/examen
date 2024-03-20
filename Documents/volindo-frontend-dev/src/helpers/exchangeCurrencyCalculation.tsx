const availableFlow = [
  { pathName: '/booking', flow: 'booking' },
  { pathName: '/booking-flight', flow: 'flight' },
  { pathName: '/proposal', flow: 'proposal' },
  { pathName: '/reservations', flow: 'reservations' },
  { pathName: '/suppliers/booking', flow: 'suppliers' },
  { pathName: '/suppliers/proposal', flow: 'suppliers' },
  { pathName: '/suppliers/payment', flow: 'suppliers' },
];

export const findPathNameByAvailableFlow = (pathName: string) => {
  const availableFlowObj = availableFlow.find(obj =>
    pathName.startsWith(obj.pathName)
  );
  return availableFlowObj ? pathName : null;
};

export const changeCurrency = (
  baseCurrency: number,
  exchangeCurrencyNumber: number
) => {
  return Math.ceil(baseCurrency * exchangeCurrencyNumber);
};

export const baseCurrencyReturns = (
  price: number,
  exchangeCurrencyNumber: number
) => {
  return price !== 0 ? Math.ceil(price / exchangeCurrencyNumber) : 0;
};
