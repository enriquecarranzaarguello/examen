import { useEffect, useState } from 'react';
import { Modal, LoadingSpinner } from '@components';
import { useTranslation } from 'next-i18next';

import type { ModalRateConditionsProps } from '@typing/proptypes';
import { translateDescription } from '@utils/axiosClients';

const replaceSpecialCharacters = (text: any) => {
  // Reemplazar los caracteres especiales por su correspondiente código HTML
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#039;/g, "'");
  return text;
};

export default function ModalRateConditions({
  open,
  onClose,
  rateConditions,
}: ModalRateConditionsProps) {
  const { t, i18n } = useTranslation('common');
  const userAgent = window.navigator.userAgent;
  const isIphone = /iPhone/i.test(userAgent);
  const [translatedRateConditions, setTranslatedRateConditions] =
    useState<string[]>(rateConditions);
  const [loader, setLoader] = useState<boolean>(false);

  const handleTranslateDescription = async (RateConditions: string[]) => {
    setLoader(true);
    const message = {
      text: RateConditions.join('\n'),
      original_lg: 'EN',
      translate_lg: i18n.language.toUpperCase(),
    };

    translateDescription(message)
      .then(res => {
        setTranslatedRateConditions(res.data.split('\n'));
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    if (i18n.language !== 'en' && rateConditions.length > 0) {
      handleTranslateDescription(rateConditions);
    } else {
      setTranslatedRateConditions(rateConditions);
    }
  }, []);

  const combinedConditions = translatedRateConditions
    .map(condition => `<p>${condition}</p>`)
    .join(' ');

  return (
    <Modal open={open} onClose={onClose}>
      <div
        className={`flex flex-col items-center w-full md:max-w-[800px] md:max-h-[600px] h-screen md:h-auto px-10 md:px-20 py-10 overflow-auto scrollbar-hide ${
          isIphone ? 'realtive' : ''
        }`}
      >
        {loader ? (
          <LoadingSpinner size="small" />
        ) : (
          <>
            {isIphone && (
              <div className="fixed p-1 bg-[#23262F] text-white rounded-full transform top-3 right-3 z-[!100] md:hidden">
                {/* Icono de tache (puedes usar un emoji o un icono personalizado aquí) */}
                <span className="text-xl" onClick={onClose}>
                  ✖️
                </span>
              </div>
            )}
            <h2 className="text-white self-center font-[700] text-[18px] capitalize">
              {t('stays.rate-conditions')}
            </h2>
            <div className="font-[13px] text-white">
              <div
                dangerouslySetInnerHTML={{
                  __html: replaceSpecialCharacters(combinedConditions),
                }}
              />
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
