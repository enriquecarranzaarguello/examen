import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';

import { DatePicker, Form, SelectPicker, AutoComplete } from 'rsuite';
import Image from 'next/image';
import save from '@icons/save.svg';
import { TravelerFlightSchema } from 'src/common/schemas/traveler';
import { getTravelers } from '@utils/axiosClients';

const GeneralInfoCard = ({
  travelerInfo,
  origin,
  index,
  passTest,
  typeTraveler,
  phoneCodes,
  phoneCodeDefaultValue,
  withPhoneCode = false,
}: any) => {
  const { t } = useTranslation();
  const { data: session } = useSession();

  const modelTraveler = TravelerFlightSchema(
    {
      required: t('valid.required'),
      phone: t('agent.editSections.errors.phone_number'),
      email: t('valid.email'),
      child: t('flights.valid.nochild'),
      adult: t('flights.valid.noadult'),
      infant: t('flights.valid.noinfant'),
      minLength: t('flights.valid.minLength'),
    },
    typeTraveler
  );

  const formRef = React.useRef<any>(null);
  const [formError, setFormError] = useState<Record<string, any>>({});
  const [travelers, setTravelers] = useState<any>([]);
  const [wasAutocompleted, setWasAutocompleted] = useState<boolean>(false);

  const [flightData, setFlightData] = useState<any>({
    guid: 0,
    dob: '',
    email: '',
    first_name: '',
    last_name: '',
    gender: 'M',
    id_traveler: 0,
    is_contact: index === 0 ? true : false,
    phone: '',
    traveler_type: typeTraveler === 'infant' ? 'INF' : 'ADT',
    phone_code: '',
    id: '',
    birth_date: null,
  });

  const data = [
    { label: 'Mr.', value: 'M' },
    { label: 'Ms.', value: 'F' },
  ].map(item => ({ label: item.label, value: item.value }));

  useEffect(() => {
    if (wasAutocompleted) {
      if (formRef.current) {
        formRef.current.check();
      }
    }

    const isValid = Object.keys(formError).length == 0;

    if (
      (flightData.first_name &&
        flightData.last_name &&
        flightData.gender &&
        flightData.dob &&
        flightData.email &&
        flightData.phone) ||
      !isValid
    ) {
      flightData.guid = index;
      handlePassData(flightData, index, isValid);
    }
  }, [flightData]);

  useEffect(() => {
    if (session?.user?.id_token) {
      getTravelers(session?.user?.id_token)
        .then(response => {
          const tempTravelers = response?.data || [];

          const cleanTravelers = tempTravelers.filter(
            (traveler: any) => !traveler.traveler_id.includes('rec')
          );

          setTravelers(cleanTravelers);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [session]);

  let selectEmailPickerData;

  if (travelers.length > 0) {
    selectEmailPickerData = travelers.map((traveler: any) => ({
      label: `${traveler?.data_traveler?.fullName} - (${traveler?.data_traveler?.email})`,
      value: traveler?.data_traveler?.email,
    }));
  } else {
    selectEmailPickerData = [];
  }

  useEffect(() => {
    if (phoneCodeDefaultValue)
      setFlightData({ ...flightData, phone_code: phoneCodeDefaultValue });
  }, [phoneCodeDefaultValue]);

  const handlePassData = (flightData: any, index: number, isValid: boolean) => {
    delete flightData.birth_date;
    passTest(flightData, index, isValid);
  };

  const handleAutocomplete = (email: string) => {
    const travelerFilter = travelers.find(
      (traveler: any) => traveler.data_traveler.email === email
    );

    if (travelerFilter) {
      const tempTraveler = {
        first_name:
          travelerFilter?.data_traveler?.fullName?.split(' ')[0] || '',
        last_name: travelerFilter?.data_traveler?.fullName?.split(' ')[1] || '',
        phone: travelerFilter?.data_traveler?.phoneNumber || '',
        gender: travelerFilter?.data_traveler?.gender === 'MS' ? 'F' : 'M',
        dob: travelerFilter?.data_traveler?.dayOfBirthdate,
        id: travelerFilter?.traveler_id,
        email: email,
      };
      const updatedRowValue = { ...flightData, ...tempTraveler };
      setFlightData(updatedRowValue);
      setWasAutocompleted(true);
    } else {
      setFlightData({ ...flightData, email: email });
    }
  };

  return (
    <div className="bg-white p-[35px] px-[30px] rounded-[25px] h-fit w-full xxs:max-w-[373px] md:w-[471px] ">
      <div className="flex justify-between items-center mb-[23px]">
        <div className="text-[22px] md:text-2xl font-[760] text-black flex items-center">
          <span>
            {t('travelers.traveler')} {index + 1 || 1}{' '}
          </span>
          <span className="text-base text-gray-500 font-medium ml-2">
            {'| '}
            {typeTraveler === 'adult'
              ? t('stays.adult').replace(/^\w/, match => match.toUpperCase())
              : typeTraveler === 'child'
                ? t('stays.child').replace(/^\w/, match => match.toUpperCase())
                : t('flights.infant')}
          </span>
        </div>
        <button>
          <Image src={save} alt="two" />
        </button>
      </div>
      <Form
        className="flex flex-col gap-[12px] my-[7px]"
        model={modelTraveler}
        onCheck={setFormError}
        ref={formRef}
        formValue={flightData}
      >
        <AutoComplete
          name="email"
          readOnly={origin === 'pay'}
          value={flightData?.email || travelerInfo?.email}
          size="lg"
          placement="bottomStart"
          placeholder={t('agent.email') || ''}
          onChange={handleAutocomplete}
          className="nameInput rounded-[90px] border border-[rgba(0,0,0,0.15)] h-[48px] px-1 text-[#161616]"
          data={selectEmailPickerData}
          style={{ width: '100%' }}
          autoComplete="off"
        />
        <Form.Control
          name="first_name"
          readOnly={origin === 'pay'}
          value={flightData?.first_name || travelerInfo?.first_name}
          onChange={value =>
            setFlightData({ ...flightData, first_name: value })
          }
          placeholder={t('stays.placeholder-first-name')}
          className="rounded-[90px] border border-r-0 border-[rgba(0,0,0,0.15)] h-[48px] px-4 text-[#161616] w-full"
          style={{ width: '100%' }}
        />
        <Form.Control
          name="last_name"
          readOnly={origin === 'pay'}
          value={flightData?.last_name || travelerInfo?.last_name}
          onChange={value => setFlightData({ ...flightData, last_name: value })}
          placeholder={t('stays.placeholder-last-name')}
          className="rounded-[90px] border border-r-0 border-[rgba(0,0,0,0.15)] h-[48px] px-4 text-[#161616] w-full"
          style={{ width: '100%' }}
        />

        {withPhoneCode ? (
          <div className="flightsBirthGender">
            <Form.Control
              name="phone_code"
              accepter={SelectPicker}
              readOnly={origin === 'pay'}
              data={phoneCodes}
              cleanable={false}
              searchable={false}
              value={flightData?.phone_code || phoneCodeDefaultValue}
              onChange={value =>
                setFlightData({ ...flightData, phone_code: value || '' })
              }
              placement="bottom"
              placeholder={t('flights.phone_code')}
              className="flightsGender rounded-[90px] border border-[rgba(0,0,0,0.15)] h-[48px] text-[#161616]"
              menuStyle={{
                padding: '10px 0 10px 20px',
                marginTop: '0.5rem',
              }}
            />
            <Form.Control
              name="phone"
              readOnly={origin === 'pay'}
              value={flightData?.phone || travelerInfo?.phone}
              onChange={value => setFlightData({ ...flightData, phone: value })}
              placeholder={t('agent.phone_number')}
              className="rounded-[90px] border border-[rgba(0,0,0,0.15)] h-[48px] px-4 text-[#161616]"
              style={{ width: '100%' }}
            />
          </div>
        ) : (
          <Form.Control
            name="phone"
            readOnly={origin === 'pay'}
            value={flightData?.phone || travelerInfo?.phone}
            onChange={value => setFlightData({ ...flightData, phone: value })}
            placeholder={t('agent.phone_number')}
            className="rounded-[90px] border border-[rgba(0,0,0,0.15)] h-[48px] px-4 text-[#161616]"
            style={{ width: '100%' }}
          />
        )}
        <div className="flightsBirthGender">
          {origin === 'pay' ? (
            <Form.Control
              name="birth_date"
              accepter={DatePicker}
              readOnly={true}
              value={new Date(`${travelerInfo?.dob}T00:00:00`)}
              oneTap
              placeholder={t('agent.birthday')}
              className="flightsBirth rounded-[90px] border border-[rgba(0,0,0,0.15)] h-[48px] text-[#161616]"
            />
          ) : (
            <Form.Control
              name="birth_date"
              accepter={DatePicker}
              shouldDisableDate={date => {
                const today = new Date();
                return date > today;
              }}
              oneTap
              onChange={(date: Date | null, _event: React.SyntheticEvent) => {
                const invalidDate = date === null || isNaN(date.getTime());
                if (!invalidDate) {
                  setFlightData({
                    ...flightData,
                    dob: date.toISOString().substring(0, 10),
                    birth_date: date,
                  });
                }
              }}
              onClean={() =>
                setFlightData({ ...flightData, dob: '', birth_date: null })
              }
              placeholder={t('agent.birthday')}
              className="flightsBirth rounded-[90px] border border-[rgba(0,0,0,0.15)] h-[48px] text-[#161616]"
            />
          )}

          <Form.Control
            name="gender"
            accepter={SelectPicker}
            readOnly={origin === 'pay'}
            data={data}
            cleanable={false}
            searchable={false}
            value={flightData?.gender || travelerInfo?.gender}
            onChange={value =>
              setFlightData({ ...flightData, gender: value || '' })
            }
            placement="bottom"
            placeholder={t('flights.gender')}
            className="flightsGender rounded-[90px] border border-[rgba(0,0,0,0.15)] h-[48px] text-[#161616]"
            menuStyle={{
              padding: '10px 20px',
              marginTop: '0.5rem',
            }}
          />
        </div>
      </Form>
    </div>
  );
};

export default GeneralInfoCard;
