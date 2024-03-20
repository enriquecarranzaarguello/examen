import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Componente que muestra una pestaña de perfil con opciones para "Personal Details" y "Wallet".
 *
 * @component
 * @example
 * // Personal Details seleccionado por defecto
 * <ProfileTab initialTab="details" />
 *
 * // Wallet seleccionado por defecto
 * <ProfileTab initialTab="wallet" />
 *
 * @param {Object} props - Propiedades del componente
 * @param {('details' | 'wallet')} [props.initialTab='details'] - Pestaña inicial seleccionada.
 *   - Si es `'details'`, se mostrará la pestaña "Personal Details" seleccionada por defecto.
 *   - Si es `'wallet'`, se mostrará la pestaña "Wallet" seleccionada por defecto.
 * @param {function} [props.onChange] - Función que se ejecuta cuando cambia la selección de pestaña.
 *   Recibe un parámetro `value` que indica si la pestaña seleccionada es "Personal Details" (`true`) o "Wallet" (`false`).
 */

interface Props {
  initialTab: 'details' | 'wallet';
  onChange?: (value: boolean) => void;
}

const ProfileTab: FC<Props> = ({ initialTab = 'details', onChange }) => {
  const { t } = useTranslation();
  const [isOnDetails, setIsOnDetails] = useState(initialTab === 'details');

  useEffect(() => {
    if (onChange !== undefined) onChange(isOnDetails);
  }, [isOnDetails]);

  return (
    <div
      data-testid="profile-tab-controls"
      className="w-[100%] lg:max-w-[237px] border border-[#323232] bg-[#191919] text-white rounded-md py-2 px-2 lg:py-1 lg:px-1 flex gap-2"
    >
      <button
        data-testid="profile-agent-selector"
        className={`py-2 lg:py-1 ${
          isOnDetails ? 'bg-[#323232]' : ''
        } w-full rounded-md button-no-active`}
        onClick={() => {
          setIsOnDetails(true);
        }}
      >
        {t('agent.profile')}
      </button>

      <button
        data-testid="profile-wallet-selector"
        className={`py-2 lg:py-1 ${
          isOnDetails ? '' : 'bg-[#323232]'
        } w-full rounded-md button-no-active`}
        onClick={() => {
          setIsOnDetails(false);
        }}
      >
        {t('agent.wallet')}
      </button>
    </div>
  );
};

export default ProfileTab;
