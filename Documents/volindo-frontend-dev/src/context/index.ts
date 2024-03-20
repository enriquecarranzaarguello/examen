export { default as ServiceContext } from './service/ServiceContext';
export { useAppDispatch, useAppSelector } from './app/hooks';

export {
  setLoading,
  setCurrency,
  getCurrencyResponse,
} from './slices/generalSlice';
export {
  setProfile,
  setIdentifiers,
  setInitialStateAgent,
  setPhone,
  setValidSubscription,
} from './slices/agentSlice';

export {} from './slices/suppliersSlice';

export {
  setCouponCode,
  setSelectedCategory,
  setSelectedVideo,
  setMarketingTotalRedo,
  setCouponTotal,
  setAvailableCourses,
  setSelectedAcademyVideo,
} from './slices/marketingSlice';

export {
  setFlightOrigin,
  setFlightDestination,
  setFlightStartDate,
  setFlightEndDate,
  incrementFlightAdults,
  incrementFlightChildren,
  incrementFlightInfants,
  decrementFlightAdults,
  decrementFlightChildren,
  decrementFlightInfants,
  setFlightClass,
  setFlightType,
  setFlightResults,
  addFlightSegment,
  removeFlightSegment,
  resetSegments,
  flightTypeChangeMiddleware,
  resetRoundTrip,
  setRoundTrip,
  setSelectedFlight,
  sortFlightResults,
  filterFlightResults,
  setIsLoadingAllItineraries,
  setIsLoadingSkeletons,
  resetFlightState,
} from './slices/flightSlice/flightSlice';

export {
  setFiltersSearchParams,
  setDestination,
  setCity,
  setCheckin,
  setCheckout,
  setAddTraveler,
  setSubstractTraveler,
  setAddRoom,
  setSubstractRoom,
  setRooms,
  setSearchId,
  setHotels,
  addHotels,
  resetHotels,
  setHotelId,
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
  setResultId,
  setSocketError,
  setNotHotelAvailableFound,
  setClearErrorsStatus,
  setLoadedChange,
  setSelectedRoomDetails,
  setFilterCancelPolicy,
} from './slices/hotelSlice';

export {
  addTravelerDeals,
  addTravelerChild,
  clearState,
  setDeals,
} from './slices/dealsSlice';
