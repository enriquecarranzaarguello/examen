import { useState, useEffect } from 'react';
import axios from 'axios';
import { Checkbox } from 'rsuite';

import { getHotelData, payHotelProposal } from '@utils/axiosClients';
import config from '@config';
import { io } from 'socket.io-client';

// Client Imports
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import SelectTypePayment from '@components/payment/SelectTypePayment';

import HotelLoader from '@components/HotelLoader';

import { Lottie } from '@components/Lottie';

import { usePrice } from '@components/utils/Price/Price';

import {
  DetailsCard,
  SEO,
  StripePayment,
  ConektaPayment,
  LoadingSpinner,
  ModalCancellationPolicy,
  ModalRateConditions,
  Step,
  BookingLayout,
} from '@components';

export async function getServerSideProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
}

const InternalPaymentHotel = () => {
  const { t, i18n } = useTranslation('common');
  const { data: session } = useSession();
  const router = useRouter();

  const [check, setCheck] = useState('0');
  const [openPolicies, setOpenPolicies] = useState(false);
  const [showRateConditions, setShowRateConditions] = useState(false);
  const [data, setData] = useState<any>({});
  const [hotelData, setHotelData] = useState<any>({});
  const [activeServicePayment, setActiveServicePayment] = useState('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [checkoutId, setCheckoutId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorModal, setErrorModal] = useState<boolean>(false);
  const [bookingId, setBookingId] = useState('');
  const [agentId, setAgentId] = useState('');

  const price = usePrice();

  useEffect(() => {
    const socket = io(`${config.socket_api}`);

    if (router.query && router.query.slug) {
      const slug = router.query.slug as string;
      const parts = slug.split('--');

      if (parts.length === 2) {
        const getDetails = async (bookingId: string, agentId: string) => {
          setBookingId(bookingId);
          setAgentId(agentId);
          if (router.query.success === 'confirmation') {
            router.push(
              `${window.location.protocol}//${window.location.hostname}/reservations/details/${bookingId}--${agentId}`
            );
          }
          const response = await getHotelData(bookingId, agentId);
          if (response.status === 200) {
            setData(response.data);
            getData(bookingId, agentId);
          }
        };
        getDetails(parts[0], parts[1]);
      } else {
        console.log('La cadena no tiene el formato esperado');
      }
    } else {
      console.log("No se encontró el parámetro 'slug' en la URL");
    }
  }, []);

  const getData = async (bookingId: string, agentId: string) => {
    const roomsStatic = [
      {
        Name: [''],
        DayRates: [
          [
            {
              BasePrice: 0,
            },
          ],
        ],
        MealType: '',
        TotalTax: 0,
        Amenities: ['', ''],
        Inclusion: '',
        TotalFare: 0,
        BookingCode: '',
        IsRefundable: false,
        RoomPromotion: [''],
        WithTransfers: false,
        CancelPolicies: [
          {
            FromDate: '',
            ChargeType: '',
            CancellationCharge: 0,
          },
        ],
      },
    ];

    // move this to axios file
    const res = await fetch(`${config.api}/bookings/${bookingId}||${agentId}`);

    if (res.status === 200) {
      const result = await res.json();

      const reservation = result;

      const socket = io(`${config.socket_api}`);

      const message2 = {
        params: {
          rooms: reservation.service.search_parameters.rooms,
          check_in: reservation.service.search_parameters.check_in,
          check_out: reservation.service.search_parameters.check_out,
          currency: 'USD',
          city: null,
          hotel_id: reservation.service.id_meilisearch,
          nationality:
            reservation.service.search_parameters.nationality || 'US',
          room: {
            Name: reservation.service.name_room,
            MealType: reservation.service.meal_type,
            Inclusion: reservation.service.inclusion,
            WithTransfers: reservation.service.with_transfers,
            IsRefundable: reservation.service.is_refundable,
            CancelPolicies: reservation.service.cancel_policies,
            TotalFare: parseFloat(reservation.payments.provider_price),
          },
        },
      };

      socket.emit('hotel:one_hotel:search', JSON.stringify(message2));
      socket.emit('hotel:roomprice:update', JSON.stringify(message2));

      socket.on('hotel:roomprice:update', hotel => {
        const statuscode = hotel.status_code;
        const hotels = hotel.result;
        setHotelData({
          roomAmenities: reservation?.service?.roomAmenities,
          rateConditions: reservation.service.rateConditions,
          cancel_policies: reservation?.service?.cancel_policies,
          supplements: reservation?.service?.supplements,
          is_refundable: reservation?.service?.is_refundable,
          check_in_time: hotels[0]?.CheckInTime,
          check_out_time: hotels[0]?.CheckOutTime,
          agentId: agentId,
          agent: reservation?.agent,
          id: reservation?.booking_id,
          subtotal: hotels[0]?.Rooms[0]?.TotalFare,
          display_price: hotels[0]?.Rooms[0]?.TotalFare,
          display_total_price: hotels[0]?.Rooms[0]?.TotalFare,
          approved_at: 'null | string',
          provider_price: hotels[0]?.ProviderPrice,
          total_price: reservation?.payments?.total,
          agent_commission: reservation?.payments?.agent_commission,
          transaction_details: reservation.payments.transaction_details,
          recommendedPrice:
            reservation?.payments?.transaction_details?.recommendedPrice,
          reservation: {
            rooms: [hotels[0]?.Rooms],
          },
          rooms: hotels[0]?.Rooms,
          //rooms:[],
          contact: reservation?.main_contact,
          package: {
            hotel_name: hotels[0]?.HotelName,
            check_in: reservation?.service?.search_parameters?.check_in,
            check_out: reservation?.service?.search_parameters?.check_out,
            stars: hotels[0]?.HotelRating,
            Images: hotels[0]?.Images,
            id: hotels[0]?.Id,
            address: hotels[0]?.Address,
            external_id: '',
            latitude: parseFloat(hotels[0]?.Map.split('|')[0]),
            longitude: parseFloat(hotels[0]?.Map.split('|')[1]),
            hotel_amenities: hotels[0]?.HotelFacilities,
            hotel_pictures: hotels[0]?.Images,
            description: hotels[0]?.Description,
            price: hotels[0]?.LowestTotalFare,
            number_of_nights: 3,
            hotel: '',
            cheaper_room: '',
          },
        });
      });
    }
  };

  let contactInfo = [
    {
      title: t('stays.placeholder-first-name'),
      content: data?.main_contact?.[0]?.first_name || '',
    },
    {
      title: t('stays.placeholder-last-name'),
      content: data?.main_contact?.[0]?.last_name || '',
    },
    {
      title: t('stays.placeholder-phone'),
      content: data?.main_contact?.[0]?.phone || '',
    },
    {
      title: t('stays.placeholder-email'),
      content: data?.main_contact?.[0]?.email || '',
    },
  ];

  let dateInfo = [
    {
      title: 'Check-in',
      date: data?.service?.check_in || '',
      serviceTime: `From ${hotelData?.check_in_time}` || '',
    },
    {
      title: 'Check-out',
      date: data?.service?.check_out || '',
      serviceTime: `By ${hotelData?.check_out_time}` || '',
    },
  ];

  let paymentInfo = [
    {
      title: 'Resumen',
      price: hotelData?.total_price || 0,
      subtotal: hotelData?.subtotal + hotelData?.agent_commission || 0,
      recommendedPrice: hotelData?.recommendedPrice || 0,
      agentCommission: hotelData?.agent_commission || 0,
      transactionFee: hotelData?.transaction_details?.transactionFee || 0,
      rooms: hotelData?.transaction_details?.number_of_rooms || 0,
      adults: hotelData?.transaction_details?.number_of_adults || 0,
      children: hotelData?.transaction_details?.number_of_children || 0,
    },
  ];

  const clearPaymentData = () => {
    setMessage('');
    setCheckoutId('');
    setClientSecret('');
  };
  const email = hotelData?.contact?.[0]?.email;
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
      provider: service,
      currency: 'USD',
      phone_number: phone_number,
      plazo: plazo,
      payment_method: paymentMethod,
      amount: data?.payments?.total,
      product_name: 'booking_hotel',
      booking_id: parseInt(bookingId),
      hotel_name: data?.service?.hotel_name || 'No hotel Name',
      subtotal: hotelData?.rooms[0]?.TotalFare,
      provider_price: hotelData?.provider_price,
      agent_id: data?.agent_id,
      booking_code: hotelData?.rooms[0]?.BookingCode,
      traveler_id: data?.main_contact[0]?.travelerId,
      display_currency: price.countryCode,
      display_total: price.integerRate(data?.payments?.total),
    };

    payHotelProposal(body)
      .then((res: any) => {
        clearPaymentData();
        if (res?.data?.data?.secret) {
          setClientSecret(res?.data?.data?.secret);
        } else if (
          res.data?.data?.checkout_id?.checkout_id &&
          res.data?.data?.checkout_id?.checkout_id !== ''
        ) {
          setCheckoutId(res.data?.data?.checkout_id?.checkout_id);
        } else if (res?.data?.data?.message?.message == 'success') {
          setMessage(`${i18n.t('payment.oxxo_pay', { EMAIL: userEmail })}`);
        }
      })
      .catch((err: any) => {
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

  return (
    <>
      <BookingLayout isPublic={true} agentId={agentId}>
        <SEO title={'Payment Page'} description="" />
        {showRateConditions && data?.service?.rateConditions && (
          <ModalRateConditions
            open={showRateConditions}
            onClose={() => setShowRateConditions(false)}
            rateConditions={data?.service?.rateConditions}
          />
        )}
        {openPolicies && (
          <>
            {/* TODO Make destrucuring for data */}
            {data?.service?.cancel_policies && (
              <ModalCancellationPolicy
                open={openPolicies}
                onClose={() => setOpenPolicies(false)}
                policies={data?.service?.cancel_policies}
                supplements={hotelData?.supplements}
                isRefundable={hotelData?.rooms?.[0].IsRefundable || false}
              />
            )}
          </>
        )}

        <div className="w-full flex items-center justify-center flex-col px-[20px] max-w-[1100px] m-[0_auto]">
          <Step actualStep="Payment" />
          <div className="w-full flex flex-col-reverse md:flex-row gap-5">
            <div className="w-full md:w-[60%]">
              <div className="bg-[#242424] overflow-auto mb-5 p-[30px] rounded-[24px] flex items-center justify-center lg:pb-[40px]">
                <div className="w-full">
                  <h2 className="font-[700] text-white text-[24px] capitalize leading-normal mb-[25px]">
                    {t('payment.payment-details')}
                  </h2>
                  <SelectTypePayment
                    handlePaymentService={handlePaymentService}
                    paymentCase={'booking'}
                    time={1}
                    price={data?.payments?.total}
                    services={{
                      stripeShow: true,
                      conektaShow: true,
                      mercadoShow: false,
                    }}
                  />
                  {loading && (
                    <div className="w-full min-h-[385px] md:pb-16 flex items-center justify-center">
                      {!errorModal ? (
                        <LoadingSpinner size="big" />
                      ) : (
                        <p className="font-[400] text-[16px] leading-[20px] text-white my-2">
                          {t('paymentreg.WL.payment_error')}
                        </p>
                      )}
                    </div>
                  )}
                  {message && (
                    <div className="w-full flex items-center justify-center text-center md:text-left">
                      <p className="text-center text-white text-sm">
                        {message}
                      </p>
                    </div>
                  )}
                  {checkoutId && activeServicePayment === 'conekta' && (
                    <ConektaPayment
                      checkoutRequestId={checkoutId}
                      service="hotels"
                      redirectUrl={
                        `${window.location.protocol}//${window.location.hostname}/reservations/details/${bookingId}--${agentId}` ||
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
                          `${window.location.protocol}//${window.location.hostname}/reservations/details/${bookingId}--${agentId}` ||
                          '/'
                        }
                        confirmationOutside={false}
                        paymentConfirmed={false}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full md:w-[40%]">
              {Object.keys(hotelData).length === 0 ? (
                <div className="wrapperCarLoader">
                  <Lottie src={'/carLoader.json'} className="carLoader" />
                </div>
              ) : (
                <DetailsCard
                  data={contactInfo}
                  dateInfo={dateInfo}
                  paymentInfo={paymentInfo}
                  title={t('stays.reservation-details')}
                >
                  <div className="w-full items-center justify-center flex flex-row gap-1">
                    <p className="text-[12px] text-[#767676] capitalize">
                      <span
                        className="text-[12px] font-[600] underline cursor-pointer"
                        onClick={() => setOpenPolicies(true)}
                      >
                        {t('reservations.cancellation_text')}
                      </span>
                      <span> & </span>
                      <span
                        className="
                            underline py-2 cursor-pointer font-[600]"
                        onClick={() => setShowRateConditions(true)}
                      >
                        {t('stays.rate-conditions')}
                      </span>
                    </p>
                  </div>
                </DetailsCard>
              )}
            </div>
          </div>
        </div>
      </BookingLayout>
    </>
  );
};

export default InternalPaymentHotel;
