import React, { useState, useEffect } from 'react';
import {
  BookingLayout,
  SEO,
  ServiceDetails,
  MapWrapper,
  RoomDetails,
  ModalCancellationPolicy,
  ServiceModal,
  SupplierPriceDetails,
  TravelersButton,
  DateDetailsSupplier,
  AmenitiesList,
  ModalProposalConfirmation,
} from '@components';
import { SummaryContainer } from '@containers';

import { Lottie } from '@components/Lottie';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';

import { getDaysDifference } from '@utils/timeFunctions';

import { GuestArray, AdultGuest, ChildrenGuest } from '@typing/types';

import style from '@styles/deals/hotel.module.scss';

//SERVER SIDE IMPLEMENTATION
import type { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '@pages/api/auth/[...nextauth]';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nextConfig from 'next-i18next.config';
import { useRouter } from 'next/router';

import {
  getSupplierDetails,
  createTraveler,
  createProposal,
} from '@utils/axiosClients';
import { usePrice } from '@components/utils/Price/Price';
import SearchLoader from '@components/SearchLoader';

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

const SupplierBooking = () => {
  const { t } = useTranslation();
  const price = usePrice();
  const { data: session } = useSession();

  const router = useRouter();
  const { id } = router.query;

  const [supplier, setSupplier] = useState<any>({});
  const [mapObject, setMapObject] = useState<any>({
    address: '',
    hotel_name: '',
    hotel_pictures: [],
    id: '',
    latitude: 0,
    longitude: 0,
    rooms: [],
    stars: 0,
  });
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [guests, setGuests] = useState<GuestArray[]>([]);
  const [guestRooms, setGuestRooms] = useState([
    {
      children_age: [],
      number_of_adults: 1,
      number_of_children: 0,
    },
  ]);
  const [isChecked, setIsChecked] = useState(false);
  const [showCancellPolicies, setShowCancellPolicies] = useState(false);

  const [showSearchModal, setShowSearchModal] = useState(false);
  const [cancellPolicies, setCancellPolicies] = useState([]);
  const [acccommodationAmenities, setAccommodationAmenities] = useState<
    string[]
  >([]);
  const [paymentDetails, setPaymentDetails] = useState({
    commission: 0,
    transactionFee: 0,
    total: 0,
  });
  const [serviceDetails, setServiceDetails] = useState({
    checkInDate: '',
    checkOutDate: '',
    checkInHour: '',
    checkOutHour: '',
  });
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  //MODAL OPEN PROPOSAL
  const [showModalConfirmation, setShowModalConfirmation] =
    useState<boolean>(false);
  const [showProposalNext, setShowProposalNext] = useState<boolean>(false);

  //BOOKING IDs
  const [bookingId, setBookingId] = useState<string>('');
  const [agentId, setAgentId] = useState<string>('');

  const [proposalLoading, setProposalLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.agent_id && typeof id === 'string') {
      getSupplierDetails(id, session?.user?.agent_id)
        .then(supplier => {
          if (supplier.status === 200) setSupplier(supplier.data.Item);
          const {
            add_image_text,
            address,
            company_name,
            supplier_lat,
            supplier_long,
          } = supplier.data.Item;
          setMapObject({
            address,
            hotel_name: company_name,
            hotel_pictures: add_image_text,
            id,
            latitude: Number(supplier_lat),
            longitude: Number(supplier_long),
            rooms: [{ TotalFare: 0 }],
            stars: 5,
          });
          const tempCancelPolicies: any = [];
          const tempAmenities: string[] = [];

          for (const key in supplier.data.Item) {
            if (key.includes('cancel_policies')) {
              tempCancelPolicies.push(supplier.data.Item[key]);
            }
            if (key.includes('amenities[')) {
              tempAmenities.push(supplier.data.Item[key]);
            }
          }
          setCancellPolicies(tempCancelPolicies);
          setAccommodationAmenities(tempAmenities);
        })
        .catch(console.error);
    }
  }, [session?.user?.agent_id, id]);

  const handleGuest = (guests: GuestArray[]) => {
    setGuests(guests);
  };

  const addTraveler = () => {
    const updatedGuestRooms = [...guestRooms];

    const index = 0;

    updatedGuestRooms[index] = {
      ...updatedGuestRooms[index],
      number_of_adults: updatedGuestRooms[index].number_of_adults + 1,
    };

    setGuestRooms(updatedGuestRooms);
  };

  const deleteTraveler = () => {
    const updatedGuestRooms = [...guestRooms];

    const index = 0;

    updatedGuestRooms[index] = {
      ...updatedGuestRooms[index],
      number_of_adults: updatedGuestRooms[index].number_of_adults - 1,
    };

    setGuestRooms(updatedGuestRooms);
  };

  const validateGuests = (): any => {
    let travelerValidation = false;
    let childrenValidation = false;
    guests.map((travelers: GuestArray) => {
      travelerValidation = travelers.adults.every((adult: AdultGuest) => {
        return (
          Number(adult.age) >= 21 ||
          !!adult.email ||
          !!adult.name ||
          adult.phoneNumber.length > 11
        );
      });

      childrenValidation = travelers.children.every((child: ChildrenGuest) => {
        return Number(child.age) > 18 || !!child.name;
      });
    });
    return travelerValidation && childrenValidation;
  };

  const validateServiceDetails = (): boolean => {
    if (supplier?.selectedSupplier === 'accommodation')
      return !!serviceDetails.checkInDate && !!serviceDetails.checkOutDate;
    else return !!serviceDetails.checkInDate;
  };

  const validatePriceDetails = (): boolean => {
    return !!paymentDetails.total && !!paymentDetails.transactionFee;
  };

  const validateFields = (): boolean => {
    return (
      validateGuests() && validateServiceDetails() && validatePriceDetails()
    );
  };

  const createReservation = async (traveler_id: string) => {
    if (validateFields()) {
      const rooms = {
        traveler_name: guests[0]?.adults[0]?.name,
        traveler_number: guests[0]?.adults[0]?.phoneNumber,
        traveler_email: guests[0]?.adults[0]?.email,
        traveler_title: guests[0]?.adults[0]?.gender,
        traveler_age: guests[0]?.adults[0]?.age,
        accommodation_checkin: serviceDetails?.checkInDate,
        accommodation_date_checkout: serviceDetails?.checkOutDate,
        accommodation_number_of_people_permitted: numberOfPeople,
      };

      const supplierBody = {
        traveler: [
          {
            first_name: guests[0]?.adults[0]?.name || '',
            phone_number: guests[0]?.adults[0]?.phoneNumber || '',
            email: guests[0]?.adults[0]?.email || '',
            title: guests[0]?.adults[0]?.gender || '',
            age: guests[0]?.adults[0]?.age || '',
            last_name: guests[0]?.adults[0]?.lastname || '',
            traveler_id,
          },
        ],
        service: {
          service_type: 'suppliers',
          supplier_id: supplier?.supplier_id || '',
          agent_id: supplier?.agent_id,
          service_time: serviceDetails?.checkInHour || '12:00',
          date_checkin: serviceDetails?.checkInDate,
          number_of_people_permitted: numberOfPeople,
          rooms: [rooms],
          supplier_type: supplier?.selectedSupplier,
        },
        payments: [
          {
            provider_price: price.baseCurrency(paymentDetails?.transactionFee),
            subtotal: price.baseCurrency(
              paymentDetails?.total - paymentDetails?.commission
            ),
            agent_commission: price.baseCurrency(paymentDetails?.commission),
            total: price.baseCurrency(paymentDetails?.total),
            transaction_details: {
              transaction_id: '',
              payment_id: '',
              payment_type: '',
              processor_name: '',
            },
          },
        ],
      };

      createProposal(session?.user.id_token, supplierBody)
        .then((res: any) => {
          if (res.status === 201) {
            setShowModalConfirmation(true);
            setBookingId(res.data.booking_id);
            setAgentId(res.data.agent_id);
          }
        })
        .catch(console.error)
        .finally(() => setProposalLoading(false));
    }
  };

  const handleSubmitProposal = (guests: GuestArray[]) => {
    //Create traveler before create proposal
    setProposalLoading(true);
    const travelerBody = {
      fullName: `${guests[0]?.adults[0].name}` || '',
      passportNo: '',
      adress: '',
      city: '',
      country: '',
      zipCode: '',
      phoneNumber: guests[0]?.adults[0].phoneNumber || '',
      email: guests[0]?.adults[0].email || '',
      gender: guests[0]?.adults[0].gender || '',
      dayOfBirth: '',
      travelerTypecast: '',
      referral: '',
      referralName: '',
      addToGroup: '',
      specialRequest: '',
      description: 'Added from suppliers',
      profile_image: '',
    };
    createTraveler(travelerBody, session?.user.id_token || '')
      .then(response => {
        createReservation(response.data.traveler_id);
      })
      .catch(error => {
        console.error(error);
        setProposalLoading(false);
      });
  };

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

  const handleUpdateServiceDetails = (name: string, value: string) => {
    const updatedDetails = { ...serviceDetails, [name]: value };
    setServiceDetails(updatedDetails);
  };

  const handleNextAction = () => {
    setShowModalConfirmation(false);
    setShowProposalNext(true);
  };

  return (
    <>
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
        origin="suppliers"
      />
      <BookingLayout isPublic={false} agentId={session?.user?.agent_id}>
        <SEO title={t('SEO.proposal')} />
        {!!supplier?.supplier_id ? (
          <div className="w-[80%] md:w-[75%] max-w-[1250px] h-full mx-auto flex flex-col gap-5 items-start justify-center">
            <h1 className="text-white font-[650] text-[32px] leading-8 transform scale-x-100 scale-y-75">
              {t('suppliers.reservation-details')}
            </h1>
            <div className="w-full mx-auto flex flex-col-reverse md:flex-row items-start justify-center gap-10">
              <div className="w-full md:w-[40%] md:max-w-[407px]">
                <SummaryContainer
                  handleGuest={handleGuest}
                  rooms={guestRooms}
                  origin="suppliers"
                >
                  <TravelersButton
                    addTraveler={addTraveler}
                    deleteTraveler={deleteTraveler}
                    guestRooms={guestRooms}
                  />
                  <DateDetailsSupplier
                    check_in={true}
                    check_out={supplier?.selectedSupplier === 'accommodation'}
                    serviceDetails={serviceDetails}
                    handleUpdateServiceDetails={handleUpdateServiceDetails}
                  />
                  <div className={style.peopleContainer}>
                    <p>{t('suppliers.people-number')}</p>
                    <div className={style.peopleContainer_buttons}>
                      <button
                        onClick={() => {
                          if (numberOfPeople > 1)
                            setNumberOfPeople(numberOfPeople - 1);
                        }}
                        className={style.peopleContainer_buttons_button}
                      >
                        -
                      </button>
                      <p className={style.peopleContainer_buttons_text}>
                        {numberOfPeople}
                      </p>
                      <button
                        onClick={() => setNumberOfPeople(numberOfPeople + 1)}
                        className={style.peopleContainer_buttons_button}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <SupplierPriceDetails
                    numberOfNights={getDaysDifference(
                      serviceDetails.checkInDate,
                      serviceDetails.checkOutDate
                    )}
                    numberOfPeople={numberOfPeople}
                    supplierType={supplier?.selectedSupplier || ''}
                    handlePaymentDetails={handlePaymentDetails}
                  />
                </SummaryContainer>
                <>
                  <ModalCancellationPolicy
                    open={showCancellPolicies}
                    onClose={() => setShowCancellPolicies(false)}
                    policies={cancellPolicies}
                    supplements={[]}
                    isRefundable={false}
                    origin="suppliers"
                  />

                  <ServiceModal
                    open={showSearchModal}
                    onClose={() => setShowSearchModal(false)}
                    serviceType="flights"
                  />
                  <div className={style.hotelConfimration}>
                    <div className={style.hotelConfimration_message}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          setIsChecked(!isChecked);
                        }}
                        className={style.hotelConfimration_checkbox}
                      />
                      <p>
                        {t('stays.cancellation-policy-text-1')}{' '}
                        <span
                          className={
                            style.hotelConfimration_message_cancellation
                          }
                          onClick={() =>
                            setShowCancellPolicies(!showCancellPolicies)
                          }
                        >
                          {t('stays.cancellation-policy-text-2')}
                        </span>
                      </p>
                    </div>
                    <div className={style.hotelConfimration_container}>
                      <button
                        className={style.hotelConfimration_container_send}
                        onClick={e => handleSubmitProposal(guests)}
                        disabled={
                          !(
                            isChecked &&
                            validateGuests() &&
                            validateServiceDetails() &&
                            validatePriceDetails() &&
                            !proposalLoading
                          )
                        }
                      >
                        {proposalLoading ? (
                          <SearchLoader />
                        ) : (
                          <>{t('stays.send-proposal')}</>
                        )}
                      </button>
                      {/* <button
                        className={style.hotelConfimration_container_add}
                        onClick={() => setShowSearchModal(true)}
                        disabled={!(isChecked && validateGuests())}
                      >
                        {t('stays.add_service')}
                      </button> */}
                    </div>
                  </div>
                </>
              </div>
              <div className="w-full md:w-[65%] max-w-[641px] flex flex-col gap-5">
                <ServiceDetails
                  serviceName={supplier?.company_name}
                  address={supplier?.address}
                  email={supplier?.email}
                  phone={supplier?.phone_number}
                />
                <RoomDetails
                  images={supplier?.add_image_text || []}
                  hotelName={supplier?.company_name || ''}
                  stars={0}
                  roomNames={
                    [
                      supplier?.company_name,
                      supplier?.supplier_additional_info,
                    ] || []
                  }
                />
                {supplier?.selectedSupplier === 'accommodation' && (
                  <AmenitiesList
                    title={t('reservations.facilities') || ''}
                    roomAmenities={[]}
                    hotelAmenities={acccommodationAmenities || []}
                  />
                )}
                {supplier?.supplier_lat && supplier?.supplier_long && (
                  <div className={style.mapContainer}>
                    <MapWrapper
                      dataResult={[mapObject]}
                      activeMarker={activeMarker}
                      setActiveMarker={setActiveMarker}
                      displayPrice={paymentDetails.total}
                      origin="proposal"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="wrapperCarLoader">
            <Lottie src={'/carLoader.json'} className="carLoader" />
          </div>
        )}
      </BookingLayout>
    </>
  );
};

export default SupplierBooking;
