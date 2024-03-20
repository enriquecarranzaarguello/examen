import React, { useState, useEffect } from 'react';
import styles from '@styles/deals/hotel.module.scss';
import { useTranslation } from 'react-i18next';
import { Comission, PriceGeneralSummary } from '@components';
import { usePrice } from '@components/utils/Price/Price';

const SupplierPriceDetails = ({
  numberOfNights,
  supplierType,
  numberOfPeople,
  handlePaymentDetails,
}: any) => {
  const { t } = useTranslation();
  const price = usePrice();
  const [commission, setComission] = useState(0);
  const [servicePrice, setServicePrice] = useState(0);
  const [value, setValue] = useState(null || 1);
  const logState = (state: any) => {
    setValue(state);
  };
  const [brandComission, setBrandComission] = useState(servicePrice * 0.04);
  const [showComission, setShowComission] = useState(commission);
  const [totalCalc, setTotalCalc] = useState(servicePrice);

  useEffect(() => {
    let calculatedCommission = value
      ? commission
      : servicePrice * (commission / 100);
    setShowComission(calculatedCommission);

    const brandComission = (servicePrice + calculatedCommission) * 0.04;
    setBrandComission(brandComission);

    const finalTotal = servicePrice + calculatedCommission + brandComission;

    setTotalCalc(finalTotal);
    handlePaymentDetails(calculatedCommission, brandComission, finalTotal);
  }, [commission, value, servicePrice, price.countryRate]);

  return (
    <div className="flex flex-col gap-2">
      <h4 className={styles.priceDetails_title}>{t('stays.price_details')}</h4>

      <div className={styles.priceDetails_comissionContainer}>
        <span className={styles.agentTitle}>Service Price</span>
      </div>
      <Comission
        setValue={setServicePrice}
        value={servicePrice}
        logState={logState}
        currencySymbol={price.countrySymbol}
      />

      <div className={styles.priceDetails_comissionContainer}>
        <span className={styles.agentTitle}>{t('stays.agent-commission')}</span>
      </div>
      <Comission
        setValue={setComission}
        value={commission}
        logState={logState}
        commissionType={value}
        currencySymbol={price.countrySymbol}
        typeOfInput="commission"
      />
      <PriceGeneralSummary
        numberOfNights={numberOfNights !== undefined && numberOfNights}
        numberOfPeople={supplierType !== 'accommodation' ? numberOfPeople : 0}
        total={servicePrice}
        commission={showComission}
        transactionFee={brandComission}
        calculatedTotal={totalCalc}
        countrySymbol={price.countrySymbol}
      />
    </div>
  );
};

export default SupplierPriceDetails;
