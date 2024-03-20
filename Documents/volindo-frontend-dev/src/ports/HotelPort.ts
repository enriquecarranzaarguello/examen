import type { HotelInfo } from '@typing/types';
import { HotelMessage, CityMessage } from '@context/slices/hotelSlice';

export default interface HotelPort {
  searchHotel: (message: HotelMessage) => Promise<HotelInfo[]>;
  searchCity: (
    message: CityMessage,
    onSearchResults: (hotels: HotelInfo[]) => void,
    onChangeProgress: (total: number, current: number) => void,
    setPeticionId: (peticionId: string) => void,
    onPullFinish: () => void
  ) => Promise<HotelInfo[]>;
  prebook: (message: CityMessage) => Promise<any>;
  searchHotelDetails: (message: CityMessage) => Promise<any>;
  roomPriceUpdate: (message: any) => Promise<any>;
}
