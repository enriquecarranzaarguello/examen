import React, { useState, useEffect } from 'react';
import {
  createFlightPayment,
  getFlightThankyou,
  getProposal,
  createDuffelPayment,
} from '@utils/axiosClients';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import paymentLogo from '@icons/paymentLogo.svg';
import { differenceInYears } from 'date-fns';
import dynamic from 'next/dynamic';

import {
  LoadingSpinner,
  StripePayment,
  ExtraServicesDropdown,
  SEO,
  ConektaPayment,
  Step,
  InfoPopup,
  ModalFlightCash,
  BookingLayout,
} from '@components';

const DuffelUpsales = dynamic(
  () => import('@components/flights/DuffelUpsales/DuffelUpsales'),
  {
    ssr: false,
  }
);

import SelectTypePayment from '@components/payment/SelectTypePayment';

import { useVariableValue } from '@devcycle/react-client-sdk';
import { ExtraServices } from '@context/slices/flightSlice/flightSlice';
import { ExtraServicesBuilder } from 'src/helpers/flights/ExtraServiceBuilder';
import { usePrice } from '@components/utils/Price/Price';
import { useRouter } from 'next/router';

// SRR
export async function fetchData(id: string, isDuffel: boolean = false) {
  if (isDuffel) {
    try {
      const response = await getProposal(id, true);
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 403) return error?.response?.data;
      else return undefined;
    }
  } else {
    const [a, b] = id.split('--');
    const body = {
      booking_id: a,
      agent_id: b,
    };

    try {
      const response = await getFlightThankyou(body);

      return response.data;
    } catch (error) {
      console.error('Error fetching data Confirmation:', error);
      return null;
    }
  }
}

export async function getServerSideProps({ params, locale, res }: any) {
  res.setHeader(
    'Cache-Control',
    'no-cache, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
  );
  const bookingIdentifier: string = params.slug;

  const isDuffel = bookingIdentifier.startsWith('D--');

  const fetchedData: any = await fetchData(params.slug, isDuffel);

  if (fetchedData === undefined) {
    return {
      redirect: {
        permanent: false,
        destination: '/404',
      },
    };
  }

  let data = fetchedData;
  let extraInfo: string = '';

  if (isDuffel) {
    if ('detail' in fetchedData) {
      extraInfo = fetchedData?.detail?.includes('similar')
        ? 'SIMILAR'
        : fetchedData?.detail?.includes('price')
          ? 'PRICE_CHANGED'
          : 'EXPIRED';
      data = fetchedData?.booking;
    }
  }

  if (data.payment === 'paid') {
    return {
      redirect: {
        permanent: true,
        destination: `/booking-flight/confirmation/${bookingIdentifier}`,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
      data,
      extraInfo,
      isDuffel,
    },
  };
}

const InternalPaymentFlights = ({ data, extraInfo, isDuffel }: any) => {
  const { t, i18n } = useTranslation('common');
  const [clientSecret, setClientSecret] = useState<string>('');
  const { flight_policies, general_details, flights } =
    data?.service?.selected_flight || {};
  const { service, main_contact, payments } = data;
  const [message, setMessage] = useState<string>('');
  const [checkoutId, setCheckoutId] = useState('');
  const [activeServicePayment, setActiveServicePayment] = useState('');
  const [confirmPay, setConfirmPay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flightExtraInfo, setFlightExtraInfo] = useState<string>(extraInfo);
  const [upsaleSelection, setUpsaleSelection] = useState<any>(null);
  const showDuffelUpsales = useVariableValue('duffel_upsales', false);
  const [extraServices, setExtraServices] = useState<ExtraServices | null>(
    null
  );
  const [transactionFee, setTransactionFee] = useState<number>(
    payments.extra_data.transaction_fee
  );
  const [total, setTotal] = useState<number>(payments.total);
  const [openModalFlightCash, setOpenModalFlightCash] =
    useState<boolean>(false);
  const [willPayInCash, setWillPayInCash] = useState<boolean>(false);
  const [renderAgainPayment, setRenderAgainPayment] = useState<number>(0);
  const [openReloadPopup, setOpenReloadPopup] = useState<boolean>(false);

  const price = usePrice();
  const router = useRouter();

  const handleOnChangeLoading = (actualLoading: boolean) => {
    //* This is to know if the payment finish (succesfully or with error, doesn't matter, just the proccess finished).
    if (!actualLoading) {
      setConfirmPay(false);
    }
  };

  const obtainBirthDay = (dob = '') => {
    const birthDate = new Date(dob);
    const currentDate = new Date();
    const age = differenceInYears(currentDate, birthDate);
    return age;
  };

  const cleanPayment = () => {
    setMessage('');
    setClientSecret('');
    setCheckoutId('');
    setActiveServicePayment('');
  };

  const getClientData = (
    service: string,
    currency: string,
    phone_number: string,
    plazo: string,
    amount: string,
    paymentMethod: string
  ) => {
    setLoading(true);

    if (isDuffel) {
      const bodyRequest: any = {
        display_currency: price.countryCode,
        display_total: price.integerRate(total),
        provider_payment: service,
        payment_method: paymentMethod,
        plazo: plazo,
      };

      if (upsaleSelection)
        bodyRequest.upsales = JSON.stringify(upsaleSelection);

      createDuffelPayment(
        `D--${data?.booking_id}--${data?.agent_id}`,
        bodyRequest
      )
        .then(res => {
          const data = res.data;
          if (data?.client_secret) {
            //Stripe
            setClientSecret(data?.client_secret?.secret);
            setCheckoutId('');
            setMessage('');
          } else if (
            // Conekta component
            data?.checkout_id?.checkout_id &&
            data?.checkout_id?.checkout_id !== ''
          ) {
            setCheckoutId(data?.checkout_id?.checkout_id);
            setMessage('');
            setClientSecret('');
          } else if (
            // Conekta Oxxo
            data?.message?.message === 'success' &&
            data?.message?.payment_method === 'OxxoPay'
          ) {
            setMessage(
              i18n.t('payment.oxxo_pay', {
                EMAIL: main_contact[0]?.email,
              }) || ''
            );
          }
        })
        .catch((err: any) => {
          if (err.response.status === 409) {
            setMessage(`${t('payment.error_on_amount')}`);
          } else {
            setMessage(`${t('payment.error_on_payment')}`);
          }
        })
        .finally(() => setLoading(false));
    } else {
      const bodyRequest = {
        booking_id: `${data?.booking_id}`,
        agent_id: data?.agent_id,
        currency: 'USD',
        total_fare: total,
        product_name: 'flights reservation',
        phone_number: phone_number,
        provider_payment: service,
        plazo: plazo,
        payment_method: paymentMethod,
        traveler_id: data?.main_contact[0]?.id,
        flight_name:
          data?.service?.selected_flight?.flights[0]?.arrival_details?.airline
            ?.operating.airline_name,
        display_currency: price.countryCode,
        displey_total: price.integerRate(total),
      };
      createFlightPayment(bodyRequest)
        .then((res: any) => {
          if (res?.data?.data?.secret) {
            //Stripe
            setClientSecret(res?.data?.data?.secret);
            setCheckoutId('');
            setMessage('');
          } else if (
            // Conekta Component
            res.data?.data?.checkout_id?.checkout_id &&
            res.data?.data?.checkout_id?.checkout_id !== ''
          ) {
            setCheckoutId(res.data?.data?.checkout_id?.checkout_id);
            setMessage('');
            setClientSecret('');
          } else if (res?.data?.data?.message?.message == 'success') {
            // Conekta Oxxo
            setMessage(
              i18n.t('payment.oxxo_pay', {
                EMAIL: main_contact[0]?.email,
              }) || ''
            );
          }
        })
        .catch((err: any) => {
          if (err.response.status === 409) {
            setMessage(`${t('payment.error_on_amount')}`);
          } else {
            setMessage(`${t('payment.error_on_payment')}`);
          }
        })
        .finally(() => setLoading(false));
    }
  };

  const handlePaymentFlight = (
    service: 'stripe' | 'conekta',
    plan = '',
    currency = '',
    phone_number = '',
    plazo = '',
    amount = '',
    payment_method = ''
  ) => {
    cleanPayment();
    setActiveServicePayment(service);
    if (
      payment_method === 'cash' &&
      isDuffel &&
      !willPayInCash &&
      data?.service?.booking_info?.type_booking !== 'hold_order'
    ) {
      setOpenModalFlightCash(true);
      return;
    }
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

  const handleUpsalesSelection = (selection: any) => {
    cleanPayment();
    setRenderAgainPayment(prev => prev + 1);
    let extraServices: ExtraServices | null = null;
    let subtotalExtraServices = 0;
    let transactionFee = payments.extra_data.transaction_fee;
    let total = payments.total;
    if (selection != null) {
      // Building extra services
      delete selection.data.passengers;
      delete selection.data.type;
      delete selection.data.metadata;
      delete selection.data.selected_offers;
      extraServices = ExtraServicesBuilder.buildExtraServices(
        flights,
        selection.passengers,
        selection.metadata
      );
      // Calculating subtotal extra services
      if (extraServices.baggages)
        subtotalExtraServices += extraServices.baggages.reduce(
          (acc, current) => acc + current.total_amount,
          0
        );
      if (extraServices.seats)
        subtotalExtraServices += extraServices.seats.reduce(
          (acc, current) => acc + current.total_amount,
          0
        );
      if (extraServices.cancel_full_refund)
        subtotalExtraServices += extraServices.cancel_full_refund.total_amount;
      // Calculating transaction fee and total
      transactionFee = (payments.subtotal + subtotalExtraServices) * 0.04;
      total = payments.subtotal + subtotalExtraServices + transactionFee;
    }
    setUpsaleSelection(selection);
    setExtraServices(extraServices);
    setTransactionFee(transactionFee);
    setTotal(total);
  };

  const handleFlightCash = () => {
    setOpenModalFlightCash(false);
    setWillPayInCash(true);
    setUpsaleSelection(null);
    setExtraServices(null);
    setTransactionFee(payments.extra_data.transaction_fee);
    setTotal(payments.total);
  };

  const handleOnCloseFlightCash = () => {
    setOpenModalFlightCash(false);
    cleanPayment();
    setRenderAgainPayment(prev => prev + 1);
  };

  const handleReload = () => {
    setOpenReloadPopup(false);
    router.reload();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpenReloadPopup(true);
    }, 600000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <BookingLayout isPublic={true} agentId={data?.agent_id}>
        <SEO title={t('SEO.payment')} />
        <ModalFlightCash
          open={openModalFlightCash}
          onClose={handleOnCloseFlightCash}
          onPayInCash={handleFlightCash}
        />
        {/* {clientSecret.length === 0 && <PlaneLoader />} */}
        <Step actualStep="Payment" />
        <InfoPopup
          key="PopupReload"
          open={openReloadPopup}
          onClose={handleReload}
          onClickButton={handleReload}
          title={t('flights.title-reload') || ''}
          info={t('flights.content-reload') || ''}
        />

        <div className="Container flex flex-wrap justify-center md:flex-nowrap md:gap-[50px]">
          <InfoPopup
            key="PopupInfo"
            open={flightExtraInfo !== ''}
            onClose={() => setFlightExtraInfo('')}
            title={
              (flightExtraInfo === 'EXPIRED'
                ? t('flights.validity.phrase-three')
                : t('flights.similar-flight-title')) || ''
            }
            info={
              (flightExtraInfo === 'SIMILAR'
                ? t('flights.similar-flight-content')
                : flightExtraInfo === 'PRICE_CHANGED'
                  ? t('flights.similar-flight-content-price')
                  : t('flights.expired')) || ''
            }
          />
          <section>
            <div className="w-[500px] h-auto bg-[#242424] p-[20px] rounded-[24px] flex flex-col items-center justify-center lg:pb-[40px] mb-5 overflow-scroll scrollbar-hide">
              <h2 className="font-[700] text-white text-[24px] leading-normal mb-[25px]">
                {t('payment.payment-details')}
              </h2>
              <SelectTypePayment
                key={renderAgainPayment}
                handlePaymentService={handlePaymentFlight}
                paymentCase={'flight'}
                time={1}
                price={total}
                disableCash={
                  isDuffel &&
                  service?.booking_info?.type_booking === 'instant_offer'
                }
                services={{
                  stripeShow: true,
                  conektaShow: true,
                  mercadoShow: false,
                }}
              />
              <div>
                {loading && (
                  <div className="w-full h-full flex items-center justify-center">
                    <LoadingSpinner size="big" className="" />
                  </div>
                )}
                {message && (
                  <div className="w-full flex items-center justify-center text-center md:text-left">
                    <p>{message}</p>
                  </div>
                )}
                {checkoutId && activeServicePayment === 'conekta' && (
                  <ConektaPayment
                    checkoutRequestId={checkoutId}
                    service="Flights"
                    redirectUrl={`${window.location.href.replace(
                      'payment',
                      'thank-you'
                    )}`}
                  />
                )}
                {clientSecret && activeServicePayment === 'stripe' && (
                  <div className="w-full">
                    <StripePayment
                      className=""
                      clientSecret={clientSecret}
                      type="payment"
                      redirectUrl={`${window.location.href.replace(
                        'payment',
                        'thank-you'
                      )}`}
                      confirmationOutside={false}
                      paymentConfirmed={confirmPay}
                      onChangeLoading={handleOnChangeLoading}
                    />
                    <div className="w-full items-start mt-5">
                      <Image src={paymentLogo} alt="security logos" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            {isDuffel &&
            general_details?.provider_data?.data?.offer_id &&
            data?.service?.booking_info?.type_booking !== 'hold_order' &&
            !willPayInCash &&
            showDuffelUpsales ? (
              <DuffelUpsales
                offer={data?.service?.booking_info?.relevant_data_from_provider}
                clientKey={general_details.provider_data.data.client_key}
                passengers={data.main_contact}
                idsOfPassengers={
                  general_details.provider_data.data.ids_of_passengers
                }
                onSelection={handleUpsalesSelection}
              />
            ) : null}
          </section>

          <div className="detailsContainer h-[50%] w-full mt-[20px] rounded-[24px] bg-[#F6F5F7] px-[15px] pt-[25px] md:max-w-[407px] md:mt-[0px]">
            <p className="text-black font-[590] text-[20px] mb-[12px]">
              {t('flights.details')}
            </p>

            {main_contact &&
              main_contact.map((contact: any, index: number) => {
                const { first_name, last_name, email, phone, dob } = contact;
                return (
                  <div
                    className="card flex min-h-[200px] p-[15px] flex-wrap bg-white rounded-[24px] mb-[15px]"
                    key={index}
                  >
                    <div className="w-[50%]">
                      <div className="font-[400] text-[12px] text-[#272727] mb-[8px]">
                        <span className="opacity-50">
                          {t('stays.placeholder-first-name')}
                        </span>
                        <p className="font-[400] text-[14px] leading-[23px] text-black">
                          {first_name} {last_name}
                        </p>
                      </div>

                      <div className="font-[400] text-[12px] text-[#272727] mb-[8px]">
                        <span className="opacity-50">
                          {t('agent.phone_number')}
                        </span>
                        <p className="font-[400] text-[14px] leading-[23px] text-black">
                          {phone}
                        </p>
                      </div>
                    </div>

                    <div className="w-[50%]">
                      <div className="font-[400] text-[12px] text-[#272727] mb-[8px]">
                        <span className="opacity-50">{t('stays.age')}</span>
                        <p className="font-[400] text-[14px] leading-[23px] text-black">
                          {obtainBirthDay(dob)}
                        </p>
                      </div>

                      <div className="font-[400] text-[12px] text-[#272727] mb-[8px]">
                        <span className="opacity-50">{t('common.dob')}</span>
                        <p className="font-[400] text-[14px] leading-[23px] text-black">
                          {dob}
                        </p>
                      </div>

                      <div className="font-[400] text-[12px] text-[#272727] mb-[8px]">
                        <span className="opacity-50">{t('agent.email')}</span>
                        <p className="font-[400] text-[14px] leading-[23px] text-black">
                          {email}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            <div className="card flex min-h-[150px] p-[15px] bg-white rounded-[24px] text-gray-400 mb-[15px] flex-col">
              <span className="text-[14px] font-[400] leading-[20px]">
                {t('common.cost')}
              </span>
              <div className="flex justify-between text-[#3E3E3E] text-[14px] font-[510] leading-[24px] mb-[10px]">
                <span>Ticket </span>
                <span>
                  {price.countrySymbol}{' '}
                  {price.integerWithOneDecimal(payments.subtotal)}
                </span>
              </div>
              <div className="w-full">
                <ExtraServicesDropdown
                  flights={flights}
                  flightPolicies={flight_policies}
                  extraServices={extraServices}
                />
              </div>
              <div className="flex justify-between text-[#3E3E3E] text-[14px] font-[510] leading-[24px] mb-[10px]">
                <span>{t('stays.transfer_fee')} </span>
                <span>
                  {price.countrySymbol}{' '}
                  {price.integerWithOneDecimal(transactionFee)}
                </span>
              </div>
              <div className="flex justify-between  text-[14px] font-[700] leading-[24px] mb-[10px] text-whiteLabelColor">
                <span>Total</span>{' '}
                <span>
                  {price.countrySymbol} {price.integerTotal(total)}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1 items-center mb-5 text-black">
              {payments.extra_data?.old_price ? (
                <div className="flex justify-between text-[#3E3E3E] text-[14px] font-[510] leading-[24px] mb-[10px]">
                  <span>{t('flights.price-change')}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </BookingLayout>
    </>
  );
};

export default InternalPaymentFlights;
