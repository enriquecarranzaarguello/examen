import { useState, FormEvent } from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import type { ModalWithDrawFormProps } from '@typing/proptypes';

import IconCloseBlack from '@icons/close-black.svg';
import paypal from '@icons/paypal.svg';
import bankIcon from '@icons/bankIcon.svg';
import { useSession } from 'next-auth/react';
import { AgentWithDrawType } from '@typing/types';
import numeral from 'numeral';
import { requestWalletWithdrawl } from '@utils/axiosClients';
import { LoadingSpinner } from '@components/profile/atoms';

const ModalUserWithdrawForm: React.FC<ModalWithDrawFormProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState('paypal');
  const [approveWithdraw, setApproveWithdraw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AgentWithDrawType>({
    email: '',
    account_full_name: '',
    bank_name: '',
    bank_account_address: '',
    swift_number: '',
    account_number: '',
    amount_to_withdrwal: null,
    payment_method: 'paypal',
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    requestWalletWithdrawl(
      session?.user.id_token,
      formData,
      formData.payment_method === 'paypal'
    )
      .then(res => {
        onSubmit('success');
      })
      .catch(err => {
        if (err?.response?.status === 403) onSubmit('funds');
        else onSubmit('error');
        console.error('Wallet Error: ', err);
      })
      .finally(() => {
        onClose();
        setLoading(false);
      });
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-[#23262F]/[.8] flex justify-center items-center z-[1080]">
        <div className="relative bg-[#141416] shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] rounded-[16px] p-10  h-auto max-h-[80%]">
          <button className="absolute -top-5 -right-5 " onClick={onClose}>
            <Image alt="icon" src={IconCloseBlack} />
          </button>
          <h2 className="w-full text-center mb-[63px] mx-auto text-[40px] font-[760] text-white">
            {t('withdraw.withdraw')}
          </h2>
          <div className="h-[calc(100vh-347px)] overflow-hidden overflow-y-auto scrollbar-hide">
            <div className="w-[544px] h-[auto flex flex-col">
              <div className="flex justify-center">
                <form onSubmit={handleSubmit} className="flex flex-col">
                  <input
                    className="bg-transparent border border-gray-500 rounded-3xl py-4 px-[7rem] text-white text-base outline-none"
                    placeholder={`${t('withdraw.withdraw_amount')}`}
                    type="text"
                    name="amount"
                    value={
                      formData.amount_to_withdrwal !== null
                        ? numeral(formData.amount_to_withdrwal).format('$0,0')
                        : ''
                    }
                    onChange={e => {
                      const value = numeral(e.target.value).value();
                      setFormData({
                        ...formData,
                        amount_to_withdrwal: isNaN(value) ? null : value,
                      });
                    }}
                  />
                  <div className="flex gap-2 items-center mt-2">
                    <input
                      className=""
                      type="checkbox"
                      name="paymentcheckbox"
                      onChange={e => setApproveWithdraw(e.target.checked)}
                      checked={approveWithdraw}
                    />
                    <label className="text-white text-xs" htmlFor="">
                      {t('withdraw.amount')}
                    </label>
                  </div>
                  {selectedOption === 'paypal' && (
                    <input
                      className=" bg-transparent border border-gray-500 rounded-3xl py-4 px-[7rem] text-white text-base outline-none mt-6"
                      placeholder={t('withdraw.paypal_email') || ''}
                      type="Email"
                      name="paypal_email"
                      value={formData.email}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                    />
                  )}
                  {selectedOption === 'paypal' && (
                    <div className="flex flex-col">
                      <h2 className="w-[290px] text-base text-white mt-[39px] mx-auto text-center">
                        {t('withdraw.method')}
                      </h2>
                    </div>
                  )}

                  <div className="relative">
                    <Image
                      className="absolute top-10 left-5"
                      src={selectedOption !== 'paypal' ? bankIcon : paypal}
                      width={16}
                      height={16}
                      alt="paypal"
                    />
                    <select
                      value={selectedOption}
                      onChange={e => {
                        setSelectedOption(e.target.value);
                        setFormData({
                          ...formData,
                          payment_method: e.target.value,
                        });
                      }}
                      className=" bg-transparent border border-gray-500 rounded-3xl py-4 w-full px-14 text-white text-base mx-auto mt-5 outline-none"
                    >
                      <option
                        value={'paypal'}
                        className="bg-[#151313d4] text-white scrollbar-hide backdrop-blur-lg text-lg"
                      >
                        PayPal
                      </option>
                      <option
                        value={'bank'}
                        className="bg-[#151313d4] text-white scrollbar-hide backdrop-blur-lg text-lg"
                      >
                        {t('withdraw.bank')}
                      </option>
                    </select>
                  </div>
                  {selectedOption === 'bank' && (
                    <div className="flex flex-col space-y-[16px] mt-[16px]">
                      <input
                        className=" bg-transparent border border-gray-500 rounded-3xl py-4 w-full px-4 text-white text-base outline-nonee"
                        placeholder={t('withdraw.email') || ''}
                        type="Email"
                        name="paypal_email"
                        value={formData.email}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            email: e.target.value,
                          })
                        }
                      />
                      <input
                        name="account_fullname"
                        type="text"
                        placeholder={`${t('withdraw.name')}`}
                        className=" bg-transparent border border-gray-500 rounded-3xl py-4 w-full px-4 text-white text-base outline-none"
                        value={formData.account_full_name || ''}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            account_full_name: e.target.value,
                          })
                        }
                      />
                      <input
                        name="bank_name"
                        type="text"
                        placeholder={`${t('withdraw.bank_name')}`}
                        className=" bg-transparent border border-gray-500 rounded-3xl py-4 w-full px-4 text-white text-base outline-none"
                        value={formData.bank_name || ''}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            bank_name: e.target.value,
                          })
                        }
                      />
                      <input
                        name="bank_address"
                        type="text"
                        placeholder={`${t('withdraw.address')}`}
                        className=" bg-transparent border border-gray-500 rounded-3xl py-4 w-full px-4 text-white text-base outline-none"
                        value={formData.bank_account_address || ''}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            bank_account_address: e.target.value,
                          })
                        }
                      />
                      <input
                        name="swift_number"
                        type="number"
                        placeholder={`${t('withdraw.swift')}`}
                        className=" bg-transparent border border-gray-500 rounded-3xl py-4 w-full px-4 text-white text-base outline-none"
                        value={
                          formData.swift_number
                            ? formData.swift_number.toString()
                            : ''
                        }
                        onChange={e =>
                          setFormData({
                            ...formData,
                            swift_number: e.target.value.toString(),
                          })
                        }
                      />

                      <input
                        name="account_number"
                        type="number"
                        placeholder={`${t('withdraw.account_number')}`}
                        className=" bg-transparent border border-gray-500 rounded-3xl py-4 w-full px-4 text-white text-base outline-none"
                        value={
                          formData.account_number
                            ? formData.account_number.toString()
                            : ''
                        }
                        onChange={e =>
                          setFormData({
                            ...formData,
                            account_number: e.target.value.toString(),
                          })
                        }
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className={`my-20 bg-whiteLabelColor rounded-full h-12 text-base text-black font-[760] ${
                      loading ? 'customTailwind' : ''
                    }`}
                    disabled={!approveWithdraw || loading}
                  >
                    {loading ? (
                      <LoadingSpinner size="small" />
                    ) : (
                      t('withdraw.withdraw')
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ModalUserWithdrawForm;
