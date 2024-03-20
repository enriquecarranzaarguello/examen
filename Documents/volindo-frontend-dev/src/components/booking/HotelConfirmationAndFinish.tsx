import { useState } from 'react';
import styles from '@styles/deals/hotel.module.scss';
import { useTranslation } from 'react-i18next';
import { GuestArray, AdultGuest, ChildrenGuest } from '@typing/types';
import { useSession } from 'next-auth/react';

import {
  ModalCancellationPolicy,
  ModalRateConditions,
  ServiceModal,
} from '@components';
import { createTraveler, createProposal } from '@utils/axiosClients';
import { usePrice } from '@components/utils/Price/Price';
import SearchLoader from '@components/SearchLoader';

const HotelConfirmationAndFinish = ({
  rateConditions,
  cancelPolicies,
  supplements,
  isRefundable,
  bookingCode,
  idMelisearch,
  guests,
  prebook,
  hotelDetails,
  paymentDetails,
  searchParams,
  setBookingId,
  setAgentId,
  setShowModalConfirmation,
}: {
  rateConditions: any;
  cancelPolicies: any[];
  supplements: any;
  isRefundable: boolean;
  bookingCode: string;
  idMelisearch: string;
  guests: GuestArray[];
  prebook: any;
  hotelDetails: any;
  paymentDetails: any;
  searchParams: any;
  setBookingId: (value: string) => void;
  setAgentId: (value: string) => void;
  setShowModalConfirmation: (activate: boolean) => void;
}) => {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const price = usePrice();
  const [isChecked, setIsChecked] = useState(false);
  const [showCancellPolicies, setShowCancellPolicies] = useState(false);
  const [showRateConditions, setShowRateConditions] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [proposalLoading, setProposalLoading] = useState(false);

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

  const calcTotalGuests = (searchParams: any): [number, number] => {
    let totalAdults = 0;
    let totalChildren = 0;

    searchParams.rooms.forEach((room: any) => {
      totalAdults += room.number_of_adults;
      totalChildren += room.number_of_children;
    });

    return [totalAdults, totalChildren];
  };

  const createReservation = async (travelerId: string) => {
    const { Currency, RateConditions, Rooms } = prebook;
    const { Address, HotelName, Map } = hotelDetails;
    const { commission, transactionFee, total } = paymentDetails;
    const { check_in, check_out } = searchParams;
    const totalGuests = calcTotalGuests(searchParams);
    try {
      let travelersFinal: any[] = [];

      guests.map((travelers: GuestArray) => {
        travelers.adults.map((adult: AdultGuest) => {
          travelersFinal.push({
            travelerId: '',
            first_name: adult.name,
            last_name: adult.lastname,
            phone: adult.phoneNumber,
            email: adult.email,
            title: adult.gender,
            age: adult.age,
            is_contact: true,
          });
        });

        travelers.children.map((child: ChildrenGuest) => {
          travelersFinal.push({
            name: child.name,
            age: child.age,
          });
        });
      });

      travelersFinal[0].travelerId = travelerId;

      const proposalBody = {
        traveler: travelersFinal,
        service: {
          roomAmenities: Rooms[0].Amenities || [],
          hotelAmenities: hotelDetails.HotelAmenities || [],
          service_type: 'hotels',
          id_meilisearch: bookingCode,
          hotel_name: HotelName || '',
          address: Address || '',
          latitude: Map.split('|')[0] || 0,
          longitude: Map.split('|')[1] || 0,
          name_room: Rooms[0].Name,
          meal_type: Rooms[0].MealType || '',
          cancel_policies: Rooms[0].CancelPolicies || [],
          supplements: '',
          search_parameters: searchParams,
          inclusion: Rooms[0].Inclusion,
          is_refundable: Rooms[0].IsRefundable || false,
          with_transfers: Rooms[0].WithTransfers || false,
          check_in,
          check_out,
          booking_code: idMelisearch,
          rateConditions: RateConditions || [],
          description: hotelDetails.Description || '',
        },
        payments: [
          {
            current_currency: Currency,
            agent_commission: price.baseCurrency(commission),
            provider_price: Rooms[0].provider_price,
            total: price.baseCurrency(total),
            transaction_details: {
              recommendedPrice: 0,
              transactionFee: price.baseCurrency(transactionFee),
              number_of_rooms: searchParams.rooms.length,
              number_of_adults: totalGuests[0],
              number_of_children: totalGuests[1],
            },
          },
        ],
      };

      createProposal(session?.user.id_token, proposalBody)
        .then((res: any) => {
          if (res.status === 201) {
            setShowModalConfirmation(true);
            setBookingId(res.data.booking_id);
            setAgentId(res.data.agent_id);
          }
        })
        .catch(error => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    } finally {
      setProposalLoading(false);
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
      description: 'Added from Hotels',
      profile_image: '',
    };
    createTraveler(travelerBody, session?.user.id_token || '')
      .then(response => {
        createReservation(response.data.traveler_id);
      })
      .catch(error => {
        setProposalLoading(false);
        console.error(error);
      });
  };

  return (
    <>
      <ModalRateConditions
        open={showRateConditions}
        onClose={() => setShowRateConditions(false)}
        rateConditions={rateConditions || []}
      />

      <ModalCancellationPolicy
        open={showCancellPolicies}
        onClose={() => setShowCancellPolicies(false)}
        policies={cancelPolicies}
        supplements={supplements}
        isRefundable={isRefundable}
      />

      <ServiceModal
        open={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        serviceType="flights"
      />
      <div className={styles.hotelConfimration}>
        <div className={styles.hotelConfimration_message}>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => {
              setIsChecked(!isChecked);
            }}
            className={styles.hotelConfimration_checkbox}
          />
          <p>
            {t('stays.cancellation-policy-text-1')}{' '}
            <span
              className={styles.hotelConfimration_message_cancellation}
              onClick={() => setShowCancellPolicies(!showCancellPolicies)}
            >
              {t('stays.cancellation-policy-text-2')}
            </span>
            {' y '}
            <span
              className={styles.hotelConfimration_message_cancellation}
              onClick={() => setShowRateConditions(!showRateConditions)}
            >
              {t('stays.rate-conditions')}
            </span>
          </p>
        </div>
        <div className={styles.hotelConfimration_container}>
          <button
            className={styles.hotelConfimration_container_send}
            onClick={e => handleSubmitProposal(guests)}
            disabled={!(isChecked && validateGuests() && !proposalLoading)}
          >
            {proposalLoading ? (
              <SearchLoader />
            ) : (
              <>{t('stays.send-proposal')}</>
            )}
          </button>
          {/* <button
            className={styles.hotelConfimration_container_add}
            onClick={() => setShowSearchModal(true)}
            disabled={!(isChecked && validateGuests())}
          >
            {t('stays.add_service')}
          </button> */}
        </div>
      </div>
    </>
  );
};

export default HotelConfirmationAndFinish;
