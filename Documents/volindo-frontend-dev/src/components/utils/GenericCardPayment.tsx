import { useState, ChangeEvent, useEffect } from 'react';
import styles from '@styles/generic-card-payment.module.scss';

const GenericCardPayment = () => {
  // Data
  const [cardNumber, setCardNumber] = useState('');
  const [expiracy, setExpiracy] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  // Aux states
  const [isIncomplete, setIsIncomplete] = useState(true);

  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    for (let i = 0; i < value.length; i += 4) {
      parts.push(value.substring(i, i + 4));
    }
    setCardNumber(parts.join(' '));
  };

  const handleExpiracyChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');

    const numValue = Number(value);
    switch (value.length) {
      case 1:
        if (numValue > 1) {
          value = `0${value} / `;
        }
        break;
      case 2:
        if (numValue > 12) {
          value = `0${value[0]} / ${value[1]}`;
        }
        break;
      default:
        if (value.length > 2) {
          value = value.substring(0, 2) + ' / ' + value.substring(2, 4);
        }
    }
    setExpiracy(value);
  };

  const handleCvcChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCvc(e.target.value.replace(/\D/g, ''));
  };

  const handleName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value.replace(/[^a-zA-ZáÁéÉíÍóÓúÚñÑüÜ ]/g, ''));
  };

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const expiracyParts = expiracy.split(' / ');
    var card = {
      card_number: cardNumber.replaceAll(' ', ''),
      name: name,
      cvc: cvc,
      exp_month: expiracyParts[0],
      exp_year: expiracyParts[1],
    };

    console.log('Card', card);
  };

  useEffect(() => {
    const validForm = () => {
      return (
        cardNumber.length === 19 &&
        name.length >= 3 &&
        expiracy.length === 7 &&
        cvc.length === 3
      );
    };

    setIsIncomplete(!validForm());
  }, [cardNumber, expiracy, cvc, name]);

  return (
    <form className={styles.container} onSubmit={onSubmitForm}>
      <div className={styles.container_row}>
        <label className={styles.input}>
          <span>Card number</span>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={19}
            placeholder="1234 1234 1234 1234"
            value={cardNumber}
            onChange={handleCardNumberChange}
            required
          />
        </label>
      </div>
      <div className={styles.container_row}>
        <label className={styles.input}>
          <span>Cardholder</span>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={handleName}
            required
          />
        </label>
      </div>
      <div className={styles.container_row}>
        <label className={styles.input}>
          <span>Expiration</span>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={7}
            placeholder="MM / YY"
            value={expiracy}
            onChange={handleExpiracyChange}
            required
          />
        </label>
        <label className={styles.input}>
          <span>CVC</span>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={3}
            placeholder="CVC"
            value={cvc}
            onChange={handleCvcChange}
            required
          />
        </label>
      </div>
      <div className={styles.container_row}>
        <button type="submit" className={styles.button} disabled={isIncomplete}>
          Pay now
        </button>
      </div>
    </form>
  );
};

export default GenericCardPayment;
