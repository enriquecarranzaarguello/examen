import { useEffect, useState } from 'react';
import style from './guestChild.module.scss';
import { useTranslation } from 'react-i18next';
import { HotelChildSchema } from 'src/common/schemas/hotel';
import { ValidationError } from 'yup';

interface GuestChildProps {
  roomNumber: number;
  kidIndex: number;
  testGuestSummary: (object: any) => void;
}

//TODO Update this component to be a general form
const GuestHotelChild = ({
  roomNumber,
  kidIndex,
  testGuestSummary,
}: GuestChildProps) => {
  const { t, i18n } = useTranslation();

  const [errors, setErrors] = useState<any>([]);
  const [child, setChild] = useState({
    name: '',
    age: '',
  });

  const childValidator = HotelChildSchema({
    required: t('valid.required'),
    positive: t('valid.positive'),
    integer: t('valid.integer'),
    minLength: i18n.t('valid.special_min', { NUMBER: 3 }),
    maxLength: i18n.t('valid.special_max', { NUMBER: 40 }),
    maxAge: i18n.t('valid.age_kid', { NUMBER: 18 }),
  });

  const validateField = async (name: string, value: any) => {
    try {
      await childValidator.validateAt(name, { [name]: value });
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

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === '') {
      setChild({ ...child, [name]: value });
      await validateField(name, 5);
    } else {
      setChild({ ...child, [name]: value });
      await validateField(name, value);
    }
  };

  useEffect(() => {
    if (parseInt(child.age) < 18 && !!child.name) {
      testGuestSummary({ ...child, roomIndex: roomNumber, kidIndex: kidIndex });
    }
  }, [child]);

  return (
    <form className={style.childGuest}>
      <h2 className={style.childGuest_title}>
        {t('stays.child')} {kidIndex + 1}
      </h2>
      <input
        name="name"
        type="string"
        placeholder="Name"
        onChange={handleChange}
        value={child.name}
        className={style.childGuest_field}
      />
      {errors.name && <p className={style.error}>{errors.name}</p>}
      <input
        name="age"
        type="number"
        placeholder="Age"
        onChange={handleChange}
        value={child.age}
        className={style.childGuest_field}
      />
      {errors.age && <p className={style.error}>{errors.age}</p>}
    </form>
  );
};

export default GuestHotelChild;
