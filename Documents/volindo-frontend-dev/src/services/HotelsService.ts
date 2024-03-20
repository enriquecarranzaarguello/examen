import { HotelSocketAdapter } from '@adapters/index';
import HotelPort from '@ports/HotelPort';
import { HotelMessage, CityMessage } from '@context/slices/hotelSlice';
import { HotelInfo } from '@typing/types';

export class HotelService {
  private adapter: HotelPort;

  constructor(message: null = null) {
    this.adapter = new HotelSocketAdapter(message);
  }

  searchHotel = (message: HotelMessage): Promise<HotelInfo[]> => {
    return this.adapter.searchHotel(message);
  };

  searchCity = (
    message: CityMessage,
    onSearchResults: (hotels: HotelInfo[]) => void,
    onChangeProgress: (total: number, current: number) => void,
    setPeticionId: (peticionId: string) => void,
    onPullFinish: () => void
  ): Promise<HotelInfo[]> => {
    return this.adapter.searchCity(
      message,
      onSearchResults,
      onChangeProgress,
      setPeticionId,
      onPullFinish
    );
  };

  prebook = (message: any): Promise<any> => {
    return this.adapter.prebook(message);
  };

  searchHotelDetails = (message: any): Promise<any> => {
    return this.adapter.searchHotelDetails(message);
  };

  roomPriceUpdate = (message: any): Promise<any> => {
    return this.adapter.roomPriceUpdate(message);
  };
}
