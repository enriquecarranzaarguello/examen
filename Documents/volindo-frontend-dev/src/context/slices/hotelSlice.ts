import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import config from '@config';
import type {
  SearchHotelType,
  HotelInfo,
  Filter,
  RoomDetails,
  RoomHotelInfo,
} from '@typing/types';
import { calcDaysOfDifference } from '@utils/timeFunctions';

interface Room {
  number_of_adults: number;
  number_of_children: number;
  children_age: number[];
}

interface Token {
  headers: {
    Authorization: string;
  };
}

interface CityMessage {
  NoOfRooms: number;
  check_in: string;
  check_out: string;
  city: string;
  currency: string;
  destination: string;
  hotel_id: string;
  nationality: string;
  requestId: string;
  rooms: Room[];
  token: Token;
}

interface HotelMessage {
  hotel_id: string;
  city: string;
  destination: string;
  check_in: string;
  check_out: string;
  rooms: Room[];
  nationality: string;
  currency: string;
  requestId: Record<string, never>;
  token: Token;
}

interface DayRate {
  BasePrice: number;
}

interface CancellationPolicy {
  Index: string;
  FromDate: string;
}

interface RoomDetail {
  BookingCode: string;
  CancelPolicies: CancellationPolicy[];
  DayRates: DayRate[];
  IsRefundable: boolean;
  MealType: string;
  Name: string[];
  ProviderPrice: number;
  RoomPromotion: string[];
  TotalFare: number;
  TotalTax: number;
  WithTransfers: boolean;
}

interface HotelDetail {
  Address: string;
  HotelFacilities: string[];
  HotelName: string;
  HotelRating: number;
  Id: string;
  Images: string[];
  LowestTotalFare: number;
  Map: string;
  Rating: number;
  address: string;
  amenities: string[];
  cheaper_room: string;
  check_in_time: string;
  check_out_time: string;
  description: string;
  external_id: string;
  hotel: string;
  hotel_amenities: string[];
  hotel_name: string;
  hotel_pictures: string[];
  id: string;
  is_available: string;
  latitude: string;
  longitude: string;
  number_of_nights: number;
  price: number;
  rooms: RoomDetail[];
  stars: number;
}

const compareByPrice = (a: any, b: any, order: string) => {
  if (order === 'min') {
    return a.LowestTotalFare - b.LowestTotalFare;
  } else if (order === 'max') {
    return b.LowestTotalFare - a.LowestTotalFare;
  }
  return 0;
};

const findOutliers = (results: any, zScoreThreshold: number) => {
  const mean =
    results.reduce((acc: number, val: number) => acc + val, 0) / results.length;
  const variance =
    results.reduce(
      (acc: number, val: number) => acc + Math.pow(val - mean, 2),
      0
    ) / results.length;
  const stdDev = Math.sqrt(variance);

  const outliers = results.filter(
    (element: number) => Math.abs((element - mean) / stdDev) > zScoreThreshold
  );

  return { mean, stdDev, outliers };
};

const checkCancellationItems = (cancellPolicies: any) => {
  if (cancellPolicies.length > 1) {
    const today = new Date();
    const limitDate = new Date(today);
    limitDate.setDate(today.getDate() + 7);

    const cancellationInsideTime = cancellPolicies.slice(
      cancellPolicies.length - 2
    );
    const elementDate = new Date(cancellationInsideTime[0].FromDate);
    if (elementDate >= limitDate) return elementDate >= limitDate;
  }
  return false;
};

const updateFilterResults = (
  hotelList: HotelInfo[],
  filters: Filter,
  date: string
): HotelInfo[] => {
  let filterArrayResults: HotelInfo[] = hotelList;
  if (filterArrayResults.length > 1) {
    const allProvdierPrice = hotelList.map(item => item.provider_price);
    const { outliers } = findOutliers(allProvdierPrice, 6);
    const tempOutliners = [...outliers];

    filterArrayResults = hotelList.filter(
      elemento => !tempOutliners.includes(elemento.provider_price)
    );
  }

  let aux = filterArrayResults;

  //NAME FILTER
  if (!!filters.name) {
    aux = aux.filter(
      (item: HotelInfo) =>
        item?.HotelName &&
        item?.HotelName.toLowerCase().includes(filters.name.toLowerCase())
    );
  }

  //STARS FILTER
  if (filters.rating.length > 0) {
    aux = aux?.filter(
      (item: HotelInfo) =>
        item?.HotelRating && filters.rating.includes(item?.HotelRating)
    );
  }

  //MIN AND MAX FILTER
  if (filters.price.selectedMin || filters.price.selectedMax) {
    aux = aux?.filter(
      (item: HotelInfo) =>
        item.LowestTotalFare &&
        item.LowestTotalFare <= filters.price.selectedMax &&
        item.LowestTotalFare >= filters.price.selectedMin
    );
  }

  //MEALTYPE FILTER
  if (filters.mealType.length > 0) {
    aux = aux.filter((item: HotelInfo) => {
      let isInclude = false;
      if (!item.Rooms) return false;
      for (let room of item.Rooms) {
        if (
          room.MealType === 'Breakfast_For_2' &&
          filters.mealType.includes('Breakfast')
        )
          return true;
        isInclude = filters.mealType.includes(room.MealType);
        if (isInclude) return true;
      }
    });
  }

  //CANCELL POLICIES FILTER
  if (filters.cancelPolicy.length > 0) {
    let simpleCancellation: HotelInfo[] = [];
    let plusSevenCancellation: HotelInfo[] = [];
    if (date) {
      if (filters.cancelPolicy.includes('free_cancellation')) {
        simpleCancellation = aux.filter((item: HotelInfo) => {
          const cancellations: boolean[] = item.Rooms.map(
            (room: RoomHotelInfo) => {
              return room.CancelPolicies.some(
                policy =>
                  policy.ChargeType === 'Fixed' &&
                  policy.CancellationCharge === 0
              );
            }
          );

          const index = cancellations.findIndex(cancellation => cancellation);
          return index !== -1 && item;
        });
      }
      if (filters.cancelPolicy.includes('free_cancellation_plus_seven')) {
        plusSevenCancellation = aux.filter((item: HotelInfo) => {
          const cancellations: boolean[] = item.Rooms.map(
            (room: RoomHotelInfo) => {
              return checkCancellationItems(room.CancelPolicies);
            }
          );
          const index = cancellations.findIndex(cancellation => cancellation);
          return index !== -1 && item;
        });
      }
    }
    aux = [...simpleCancellation, ...plusSevenCancellation];
  }

  let orderHotelResults: HotelInfo[] = [];

  if (filters.orderBy === 'min' || filters.orderBy === 'max') {
    orderHotelResults = aux
      ?.slice()
      .sort((a, b) => compareByPrice(a, b, filters.orderBy));
  }
  return orderHotelResults;
};

const initialState: SearchHotelType = {
  results: [],
  loadingTotal: 0,
  loadingProgress: 0,
  resultId: '',
  searchParams: {
    hotel_id: '',
    city: '',
    destination: '',
    check_in: '',
    check_out: '',
    rooms: [{ number_of_adults: 2, number_of_children: 0, children_age: [] }],
    nationality: config.WHITELABELNATIONALITY || 'US',
  },
  hotelDetail: {
    Address: '',
    HotelFacilities: [],
    HotelName: '',
    HotelRating: 0,
    Id: '',
    Images: [],
    LowestTotalFare: 0,
    Map: '',
    Rating: 0,
    address: '',
    amenities: [],
    cheaper_room: '',
    check_in_time: '',
    check_out_time: '',
    description: '',
    external_id: '',
    hotel: '',
    hotel_amenities: [],
    hotel_name: '',
    hotel_pictures: [],
    id: '',
    is_available: '',
    latitude: '',
    longitude: '',
    number_of_nights: 0,
    price: 0,
    rooms: [
      {
        BookingCode: '',
        CancelPolicies: [{ Index: '', FromDate: '' }],
        DayRates: [{ BasePrice: 0 }],
        IsRefundable: true,
        MealType: '',
        Name: [],
        ProviderPrice: 0,
        RoomPromotion: [],
        TotalFare: 0,
        TotalTax: 0,
        WithTransfers: true,
      },
    ],
    stars: 0,
  },
  filter: {
    name: '',
    price: {
      min: 0,
      max: 0,
      selectedMin: 0,
      selectedMax: 0,
    },
    rating: [],
    mealType: [],
    orderBy: 'min',
    cancelPolicy: [],
  },
  filteredResults: [],
  hotelFound: '',
  selectedRoom: {
    Name: '',
    MealType: '',
    Inclusion: '',
    WithTransfers: false,
    IsRefundable: false,
    CancelPolicies: [],
    TotalFare: 0,
  },
  socketError: false,
  notHotelAvailable: false,
  showProgresBar: false,
};

export const hotelSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {
    setFiltersSearchParams: (state, action: PayloadAction<any>) => {
      state.searchParams = {
        ...action.payload,
      };
    },
    setLoadedChange: (state, action) => {
      state.showProgresBar = action.payload;
    },
    setSocketError: state => {
      state.socketError = true;
    },
    setNotHotelAvailableFound: state => {
      state.notHotelAvailable = true;
    },
    setSelectedRoomDetails: (
      state,
      action: PayloadAction<{ hotelDetails: RoomDetails }>
    ) => {
      state.selectedRoom = action.payload.hotelDetails;
    },
    setClearErrorsStatus: state => {
      state.socketError = false;
      state.notHotelAvailable = false;
    },
    setResultId: (state, action: PayloadAction<{ resultId: string }>) => {
      state.resultId = action.payload.resultId;
    },
    setDestination: (state, action: PayloadAction<{ destination: string }>) => {
      state.searchParams.destination = action.payload.destination;
    },
    setCity: (state, action: PayloadAction<{ city: string }>) => {
      state.searchParams.city = action.payload.city;
    },
    setHotelId: (state, action: PayloadAction<{ hotel_id: string }>) => {
      state.searchParams.hotel_id = action.payload.hotel_id;
    },
    setCheckin: (state, action: PayloadAction<{ check_in: string }>) => {
      state.searchParams.check_in = action.payload.check_in;
    },
    setCheckout: (state, action: PayloadAction<{ check_out: string }>) => {
      state.searchParams.check_out = action.payload.check_out;
    },
    setRooms: (state, action: PayloadAction<{ rooms: Room[] }>) => {
      state.searchParams.rooms = action.payload.rooms;
    },
    setAddTraveler: (
      state,
      action: PayloadAction<{ index: number; type: string }>
    ) => {
      const { index, type } = action.payload;
      const updatedRooms = [...state.searchParams.rooms];
      const room = updatedRooms[index];

      switch (type) {
        case 'adults':
          room.number_of_adults += 1;
          break;
        case 'children':
          room.children_age = [...room.children_age, 8];
          room.number_of_children = room.children_age.length;
          break;
        default:
          break;
      }
      state.searchParams.rooms = updatedRooms;
    },
    setSubstractTraveler: (
      state,
      action: PayloadAction<{ index: number; type: string }>
    ) => {
      const { index, type } = action.payload;
      const updatedRooms = [...state.searchParams.rooms];
      const room = updatedRooms[index];

      switch (type) {
        case 'adults':
          if (room.number_of_adults > 1) {
            room.number_of_adults -= 1;
          }
          break;
        case 'children':
          room.children_age = room.children_age.slice(0, -1);
          room.number_of_children = room.children_age.length;
          break;
        default:
          break;
      }
      state.searchParams.rooms = updatedRooms;
    },
    setAddRoom: state => {
      const newRoom = {
        number_of_adults: 2,
        number_of_children: 0,
        children_age: [],
      };
      state.searchParams.rooms = [...state.searchParams.rooms, newRoom];
    },
    setSubstractRoom: state => {
      const updatedRooms = state.searchParams.rooms.slice(0, -1);
      state.searchParams.rooms = updatedRooms;
    },
    setSearchId: (state, action: PayloadAction<{ id: string }>) => {
      state.resultId = action.payload.id;
    },
    setHotels: (
      state,
      action: PayloadAction<{
        hotels: HotelInfo[];
      }>
    ) => {
      state.results = action.payload.hotels;
      state.filteredResults = action.payload.hotels;
    },
    resetHotels: state => {
      state.results = [];
    },
    addHotels: (
      state,
      action: PayloadAction<{
        hotels: HotelInfo[];
      }>
    ) => {
      let newHotelsArray;
      if (
        !state?.results[0]?.LowestTotalFare ||
        state?.results[0]?.LowestTotalFare === undefined
      ) {
        newHotelsArray = [...action.payload.hotels];
      } else {
        newHotelsArray = [...state.results, ...action.payload.hotels];
      }
      state.results = newHotelsArray;
      state.filteredResults = updateFilterResults(
        newHotelsArray,
        state.filter,
        state.searchParams.check_in
      );
    },
    setFilter: (state, action) => {},
    setSearchTotal: (state, action) => {
      state.loadingTotal = action.payload;
    },
    setSearchProgress: (state, action) => {
      state.loadingProgress = action.payload;
    },
    setEmptyFilter: state => {
      state.filter.name = '';
      state.filter.mealType = [];
      state.filter.rating = [];
      state.filter.cancelPolicy = [];
      state.filter.price.max = 0;
      state.filter.price.min = 0;
      state.filter.price.selectedMax = 0;
      state.filter.price.selectedMin = 0;
    },
    setFilterName: (state, action: PayloadAction<{ name: string }>) => {
      state.filter.name = action.payload.name;
      state.filteredResults = updateFilterResults(
        state.results,
        state.filter,
        state.searchParams.check_in
      );
    },
    setFilterCancelPolicy: (
      state,
      action: PayloadAction<{
        policies: string[];
      }>
    ) => {
      state.filter.cancelPolicy = action.payload.policies;
      state.filteredResults = updateFilterResults(
        state.results,
        state.filter,
        state.searchParams.check_in
      );
    },
    setFilterRating: (state, action: PayloadAction<{ stars: number[] }>) => {
      state.filter.rating = action.payload.stars;
      state.filteredResults = updateFilterResults(
        state.results,
        state.filter,
        state.searchParams.check_in
      );
    },
    setFilterMealType: (
      state,
      action: PayloadAction<{ mealType: string[] }>
    ) => {
      state.filter.mealType = action.payload.mealType;
      state.filteredResults = updateFilterResults(
        state.results,
        state.filter,
        state.searchParams.check_in
      );
    },
    setFilterPriceMaxLimit: state => {
      const maxPrice = state.results.reduce((max, hotel) => {
        return Math.max(max, hotel.LowestTotalFare || 0);
      }, 0);
      if (state.filter.price.max === state.filter.price.selectedMax) {
        state.filter.price.selectedMax = maxPrice;
      }
      state.filter.price.max = maxPrice;
    },
    setFilterPriceMinLimit: state => {
      let minPrice = 0;
      const validPrices = state.results
        .filter(
          hotel =>
            typeof hotel.LowestTotalFare === 'number' &&
            !isNaN(hotel.LowestTotalFare)
        )
        .map(hotel => hotel.LowestTotalFare)
        .filter(price => price !== undefined) as number[];

      if (validPrices.length > 0) {
        minPrice = Math.min(...validPrices);
      }
      state.filter.price.min = minPrice;
    },

    setFilterPriceUserMaxLimit: (
      state,
      action: PayloadAction<{ userMaxLimit: number }>
    ) => {
      state.filter.price.selectedMax = action.payload.userMaxLimit;
      state.filteredResults = updateFilterResults(
        state.results,
        state.filter,
        state.searchParams.check_in
      );
    },
    setFilterPriceUserMinLimit: (
      state,
      action: PayloadAction<{ userMinLimit: number }>
    ) => {
      state.filter.price.selectedMin = action.payload.userMinLimit;
      state.filteredResults = updateFilterResults(
        state.results,
        state.filter,
        state.searchParams.check_in
      );
    },
    setFilterOrderBy: (state, action: PayloadAction<'min' | 'max'>) => {
      state.filter.orderBy = action.payload;
      state.filteredResults = updateFilterResults(
        state.results,
        state.filter,
        state.searchParams.check_in
      );
    },
    setHotelDetail: (
      state,
      action: PayloadAction<{ hotelDetail: HotelDetail }>
    ) => {
      state.hotelDetail = action.payload.hotelDetail;
    },
    setHotelFound: (state, action: PayloadAction<{ hotelFound: string }>) => {
      state.hotelFound = action.payload.hotelFound;
    },
    setSwitchPriceMinMax: (
      state,
      action: PayloadAction<{ value: number; switchMinMax: string }>
    ) => {
      const { value, switchMinMax } = action.payload;
      switch (switchMinMax) {
        case 'min':
          setFilterPriceUserMinLimit({ userMinLimit: value });
          break;
        case 'max':
          setFilterPriceUserMaxLimit({ userMaxLimit: value });
          break;
        default:
          break;
      }
    },
  },
});

export type {
  Room,
  Token,
  HotelMessage,
  CityMessage,
  HotelDetail,
  RoomDetail,
  CancellationPolicy,
};

export const {
  setFiltersSearchParams,
  setDestination,
  setCity,
  setCheckin,
  setAddTraveler,
  setSubstractTraveler,
  setAddRoom,
  setSubstractRoom,
  setCheckout,
  setRooms,
  setSearchId,
  setHotels,
  resetHotels,
  addHotels,
  setHotelId,
  setResultId,
  setSearchProgress,
  setSearchTotal,
  setEmptyFilter,
  setFilterName,
  setFilterRating,
  setFilterMealType,
  setFilterPriceMaxLimit,
  setFilterPriceMinLimit,
  setFilterPriceUserMaxLimit,
  setFilterPriceUserMinLimit,
  setFilterOrderBy,
  setHotelDetail,
  setHotelFound,
  setSwitchPriceMinMax,
  setSocketError,
  setNotHotelAvailableFound,
  setClearErrorsStatus,
  setLoadedChange,
  setSelectedRoomDetails,
  setFilterCancelPolicy,
} = hotelSlice.actions;
export default hotelSlice.reducer;
