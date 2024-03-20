import React, { useState } from 'react';
import Image from 'next/image';
import { Modal } from '@components';

import type { TravelerDataType, ModalFilterType } from '@typing/types';

//Getting Flags
import { findFlagByCountry } from '../../helpers/findFlagByCountry';

//Icons
import dropdownArrow from '@icons/downIconwhite.svg';
import searchIcon from '@icons/searchIcon.svg';

const ModalFilters = ({
  open,
  onClose,
  travelers,
  handleChangeFilterName,
  handleChangeFilterCountries,
  handleChangeFilterTypecast,
  handleChangeFilterReferral,
}: ModalFilterType) => {
  const [nameFilterOpen, setNameFilterOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [countriesFilterOpen, setCountriesFilterOpen] = useState(false);
  const [filterCountry, setFilterCountry] = useState('');
  const [typecastFilterOpen, setTypecastFilterOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [referralFilterOpen, setReferralFilterOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState('');

  const typeCasting = [
    { label: 'All', value: 'all' },
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

  const referralSource = [
    { label: 'All', value: 'all' },
    { label: 'Family/Friend', value: 'family/friend' },
    { label: 'Online campaigns', value: 'online_campaigns' },
    { label: 'Off-line campaigns', value: 'off-line_campaigns' },
    { label: 'Referral', value: 'referral' },
  ];

  //Check for full names
  const uniqueNames = travelers?.filter(
    (traveler, index, self) =>
      traveler?.data_traveler?.fullName &&
      traveler?.data_traveler?.fullName.trim() &&
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

  const handleFilter = () => {
    handleChangeFilterName(filterText);
    handleChangeFilterCountries(filterCountry);
    handleChangeFilterTypecast(selectedType);
    handleChangeFilterReferral(selectedReferral);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col p-5 leading-8">
        <h2 className="font-[650] text-[28px] text-white">Filter</h2>
        {/* Name */}
        <div>
          <div
            onClick={() => setNameFilterOpen(!nameFilterOpen)}
            className="flex flex-row gap-5 text-white"
          >
            <p className="font-[510] text-[16px]">Name</p>
            <Image
              alt="icon"
              src={dropdownArrow}
              className={`${nameFilterOpen && 'rotate-180'}`}
            />
          </div>
          {nameFilterOpen && (
            <>
              <div className="relative w-full rounded-xl overflow-hidden">
                <input
                  type="text"
                  className="w-full h-[40px] bg-transparent border rounded-xl border-gray focus:border-gray focus:outline-none text-white p-2 my-4"
                  placeholder="Search by name"
                  value={filterText}
                  onChange={e => setFilterText(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Image alt="icon" src={searchIcon} width={20} height={20} />
                </div>
              </div>
              <div className="h-fit max-h-[200px] overflow-scroll scrollbar-hide">
                {uniqueNames && (
                  <ul>
                    {uniqueNames
                      .filter(traveler =>
                        traveler?.data_traveler?.fullName
                          .toLowerCase()
                          .includes(filterText?.toLowerCase())
                      )
                      .map(traveler => (
                        <div
                          key={traveler.traveler_id}
                          className="flex flex-row items-center gap-5 text-white"
                        >
                          <Image
                            alt="icon"
                            src={searchIcon}
                            width={16}
                            height={16}
                          />
                          <li
                            key={traveler.traveler_id}
                            className="font-[400] text-[15px]"
                            onClick={() =>
                              setFilterText(traveler?.data_traveler?.fullName)
                            }
                          >
                            {traveler?.data_traveler?.fullName}
                          </li>
                        </div>
                      ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
        {/* Country */}
        <div>
          <div
            onClick={() => setCountriesFilterOpen(!countriesFilterOpen)}
            className="flex flex-row gap-5 text-white mt-2"
          >
            <p className="font-[510] text-[16px]">Country</p>
            <Image
              alt="icon"
              src={dropdownArrow}
              className={`${countriesFilterOpen && 'rotate-180'}`}
            />
          </div>
          {countriesFilterOpen && (
            <>
              <div className="relative w-full rounded-xl overflow-hidden">
                <input
                  type="text"
                  className="w-full h-[40px] bg-transparent border rounded-xl border-gray focus:border-gray focus:outline-none text-white p-2 my-4"
                  placeholder="Search by country"
                  value={filterCountry}
                  onChange={e => setFilterCountry(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Image alt="icon" src={searchIcon} width={20} height={20} />
                </div>
              </div>
              {uniqueCountries && (
                <ul>
                  {uniqueCountries
                    .filter(traveler =>
                      traveler.data_traveler.country
                        .toLowerCase()
                        .includes(filterCountry.toLowerCase())
                    )
                    .map(traveler => (
                      <div
                        key={traveler.traveler_id}
                        className="flex flex-row items-center gap-5 text-white"
                      >
                        <div>
                          {findFlagByCountry(traveler.data_traveler.country)}
                        </div>
                        <li
                          key={traveler.traveler_id}
                          className="font-[400] text-[15px]"
                          onClick={() =>
                            setFilterCountry(traveler.data_traveler.country)
                          }
                        >
                          {traveler.data_traveler.country}
                        </li>
                      </div>
                    ))}
                </ul>
              )}
            </>
          )}
        </div>
        {/* Typecast */}
        <div>
          <div
            onClick={() => setTypecastFilterOpen(!typecastFilterOpen)}
            className="flex flex-row gap-5 text-white mt-2"
          >
            <p className="font-[510] text-[16px]">Typecast</p>
            <Image
              alt="icon"
              src={dropdownArrow}
              className={`${typecastFilterOpen && 'rotate-180'}`}
            />
          </div>
          {typecastFilterOpen && (
            <>
              {typeCasting.map(option => (
                <div key={option.value} className="flex items-center gap-5">
                  <input
                    type="radio"
                    id={option.value}
                    name="typeCasting"
                    value={option.value}
                    checked={selectedType === option.value}
                    onChange={() => setSelectedType(option.value)}
                    className="sr-only"
                  />
                  <label
                    htmlFor={option.value}
                    className={`flex flex-row gap-5 items-center font-[400] text-[15px] ${
                      selectedType === option.value ? 'text-white' : 'text-gray'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 border border-gray-400 rounded-full ${
                        selectedType === option.value ? 'bg-white' : 'bg-none'
                      }`}
                    ></div>{' '}
                    {option.label}
                  </label>
                </div>
              ))}
            </>
          )}
        </div>
        {/* Referral */}
        <div>
          <div
            onClick={() => setReferralFilterOpen(!referralFilterOpen)}
            className="flex flex-row gap-5 text-white mt-2"
          >
            <p className="font-[510] text-[16px]">Referral</p>
            <Image
              alt="icon"
              src={dropdownArrow}
              className={`${referralFilterOpen && 'rotate-180'}`}
            />
          </div>
          {referralFilterOpen && (
            <>
              {referralSource.map(option => (
                <div key={option.value} className="flex items-center gap-5">
                  <input
                    type="radio"
                    id={option.value}
                    name="typeCasting"
                    value={option.value}
                    checked={selectedType === option.value}
                    onChange={() => setSelectedReferral(option.value)}
                    className="sr-only"
                  />
                  <label
                    htmlFor={option.value}
                    className={`flex flex-row gap-5 items-center font-[400] text-[15px] ${
                      selectedReferral === option.value
                        ? 'text-white'
                        : 'text-gray'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 border border-gray-400 rounded-full ${
                        selectedReferral === option.value
                          ? 'bg-white'
                          : 'bg-none'
                      }`}
                    ></div>{' '}
                    {option.label}
                  </label>
                </div>
              ))}
            </>
          )}
        </div>
        <button
          className="bg-[var(--primary-background)] rounded-full m-5 fixed bottom-0 left-0 right-0 p-4 bg-blue-500 text-white font-[760] text-[18px]"
          onClick={() => handleFilter()}
        >
          Done
        </button>
      </div>
    </Modal>
  );
};

export default ModalFilters;
