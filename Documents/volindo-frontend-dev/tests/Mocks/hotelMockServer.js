import { io as ioc } from 'socket.io-client';

import { Server } from 'socket.io';

import hotelSearchFakeData from './Hotel/hotel-search-res';
import roomSearchMock from './Hotel/hotel-room-search';

import { preeBookFakeData } from './Hotel/hotel-prebook';

class HotelMockServer {
  constructor() {
    this.io = new Server({
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.io.on('connection', socket => {
      // console.log('inside of Connection mock');
      // Add all events to be handled here
      socket.on('hotel:search', data => {
        // console.log('inside of ON :', data);
        socket.emit('hotel:tboresponse', hotelSearchFakeData);
      });

      socket.on('hotel:prebook', data => {
        // console.log('inside of PREBOOK MOCK :', data);
        socket.emit('hotel:prebook', preeBookFakeData);
      });

      socket.on('hotel:rooms_one_hotel:search', data => {
        // console.log('inside of ROOM  mock :', data);
        socket.emit('hotel:rooms_one_hotel:response', roomSearchMock);
      });
    });

    this.io.listen(3001);
  }
}

// module.exports = HotelMockServer;

export default HotelMockServer;
