import React, { useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import {
  AutoComplete,
  FlexboxGrid,
  Input,
  List,
  Popover,
  SelectPicker,
} from 'rsuite';

import type { GuestICProps } from '@typing/proptypes';
import type { TravelerType } from '@typing/types';

import { getTravelers } from '@utils/axiosClients';

import config from '@config';

// TODO check if used
const data = [
  { label: 'Mr.', value: 'MR' },
  { label: 'Ms.', value: 'MS' },
].map(item => ({ label: item.label, value: item.value }));

export default function GuestIC({
  rowIndex,
  rowValue,
  rowError,
  onChange,
}: GuestICProps) {
  const { t } = useTranslation('common');
  const { data: session } = useSession();
  const [travelers, setTravelers] = React.useState<TravelerType[]>([]);
  const [savedTravelers, setSavedTravelers] = React.useState<any>([]);

  const handleChangeName = async (value: string, type: string) => {
    const regex = /^[A-Za-z ]*$/;
    if (!regex.test(value)) {
      return;
    }
    onChange(rowIndex, { ...rowValue, [type]: value });
  };

  useEffect(() => {
    const getTravelers = async () => {
      try {
        const response = await axios.get(`${config.api}/travelers`, {
          headers: {
            Authorization: 'Bearer ' + session?.user.id_token || '',
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 200) {
          const tempTravelers = response?.data || [];

          const cleanTravelers = tempTravelers.filter(
            (traveler: any) => !traveler.traveler_id.includes('rec')
          );

          setSavedTravelers(cleanTravelers);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (session?.user.id_token) {
      getTravelers();
    }
  }, [session]);

  const handleImport = (item: TravelerType) => {
    onChange(rowIndex, {
      id: item.id,
      first_name: item.first_name,
      last_name: item.last_name,
      phone_number: item.phone_number,
      email: item.email,
      title: item.title,
      child: rowValue.child,
      save: true,
    });

    setTravelers([]);
  };

  let selectEmailPickerData;

  if (savedTravelers.length > 0) {
    selectEmailPickerData = savedTravelers.map((traveler: any) => ({
      label: `${traveler?.data_traveler?.fullName} - (${traveler?.data_traveler?.email})`,
      value: traveler.data_traveler.email,
    }));
  } else {
    selectEmailPickerData = [];
  }

  const handleSelectedEmail = (email: any) => {
    const travelerFilter = savedTravelers.find(
      (traveler: any) => traveler.data_traveler.email === email
    );

    if (travelerFilter) {
      const temObj = {
        first_name:
          travelerFilter?.data_traveler?.fullName?.split(' ')[0] || '',
        last_name: travelerFilter?.data_traveler?.fullName?.split(' ')[1] || '',
        phone_number: travelerFilter?.data_traveler?.phoneNumber || '',
        email: email,
      };

      const updatedRowValue = { ...rowValue, ...temObj };
      onChange(rowIndex, updatedRowValue);
    } else {
      onChange(rowIndex, { ...rowValue, email: email });
    }
  };

  return (
    <div
      data-testid="hotel-guest-form"
      className="bg-[#FBFBFB] pt-[18px] pb-[35px] px-[31px] mb-[25px] rounded-[25px] lg:pt-[35px]"
    >
      <div className="flex justify-between mb-[24px]">
        <label className="text-[#010101] text-[22px] font-[510] leading-[24px]">{`${t(
          'stays.guest'
        )} ${t(rowValue.child ? 'stays.child' : 'stays.adult')}`}</label>
        <div className="flex gap-[10px]"></div>
      </div>
      {rowError ? (
        <label className="text-red-600">{rowError.email.errorMessage}</label>
      ) : null}

      <AutoComplete
        size="lg"
        placement="bottomStart"
        onChange={handleSelectedEmail}
        placeholder={t('stays.placeholder-email') || ''}
        className="nameInput rounded-[90px] border border-[rgba(0,0,0,0.15)] h-[48px] px-1 text-[#161616] mb-5"
        data={selectEmailPickerData}
        autoComplete="off"
      />

      {rowError &&
        (rowError.first_name.errorMessage ||
          rowError.last_name.errorMessage) && (
          <div className="flex justify-between">
            {rowError ? (
              <label className="text-red-600 w-[196px]">
                {rowError.first_name.errorMessage}
              </label>
            ) : null}
            {rowError ? (
              <label className="text-red-600 w-[196px]">
                {rowError.last_name.errorMessage}
              </label>
            ) : null}
          </div>
        )}

      <div className="flex flex-col gap-[17px] mt-[7px]">
        <div className="relative flex w-full xs:flex-wrap">
          <Input
            value={rowValue.first_name}
            onChange={value => handleChangeName(value, 'first_name')}
            placeholder={t('stays.placeholder-first-name') || ''}
            className="xs:rounded-[25px] xs:mb-[17px] sm:rounded-l-[90px] border sm:border-r-0 border-[rgba(0,0,0,0.15)] h-[48px] px-4 text-[#161616] w-full"
          />

          <Input
            value={rowValue.last_name}
            onChange={value => handleChangeName(value, 'last_name')}
            placeholder={t('stays.placeholder-last-name') || ''}
            className="xs:rounded-[25px] sm:rounded-r-[90px] border border-[rgba(0,0,0,0.15)] h-[48px] px-4 text-[#161616] w-full"
          />

          {travelers.length > 0 && (
            <Popover
              title=""
              visible
              className="top-[55px] text-black w-[365px] max-h-[300px] overflow-y-auto"
            >
              <List hover>
                {travelers.map((item, index) => (
                  <List.Item
                    key={item.id}
                    index={index}
                    onClick={() => handleImport(item)}
                    className="cursor-pointer"
                  >
                    <FlexboxGrid>
                      <FlexboxGrid.Item
                        colspan={12}
                        className="text-[16px]"
                      >{`${item.first_name} ${item.last_name}`}</FlexboxGrid.Item>

                      <FlexboxGrid.Item colspan={12} className="text-[16px]">
                        {item.email}
                      </FlexboxGrid.Item>
                    </FlexboxGrid>
                  </List.Item>
                ))}
              </List>
            </Popover>
          )}
        </div>
        {rowError ? (
          <label className="text-red-600">
            {rowError.phone_number.errorMessage}
          </label>
        ) : null}
        <Input
          value={rowValue.phone_number}
          onChange={value =>
            onChange(rowIndex, { ...rowValue, phone_number: value })
          }
          placeholder={t('stays.placeholder-phone') || ''}
          className="rounded-[90px] border border-[rgba(0,0,0,0.15)] h-[48px] px-4 text-[#161616]"
        />

        {!rowValue.child && (
          <SelectPicker
            data={data}
            cleanable={false}
            searchable={false}
            value={rowValue.title}
            onChange={value =>
              onChange(rowIndex, { ...rowValue, title: value || '' })
            }
            placement="bottomEnd"
            placeholder={t('stays.placeholder-title') || ''}
            className="select-picker-guest rounded-[90px] border border-[rgba(0,0,0,0.15)] h-[48px] px-4 text-[#161616] w-[160px]"
          />
        )}
      </div>
    </div>
  );
}
