import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HotelAdultSchema } from 'src/common/schemas/hotel';

import style from './guestAdult.module.scss';
import { ValidationError } from 'yup';

const genders = [
  { label: 'Mr.', value: 'MR' },
  { label: 'Ms.', value: 'MS' },
].map(item => ({ label: item.label, value: item.value }));

//TODO Update this component to be a general form
const GuestAdult = ({
  roomNumber = 0,
  adultIndex = 0,
  testGuestSummary,
  origin,
}: {
  roomNumber: number;
  adultIndex: number;
  testGuestSummary: (object: any) => void;
  origin?: string;
}) => {
  const { t, i18n } = useTranslation();
  const [travelerData, setTravelerData] = useState({
    roomIndex: roomNumber,
    adultIndex: adultIndex,
    name: '',
    lastname: '',
    phoneNumber: '',
    email: '',
    gender: 'MR' || 'MS',
    age: '',
  });
  const [errors, setErrors] = useState<any>([]);

  const guestValidator = HotelAdultSchema({
    required: t('valid.required'),
    phone: t('agent.editSections.errors.phone_number'),
    email: t('valid.email'),
    positive: t('valid.positive'),
    integer: t('valid.integer'),
    minNumberLength: i18n.t('valid.special_min', { NUMBER: 10 }),
    maxNumberLength: i18n.t('valid.special_max', { NUMBER: 11 }),
    minLength: i18n.t('valid.special_min', { NUMBER: 3 }),
    maxLength: i18n.t('valid.special_max', { NUMBER: 40 }),
    minAge: i18n.t('valid.age_adult', { NUMBER: 18 }),
  });

  const validateField = async (name: string, value: any) => {
    try {
      await guestValidator.validateAt(name, { [name]: value });
      setErrors((prevErrors: any) => ({ ...prevErrors, [name]: '' }));
    } catch (error: any) {
      if (error instanceof ValidationError) {
        setErrors((prevErrors: any) => ({
          ...prevErrors,
          [name]: error.message,
        }));
      }
    }
  };

  const validFields = (travelerData: any): boolean => {
    return (
      travelerData &&
      !!travelerData.name &&
      travelerData.name.length >= 3 &&
      travelerData.name.length <= 40 &&
      !!travelerData.phoneNumber &&
      !!travelerData.email &&
      travelerData.email &&
      travelerData.email.includes('@') &&
      travelerData.email.includes('.') &&
      travelerData.age &&
      travelerData.age >= 18
    );
  };

  const handleChange = async (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'phoneNumber') {
      if (/^\d*$/.test(value)) {
        setTravelerData({ ...travelerData, [name]: value });
        await validateField(name, value);
      }
    } else if (name === 'name') {
      if (!/\d/.test(value)) {
        setTravelerData({ ...travelerData, [name]: value });
        await validateField(name, value);
      }
    } else if (name === 'age' && value === '') {
      setTravelerData({ ...travelerData, [name]: value });
      await validateField(name, 19);
    } else {
      setTravelerData({ ...travelerData, [name]: value });
      await validateField(name, value);
    }
  };

  useEffect(() => {
    if (validFields(travelerData)) {
      testGuestSummary(travelerData);
    }
  }, [travelerData]);

  return (
    <form className={style.adultGuest}>
      <h2 className={style.adultGuest_title}>
        {origin === 'suppliers' ? t('suppliers.contact') : t('stays.adult')}{' '}
        {adultIndex + 1}
      </h2>
      <div className={style.adultGuest_combinedField}>
        <div>
          <input
            name="name"
            type="string"
            placeholder="Name"
            onChange={handleChange}
            value={travelerData.name}
            className={style.adultGuest_combinedField_fieldFirst}
            autoComplete="off"
          />
          <input
            name="lastname"
            type="string"
            placeholder="Lastname"
            onChange={handleChange}
            value={travelerData.lastname}
            className={style.adultGuest_combinedField_fieldSecond}
            autoComplete="off"
          />
        </div>
        <div className={style.adultGuest_combinedField_errorContainer}>
          {errors.name && <h5 className={style.error}>{errors.name}</h5>}
          {errors.lastname && (
            <h5 className={style.error}>{errors.lastname}</h5>
          )}
        </div>
      </div>
      <input
        name="phoneNumber"
        type="tel"
        placeholder="Phone Number"
        onChange={handleChange}
        value={travelerData.phoneNumber}
        className={style.adultGuest_field}
      />
      {errors.phoneNumber && (
        <p className={style.error}>{errors.phoneNumber}</p>
      )}
      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        value={travelerData.email}
        className={style.adultGuest_field}
      />
      {errors.email && <p className={style.error}>{errors.email}</p>}
      <div className={style.adultGuest_twoField}>
        {origin !== 'suppliers' && (
          <select
            name="gender"
            placeholder="Gender"
            onChange={handleChange}
            value={travelerData.gender}
            className={style.adultGuest_twoField_field}
          >
            {genders.map((gender, index) => (
              <option
                key={index}
                value={gender.value}
                className={style.adultGuest_twoField_field_camp}
              >
                {gender.label}
              </option>
            ))}
          </select>
        )}

        <input
          name="age"
          type="number"
          max={4}
          placeholder="Age"
          onChange={handleChange}
          value={travelerData.age}
          className={style.adultGuest_twoField_field}
        />
      </div>
      {errors.age && <p className={style.error}>{errors.age}</p>}
    </form>
  );
};

export default GuestAdult;
