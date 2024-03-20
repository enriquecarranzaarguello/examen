import { useEffect, useState } from 'react';
import styles from '@styles/deals/hotel.module.scss';
import { usePrice } from 'src/components/utils/Price/Price';
import { useTranslation } from 'react-i18next';
import config from '@config';

import { Comission, PriceGeneralSummary } from '@components';

interface PriceDetailsProps {
  total: number;
  numberOfNights: number;
  handlePaymentDetails: (
    commission: number,
    transactionFee: number,
    total: number
  ) => void;
}

const PriceDetails = ({
  total,
  numberOfNights,
  handlePaymentDetails,
}: PriceDetailsProps) => {
  const price = usePrice();
  const { t } = useTranslation();
  const [value, setValue] = useState(null || 1);
  const [commission, setComission] = useState(0);
  const [brandComission, setBrandComission] = useState(total * 0.04);
  const [showComission, setShowComission] = useState(commission);
  const [totalCalc, setTotalCalc] = useState(total);
  const companyComission = config.transactionfee;

  useEffect(() => {
    let calculatedCommission = value
      ? commission
      : price.integerRate(total) * (commission / 100);
    setShowComission(calculatedCommission);

    const brandComission =
      (price.integerRate(total) + calculatedCommission) * 0.04;
    setBrandComission(brandComission);

    const finalTotal =
      price.integerRate(total) + calculatedCommission + brandComission;

    setTotalCalc(finalTotal);
    handlePaymentDetails(calculatedCommission, brandComission, finalTotal);
  }, [commission, value, total, price.countryRate]);

  const logState = (state: any) => {
    setValue(state);
  };

  return (
    <div className={styles.priceDetails}>
      <h4 className={styles.priceDetails_title}>{t('stays.price_details')}</h4>
      <div className={styles.priceDetails_comissionContainer}>
        <span className={styles.agentTitle}>{t('stays.agent-commission')}</span>
      </div>

      <Comission
        setValue={setComission}
        value={commission}
        commissionType={value}
        logState={logState}
        currencySymbol={price.countrySymbol}
        typeOfInput="commission"
      />

      <PriceGeneralSummary
        numberOfNights={numberOfNights}
        total={price.integerRate(total)}
        commission={showComission}
        transactionFee={brandComission}
        calculatedTotal={totalCalc}
        countrySymbol={price.countrySymbol}
      />
    </div>
  );
};

export default PriceDetails;
