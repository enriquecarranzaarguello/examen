import { useEffect, useState } from 'react';
import { usePrice } from '@components/utils/Price/Price';
import { useTranslation } from 'react-i18next';

const Comission = ({ total, commission, setComission }: any) => {
  const { t } = useTranslation();
  const price = usePrice();
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const calComission = isNaN(commission) ? 0 : commission;
    const tempPercentage = (calComission / total) * 100;
    setPercentage(tempPercentage);
  }, [commission]);

  const handleComissionChange = (e: any) => {
    const inputComission = parseFloat(e.target.value);
    if (isNaN(inputComission)) {
      setComission(0);
    }
    setComission(inputComission);
  };
  //TODO Change to styles
  return (
    <div className="bg-[#ffffff26] rounded-[8px] flex justify-between items-center h-[45px] w-full px-3 input-number my-5">
      <label className="text-white text-[14px] font-[500]">
        {t('stays.agent-commission')}
      </label>
      <div className="flex flex-row gap-2 text-black">
        <div className="flex flex-row gap-5 items-center justify-center border rounded-full px-5 border-white max-w-[100px] bg-white">
          <p className="">%</p>
          <span>{!isNaN(percentage) ? Math.round(percentage) : 0}</span>
        </div>
        <div className="flex flex-row gap-5 items-center justify-center border rounded-full px-5 border-white max-w-[120px] bg-white">
          <span className="">{price.countrySymbol}</span>
          <input
            name="commission"
            type="number"
            value={commission}
            onChange={handleComissionChange}
            className="bg-transparent focus:bg-none focus:outline-none focus:border-none w-3/4"
          />
        </div>
      </div>
    </div>
  );
};

export default Comission;
