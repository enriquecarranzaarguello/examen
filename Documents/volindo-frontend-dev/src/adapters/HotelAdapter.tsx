import { HotelPort } from 'src/ports';

import config from '@config';
import { io } from 'socket.io-client';

import { HotelMessage, CityMessage } from '@context/slices/hotelSlice';
import { HotelInfo } from '@typing/types';

export default class HotelSocketAdapter implements HotelPort {
  message: null;

  constructor(message: null = null) {
    this.message = message;
  }

  searchHotel = (message: HotelMessage): Promise<HotelInfo[]> => {
    return new Promise<HotelInfo[]>(async (resolve, reject) => {
      try {
        const socket = io(`${config.socket_api}`);
        const messageForHotelSearch = {
          params: {
            ...message,
          },
        };

        socket.emit(
          'hotel:one_hotel:search',
          JSON.stringify(messageForHotelSearch)
        );

        socket.io.on('error', error => {
          socket.disconnect();
          reject(error);
        });

        const hotelResults: HotelInfo[] = [];

        socket.on('hotel:one_hotel:search', hotel => {
          if (hotel !== true) {
            if (hotel.statuscode !== 500) {
              hotelResults.push(hotel.result);
            }
          } else {
            resolve(hotelResults);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  searchCity = (
    message: CityMessage,
    onSearchResults: (hotels: HotelInfo[]) => void,
    onChangeProgress: (total: number, current: number) => void,
    setPeticionId: (peticionId: string) => void,
    onPullFinish: () => void
  ): Promise<HotelInfo[]> => {
    return new Promise<HotelInfo[]>(async (resolve, reject) => {
      try {
        const socket = io(`${config.socket_api}`);
        const messageForCitySearch = {
          params: {
            ...message,
          },
        };

        socket.emit('hotel:search', JSON.stringify(messageForCitySearch));

        socket.io.on('error', error => {
          socket.disconnect();
          reject(error);
        });

        const results = [];

        const hotelResults: HotelInfo[] = [];

        socket.on('hotel:search', hotel => {
          hotelResults.push(hotel.result);
          setPeticionId(hotel.requestId);
          resolve(hotelResults);
        });

        socket.on('hotel:tboresponse', hotel => {
          onChangeProgress(hotel?.totalRequest, hotel?.currentRequest);

          if (hotel.result.length > 0) {
            onSearchResults([...hotel?.result]);
            results.push([...hotel?.result]);
            setPeticionId(hotel.requestId);
          }

          if (
            hotel?.totalRequest === hotel?.currentRequest &&
            results.length === 0
          )
            onPullFinish();
        });
        socket.on('hotel:hotelsearch:complete', response => {
          if (response === true) {
            if (results.length === 0) onPullFinish();
            socket.disconnect();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  prebook = (message: any): Promise<HotelInfo[]> => {
    return new Promise<HotelInfo[]>(async (resolve, reject) => {
      try {
        const socket = io(`${config.socket_api}`);
        socket.emit('hotel:prebook', JSON.stringify(message));

        socket.io.on('error', error => {
          socket.disconnect();
          reject(error);
        });

        socket.on('hotel:prebook', response => {
          if (response.statuscode === 200) {
            resolve(response.response.HotelResult[0]);
          }
        });
        socket.on('hotel:prebook:noavailable', response => {
          reject(response);
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  searchHotelDetails = (message: any): Promise<HotelInfo[]> => {
    return new Promise<HotelInfo[]>(async (resolve, reject) => {
      try {
        const socket = io(`${config.socket_api}`);
        const messageForCitySearch = {
          params: {
            ...message,
          },
        };
        socket.emit(
          'hotel:rooms_one_hotel:search',
          JSON.stringify(messageForCitySearch)
        );

        socket.io.on('error', error => {
          socket.disconnect();
          reject(error);
        });

        socket.on('hotel:rooms_one_hotel:response', response => {
          if (response.statuscode === 200) {
            resolve(response.result[0]);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  roomPriceUpdate = (message: any): Promise<any> => {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const socket = io(`${config.socket_api}`);
        socket.emit('hotel:roomprice:update', JSON.stringify(message));

        socket.io.on('error', error => {
          socket.disconnect();
          reject(error);
        });

        socket.on('hotel:roomprice:update', hotel => {
          if (hotel.statuscode === 200) {
            resolve(hotel);
          } else {
            reject(hotel);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  };
}
