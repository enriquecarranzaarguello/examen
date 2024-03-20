import { useState } from 'react';
import { SupplierHeaderType } from '@typing/types';

// Translation
import { useTranslation } from 'react-i18next';

const Step = ({ actualStep }: { actualStep: string }) => {
  const { t, i18n } = useTranslation('common');
  const [resTabs, setResTabs] = useState(actualStep);

  const Step = ({ number, text, isActive }: SupplierHeaderType) => {
    const baseClasses = `font-[600] flex gap-2 items-center ${
      isActive
        ? 'flex justify-center bg-whiteLabelColor text-sm h-6 w-6 text-[#040404] rounded-full'
        : 'bg-[#525252] rounded-full text-[#040404] text-sm flex justify-center h-6 w-6'
    }`;

    const textClasses = `text-sm mt-0 ${
      isActive ? 'text-white !block' : 'text-gray-600'
    } hidden md:block`;

    return (
      <div className="flex space-x-[11px] items-center">
        <p className={baseClasses}>{number}</p>
        <p className={textClasses}>{text}</p>
      </div>
    );
  };

  return (
    <div className="flex justify-center w-full max-w-[360px] m-[0_auto] mt-[23px] mb-[27px] md:max-w-full md:mb-[40px]">
      <div className="flex gap-2 justify-between items-center w-[90%] md:w-fit">
        <Step
          number={1}
          text={t('suppliers.reservation')}
          isActive={resTabs === 'ResDetails'}
          isLast={false}
        />
        <span className="text-gray-600 md:block hidden">----------</span>
        <span className="text-gray-600 md:hidden">--------</span>
        <Step
          number={2}
          text={t('suppliers.payment')}
          isActive={resTabs === 'Payment'}
          isLast={false}
        />
        <span className="text-gray-600 md:block hidden">----------</span>
        <span className="text-gray-600 md:hidden">--------</span>
        <Step
          number={3}
          text={t('suppliers.confirmation')}
          isActive={resTabs === 'Confirmation'}
          isLast
        />
      </div>
    </div>
  );
};

export default Step;
