export const limits = {
  maxByPaymentType: {
    card: 200_000,
    cash: 40_000,
    bankTransfer: 40_000,
  },
  minByPaymentType: {
    card: 5,
    cash: 10,
    bankTransfer: 10,
  },
  maxByCashOption: {
    bancomer: 40_000,
    serfin: 40_000,
    banamex: 40_000,
    oxxo: 10_000,
  },
  minByCashOption: {
    bancomer: 10,
    serfin: 10,
    banamex: 10,
    oxxo: 10,
  },
};
