import { useState, useEffect } from 'react';
import salesIcon from '@icons/salesIcon.svg';
import diamond from '@icons/diamond.svg';
import dollar from '@icons/dollar.svg';
import starblank from '@icons/star-blank.svg';
// import starIcon from '@icons/star-white.svg';
import infoIcon from '@icons/Info-circle.svg';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { AgentWalletBalance } from '@typing/types';
import ModalUserWithdrawForm from '../modals/ModalUserWithdrawForm';
import { useSession } from 'next-auth/react';
import { Slider } from 'rsuite';
import { useVariableValue } from '@devcycle/react-client-sdk';
import styles from '@styles/profile/profile-wallet.module.scss';
import { InfoPopup, Modal } from '@components';
import { getAgentWallet } from '@utils/axiosClients';
import { AxiosResponse } from 'axios';

const Wallet = () => {
  const { t } = useTranslation();
  const { data: session } = useSession();

  // * Open Modal State
  const [openUserWithdrawForm, setOpenUserWithdrawForm] = useState(false);
  const [walletBalance, setWalletBalance] = useState<AgentWalletBalance>({
    sales: {
      total: 0,
      on_hold: 0,
    },
    commissions: {
      total: 0,
      on_hold: 0,
    },
    earnings: {
      available: 0,
      withdrawn: 0,
    },
  });
  const [showTest, setShowTest] = useState(false);
  const [withdrawlMessage, setWithdrawlMessage] = useState<string>('');

  const cashbackIsActive = useVariableValue('frontend_cashback', false);

  useEffect(() => {
    if (session?.user.id_token) {
      getAgentWallet(session?.user.id_token)
        .then((res: AxiosResponse<AgentWalletBalance>) => {
          setWalletBalance(res.data);
        })
        .catch(err => {
          console.error('Wallet Error', err);
        });
    }
  }, [session?.user.id_token]);

  const evaluateModalStep = () => {
    if (walletBalance.earnings.available >= 50) {
      setOpenUserWithdrawForm(true);
      return;
    }
    setShowTest(true);
  };

  return (
    <>
      <Modal open={showTest} onClose={() => setShowTest(false)}>
        <div className={styles.insuficient_funds_modal}>
          <h1 className={styles.insuficient_funds_modal__title}>
            {t('profile.wallet.modal.error.title')}
          </h1>
          <p className={styles.insuficient_funds_modal__content}>
            {t('profile.wallet.modal.error.text')}
          </p>
          <button
            className={styles.insuficient_funds_modal__button}
            onClick={() => setShowTest(false)}
          >
            {t('profile.wallet.modal.error.button')}
          </button>
        </div>
      </Modal>

      <ModalUserWithdrawForm
        open={openUserWithdrawForm}
        onClose={() => setOpenUserWithdrawForm(false)}
        onSubmit={value => setWithdrawlMessage(value)}
      />
      <InfoPopup
        open={withdrawlMessage !== ''}
        onClose={() => setWithdrawlMessage('')}
        title={
          withdrawlMessage === 'success'
            ? t('profile.wallet.modal.success.title')
            : t('profile.wallet.modal.error.title')
        }
        info={
          (withdrawlMessage === 'success'
            ? t('profile.wallet.modal.success.text')
            : withdrawlMessage === 'error'
              ? t('profile.wallet.modal.error.text')
              : t('profile.wallet.modal.insufficient-funds')) || ''
        }
      />

      {/* Progress bars */}
      {cashbackIsActive ? (
        <div className="flex flex-wrap md:flex-nowrap lg:flex-wrap xl:flex-nowrap gap-[36px] relative mt-[10px] p-[18px] pb-[44px] bg-white/10 rounded-2xl">
          <div className="w-full">
            <div className="flex justify-between items-center mb-[15px]">
              <div className="flex items-center gap-[5px] text-[12px] font-[590] text-white">
                {t('paymentreg.WL.money-back')}
                <Image src={infoIcon} width={16} height={16} alt="Info" />
              </div>
              <div className="flex text-[30px] font-[650] text-white leading-[normal] scale-y-[0.7]">
                {walletBalance.sales.total || 0}$
              </div>
            </div>
            <div className="relative pointer-events-none">
              <div className="absolute -top-[5px] -left-[6px] w-[15px] h-[15px] bg-whiteLabelColor rounded-full"></div>
              <Slider
                className="profileSlider"
                value={walletBalance.sales.total}
                min={0}
                max={25000}
                progress
                renderTooltip={(value: number | undefined) => (
                  <div className="w-[50px] text-center">{`${value}$`}</div>
                )}
              />
              {/* didnt delete it because maybe this slider will be needed */}
              {/* <Slider
              className="profileSlider"
              value={Totalsales}
              min={0}
              max={25000}
              progress
              renderTooltip={(value: number | undefined) => (
                <div className="w-[50px] text-center">{`${value}$`}</div>
              )}
            /> */}
              <div className="absolute -top-[5px] -right-[4px] w-[15px] h-[15px] bg-[#3C3C3C] rounded-full"></div>
              <div className="absolute top-[14px] text-[12px] font-[590] text-white">
                {walletBalance.sales.total >= 5000 && '0$'}
              </div>
              <div className="absolute right-0 top-[14px] text-[12px] font-[590] text-white">
                {walletBalance.sales.total >= 17200 ? '' : '25000$'}
              </div>
            </div>
          </div>

          {/* <div className="hidden md:block lg:hidden xl:block absolute left-1/2 h-[100px] w-[1px] bg-[#3C3C3C]"></div>

        <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
          <div className="flex items-center justify-between gap-[5px] text-[12px] font-[590] text-white">
            <div className="flex gap-[5px]">
              Flyway's Coins
              <Image
                className="cursor-pointer"
                src={infoIcon}
                width={16}
                height={16}
                alt="Info"
              />
            </div>
            <div className="flex gap-[7px]">
              <div className="flex items-center justify-center w-6 h-6 text-[8px] font-[590] bg-whiteLabelColor rounded-full">
                100
              </div>
              <div className="flex items-center justify-center w-6 h-6 text-[8px] font-[590] bg-whiteLabelColor rounded-full">
                200
              </div>
              <div className="flex items-center justify-center w-6 h-6 text-[8px] font-[590] bg-whiteLabelColor rounded-full">
                500
              </div>
              <div
                className={`flex items-center justify-center w-6 h-6 text-[8px] font-[590] rounded-full ${
                  coins > 999 ? 'bg-whiteLabelColor' : 'bg-[#3C3C3C]'
                }`}
              >
                {coins > 999 && 1000}
              </div>
            </div>
          </div>
          <div className="flex mb-[8px] text-[30px] font-[650] text-white scale-y-[0.7]">
            500 C
          </div>
          <div className="relative pointer-events-none">
            <Slider
              className="progress-slider"
              progress
              // readOnly
              min={500}
              max={1000}
              value={700}
              renderTooltip={(value: number | undefined) => (
                <div>{`${value}C`}</div>
              )}
            />
            <div className="absolute top-[14px] text-[12px] font-[590] text-white">
              500C
            </div>
            <div className="absolute right-0 top-[14px] text-[12px] font-[590] text-white">
              1000C
            </div>
          </div>
        </div> */}
        </div>
      ) : null}
      {/* End progress bars */}

      <div
        data-testid="profile-wallet-about"
        className="xxs:w-full mx-auto xxs:text-center mt-4"
      >
        <div className="flex bg-white/10 rounded-2xl">
          <div className="w-1/2 p-6">
            <div className="flex flex-col gap-y-2 max-w-full">
              <label
                style={{
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                }}
                className="text-white/70 text-base"
              >
                {t('withdraw.totalSales')}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    marginLeft: '10px',
                  }}
                >
                  <Image
                    src={starblank}
                    width={20}
                    height={20}
                    alt={'sales'}
                    style={{
                      width: 'auto',
                      height: 'auto',
                      minWidth: '20px', // Tamaño mínimo de la imagen
                      minHeight: '20px', // Tamaño mínimo de la imagen
                    }}
                  />
                </div>
              </label>
            </div>
            <div className="flex justify-between gap-5 items-center w-full pr-6">
              <div className="flex items-center gap-3 xs:flex-row xs:gap-6">
                <Image src={dollar} width={20} height={20} alt={'sales'} />
                <div className="text-xl flex gap-1">
                  <label className="text-5xl text-white opacity-[1]">
                    {walletBalance.sales.total}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div
            className="w-1/2 p-6"
            style={{ display: 'grid', justifyContent: 'space-between' }}
          >
            <div className="flex flex-col gap-y-2 max-w-full">
              <label
                style={{
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                }}
                className="text-white/70 text-base"
              >
                {t('withdraw.pendingSales')}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    marginLeft: '10px',
                  }}
                >
                  <Image
                    src={starblank}
                    width={20}
                    height={20}
                    alt={'sales'}
                    style={{
                      width: 'auto',
                      height: 'auto',
                      minWidth: '20px', // Tamaño mínimo de la imagen
                      minHeight: '20px', // Tamaño mínimo de la imagen
                    }}
                  />
                </div>
              </label>
            </div>
            <div className="flex justify-between gap-5 items-center w-full pr-6">
              <div className="flex items-center gap-3 xs:flex-row xs:gap-6">
                <Image
                  src={dollar}
                  width={20}
                  height={20}
                  alt={'sales'}
                  style={{
                    width: 'auto',
                    height: 'auto',
                    minWidth: '20px',
                    minHeight: '20px',
                  }}
                />
                <div className="text-xl flex gap-1">
                  <label className="text-5xl text-white opacity-[1]">
                    {walletBalance.sales.on_hold}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="xxs:w-full mx-auto xxs:text-center mt-4">
          <div className="flex bg-white/10 rounded-2xl">
            <div className="w-1/2 p-6">
              <div className="flex flex-col gap-y-2 max-w-full">
                <label
                  style={{
                    color: 'mediumslateblue',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  className="text-white/70 text-base"
                >
                  {t('withdraw.commissionTotal')}
                  <div
                    style={{ marginLeft: '10px' }}
                    className="inline-flex border-left"
                  >
                    <Image
                      src={salesIcon}
                      width={20}
                      height={20}
                      alt={'sales'}
                      style={{
                        width: 'auto',
                        height: 'auto',
                        minWidth: '20px', // Tamaño mínimo de la imagen
                        minHeight: '20px', // Tamaño mínimo de la imagen
                      }}
                    />
                  </div>
                </label>
              </div>
              <div className="flex justify-between gap-5 items-center w-full pr-6">
                <div className="flex items-center gap-3 xs:flex-row xs:gap-6">
                  <Image src={dollar} width={20} height={20} alt={'sales'} />
                  <div className="text-xl flex gap-1">
                    <label className="text-5xl text-white opacity-[1]">
                      {walletBalance.commissions.total}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-1/2 p-6">
              <div className="flex flex-col gap-y-2 max-w-full">
                <label
                  style={{
                    color: 'mediumslateblue',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  className="text-white/70 text-base"
                >
                  {t('withdraw.Pendingcommission')}
                  <div
                    style={{ marginLeft: '10px' }}
                    className="inline-flex border-left"
                  >
                    <Image
                      src={salesIcon}
                      width={20}
                      height={20}
                      alt={'commission'}
                      style={{
                        width: 'auto',
                        height: 'auto',
                        minWidth: '20px', // Tamaño mínimo de la imagen
                        minHeight: '20px', // Tamaño mínimo de la imagen
                      }}
                    />
                  </div>
                </label>
              </div>
              <div className="flex justify-between gap-5 items-center w-full pr-6">
                <div className="flex items-center gap-3 xs:flex-row xs:gap-6">
                  <Image
                    src={dollar}
                    width={20}
                    height={20}
                    alt={'commission'}
                  />
                  <div className="text-xl flex gap-1">
                    <label className="text-5xl text-white opacity-[1]">
                      {walletBalance.commissions.on_hold}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="xxs:w-full mx-auto xxs:text-center mt-4">
          <div className="flex bg-white/10 rounded-2xl">
            <div
              className="w-1/2 p-6 flex flex-col justify-start"
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <div className="flex flex-col gap-y-2 max-w-full">
                <label
                  style={{
                    color: '#21CF7B',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  className="text-white/70 text-base"
                >
                  <div className="flex items-center">
                    <span>{t('withdraw.Earnedsofar')}</span>
                    <div
                      style={{ marginLeft: '10px' }}
                      className="inline-flex border-left"
                    >
                      <Image
                        src={diamond}
                        width={20}
                        height={20}
                        alt={'sales'}
                        style={{
                          width: 'auto',
                          height: 'auto',
                          minWidth: '20px',
                          minHeight: '20px',
                        }}
                      />
                    </div>
                  </div>
                </label>
              </div>
              <div className="flex justify-between gap-5 items-end w-full pr-6">
                <div className="flex items-end gap-3 xs:flex-row xs:gap-6">
                  <Image src={dollar} width={20} height={20} alt={'sales'} />
                  <div className="text-xl flex gap-1">
                    <div
                      className="text-5xl text-white opacity-[1]"
                      style={{
                        alignSelf: 'flex-end',
                        verticalAlign: 'middle',
                      }}
                    >
                      {walletBalance.earnings.withdrawn}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-1/2 p-6">
              <div className="flex flex-col gap-y-2 max-w-full">
                <label
                  style={{
                    color: '#21CF7B',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  className="text-white/70 text-base"
                >
                  {t('withdraw.commission')}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      marginLeft: '10px',
                    }}
                  >
                    <Image
                      src={diamond}
                      width={20}
                      height={20}
                      alt={'commission'}
                      style={{
                        width: 'auto',
                        height: 'auto',
                        minWidth: '20px',
                        minHeight: '20px',
                      }}
                    />
                  </div>
                </label>

                <div className="flex justify-between gap-5 items-center w-full pr-6">
                  <div className="flex items-end gap-3 xs:flex-row xs:gap-6">
                    <Image
                      src={dollar}
                      width={20}
                      height={20}
                      alt={'commission'}
                    />
                    <div className="text-xl flex gap-1">
                      <div
                        className="text-5xl text-white opacity-[1]"
                        style={{
                          alignSelf: 'flex-end',
                          verticalAlign: 'middle',
                        }}
                      >
                        {walletBalance.earnings.available}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center mt-6 lg:justify-start">
          <button
            data-testid="profile-wallet-withdraw"
            onClick={() => evaluateModalStep()}
            className="bg-whiteLabelColor w-[238.16px] h-[48px] rounded-3xl text-base font-[760] text-black"
          >
            {t('withdraw.withdraw')}
          </button>
        </div>
      </div>
    </>
  );
};

export default Wallet;
