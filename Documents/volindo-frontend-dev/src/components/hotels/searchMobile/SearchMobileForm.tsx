import Image from 'next/image';
import { Button } from 'rsuite';
import moment from 'moment';
import { useTranslation } from 'next-i18next';
import filterIcon from '@icons/filterIcon.svg';

import pin from '@icons/pin.svg';
import styles from './search-mobile.module.scss';

const SearchMobileForm = ({
  toggleMenu,
  catalogues,
  filters,
}: {
  toggleMenu: () => void;
  catalogues: any;
  filters: any;
}) => {
  const { t, i18n } = useTranslation();
  return (
    <nav className={styles.filterMobile}>
      <div className={styles.filterMobile_container}>
        <div className="">
          <div className={styles.filterMobile_container_card}>
            <div className={styles.filterMobile_container_card_pin}>
              <Button
                onClick={toggleMenu}
                className={styles.filterMobile_container_card_pin_button}
              >
                <Image
                  className="invert"
                  src={pin}
                  width={20}
                  height={20}
                  alt="Filter"
                />
              </Button>
            </div>

            <div className={styles.filterMobile_container_card_content}>
              <div className={styles.filterMobile_container_card_content_city}>
                {catalogues?.destinations[0]?.display_name
                  ? `${catalogues?.destinations[0]?.display_name}`
                  : ''}
                {filters.city}
              </div>
              <div
                className={styles.filterMobile_container_card_content_travelers}
              >
                {filters.check_in && filters.check_out && filters.rooms[0]
                  ? `${moment(filters.check_in)
                      .format('ddd, D MMM')
                      .replace('.', '')} - ${moment(filters.check_out)
                      .format('ddd, D MMM')
                      .replace('.', '')} ${
                      filters.rooms[0].number_of_adults
                    } ${t('travelers.title')}`
                  : ''}
              </div>
            </div>

            <div className={styles.filterMobile_containe_cardIcon}>
              <button
                onClick={toggleMenu}
                className={styles.filterMobile_containe_cardIcon_button}
              >
                <Image
                  className="invert"
                  src={filterIcon}
                  width={20}
                  height={20}
                  alt="Filter"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SearchMobileForm;
