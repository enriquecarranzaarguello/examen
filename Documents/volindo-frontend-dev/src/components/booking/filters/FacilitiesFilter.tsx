import { useAppSelector, useAppDispatch } from '@context';
import { useTranslation } from 'react-i18next';

const FacilitiesFilter = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const hotelFilters = useAppSelector(state => state.hotels.filter);
  const totalPeticions = useAppSelector<number>(
    state => state.hotels.loadingTotal
  );
  const handleFacilitiesFilter = (facilitie: string) => {
    const updatedFacilities = hotelFilters?.facilities?.includes(facilitie)
      ? hotelFilters.facilities.filter((item: any) => item !== facilitie)
      : [...hotelFilters.facilities, facilitie];
    //TODO ADD DISPTACH OF AMENITIES
  };

  return (
    <div className="flex flex-col gap-y-3">
      <button
        type="button"
        className="flex gap-2 items-center !translate-y-0"
        onClick={() => handleFacilitiesFilter('Parking')}
      >
        <input
          className="w-5 h-5 inputradiohotelM"
          type="radio"
          value={1}
          id="star-1"
          checked={hotelFilters.facilities.includes('Parking')}
        />
        <p className="text-base text-white">{t('stays.parking')}</p>
      </button>
      <button
        type="button"
        className="flex gap-2 items-center !translate-y-0"
        onClick={() => handleFacilitiesFilter('Free WiFi')}
      >
        <input
          className="w-5 h-5 inputradiohotelM"
          type="radio"
          value={2}
          id="star-2"
          checked={hotelFilters.facilities.includes('Free WiFi')}
        />
        <p className="text-base text-white">{t('stays.free-wifi')}</p>
      </button>
      <button
        type="button"
        className="flex gap-2 items-center !translate-y-0"
        onClick={() => handleFacilitiesFilter('Restaurant')}
      >
        <input
          className="w-5 h-5 inputradiohotelM"
          type="radio"
          value={3}
          id="star-3"
          checked={hotelFilters.facilities.includes('Restaurant')}
        />
        <p className="text-base text-white">{t('stays.restaurant')}</p>
      </button>
      <button
        type="button"
        className="flex gap-2 items-center !translate-y-0"
        onClick={() => handleFacilitiesFilter('Pets allowed')}
      >
        <input
          className="w-5 h-5 inputradiohotelM"
          type="radio"
          value={3}
          id="star-3"
          checked={hotelFilters.facilities.includes('Pets allowed')}
        />
        <p className="text-base text-white">{t('stays.pets-allowed')}</p>
      </button>
      <button
        type="button"
        className="flex gap-2 items-center !translate-y-0"
        onClick={() => handleFacilitiesFilter('Room service')}
      >
        <input
          className="w-5 h-5 inputradiohotelM"
          type="radio"
          value={3}
          id="star-3"
          checked={hotelFilters.facilities.includes('Room service')}
        />
        <p className="text-base text-white">{t('stays.room-service')}</p>
      </button>
      <button
        type="button"
        className="flex gap-2 items-center !translate-y-0"
        onClick={() => handleFacilitiesFilter('24-hour front desk')}
      >
        <input
          className="w-5 h-5 inputradiohotelM"
          type="radio"
          value={3}
          id="star-3"
          checked={hotelFilters.facilities.includes('24-hour front desk')}
        />
        <p className="text-base text-white">{t('stays.twenty-four-hours')}</p>
      </button>
      <button
        type="button"
        className="flex gap-2 items-center !translate-y-0"
        onClick={() => handleFacilitiesFilter('Fitness centre')}
      >
        <input
          className="w-5 h-5 inputradiohotelM"
          type="radio"
          value={3}
          id="star-3"
          checked={hotelFilters.facilities.includes('Fitness centre')}
        />
        <p className="text-base text-white">{t('stays.fitness-centre')}</p>
      </button>
      <button
        type="button"
        className="flex gap-2 items-center !translate-y-0"
        onClick={() => handleFacilitiesFilter('Non-smoking rooms')}
      >
        <input
          className="w-5 h-5 inputradiohotelM shrink-0"
          type="radio"
          value={3}
          id="star-3"
          checked={hotelFilters.facilities.includes('Non-smoking rooms')}
        />
        <p className="text-base text-white text-left">
          {t('stays.non-smoking-rooms')}
        </p>
      </button>
      <button
        type="button"
        className="flex gap-2 items-center !translate-y-0"
        onClick={() => handleFacilitiesFilter('Airport shuttle')}
      >
        <input
          className="w-5 h-5 inputradiohotelM"
          type="radio"
          value={3}
          id="star-3"
          checked={hotelFilters.facilities.includes('Airport shuttle')}
        />
        <p className="text-base text-white">{t('stays.airport-shuttle')}</p>
      </button>
      <button
        type="button"
        className="flex gap-2 items-center !translate-y-0"
        onClick={() => handleFacilitiesFilter('Facilities for disabled guests')}
      >
        <input
          className="w-5 h-5 inputradiohotelM shrink-0"
          type="radio"
          value={3}
          id="star-3"
          checked={hotelFilters.facilities.includes(
            'Facilities for disabled guests'
          )}
        />
        <p className="text-base text-white text-left">
          {t('stays.facilities-for-disabled-guests')}
        </p>
      </button>
      <button
        type="button"
        className="flex gap-2 items-center !translate-y-0"
        onClick={() => handleFacilitiesFilter('Family rooms')}
      >
        <input
          className="w-5 h-5 inputradiohotelM"
          type="radio"
          value={3}
          id="star-3"
          checked={hotelFilters.facilities.includes('Family rooms')}
        />
        <p className="text-base text-white text-left">
          {t('stays.family-rooms')}
        </p>
      </button>
      <button
        type="button"
        className="flex gap-2 items-center !translate-y-0"
        onClick={() => handleFacilitiesFilter('Spa and wellness centre')}
      >
        <input
          className="w-5 h-5 inputradiohotelM"
          type="radio"
          value={3}
          id="star-3"
          checked={hotelFilters.facilities.includes('Spa and wellness centre')}
        />
        <p className="text-base text-white">
          {t('stays.spa-and-wellness-centre')}
        </p>
      </button>
    </div>
  );
};

export default FacilitiesFilter;
