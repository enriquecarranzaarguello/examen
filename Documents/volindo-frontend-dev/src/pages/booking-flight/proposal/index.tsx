import React, { useState, useEffect, useRef } from 'react';

import Image from 'next/image';
import nextI18nextConfig from 'next-i18next.config';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '@pages/api/auth/[...nextauth]';
import { useSession } from 'next-auth/react';
import phoneCountries from '../../../common/data/countries/phoneCountries.json';

import 'moment/locale/es';
import moment from 'moment';

import {
  InputGroup,
  FlexboxGrid,
  Toggle,
  Input,
  Form,
  Modal,
  Checkbox,
} from 'rsuite';

import {
  BookingLayout,
  SupplierServiceModal,
  ProposalLinkModal,
  ModalPolicy,
  Details,
  ExtraServicesDropdown,
  ImageFallback,
  InfoPopup,
  SEO,
  ServiceModal,
  PaymentFlightsAgent,
} from '@components';

import { usePrice } from 'src/components/utils/Price/Price';

import { GeneralInfoCard } from '@containers';

import config from '@config';

import takeoff from '@icons/takeoff.svg';
import landing from '@icons/landing.svg';
import logoV from '@icons/noAirline.svg';
import logoFT from '@icons/noAirlineFT.svg';

import { createPnr, getCountryCode, createTraveler } from '@utils/axiosClients';
// TODO check import
import PlaneLoader from '@components/PlaneLoader';
import SearchLoader from '@components/SearchLoader';

import { useAppSelector } from '@context';
import { validPhoneWithCountryCode } from '@utils/userFunctions';
import { hasDatePassed } from '@utils/timeFunctions';

import { useVariableValue } from '@devcycle/react-client-sdk';

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

const AgentProposal = () => {
  const { data: session } = useSession();
  const { t, i18n } = useTranslation('common');

  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [agentcommissionType, setAgentCommissionType] =
    useState<string>('dollar');
  const [supplierText, setSupplierText] = useState('');
  const [showServiceDets, setShowServiceDets] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [subTotal, setSubTotal] = useState<number>(0);
  const [transactionFee, setTransactionFee] = useState<number>(0);
  const [agentCommission, setAgentCommission] = useState<number>(0);
  const [VolindoFee, setVolindoFee] = useState<number>(0);
  const formRef = useRef<any>(null);
  const [openProposal, setOpenProposal] = useState(false);
  const [openProposalNext, setOpenProposalNext] = useState(false);
  const [openAlreadyProposal, setOpenAlreadyProposal] = useState(false);
  const proposalType = 'supplier';
  const paymentId = 'the flight booking ID';
  const [policies, setPolicies] = useState<string[]>(['No Policy']);
  const [showCancelPolicy, setShowCancelPolicy] = useState<boolean>(false);
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [titlePopup, setTitlePopup] = useState('');
  const [messagePopup, setMessagePopup] = useState('');
  const [contentPopup, setContentPopup] = useState(<></>);
  const price = usePrice();

  const logo = config.WHITELABELNAME === 'Volindo' ? logoV : logoFT;

  // const [flightDetails, setFlightDetails] = useState<any>();
  const [passangers, setPassangers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [internaLink, setInternaLink] = useState('');
  const [flightData, setFlightData] = useState({
    origin: '',
    address: '',
    base_price_per_traveler: 0,
    city: '',
    country: '',
    currency: '',
    dob: '',
    email: '',
    first_name: '',
    last_name: '',
    gender: '',
    id_traveler: 0,
    is_contact: false,
    passport: '',
    phone: '',
    taxes_per_traveler: 0,
    total_price_per_traveler: 0,
    traveler_type: '',
    zip_code: 0,
    travel_date: '',
  });
  const [formValue, setFormValue] = useState<any>({
    cost_service_price: '',
    agent_servicefee: '',
    agent_discount: '',
    totalPrice: 0,
    subTotal: 0,
    transactionFee: 0,
    VolindoFee: 0,
    arlineTaxes: 0,
  });
  const [detailsArr, setDetailsArr] = useState([]);
  const [validPnr, setValidPnr] = useState<boolean>(false);
  const [defaultPhoneCode, setDefaultPhoneCode] = useState<string>(
    phoneCountries[0].code
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [pass, setPass] = useState<boolean>(false);

  const { selectedFlight: flightDetails } = useAppSelector(
    state => state.flights
  );

  const showSearchEngineModal = useVariableValue('show-deals-button', false);

  const { flight_policies, general_details, flights, conditions } =
    flightDetails?.itinerary[0] || {
      flight_policies: [],
      general_details: {},
      flights: [],
      conditions: null,
    };
  const { ticketing_deadline_datetime_mx } = general_details;

  const oneway: any = flights[0] || null;
  const roundTrip: any = flights[1] || null;
  const multiFlights = flights || null;
  const flightTotalCost =
    Number(flightDetails?.itinerary[0].total_price?.total_price) || 0;

  const isDuffel = general_details?.provider_data?.provider === 'Duffel';

  const originalDepartCity =
    oneway?.departure_details.city_name.split(' - ')[0] ||
    roundTrip?.departure_details.city_name.split(' - ')[0];
  const originalArrivalcity =
    oneway?.arrival_details.city_name.split(' - ')[0] ||
    roundTrip?.arrival_details.city_name.split(' - ')[0];

  const calculateTotalPrice = () => {
    const { commission } = formValue;
    let calculatedComission = 0;

    if (!isNaN(commission)) {
      calculatedComission =
        agentcommissionType === 'percentage'
          ? price.integerRate(flightTotalCost) * (Number(commission) / 100)
          : Number(commission || 0);
    }
    const transactionFee =
      (price.integerWithOneDecimal(flightTotalCost) + calculatedComission) *
      0.04;

    const totalCalc =
      price.integerWithOneDecimal(flightTotalCost) +
      calculatedComission +
      transactionFee;

    setAgentCommission(
      agentcommissionType === 'percentage'
        ? commission
        : price.baseCurrency(calculatedComission)
    );
    setSubTotal(
      price.baseCurrency(
        price.integerWithOneDecimal(flightTotalCost) +
          Number(calculatedComission)
      )
    );
    setTransactionFee(price.baseCurrency(transactionFee));
    setTotalPrice(price.baseCurrency(totalCalc));
  };

  const handleLinkProposal = () => {
    if (passangers.length !== general_details.total_travelers) {
      setTitlePopup('Hey!');
      setMessagePopup(t('flights.errorFillTravelers') || '');
      setOpenPopup(true);
      return;
    }

    if (isDuffel) {
      const validAllPhones = passangers.every(passanger =>
        validPhoneWithCountryCode(`${passanger.phone_code}${passanger.phone}`)
      );

      if (!validAllPhones) {
        setTitlePopup('Hey!');
        setMessagePopup(t('flights.error.invalid_phone') || '');
        setOpenPopup(true);
        return;
      }
    }

    setIsLoading(true);

    let body = {
      passengers_info: passangers.sort(
        (passA, passB) => passA.guid - passB.guid
      ),
      commissions: {
        agent_commission: isNaN(agentCommission) ? 0 : agentCommission,
        transaction_fee: transactionFee,
        percentage: agentcommissionType === 'percentage',
        current_currency: price.countryCode,
      },

      pre_booking_id: flightDetails?.selected_flight_id,
      special_request_service: [],
    };

    if (passangers[0].id !== '') {
      createProposal(body);
    } else {
      const formData = {
        fullName:
          `${body?.passengers_info[0]?.first_name} ${body?.passengers_info[0]?.last_name}` ||
          '',
        passportNo: '',
        adress: '',
        city: '',
        country: '',
        zipCode: '',
        phoneNumber:
          `${body?.passengers_info[0]?.phone_code}${body?.passengers_info[0]?.phone}` ||
          '',
        email: body?.passengers_info[0]?.email || '',
        gender: body?.passengers_info[0]?.gender || '',
        dayOfBirth: body?.passengers_info[0]?.dob || '',
        travelerTypecast: '',
        referral: '',
        referralName: '',
        addToGroup: '',
        specialRequest: '',
        description: '',
        profile_image: '',
      };

      createTraveler(formData, session?.user.id_token || '')
        .then(response => {
          body.passengers_info[0].id = response?.data?.traveler_id;
          createProposal(body);
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  const createProposal = (body: any) => {
    body = isDuffel ? { ...body, general_details } : body;

    createPnr(body, session?.user.id_token || '', isDuffel)
      .then(({ data }) => {
        setOpenProposal(true);
        const url = isDuffel
          ? `${data.proposal_link}`
          : `${data.proposal_link.proposal_link}`;

        setInternaLink(url);
      })
      .catch(err => {
        console.error('handle error pnr:', err);

        if (isDuffel) {
          switch (err.response?.status) {
            case 403:
              if (internaLink) {
                setOpenAlreadyProposal(true);
                setOpenProposal(true);
              } else {
                setTitlePopup('Hey!');
                setMessagePopup(t('flights.error.searchAgain') || '');
                setOpenPopup(true);
              }
              break;
            case 422:
              //Phone number
              setTitlePopup('Hey!');
              setMessagePopup(t('flights.error.invalid_phone') || '');
              setOpenPopup(true);
              break;
            case 401:
              setTitlePopup('Hey!');
              setMessagePopup(t('subscription.error.proposal') || '');
              setOpenPopup(true);
              break;
            default:
              setTitlePopup('Oops!');
              setContentPopup(
                <p className="text-[#FFFFFF80] text-center text-base">
                  {t('common.errorServer')}{' '}
                  <a
                    href={`mailto:${config.WHITELABELEMAIL}`}
                    className="text-white cursor-pointer"
                  >
                    {config.WHITELABELEMAIL}
                  </a>
                </p>
              );
              setOpenPopup(true);
              break;
          }
        } else {
          // Sabre handling
          switch (err.response?.status) {
            case 403:
              setTitlePopup('Hey!');
              setMessagePopup(t('subscription.error.proposal') || '');
              setOpenPopup(true);
              break;
            case 400:
              setTitlePopup('Hey!');
              setMessagePopup(t('flights.errorParams') || '');
              setOpenPopup(true);
              break;
            default:
              setTitlePopup('Oops!');
              setContentPopup(
                <p className="text-[#FFFFFF80] text-center text-base">
                  {t('common.errorServer')}{' '}
                  <a
                    href={`mailto:${config.WHITELABELEMAIL}`}
                    className="text-white cursor-pointer"
                  >
                    {config.WHITELABELEMAIL}
                  </a>
                </p>
              );
              setOpenPopup(true);
              break;
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSendProposal = () => {
    if (isValidPnr(ticketing_deadline_datetime_mx)) handleLinkProposal();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const showStops = (stops: any) => {
    handleOpen();
    setDetailsArr(stops);
  };

  const formatDate = (param: any, hour = false) => {
    const language = i18n.language;
    return (
      <>
        {language === 'en' ? (
          <span>
            {moment(param).locale('en').format('ddd, D MMM')}{' '}
            {hour && moment(param).locale('en').format('HH:mm')}
          </span>
        ) : (
          <span>
            {moment(param).locale('es').format('ddd D MMM')}{' '}
            {hour && moment(param).locale('en').format('HH:mm')}
          </span>
        )}
      </>
    );
  };

  const totalTravelTime = (dateObj: any) => {
    if (!!dateObj) {
      const { hours, minutes, days } =
        dateObj.total_time_formatted || dateObj.total_flight_time_formatted;

      return (
        <span>
          {!!days && days}
          {!!days && 'd'} {!!hours && hours}
          {!!hours && 'h'} {!!minutes && minutes}
          {!!minutes && 'm'}
        </span>
      );
    }
  };

  const defineTitle = (i: number) => {
    const multiFlightTest = !!multiFlights && multiFlights.length > 2;
    let variable = '';
    const classFlight = t(
      `flights.classes.${general_details.class_of_service}`
    );
    if (multiFlightTest)
      return `${t('flights.flight')} ${i + 1} (${classFlight})`;
    variable = i === 0 ? t('flights.departure') : t('flights.return');

    return `${variable} (${classFlight})`;
  };

  const getTheAmountTest = () => {
    if (flightDetails) {
      const adults = general_details.type_of_passengers.adults;
      const children = general_details.type_of_passengers.children;
      const infants = general_details.type_of_passengers.infants;
      const filledArray = Array(adults + children + infants).fill(Number(3));

      const phoneCodes = phoneCountries.map(item => ({
        label: `${item.iso_code} ${item.code}`,
        value: item.code,
      }));

      return filledArray.map((item, index) => (
        <div className="my-[5px] w-full" key={index}>
          <GeneralInfoCard
            passTest={passTest}
            index={index}
            key={index}
            typeTraveler={
              index < adults
                ? 'adult'
                : index < adults + children
                  ? 'child'
                  : 'infant'
            }
            phoneCodes={phoneCodes}
            phoneCodeDefaultValue={defaultPhoneCode}
            withPhoneCode={isDuffel}
          />
        </div>
      ));
    } else {
      return null;
    }
  };

  const passTest = (param: any, index: number, isValid: boolean) => {
    const copyPassangers = [...passangers];

    const indexPassanger = copyPassangers.findIndex(
      passanger => passanger.guid === param.guid
    );

    if (indexPassanger !== -1) {
      copyPassangers.splice(indexPassanger, 1);
    }

    if (isValid) {
      setPass(true);
      copyPassangers.push(param);
    }

    if (!isValid) {
      setPass(false);
    }

    setPassangers(copyPassangers);

    setFormValue((prevState: any) => ({
      ...prevState,
      travlersData: param,
      totalPrice: totalPrice,
      subTotal: subTotal,
      transactionFee: transactionFee,
      VolindoFee: VolindoFee,
    }));
  };

  const cleanAndClosePopup = () => {
    setTitlePopup('');
    setMessagePopup('');
    setContentPopup(<></>);
    setOpenPopup(false);
  };

  const handleIsValidDate = (boolean: boolean) => {
    if (!boolean) {
      const title = t('flights.validity.phrase-three');
      const text = t('flights.validity.phrase-four');

      setTitlePopup(title);
      setMessagePopup(text);
      setOpenPopup(true);
      return false;
    }
  };

  const isValidPnr = (param: string) => {
    const isUTC = flightDetails?.itinerary[0]?.offer_id !== undefined;
    const validity = hasDatePassed(param, isUTC);

    if (!validity) {
      handleIsValidDate(false);
      setValidPnr(true);
    }
    return validity;
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [
    formValue.cost_service_price,
    formValue.agent_servicefee,
    formValue.agent_discount,
    formValue.commission,
    agentcommissionType,
    price.baseCurrency,
  ]);

  useEffect(() => {
    setFormValue((prevState: any) => ({
      ...prevState,
      travlersData: flightData,
      totalPrice: totalPrice,
      subTotal: subTotal,
      transactionFee: transactionFee,
      VolindoFee: VolindoFee,
    }));
  }, [flightData, totalPrice, subTotal, transactionFee, VolindoFee]);

  useEffect(() => {
    if (!!ticketing_deadline_datetime_mx) {
      isValidPnr(ticketing_deadline_datetime_mx);
    }
  }, [ticketing_deadline_datetime_mx]);

  // check all use effect
  useEffect(() => {
    const getActualIsoCode = () => {
      navigator.geolocation.getCurrentPosition(function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        getCountryCode(latitude, longitude)
          .then(response => {
            const isoCode = response.data.countryCode;
            const countryPhone = phoneCountries.find(
              item => item.iso_code === isoCode
            );

            if (countryPhone) setDefaultPhoneCode(countryPhone.code);
            else setDefaultPhoneCode(phoneCountries[0].code);
          })
          .catch(() => {
            setDefaultPhoneCode(phoneCountries[0].code);
          });
      });
    };

    getActualIsoCode();
  }, []);

  const openServiceModal = () => {
    setShowSearchModal(true);
  };

  const closeServiceModal = () => {
    setShowSearchModal(false);
  };

  return (
    <>
      <ServiceModal
        open={showSearchModal}
        onClose={closeServiceModal}
        serviceType="hotels"
      />

      <SEO title={t('SEO.proposal')} />
      <InfoPopup
        open={openPopup}
        onClose={cleanAndClosePopup}
        title={titlePopup}
        content={contentPopup}
        info={messagePopup}
        textButton={t('stays.got-it') || ''}
      />

      <SupplierServiceModal
        open={showServiceDets}
        onClose={() => setShowServiceDets(false)}
        text={supplierText}
      />

      <ProposalLinkModal
        proposalType={proposalType}
        openProposal={openProposal}
        setOpenProposal={setOpenProposal}
        openProposalNext={openProposalNext}
        setOpenProposalNext={setOpenProposalNext}
        openAlreadyProposal={openAlreadyProposal}
        paymentId={paymentId}
        handleLinkProposal={handleLinkProposal}
        internalLink={internaLink}
      />

      <ModalPolicy
        open={showCancelPolicy}
        onClose={() => setShowCancelPolicy(false)}
        conditions={conditions}
      />

      <Modal
        open={open}
        onClose={handleClose}
        className="details-modal"
        size={'lg'}
      >
        <Modal.Header>
          <Modal.Title className="h-[29px] text-[24px] leading-[29px] text-white md:font-bold md:text-[40px] md:h-[48px] md:flex md:justify-center md:leading-[48px] md:tracking-[0.35px]">
            {t('flights.details')}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {detailsArr.map((flight: any, i: number) => (
            <Details
              single={flight}
              key={i}
              i={i}
              originalArrivalcity={originalArrivalcity}
              originalDepartCity={originalDepartCity}
              totalTime={oneway.total_time.total_time_formatted}
            />
          ))}
        </Modal.Body>
      </Modal>

      {flights.length === 0 && <PlaneLoader />}

      <BookingLayout>
        <div className="flight-proposal flex items-center flex-col p-[17px] md:p-0 relative h-full">
          <div className="w-full">
            {/* TODO check and remove form that is acting as a container */}
            <Form
              ref={formRef}
              formValue={formValue}
              onChange={setFormValue}
              autoComplete="off"
            >
              <div className="flex md:gap-12 justify-center md:mt-[78px] md:px-3">
                <div className="gap-y-3 hidden flex-col md:flex">
                  <div className="flex items-center gap-[18px] mb-[10px]">
                    <h2 className="text-white text-2xl font-[650]">
                      {t('flights.reservation')}
                    </h2>
                  </div>
                  <div className="generataingGustweb">{getTheAmountTest()}</div>

                  <div className="hidden flex-col md:flex"></div>
                  <FlexboxGrid className="webButtonContainer hidden md:inline">
                    <FlexboxGrid.Item>
                      <div className="flex gap-1 items-center mb-5 text-white">
                        <Checkbox
                          checked={isChecked}
                          id="policyCheck-1"
                          onChange={() => setIsChecked(!isChecked)}
                        />
                        <label
                          htmlFor="policyCheck-1"
                          className="cursor-pointer"
                        >
                          {t('flights.flight-policy-text-1')}{' '}
                          <button
                            onClick={() => setShowCancelPolicy(true)}
                            className="underline"
                          >
                            {t('flights.flight-policy-text-2')}
                          </button>
                        </label>
                      </div>
                    </FlexboxGrid.Item>

                    <FlexboxGrid.Item className="buttonsWeb md:flex md:gap-[10px] md:items-center">
                      {/* TODO check layout there is double sumbit buttons WEB VIEW*/}
                      <button
                        disabled={
                          !!flightData.first_name ||
                          !!flightData.last_name ||
                          !!flightData.email ||
                          !!flightData.phone ||
                          !!flightData.dob ||
                          !!flightData.gender ||
                          validPnr ||
                          !isChecked ||
                          isLoading
                        }
                        className={`web-submit text-black bg-[var(--primary-background)] w-[361px] h-[48px] rounded-3xl font-[760] tracking-widest mb-9 flex items-center justify-center md:w-[197px] md:mb-[0px]${
                          isLoading ? 'customTailwind' : ''
                        }`}
                        onClick={handleSendProposal}
                      >
                        {isLoading ? (
                          <SearchLoader />
                        ) : (
                          t('stays.send-proposal')
                        )}
                      </button>

                      {showSearchEngineModal && (
                        <button
                          disabled={
                            !pass || validPnr || !isChecked || isLoading
                          }
                          className={`opensercvice text-whiteLabelColor border-whiteLabelColor border-[1px] text-[16px] font-[650] bg-black hover:bg-[var(--primary-background-light)] rounded-[20px] w-full md:w-[197px] h-[48px] md:my-[10px]`}
                          onClick={() => openServiceModal()}
                        >
                          Add service
                        </button>
                      )}
                    </FlexboxGrid.Item>

                    <p className="max-w-[450px] text-slate-300">
                      {t('flights.validity.phrase-one')}{' '}
                      <span className="font-[500] text-white">
                        {formatDate(ticketing_deadline_datetime_mx, true)}
                        {flightDetails?.itinerary[0]?.offer_id !== undefined
                          ? ' (UTC) '
                          : ' (CST) '}
                      </span>
                      {t('flights.validity.phrase-two')}
                    </p>
                  </FlexboxGrid>
                </div>

                <div className="wholeFlightsInfo flex flex-col gap-y-4 text-white w-full h-auto xxs:max-w-[373px] md:w-[471px]">
                  {flights?.map((item: any, index: number) => {
                    const {
                      departure_details,
                      arrival_details,
                      total_time,
                      stops,
                    } = item;
                    return (
                      <>
                        <FlexboxGrid className="items-center" key={index}>
                          <FlexboxGrid.Item>
                            <div className="flex flex-col gap-y-4">
                              <span className="hidden md:inline-block text-xl mb-3">
                                {defineTitle(index)}
                              </span>
                            </div>
                          </FlexboxGrid.Item>
                        </FlexboxGrid>

                        <div className="containerDetails">
                          <span className="block mb-[15px] text-[18px] font-[590] md:hidden">
                            {departure_details?.city_name.split('-')[0]} -{' '}
                            {arrival_details?.city_name.split('-')[0]}
                          </span>

                          <div className="flight-card-container-trip-depart-logo-container w-fit mb-[10px] md:mb-0">
                            <ImageFallback
                              src={`https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/${departure_details?.airline.marketing.airline_code}.svg`}
                              className="flight-card-container-trip-depart-logo"
                              style={{ marginBottom: '0px' }}
                              fallbackSrc={logo.src}
                            />
                            <span className="flight-card-container-trip-depart-logo-name black">
                              {
                                departure_details?.airline.marketing
                                  .airline_name
                              }
                            </span>
                          </div>
                          <FlexboxGrid
                            justify="space-between"
                            className="text-white/[.5] text-base items-end md:items-start"
                            key={index}
                          >
                            <FlexboxGrid.Item colspan={7}>
                              <div className="flex flex-col gap-y-2 text-left">
                                <div className="flex flex-col">
                                  <span className="text-[12px] leading-[normal] md:text-white md:text-lg font-[590]">
                                    {`${departure_details?.departure_time.substring(
                                      0,
                                      departure_details?.departure_time.indexOf(
                                        ':',
                                        departure_details?.departure_time.indexOf(
                                          ':'
                                        ) + 1
                                      )
                                    )}`}
                                  </span>

                                  <span className="hidden text-[16px] md:block">
                                    {departure_details?.city_name.split('-')[0]}
                                  </span>

                                  <span className="text-[12px] leading-[normal] md:text-[16px]">
                                    {formatDate(
                                      departure_details?.departure_date
                                    )}
                                  </span>
                                </div>

                                <div className="md:hidden inline mr-auto w-[93px] border-[#2c2c2c] border relative">
                                  <span className="absolute w-[24.09px] border border-white left-0" />
                                  <span className="absolute w-[9.63px] border border-white right-0" />
                                </div>

                                <span className="text-white opacity-70 font-[590] md:hidden inline">
                                  {departure_details?.airport}
                                </span>
                              </div>
                            </FlexboxGrid.Item>

                            <FlexboxGrid.Item colspan={8}>
                              <div className="centerStops flex flex-col gap-y-[20px] text-center md:gap-y-2">
                                <span className="text-[13px]">
                                  {totalTravelTime(total_time)}
                                </span>

                                <div className="hidden justify-between md:flex">
                                  <Image
                                    className=""
                                    src={takeoff}
                                    alt="departure"
                                  />
                                  <Image
                                    className=""
                                    src={landing}
                                    alt="landing"
                                  />
                                </div>

                                <div className="flex flex-col">
                                  <div className="hidden md:inline mr-auto w-full border-[#2c2c2c] border relative mb-4">
                                    <span className="absolute w-[11.63px] border border-white] left-0" />
                                    <span className="absolute w-[11.63px] border border-white] right-1/2 left-1/2" />
                                    <span className="absolute w-[11.63px] border border-white] right-0" />
                                  </div>

                                  <div className="flex justify-center md:justify-between">
                                    <span className="hidden md:flex">
                                      {departure_details?.airport}
                                    </span>

                                    {flightDetails && stops?.length > 0 ? (
                                      <span
                                        className="text-[16px] font-[590] -mt-2 underline hover:cursor-pointer"
                                        onClick={() => showStops(stops)}
                                      >
                                        {stops?.length - 1}
                                        &nbsp; {t('flights.stops')}
                                      </span>
                                    ) : null}
                                    <span className="hidden md:flex">
                                      {arrival_details?.airport}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </FlexboxGrid.Item>

                            <FlexboxGrid.Item colspan={7}>
                              <div className="flex flex-col gap-y-2 text-right">
                                <div className="flex flex-col">
                                  <span className="text-[12px] leading-[normal] md:text-white md:text-lg font-[590]">{`${arrival_details.arrival_time.substring(
                                    0,
                                    arrival_details.arrival_time.indexOf(
                                      ':',
                                      arrival_details.arrival_time.indexOf(
                                        ':'
                                      ) + 1
                                    )
                                  )}`}</span>
                                  <span className="hidden text-[16px] md:block">
                                    {arrival_details?.city_name.split('-')[0]}
                                  </span>
                                  <span className="text-[12px] leading-[normal] md:text-[16px]">
                                    {formatDate(arrival_details?.arrival_date)}
                                  </span>
                                </div>
                                <div className="md:hidden inline ml-auto w-[93px] border-[#2c2c2c] border relative">
                                  <span className="absolute w-[9.63px] border border-white left-0" />
                                  <span className="absolute w-[24.09px] border border-white right-0" />
                                </div>
                                <span className="text-white opacity-70 font-[590] md:hidden inline">
                                  {arrival_details?.airport}
                                </span>
                              </div>
                            </FlexboxGrid.Item>
                          </FlexboxGrid>
                        </div>
                      </>
                    );
                  })}
                  {/* end of detail */}
                  <div className="flex w-full mt-[32px] md:hidden">
                    <ExtraServicesDropdown
                      flights={flights}
                      flightPolicies={flight_policies}
                      isWhite
                    />
                  </div>

                  <div className="flex md:hidden flex-col">
                    {getTheAmountTest()}
                  </div>

                  <div className="hidden w-full md:flex">
                    <ExtraServicesDropdown
                      flights={flights}
                      flightPolicies={flight_policies}
                      isWhite
                    />
                  </div>

                  <div>
                    <PaymentFlightsAgent
                      flightTotalCost={flightTotalCost}
                      subTotal={subTotal}
                      transactionFee={transactionFee}
                      totalPrice={totalPrice}
                      agentcommissionType={agentcommissionType}
                      setAgentCommissionType={setAgentCommissionType}
                    />

                    <FlexboxGrid justify="center" className="inline md:hidden">
                      <FlexboxGrid.Item>
                        <div className="flex gap-2.5 items-center md:justify-center mb-5 text-white mt-[40px]">
                          <Checkbox
                            className="transparentCheckbox"
                            id="checkPolicy"
                            checked={isChecked}
                            onChange={() => setIsChecked(!isChecked)}
                          />
                          <label htmlFor="checkPolicy" className="font-[510]">
                            {t('flights.flight-policy-text-1')}{' '}
                            <button
                              onClick={() => setShowCancelPolicy(true)}
                              className="underline"
                            >
                              {t('flights.flight-policy-text-2')}
                            </button>
                          </label>
                        </div>
                      </FlexboxGrid.Item>

                      <FlexboxGrid.Item>
                        <button
                          disabled={
                            !!flightData.first_name ||
                            !!flightData.last_name ||
                            !!flightData.email ||
                            !!flightData.phone ||
                            !!flightData.dob ||
                            !!flightData.gender ||
                            validPnr ||
                            !isChecked ||
                            isLoading
                          }
                          className={`mobile-submit text-black bg-[var(--primary-background)] w-full h-[48px] mx-auto rounded-3xl font-[760] tracking-widest mb-9 flex justify-center items-center ${
                            isLoading ? 'customTailwind' : ''
                          }`}
                          onClick={handleSendProposal}
                        >
                          {isLoading ? (
                            <SearchLoader />
                          ) : (
                            t('stays.send-proposal')
                          )}
                        </button>

                        {showSearchEngineModal && (
                          <button
                            disabled={
                              !pass || validPnr || !isChecked || isLoading
                            }
                            className={`opensercvice text-whiteLabelColor border-whiteLabelColor border-[1px] text-[16px] font-[650] bg-black hover:bg-[var(--primary-background-light)] rounded-[20px] w-full md:w-full h-[48px] lg:w-[250px]`}
                            onClick={() => openServiceModal()}
                          >
                            Add service
                          </button>
                        )}
                      </FlexboxGrid.Item>
                    </FlexboxGrid>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </BookingLayout>
    </>
  );
};

export default AgentProposal;
