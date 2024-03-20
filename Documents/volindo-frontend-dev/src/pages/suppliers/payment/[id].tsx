import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';

//Next imports
import { useRouter } from 'next/router';
import config from '@config';

import { useSession } from 'next-auth/react';

import { useTranslation } from 'next-i18next';
import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nextConfig from 'next-i18next.config';
import { passStringToDate } from '@utils/timeFunctions';

import {
  SEO,
  Step,
  BookingLayout,
  StripePayment,
  ConektaPayment,
  LoadingSpinner,
  SelectTypePayment,
} from '@components';

import { payTravelerProposal, getProposalDetails } from '@utils/axiosClients';

//Icons
import calendarIcon from '@icons/calendar.svg';
import clockIcon from '@icons/clock-gray.svg';
import IconCloseBlack from '@icons/close-black.svg';
import { usePrice } from '@components/utils/Price/Price';

export const getServerSideProps: GetServerSideProps = async context => {
  const { locale } = context;

  const translation = await serverSideTranslations(
    locale || 'en',
    ['common'],
    nextI18nextConfig
  );

  return {
    props: {
      ...translation,
    },
  };
};

const SupplierPayment = () => {
  const router = useRouter();
  const price = usePrice();
  const { data: session, status } = useSession();
  const { t, i18n } = useTranslation('common');

  const [resTabs, setResTabs] = useState('Payment');
  const [isChecked, setIsChecked] = useState(false);

  const [showCancelPolicy, setShowCancelPolicy] = useState<boolean>(false);

  //Payment States
  const [activeServicePayment, setActiveServicePayment] = useState('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [checkoutId, setCheckoutId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Extra
  const [proposalInfo, setProposalInfo] = useState<any>({});
  const [bookingId, setBookingId] = useState('');
  const [agentId, setAgentId] = useState('');

  const proposalId = router.query.id;

  useEffect(() => {
    if (typeof proposalId === 'string') {
      const params = proposalId.split('--');

      if (params.length === 2) {
        setBookingId(params[0]);
        setAgentId(params[1]);

        getProposalInfo(params[0], params[1]);
      }
    }
  }, [proposalId]);

  const getProposalInfo = (bookingId: string, agentId: string) => {
    if (bookingId && agentId) {
      axios(`${config.api}/bookings/${bookingId}||${agentId}`)
        .then(res => {
          setProposalInfo(res.data);
        })
        .catch(err => {
          console.error(err);
        });
    }
  };

  const clearPaymentData = () => {
    setMessage('');
    setCheckoutId('');
    setClientSecret('');
  };

  const email =
    Object.keys(proposalInfo).length > 0
      ? proposalInfo?.main_contact[0]?.email
      : '';

  const userEmail = email ? email : t('payment.payment_state');

  const getClientData = (
    service: string,
    currency: string,
    phone_number: string,
    plazo: string,
    amount: string,
    paymentMethod: string
  ) => {
    setLoading(true);
    const body = {
      currency: 'USD',
      supplier_name: proposalInfo?.agent?.account_email,
      agent_id: agentId,
      product_name: 'supplier reservation',
      phone_number: phone_number,
      total: amount,
      provider_payment: service,
      plazo: plazo,
      payment_method: paymentMethod,
      traveler_id: proposalInfo?.main_contact[0]?.traveler_id,
      display_total: amount,
      display_currency: 'USD',
      supplier_id: proposalInfo?.service?.supplier_id || '',
    };
    payTravelerProposal(session?.user.id_token || '', bookingId, body)
      .then(res => {
        clearPaymentData();
        if (res?.data?.data?.secret) {
          setClientSecret(res?.data?.data?.secret);
        } else if (res?.data?.data?.checkout_id?.checkout_id) {
          setCheckoutId(res?.data?.data?.checkout_id?.checkout_id);
        } else {
          setMessage(`${i18n.t('payment.oxxo_pay', { EMAIL: userEmail })}`);
        }
      })
      .catch(err => {
        setMessage(`${t('payment.error_on_payment')}`);
        if (err.response.status === 409) {
          setMessage(`${t('payment.error_on_amount')}`);
        }
      })
      .finally(() => setLoading(false));
  };

  const handlePaymentService = (
    service: 'stripe' | 'conekta',
    plan = '',
    currency = '',
    phone_number = '',
    plazo = '',
    amount = '',
    payment_method = ''
  ) => {
    setMessage('');
    setClientSecret('');
    setCheckoutId('');
    setActiveServicePayment(service);
    if (service === 'conekta' && phone_number) {
      getClientData(
        service,
        currency,
        phone_number,
        plazo,
        amount,
        payment_method
      ); // First call
    } else if (service === 'stripe') {
      getClientData(
        service,
        currency,
        phone_number,
        plazo,
        amount,
        payment_method
      );
    }
  };

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    const options = {
      weekday: 'short' as const,
      month: 'short' as const,
      day: 'numeric' as const,
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);

    if (hour > 12) {
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      return `${formattedHour}:${minutes} pm`;
    } else if (hour >= 22) {
      return '10 pm';
    } else {
      return `${hour}:${minutes} am`;
    }
  };

  const handlePriceAccomodation = (
    total: number,
    rooms: Array<any> | number
  ) => {
    let totalGuest = 0;
    if (typeof rooms === 'number') {
      return (total / rooms).toFixed(1);
    } else {
      for (let i = 0; i < rooms.length; i++) {
        totalGuest += rooms[i].accommodation_number_of_people_permitted;
      }
    }
    return price.integerWithOneDecimal(total / totalGuest);
  };

  const handleNumberOfPeople = (rooms: Array<any>) => {
    let totalGuest = 0;
    for (let i = 0; i < rooms.length; i++) {
      totalGuest += rooms[i].accommodation_number_of_people_permitted;
    }
    return totalGuest;
  };

  return (
    <>
      {showCancelPolicy && (
        <div className="fixed inset-0 bg-[#23262F]/[.8] flex justify-center items-center z-50">
          <div className="relative bg-[#141416] shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] w-screen h-screen lg:w-[544px] lg:h-[232px] rounded-[16px] px-[96px]">
            <button
              className="absolute right-7 top-[60px] lg:-top-5 lg:-right-6"
              onClick={() => setShowCancelPolicy(false)}
            >
              <Image alt="icon" src={IconCloseBlack} />
            </button>
            <div className="w-full h-full text-white flex justify-center items-center flex-col gap-3">
              <h2 className="text-2xl font-[760]">Cancellation Policy</h2>
              <p>
                {proposalInfo?.supplierProfile?.[0].cancel_policies &&
                  proposalInfo?.supplierProfile?.[0].cancel_policies.replace(
                    /[^a-zA-Z0-9 ]/g,
                    ' '
                  )}
              </p>
              <p>{proposalInfo?.supplierProfile?.[0].cancel_policies_2}</p>
            </div>
          </div>
        </div>
      )}
      <SEO title="Payment Page" />
      <BookingLayout isPublic={true} agentId={agentId}>
        <div className="w-[60%] h-full mx-auto flex flex-col">
          <Step actualStep="Payment" />
          <div className="flex flex-col md:flex-row gap-10">
            <div className="w-full h-full md:h-fit md:w-1/2 bg-[#242424] mb-5 p-[30px] rounded-[24px]">
              <h2 className="font-[700] text-white text-[24px] capitalize leading-normal mb-[25px]">
                {t('payment.payment-details')}
              </h2>
              <div className="flex items-center justify-center flex-col">
                <SelectTypePayment
                  handlePaymentService={handlePaymentService}
                  paymentCase="Suppliers"
                  time={1}
                  price={proposalInfo?.payments?.[0].total}
                  services={{
                    stripeShow: true,
                    conektaShow: true,
                    mercadoShow: false,
                  }}
                />
                {loading && <LoadingSpinner size="big" />}
                {message && (
                  <div className="w-full flex items-center justify-center text-center md:text-left">
                    <p className="text-center text-white text-sm">{message}</p>
                  </div>
                )}
                {checkoutId && activeServicePayment === 'conekta' && (
                  <ConektaPayment
                    checkoutRequestId={checkoutId}
                    service="hotels"
                    redirectUrl={
                      `${window.location.origin}/suppliers/proposal/confirmation/${proposalId}` ||
                      '/'
                    }
                  />
                )}
                {clientSecret && activeServicePayment === 'stripe' && (
                  <div className="w-full h-fit">
                    <StripePayment
                      className=""
                      clientSecret={clientSecret}
                      type="payment"
                      redirectUrl={
                        `${window.location.origin}/suppliers/proposal/confirmation/${proposalId}` ||
                        '/'
                      }
                      confirmationOutside={false}
                      paymentConfirmed={false}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="w-full md:w-1/2 bg-[#F6F5F7] p-5 rounded-[40px] h-fit">
              <h2 className="font-[590] text-[20px] text-[#0C0C0C]">
                {t('suppliers.supplier-traveler')}
              </h2>
              {proposalInfo ? (
                <>
                  {/* Name Details */}
                  <div className="w-full bg-white rounded-2xl p-5">
                    <div className="flex flex-row">
                      <div className="font-[400] text-[12px] w-1/2 text-[#272727] bg-opacity-50">
                        {t('stays.placeholder-first-name')}
                        <p className="font-[400] text-[14px] text-black">
                          {proposalInfo?.main_contact?.[0].first_name ||
                            'No name available'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row pt-2">
                      <div className="font-[400] text-[12px] w-1/2 text-[#272727] bg-opacity-50">
                        {t('stays.placeholder-phone')}
                        <p className="font-[400] text-[14px] text-black">
                          {proposalInfo?.main_contact?.[0].phone_number || ''}
                        </p>
                      </div>
                      <div className="font-[400] text-[12px] w-1/2 text-[#272727] bg-opacity-50">
                        {t('stays.placeholder-email')}
                        <p className="font-[400] text-[14px] min-w-[10px] text-black wrap truncate max-w-[100%]">
                          {proposalInfo?.main_contact?.[0].email || ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Date Details */}
                  {proposalInfo?.service?.rooms[0]?.accommodation_checkin ||
                  proposalInfo?.service?.date_checkin ||
                  proposalInfo?.service?.service_time ? (
                    <>
                      <div className="w-full bg-white rounded-2xl p-5 mt-5">
                        <div className="flex flex-row">
                          {proposalInfo?.service?.rooms[0]
                            ?.accommodation_checkin ||
                          proposalInfo?.service?.date_checkin ? (
                            <>
                              <div className="font-[400] text-[12px] w-1/2 text-[#272727] bg-opacity-50">
                                {t('suppliers.check-in')}
                                <div className="flex flex-row gap-3 items-center">
                                  <Image
                                    src={calendarIcon}
                                    alt="Calendar"
                                    width={18}
                                    height={18}
                                  />

                                  <p className="text-black text-[14px] font-[400] capitalize">
                                    {passStringToDate(
                                      proposalInfo?.service?.rooms[0]
                                        ?.accommodation_checkin ||
                                        proposalInfo?.service?.date_checkin ||
                                        '',
                                      i18n.language
                                    )}
                                  </p>
                                </div>
                              </div>
                            </>
                          ) : null}

                          {proposalInfo?.service?.supplier_type ===
                          'accommodation' ? (
                            <>
                              {proposalInfo?.service?.rooms[0]
                                ?.accommodation_date_checkout && (
                                <div className="font-[400] text-[12px] w-1/2 text-[#272727] bg-opacity-50">
                                  {t('suppliers.check-out')}
                                  <div className="flex flex-row gap-3 items-center">
                                    <Image
                                      src={calendarIcon}
                                      alt="Calendar"
                                      className=""
                                    />
                                    <p className="text-black text-[14px] font-[400] capitalize">
                                      {passStringToDate(
                                        proposalInfo?.service?.rooms[0]
                                          ?.accommodation_date_checkout || '',
                                        i18n.language
                                      )}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              {proposalInfo?.service?.service_time && (
                                <div className="font-[400] text-[12px] w-1/2 text-[#272727] bg-opacity-50">
                                  Time
                                  <div className="flex flex-row gap-3 items-center">
                                    <Image
                                      src={clockIcon}
                                      alt="Clock Icon"
                                      width={18}
                                      height={18}
                                    />
                                    <p className="text-black text-[14px] font-[400]">
                                      By{' '}
                                      {formatTime(
                                        proposalInfo?.service?.service_time
                                      )}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  ) : null}

                  <div className="w-full bg-white rounded-2xl p-5 mt-5 text-[#272727]">
                    <h3>{t('stays.summary')}</h3>
                    <div className="flex flex-row w-full justify-between items-center">
                      <p className="text-[14px] text-black font-[510]">
                        {proposalInfo?.service?.supplier_type ===
                          'accommodation' &&
                        proposalInfo?.payments?.[0]?.total ? (
                          <span>
                            {price.countrySymbol}
                            {handlePriceAccomodation(
                              proposalInfo?.payments?.[0]?.total,
                              proposalInfo?.service?.rooms
                            )}
                          </span>
                        ) : (
                          <span>
                            {price.countrySymbol}
                            {proposalInfo?.payments?.[0]?.total &&
                            proposalInfo?.service?.number_of_people_permitted
                              ? handlePriceAccomodation(
                                  proposalInfo?.payments?.[0]?.total,
                                  proposalInfo?.service
                                    ?.number_of_people_permitted
                                )
                              : proposalInfo?.payments?.[0]?.total ||
                                proposalInfo?.payments?.[0]?.subtotal}{' '}
                          </span>
                        )}{' '}
                        x{' '}
                        {proposalInfo?.service?.supplier_type ===
                        'accommodation' ? (
                          <span>
                            {handleNumberOfPeople(proposalInfo?.service?.rooms)}{' '}
                            {proposalInfo?.service?.rooms.length > 1
                              ? 'people'
                              : 'per person'}
                          </span>
                        ) : (
                          <>
                            {proposalInfo?.service
                              ?.number_of_people_permitted ? (
                              <span>
                                {proposalInfo?.service
                                  ?.number_of_people_permitted < 1
                                  ? `${proposalInfo?.service?.number_of_people_permitted} per person`
                                  : `${proposalInfo?.service?.number_of_people_permitted} people`}
                              </span>
                            ) : (
                              <span>per person</span>
                            )}
                          </>
                        )}
                      </p>
                      <p className="text-[14px] text-black text-[510]">
                        {price.countrySymbol}
                        {price.integerTotal(
                          proposalInfo?.payments?.[0]?.total || 0
                        )}
                      </p>
                    </div>
                    <div className="flex flex-row justify-between mt-2">
                      <p className="text-whiteLabelColor font-[700] text-[16px]">
                        Total
                      </p>
                      <p className="text-whiteLabelColor font-[700] text-[16px]">
                        {price.countrySymbol}
                        {price.integerTotal(
                          proposalInfo?.payments?.[0]?.total || 0
                        )}
                      </p>
                    </div>
                  </div>
                  {/* Buttons */}
                  <div className="flex flex-row gap-3 items-center text-[#272727] bg-opacity-50 py-2">
                    <p className="w-full flex items-center justify-center text-center">
                      <span
                        onClick={() => setShowCancelPolicy(true)}
                        className="underline capitalize cursor-pointer"
                      >
                        {t('suppliers.cancellation-policy-text-2')}
                      </span>
                    </p>
                  </div>
                </>
              ) : (
                <LoadingSpinner size="big" />
              )}
            </div>
          </div>
        </div>
      </BookingLayout>
    </>
  );
};

export default SupplierPayment;
