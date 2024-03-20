import React, { useEffect, useState } from 'react';

import type { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '@pages/api/auth/[...nextauth]';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nextConfig from 'next-i18next.config';

import { useRouter } from 'next/router';

import { HotelService } from '@services/HotelsService';
import { useAppSelector, useAppDispatch, clearState } from '@context';

import { PreebookInfo, GuestArray } from '@typing/types';
import { useTranslation } from 'react-i18next';

import { getDaysDifference } from '@utils/timeFunctions';

import { SummaryContainer } from '@containers';
import { Lottie } from '@components/Lottie';
import {
  BookingLayout,
  PriceDetails,
  HotelConfirmationAndFinish,
  HotelServiceCard,
  SEO,
  ModalGeneralText,
  ModalProposalConfirmation,
} from '@components';
import { useSession } from 'next-auth/react';

//server side props translation
export const getServerSideProps: GetServerSideProps = async context => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(
        context.locale || 'en',
        ['common'],
        nextI18nextConfig
      )),
      id_token: session.user.id_token,
    },
  };
};

const Proposal = () => {
  const router = useRouter();
  const { slug } = router.query;
  const hotelService = new HotelService();
  const { t, i18n } = useTranslation();
  const { data: session } = useSession();

  const searchParams = useAppSelector(state => state.hotels.searchParams);

  const [prebook, setPrebook] = useState<PreebookInfo>();
  const [hotelData, setHotelData] = useState<any>({});
  const [guests, setGuests] = useState<GuestArray[]>([]);
  const [paymentDetails, setPaymentDetails] = useState({
    commission: 0,
    transactionFee: 0,
    total: 0,
  });
  //ERROR STATES
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [textErrorModal, setTextErrorModal] = useState<string>('');
  const [titleErrorModal, setTitleErrorModal] = useState<string>('');
  const [errorCase, setErrorCase] = useState<number>(0);
  //NO ERROR OPEN PROPOSAL
  const [showModalConfirmation, setShowModalConfirmation] =
    useState<boolean>(false);
  const [showProposalNext, setShowProposalNext] = useState<boolean>(false);

  //Booking Ids
  const [bookingId, setBookingId] = useState<string>('');
  const [agentId, setAgentId] = useState<string>('');

  //Loaders
  const [loading, setLoading] = useState<boolean>(true);

  const amenitiesToDelete = [
    'Check-in',
    'Distance',
    'none',
    'Total number of rooms',
    'Floor',
    'Single room',
    'Twin room',
    'Apartment number',
    'Triple rooms',
    'suites',
    'Studios',
    'Family room',
    'Superior room',
    'Villas',
    'Annexe',
    'King-size bed',
  ];

  const handleGuest = (guests: GuestArray[]) => {
    setGuests(guests);
  };

  const handlePreebookError = (code: number) => {
    setShowErrorModal(true);
    setErrorCase(code);
    switch (code) {
      case 201:
        setTitleErrorModal(`${t('common.error_title')}`);
        setTextErrorModal(`${t('common.errors.not_available_room')}`);
        break;
      case 207:
        setTitleErrorModal(`${t('common.error_title')}`);
        setTextErrorModal(`${t('common.errors.rate_update')}`);
        break;
      case 315:
        setTitleErrorModal(`${t('common.errors.sessionExpired')}`);
        setTextErrorModal(`${t('common.errors.session_expired')}`);
        break;
      case 400:
        setTitleErrorModal(`${t('common.error_title')}`);
        setTextErrorModal(`${t('common.errors.invalid_request')}`);
        break;
      default:
        setTitleErrorModal('Oops');
        setTextErrorModal(`${t('stays.not-found')}`);
        break;
    }
  };

  useEffect(() => {
    if (slug && typeof slug === 'string') {
      const message = {
        BookingCode: slug.split('||')[1],
        PaymentMode: 'Limit',
      };

      const message3 = {
        params: {
          ...searchParams,
          currency: 'USD',
          hotel_id: slug.split('||')[0],
          nationality: searchParams.nationality || 'US',
        },
      };
      hotelService
        .prebook(message)
        .then(res => {
          setPrebook(res);
        })
        .catch(error => {
          handlePreebookError(error.statuscode);
          setLoading(false);
          console.error(error);
        });

      hotelService
        .searchHotelDetails(message3.params)
        .then(res => {
          const { CategoriesFound, Images } = res;
          const filteredAmenities = CategoriesFound?.filter(
            (amenitie: any) => !amenitiesToDelete.includes(amenitie)
          );
          setHotelData({
            ...res,
            PrincipalImage: Images[0],
            HotelAmenities: filteredAmenities,
          });
          setLoading(false);
        })
        .catch(console.error);
    }
  }, [slug]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearState());
  }, []);

  const handlePaymentDetails = (
    commission: number,
    transactionFee: number,
    total: number
  ) => {
    setPaymentDetails({
      commission,
      transactionFee,
      total,
    });
  };

  const redirectHome = () => {
    router.push('/', '/', { locale: i18n.language });
  };

  const onCloseRedirectHome = () => {
    setShowErrorModal(false);
    redirectHome();
    return;
  };

  const onCloseReloadPage = () => {
    setShowErrorModal(false);
    router.reload();
    return;
  };

  const onCloseSessionExpired = () => {
    window.close();
    return;
  };

  const handleErrorCase = (error: number) => {
    switch (error) {
      case 400:
        onCloseRedirectHome();
        break;
      case 201:
        onCloseRedirectHome();
        break;
      case 207:
        onCloseReloadPage();
        break;
      case 315:
        onCloseSessionExpired();
        break;
      default:
        onCloseRedirectHome();
        break;
    }
  };

  const handleNextAction = () => {
    setShowModalConfirmation(false);
    setShowProposalNext(true);
  };

  return (
    <>
      <ModalGeneralText
        open={showErrorModal}
        onClose={() => handleErrorCase(errorCase)}
        title={titleErrorModal}
        text={textErrorModal}
        cb={() => handleErrorCase(errorCase)}
      />
      <ModalProposalConfirmation
        open={showModalConfirmation}
        onClose={() => setShowModalConfirmation(false)}
        title={t('stays.send-proposal')}
        description={`${t('stays.send-proposal-text-firstPart')} ${t('stays.send-proposal-text-secondPart')}`}
        bookingId=""
        agentId=""
        type="button"
        cb={handleNextAction}
      />

      <ModalProposalConfirmation
        open={showProposalNext}
        onClose={() => setShowProposalNext(false)}
        title={t('stays.send-proposal-title-2')}
        description={t('stays.send-proposal-text-2')}
        bookingId={bookingId}
        agentId={agentId}
        type="link"
        cb={handleNextAction}
      />
      <BookingLayout isPublic={false} agentId={session?.user?.agent_id}>
        <SEO title={t('SEO.proposal')} />

        {loading && !errorCase && !hotelData.Id && (
          <div className="wrapperCarLoader">
            <Lottie src={'/carLoader.json'} className="carLoader" />
          </div>
        )}

        {!!hotelData.Id && !!prebook?.HotelCode && (
          <div className="w-[80%] md:w-[75%] max-w-[1250px] h-full mx-auto flex flex-col gap-5 items-start justify-center">
            <h1 className="text-white font-[650] text-[32px] leading-8 transform scale-x-100 scale-y-75">
              {t('stays.reservation-details')}
            </h1>
            <div className="w-full mx-auto flex flex-col-reverse md:flex-row items-start justify-center gap-10">
              <div className="w-full md:w-[40%] md:max-w-[407px]">
                <SummaryContainer
                  handleGuest={handleGuest}
                  rooms={searchParams.rooms}
                >
                  <PriceDetails
                    total={prebook.Rooms[0].TotalFare}
                    numberOfNights={getDaysDifference(
                      searchParams.check_in,
                      searchParams.check_out
                    )}
                    handlePaymentDetails={handlePaymentDetails}
                  />
                </SummaryContainer>
                <HotelConfirmationAndFinish
                  rateConditions={prebook?.RateConditions}
                  cancelPolicies={prebook?.Rooms[0]?.CancelPolicies}
                  supplements={prebook?.Rooms[0]?.Supplements}
                  isRefundable={prebook?.Rooms[0]?.IsRefundable}
                  bookingCode={(slug as string).split('||')[0]}
                  idMelisearch={(slug as string).split('||')[1]}
                  prebook={prebook}
                  guests={guests}
                  hotelDetails={hotelData}
                  paymentDetails={paymentDetails}
                  searchParams={searchParams}
                  setBookingId={setBookingId}
                  setAgentId={setAgentId}
                  setShowModalConfirmation={setShowModalConfirmation}
                />
              </div>
              <div className="w-full md:w-[65%] max-w-[641px] flex flex-col gap-5">
                <HotelServiceCard
                  prebook={prebook}
                  hotelData={hotelData}
                  displayPrice={paymentDetails.total}
                  origin="proposal"
                />
              </div>
            </div>
          </div>
        )}
      </BookingLayout>
    </>
  );
};

export default Proposal;
