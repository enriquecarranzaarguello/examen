import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useAppSelector } from '@context';
import config from '@config';

import {
  FlexboxGrid,
  Popover,
  Radio,
  RadioGroup,
  Whisper,
  SelectPicker,
} from 'rsuite';
import type { TravelerDataType } from '@typing/types';

//Getting Flags
import { findFlagByCountry } from '../../helpers/findFlagByCountry';

//Icons
import dropdownArrow from '@icons/downIconwhite.svg';
import searchIcon from '@icons/searchIcon.svg';

const TravelersFilter = ({
  travelers,
  handleChangeFilterName,
  handleChangeFilterCountries,
  handleChangeFilterTypecast,
  handleChangeFilterReferral,
  handleChangeFilterGroup,
}: {
  travelers: TravelerDataType[];
  handleChangeFilterName: any;
  handleChangeFilterCountries: any;
  handleChangeFilterTypecast: any;
  handleChangeFilterReferral: any;
  handleChangeFilterGroup: any;
}) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [arrowNameFilter, setArrowNameFilter] = useState(false);
  const [arrowCountryFilter, setArrowCountryFilter] = useState(false);
  const [arrowGroupFilter, setArrowGroupFilter] = useState(false);
  const [countryImage, setCountryImage] = useState(false);
  const [service, setService] = useState(false);
  const [groups, setGroups] = useState([]);

  const agent_id = useAppSelector(state => state.agent.agent_id);

  const typeCasting = [
    { label: 'Honeymoon', value: 'Honeymoon' },
    { label: 'Business Trip', value: 'Business_Trip' },
    { label: 'Just Traveler', value: 'Just_Traveler' },
    { label: 'Low cost', value: 'Low_cost' },
    { label: 'Family', value: 'Family' },
    { label: 'Bachelor Party', value: 'Bachelor_party' },
    { label: 'Company trip', value: 'Company_trip' },
    { label: 'Inactive', value: 'Inactive' },
    { label: 'New', value: 'New' },
  ];

  const travelerSource = [
    { label: 'Family/Friend', value: 'family/friend' },
    { label: 'Online campaigns', value: 'online_campaigns' },
    { label: 'Off-line campaigns', value: 'off-line_campaigns' },
    { label: 'Referral', value: 'referral' },
  ];

  const tripStatus = {
    value: 'Coming soon',
  };

  useEffect(() => {
    const getGroups = async () => {
      try {
        const response = await axios.get(
          `${config.api}/agent/traveler/group/${agent_id}`
        );
        if (response.status === 200) {
          setGroups(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getGroups();
  }, [agent_id]);

  //Handle for click outside components
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setArrowNameFilter(false);
        setArrowCountryFilter(false);
        setCountryImage(true);
        setService(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const uniqueNames = travelers?.filter(
    (traveler, index, self) =>
      traveler?.data_traveler?.fullName && //Check for full names
      traveler?.data_traveler?.fullName?.trim() &&
      index ===
        self.findIndex(
          t => t?.data_traveler?.fullName === traveler?.data_traveler?.fullName
        )
  );

  const uniqueCountries = travelers?.filter(
    (traveler, index, self) =>
      traveler?.data_traveler?.country &&
      index ===
        self.findIndex(
          t => t?.data_traveler?.country === traveler?.data_traveler?.country
        )
  );

  //Generate unique traveler names
  const selectfullnamePickerData = uniqueNames.map((traveler: any) => ({
    label: (
      <div className="flex gap-3">
        <Image src={searchIcon} alt="search" />{' '}
        {traveler?.data_traveler?.fullName}
      </div>
    ),
    value: traveler?.data_traveler?.fullName,
  }));

  //Generate Unique traveler countries
  const selectCountryNamePickerData = uniqueCountries.map((traveler: any) => ({
    label: `${findFlagByCountry(traveler?.data_traveler?.country)} ${
      traveler?.data_traveler?.country
    }`,
    value: traveler?.data_traveler?.country,
  }));

  //Generate groups label
  const selectGroupPicket = groups.map(group => ({
    label: group,
    value: group,
  }));

  return (
    <div className="hidden md:flex flex-row items-center justify-center md:w-full bg-[#141414] rounded-xl min-h-[50px] my-5 text-white">
      <FlexboxGrid className="w-full" ref={containerRef}>
        {/* Filter Of Name */}
        <FlexboxGrid.Item className="flex relative w-[14%] items-center justify-start px-5 cursor-pointer">
          <div onClick={() => setArrowNameFilter(!arrowNameFilter)}>
            <SelectPicker
              size="lg"
              placement="bottomStart"
              onChange={handleChangeFilterName}
              placeholder={t('travelers.fullname')}
              className="suppliersSelectPicker bg-[#141414] text-black"
              menuClassName="black-picker"
              data={selectfullnamePickerData}
            />
          </div>
          <Image
            alt="icon"
            src={dropdownArrow}
            className={`${arrowNameFilter && 'rotate-180'}`}
          />
        </FlexboxGrid.Item>
        {/* Filter of Country */}
        <FlexboxGrid.Item className="flex relative w-[14%] items-center justify-start px-5 cursor-pointer">
          <div onClick={() => setArrowCountryFilter(!arrowCountryFilter)}>
            <SelectPicker
              size="lg"
              placement="bottomStart"
              onChange={handleChangeFilterCountries}
              placeholder={t('travelers.country')}
              className="suppliersSelectPicker bg-[#141414] text-black"
              menuClassName="black-picker"
              data={selectCountryNamePickerData}
            />
          </div>
          <Image
            alt="icon"
            src={dropdownArrow}
            className={`${arrowCountryFilter && 'rotate-180'}`}
          />
        </FlexboxGrid.Item>
        {/* Filter of TypeCast */}
        <FlexboxGrid.Item
          className="w-[14%] flex items-center justify-between px-5 cursor-pointer"
          onClick={() => setService(!service)}
        >
          <Whisper
            trigger="click"
            placement="bottomStart"
            speaker={
              <Popover arrow={false} className="status-popover supplierfilter">
                <RadioGroup
                  name="radios-services"
                  onChange={handleChangeFilterTypecast}
                >
                  <Radio value="0">{t('suppliers.all')}</Radio>
                  {typeCasting.map((type, index) => (
                    <Radio value={type.value} key={index}>
                      {t(`travelers.typecast.${type.value}`)}
                    </Radio>
                  ))}
                </RadioGroup>
              </Popover>
            }
          >
            <button
              type="button"
              id="button-travelers"
              className="flex gap-2 justify-between items-center w-full text-[15px] text-white h-[46px] px-[15px]"
            >
              {t('travelers.typecast_title')}
              <Image
                alt="icon"
                src={dropdownArrow}
                className={`${service && 'rotate-180'}`}
              />
            </button>
          </Whisper>
        </FlexboxGrid.Item>
        {/* Trip Status */}
        <FlexboxGrid.Item className="flex relative w-[14%] items-center justify-center px-5 cursor-pointer">
          {/*TODO: Adding Trip Satatus Filter*/}
          <div className="flex flex-row  items-center justify-start w-full h-[48px] text-[15px]">
            {t('travelers.tripStatus')}
          </div>
          {/* <Image alt="icon" src={dropdownArrow} className={``} /> */}
        </FlexboxGrid.Item>
        {/* Filter of Referral */}
        <FlexboxGrid.Item
          className="w-[14%] flex items-center justify-between px-5 cursor-pointer"
          onClick={() => setService(!service)}
        >
          <Whisper
            trigger="click"
            placement="bottomStart"
            speaker={
              <Popover arrow={false} className="status-popover supplierfilter">
                <RadioGroup
                  name="radios-services"
                  onChange={handleChangeFilterReferral}
                >
                  <Radio value="0">{t('suppliers.all')}</Radio>
                  {travelerSource.map((type, index) => (
                    <Radio value={type.value} key={index}>
                      {t(`travelers.referral.${type.value}`)}
                    </Radio>
                  ))}
                </RadioGroup>
              </Popover>
            }
          >
            <button
              type="button"
              id="button-travelers"
              className="flex gap-2 justify-between items-center w-full text-[15px] text-white h-[46px] px-[15px]"
            >
              {t('suppliers.service-type')}
              <Image
                alt="icon"
                src={dropdownArrow}
                className={`${service && 'rotate-180'}`}
              />
            </button>
          </Whisper>
        </FlexboxGrid.Item>
        {/* Filter Group */}
        <FlexboxGrid.Item className="flex relative w-[14%] items-center justify-start px-5 cursor-pointer">
          <div onClick={() => setArrowGroupFilter(!arrowGroupFilter)}>
            <SelectPicker
              size="lg"
              placement="bottomStart"
              onChange={handleChangeFilterGroup}
              placeholder={t('travelers.group')}
              className="suppliersSelectPicker bg-[#141414] text-black"
              menuClassName="black-picker"
              data={selectGroupPicket}
            />
          </div>
          <Image
            alt="icon"
            src={dropdownArrow}
            className={`${arrowGroupFilter && 'rotate-180'}`}
          />
        </FlexboxGrid.Item>
        {/* Services */}
        <FlexboxGrid.Item className="flex relative w-[14%] items-center justify-center px-5 cursor-pointer">
          <div className="flex flex-row  items-center justify-start w-full h-[48px] text-[15px]">
            {t('travelers.service')}
          </div>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </div>
  );
};

export default TravelersFilter;
