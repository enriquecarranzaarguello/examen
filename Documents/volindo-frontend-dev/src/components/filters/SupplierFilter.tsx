import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import down from '@icons/downIconwhite.svg';
import IconCloseGray from '@icons/close-gray.svg';
import searchIcon from '@icons/searchIcon.svg';
import { findFlagByCountry } from '../../helpers/findFlagByCountry';
import { useTranslation } from 'next-i18next';

import {
  FlexboxGrid,
  Popover,
  Radio,
  RadioGroup,
  Whisper,
  SelectPicker,
} from 'rsuite';

interface Item {
  label: string;
  value: string;
}

const SupplierFilter = ({
  data,
  close,
  handleChangeFilterStatus,
  handleChangeFilterServices,
  handleChangeFilterName,
  handleChangeFilterCompanyName,
  handleChangeFilterCountries,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [imageToggle, setImageToggle] = React.useState(false);
  const [companyImage, setCompanyImage] = React.useState(false);
  const [locationImage, setLocationImage] = React.useState(false);
  const [service, setService] = React.useState(false);
  const [status, setStatus] = React.useState(false);

  const [inputValueCompany, setInputValueCompany] = useState('');
  const [showDropdownCompany, setShowDropdownCompany] = useState(false);
  const [filteredDataCompany, setFilteredDataCompany] = useState([]);

  const [inputValueCountry, setInputValueCountry] = useState('');
  const [showDropdownCountry, setShowDropdownCountry] = useState(false);
  const [filteredDataCountry, setFilteredDataCountry] = useState([]);

  const [selectedService, setSelectedService] = useState('0');
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState('0');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const { t } = useTranslation();

  const [windowSize, setWindowSize] = React.useState(0);
  React.useEffect(() => {
    setWindowSize(window.innerWidth);
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setImageToggle(false);
        setCompanyImage(false);
        setLocationImage(false);
        setService(false);
        setStatus(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const filteredCompanies = selectPickerData.filter((item: Item) =>
      item.label.toLowerCase().includes(inputValueCompany.toLowerCase())
    );
    setFilteredDataCompany(filteredCompanies);

    const filteredCountries = selectcontryPickerData.filter((item: Item) =>
      item.label.toLowerCase().includes(inputValueCountry.toLowerCase())
    );
    setFilteredDataCountry(filteredCountries);
  }, [inputValueCompany, inputValueCountry]);

  const uniqueNames = data?.filter(
    (name: any, index: number, self: any[]) =>
      name.company_name &&
      name.company_name.trim() && // Ensure non-empty and non-undefined company_name
      index === self.findIndex((n: any) => n.company_name === name.company_name)
  );

  const selectPickerData = uniqueNames.map((name: any) => ({
    label: name.company_name,
    value: name.company_name,
  }));

  const uniquefull_Names = data.filter(
    (name: any, index: number, self: any[]) =>
      name.full_name &&
      index === self.findIndex((n: any) => n.full_name === name.full_name)
  );

  const selectfullnamePickerData = uniqueNames.map((name: any) => ({
    label: (
      <div className="flex gap-3">
        <Image src={searchIcon} alt="search" /> {name.full_name}
      </div>
    ),
    value: name.full_name,
  }));

  const uniqueCountries = data.filter(
    (country: any, index: number, self: any[]) =>
      country.country_id &&
      index === self.findIndex((c: any) => c.country_id === country.country_id)
  );

  const selectcontryPickerData = uniqueCountries.map((country: any) => ({
    label: ` ${country.country_id}`,
    value: country.country_id,
  }));

  const handleShowCompanyDropdown = () => {
    setShowDropdownCompany(!showDropdownCompany);
    setFilteredDataCompany(selectPickerData);
  };

  const handleShowCountryDropdown = () => {
    setShowDropdownCountry(!showDropdownCountry);
    setFilteredDataCountry(selectcontryPickerData);
  };

  const handleSelectCompany = (item: Item) => {
    setInputValueCompany(item.label);
    handleChangeFilterCompanyName(item.value);
  };

  const handleInputChangeCompany = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValueCompany(e.target.value);
  };

  const handleSelectCountry = (item: Item) => {
    setInputValueCountry(item.label);
    handleChangeFilterCountries(item.value);
  };

  const handleInputChangeCountry = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValueCountry(e.target.value);
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSelectedService(newValue);
    handleChangeFilterServices(newValue);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSelectedStatus(newValue);
    handleChangeFilterStatus(newValue);
  };

  const typeOfService = [
    { label: t('suppliers.all'), value: '0' },
    { label: t('suppliers.luxury'), value: '1' },
    { label: t('suppliers.adventures'), value: '2' },
    { label: t('suppliers.extra'), value: '3' },
    { label: t('suppliers.transportation'), value: '4' },
    { label: t('suppliers.accommodation'), value: '5' },
  ];

  const statusOptions = [
    { label: t('suppliers.all'), value: '0' },
    { label: t('suppliers.pending'), value: '1' },
    { label: t('suppliers.approved'), value: '2' },
    { label: t('suppliers.proccessing'), value: '3' },
  ];

  return (
    <>
      {windowSize < 768 ? (
        <div className="flex flex-col justify-between fixed top-0 w-full h-full overflow-auto bg-black z-50 px-[20px] pb-[20px]">
          <div>
            <div className="relative flex justify-between items-center text-white pt-[15px] mb-[45px]">
              <span className="text-[26px] font-[650] scale-y-[0.8]">
                {t('suppliers.filter')}
              </span>
              <button
                className="absolute -right-[10px] top-[15px]"
                onClick={close}
              >
                <Image width={42} height={20} alt="icon" src={IconCloseGray} />
              </button>
            </div>
            <FlexboxGrid
              className={`flex flex-col w-full flexbox-grid `}
              ref={containerRef}
            >
              {/* Company name */}
              <div
                className="flex items-center flex-row gap-1.5 mb-[11px] text-white"
                onClick={handleShowCompanyDropdown}
              >
                <p className="font-[510] text-[15px]">
                  {t('suppliers.company')}
                </p>
                <Image
                  alt="icon"
                  src={down}
                  className={`${showDropdownCompany && 'rotate-180'}`}
                />
              </div>
              {showDropdownCompany && (
                <div className="relative w-full rounded-xl overflow-hidden">
                  <div className="relative">
                    <input
                      type="text"
                      value={inputValueCompany}
                      onChange={handleInputChangeCompany}
                      placeholder="Search company name"
                      className="w-full h-[34px] bg-transparent border rounded-xl border-gray focus:border-gray focus:outline-none text-white p-2"
                    />
                    <div className="absolute right-[17px] top-1/2 -translate-y-1/2 opacity-75">
                      <Image
                        alt="icon"
                        src={searchIcon}
                        width={20}
                        height={20}
                      />
                    </div>
                  </div>
                  <ul className="flex flex-col gap-[16px] mt-[9px] mb-[20px]">
                    {filteredDataCompany.map((item: Item, index: number) => (
                      <li
                        key={index}
                        className="flex gap-[15px]"
                        onClick={() => handleSelectCompany(item)}
                      >
                        <Image
                          alt="icon"
                          src={searchIcon}
                          width={16}
                          height={16}
                        />
                        <div className="text-white font-[400] text-[15px]">
                          {item.label}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Company name END */}

              {/* Country */}
              <div
                className="flex items-center flex-row gap-1.5 mb-[11px] text-white"
                onClick={handleShowCountryDropdown}
              >
                <p className="font-[510] text-[15px]">
                  {t('reservations.country')}
                </p>
                <Image
                  alt="icon"
                  src={down}
                  className={`${showDropdownCountry && 'rotate-180'}`}
                />
              </div>
              {showDropdownCountry && (
                <>
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={inputValueCountry}
                      onChange={handleInputChangeCountry}
                      placeholder="Select Country"
                      className="w-full h-[34px] bg-transparent border rounded-xl border-gray focus:border-gray focus:outline-none text-white p-2"
                    />
                    <div className="absolute right-[17px] top-1/2 -translate-y-1/2 opacity-75">
                      <Image
                        alt="icon"
                        src={searchIcon}
                        width={20}
                        height={20}
                      />
                    </div>
                  </div>
                  <ul className="flex flex-col gap-[16px] mt-[9px] mb-[20px]">
                    {filteredDataCountry.map((item: Item, index: number) => (
                      <li key={index} className="flex items-center gap-[15px]">
                        <div>{findFlagByCountry(item.value)}</div>
                        <div
                          className="flex gap-[20px]"
                          onClick={() => handleSelectCountry(item)}
                        >
                          <div className="text-white font-[400] text-[15px]">
                            {item.label}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {/* Country  END*/}

              {/* Type of service */}
              <div
                className="flex items-center flex-row gap-1.5 mb-[11px] text-white"
                onClick={() => setShowServiceDropdown(!showServiceDropdown)}
              >
                <p className="font-[510] text-[15px]">
                  {t('suppliers.service-type')}
                </p>
                <Image
                  alt="icon"
                  src={down}
                  className={`${showServiceDropdown && 'rotate-180'}`}
                />
              </div>
              {showServiceDropdown && (
                <ul className="flex flex-col gap-[6px] mb-[20px]">
                  {typeOfService.map((service, index) => (
                    <li key={index} className="flex items-center gap-[15px]">
                      <input
                        type="radio"
                        id={service.value}
                        name="service"
                        value={service.value}
                        checked={selectedService === service.value}
                        onChange={handleServiceChange}
                        className="sr-only"
                      />
                      <label
                        htmlFor={service.value}
                        className={`flex flex-row gap-[15px] items-center font-[400] text-[15px] ${
                          selectedService === service.value
                            ? 'text-white'
                            : 'text-gray'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 border border-gray-400 rounded-full ${
                            selectedService === service.value
                              ? 'bg-white'
                              : 'bg-none'
                          }`}
                        ></div>{' '}
                        {service.label}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
              {/* Type of service END */}

              {/* Status */}
              <div
                className="flex items-center flex-row gap-1.5 mb-[11px] text-white"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              >
                <p className="font-[510] text-[15px]">
                  {t('travelers.status')}
                </p>
                <Image
                  alt="icon"
                  src={down}
                  className={`${showStatusDropdown && 'rotate-180'}`}
                />
              </div>
              {showStatusDropdown && (
                <ul className="flex flex-col gap-[6px] mb-[50px]">
                  {statusOptions.map((status, index) => (
                    <li key={index} className="flex items-center gap-[15px]">
                      <input
                        type="radio"
                        id={status.value}
                        name="status"
                        value={status.value}
                        checked={selectedStatus === status.value}
                        onChange={handleStatusChange}
                        className="sr-only"
                      />
                      <label
                        htmlFor={status.value}
                        className={`flex flex-row gap-[15px] items-center font-[400] text-[15px] ${
                          selectedStatus === status.value
                            ? 'text-white'
                            : 'text-gray'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 border border-gray-400 rounded-full ${
                            selectedStatus === status.value
                              ? 'bg-white'
                              : 'bg-none'
                          }`}
                        ></div>{' '}
                        {status.label}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
              {/* Status End*/}
            </FlexboxGrid>
          </div>
          <button
            className="min-h-[48px] bg-[var(--primary-background)] rounded-full text-white font-[760] text-[22px]"
            onClick={close}
          >
            <span className="block scale-y-75">{t('common.done')}</span>
          </button>
        </div>
      ) : (
        <div className="">
          <FlexboxGrid
            className="grid grid-cols-6 bg-white/[.14] rounded-xl w-full place-items-center flexbox-grid"
            ref={containerRef}
          >
            <FlexboxGrid.Item className="flex relative">
              <div onClick={() => setImageToggle(!imageToggle)}>
                <SelectPicker
                  size="lg"
                  placement="bottomStart"
                  onChange={handleChangeFilterName}
                  placeholder={t('suppliers.fullname')}
                  className="suppliersSelectPicker w-full h-[46px!important]"
                  menuClassName="black-picker"
                  data={selectfullnamePickerData}
                />
              </div>
              <Image
                alt="icon"
                src={down}
                className={`${imageToggle && 'rotate-180'}`}
              />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item className="flex">
              <div onClick={() => setCompanyImage(!companyImage)}>
                <SelectPicker
                  size="lg"
                  placement="bottomStart"
                  onChange={handleChangeFilterCompanyName}
                  placeholder={t('suppliers.company')}
                  className="suppliersSelectPicker w-full h-[46px!important] relative"
                  menuClassName="black-picker"
                  data={selectPickerData}
                />
              </div>
              <Image
                alt="icon"
                src={down}
                className={`${companyImage && 'rotate-180'}`}
              />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item className="flex">
              <div onClick={() => setLocationImage(!locationImage)}>
                <SelectPicker
                  size="lg"
                  placement="bottomStart"
                  onChange={handleChangeFilterCountries}
                  placeholder={t('suppliers.location')}
                  className="suppliersSelectPicker w-full h-[46px!important]"
                  data={selectcontryPickerData}
                  menuClassName="black-picker"
                />
              </div>
              <Image
                alt="icon"
                src={down}
                className={`${locationImage && 'rotate-180'}`}
              />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item onClick={() => setService(!service)}>
              <Whisper
                trigger="click"
                placement="bottomStart"
                speaker={
                  <Popover arrow={false} className="status-popover">
                    <RadioGroup
                      name="radios-services"
                      onChange={handleChangeFilterServices}
                    >
                      <Radio value="0">{t('suppliers.all')}</Radio>
                      <Radio value="1">{t('suppliers.luxury')}</Radio>
                      <Radio value="2">{t('suppliers.adventures')}</Radio>
                      <Radio value="3">{t('suppliers.extra')}</Radio>
                      <Radio value="4">{t('suppliers.transportation')}</Radio>
                      <Radio value="5">{t('suppliers.accommodation')}</Radio>
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
                    src={down}
                    className={`${service && 'rotate-180'}`}
                  />
                </button>
              </Whisper>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <label className="text-white flex items-center h-[44px] px-[15px]">
                {t('suppliers.contact')}
              </label>
            </FlexboxGrid.Item>

            <FlexboxGrid.Item onClick={() => setStatus(!status)}>
              <Whisper
                trigger="click"
                placement="bottomStart"
                speaker={
                  <Popover arrow={false} className="status-popover">
                    <RadioGroup
                      name="radios-services"
                      onChange={handleChangeFilterStatus}
                    >
                      <Radio value="0">{t('suppliers.all')}</Radio>
                      <Radio value="1">{t('suppliers.pending')}</Radio>
                      <Radio value="2">{t('suppliers.approved')}</Radio>
                      <Radio value="3">{t('suppliers.proccessing')}</Radio>
                    </RadioGroup>
                  </Popover>
                }
              >
                <button
                  type="button"
                  id="button-travelers"
                  className="flex gap-2 justify-between items-center w-full text-[15px] text-white h-[46px] px-[15px]"
                >
                  {t('travelers.status')}
                  <Image
                    alt="icon"
                    src={down}
                    className={`${status ? 'rotate-180' : ''}`}
                  />
                </button>
              </Whisper>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </div>
      )}
    </>
  );
};

export default SupplierFilter;
