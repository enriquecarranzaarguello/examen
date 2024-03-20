import { useTranslation } from 'next-i18next';
import { RoomDetails } from '@typing/types';

const BreakfastStatus = ({
  mealType,
}: {
  mealType: RoomDetails['MealType'];
}) => {
  const { i18n } = useTranslation();

  const mealTypeMapping = {
    Room_Only: 'room-only',
    BreakFast: 'breakfast',
    American_Breakfast: 'american-breakfast',
    English_Breakfast: 'english-breakfast',
    Continental_Breakfast: 'continental-breakfast',
    Breakfast_Buffet: 'breakfast-buffet',
    Buffet_Breakfast: 'buffet-breakfast',
    Breakfast_For_2: 'breakfast-for-2',
    All_Inclusive_All_Meal: 'all-inclusive-all-meal',
  };

  const mealStringKey =
    mealType in mealTypeMapping
      ? `stays.${mealTypeMapping[mealType as keyof typeof mealTypeMapping]}`
      : 'stays.Meal type not specified';

  const originalTranslatedMealString = i18n.t(mealStringKey);

  const translatedMealString =
    originalTranslatedMealString === 'Breakfast included'
      ? 'Free breakfast'
      : originalTranslatedMealString === 'Desayuno incluido'
        ? 'Desayuno gratis'
        : originalTranslatedMealString;

  const textStyle = [
    'Free breakfast',
    'All-inclusive room',
    'Desayuno gratis',
    'Habitación All-inclusive',
  ].includes(translatedMealString);

  return (
    <p
      className={`${
        textStyle ? 'text-[#099A3B]' : 'text-[#FF6E6E]'
      } font-[500] text-[15px] md:ml-[0]`}
    >
      {translatedMealString}
    </p>
  );
};

export default BreakfastStatus;
