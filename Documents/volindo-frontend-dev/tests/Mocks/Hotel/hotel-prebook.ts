const preeBookNotAvail = {
  statuscode: 315,
  message: 'La tarifa o habitacion ya no estan disponibles',
};

const preeBookFakeData = {
  statuscode: 200,
  response: {
    Status: {
      Code: 200,
      Description: 'Successful',
    },
    HotelResult: [
      {
        HotelCode: '1259854',
        Currency: 'USD',
        Rooms: [
          {
            Name: ['1 KING BED STUDIO SUITE NONSMOKING'],
            BookingCode: '1259854!TB!1!TB!6a5c0ac3-75df-4549-8d0b-87a6b8d136e4',
            Inclusion: 'Buffet Breakfast',
            DayRates: [
              [
                {
                  BasePrice: 137.344465,
                },
                {
                  BasePrice: 137.344465,
                },
                {
                  BasePrice: 137.344465,
                },
                {
                  BasePrice: 137.344465,
                },
                {
                  BasePrice: 137.344465,
                },
                {
                  BasePrice: 137.344465,
                },
                {
                  BasePrice: 137.344465,
                },
                {
                  BasePrice: 137.344465,
                },
                {
                  BasePrice: 137.344465,
                },
                {
                  BasePrice: 137.344465,
                },
                {
                  BasePrice: 137.344465,
                },
                {
                  BasePrice: 137.344465,
                },
                {
                  BasePrice: 137.344465,
                },
                {
                  BasePrice: 137.344465,
                },
                {
                  BasePrice: 137.344465,
                },
                {
                  BasePrice: 137.344465,
                },
                {
                  BasePrice: 137.344465,
                },
                {
                  BasePrice: 137.344465,
                },
                {
                  BasePrice: 137.344465,
                },
                {
                  BasePrice: 137.344465,
                },
                {
                  BasePrice: 137.344465,
                },
                {
                  BasePrice: 137.344465,
                },
                {
                  BasePrice: 137.344465,
                },
                {
                  BasePrice: 137.344465,
                },
                {
                  BasePrice: 137.344465,
                },
                {
                  BasePrice: 137.344465,
                },
                {
                  BasePrice: 137.344465,
                },
                {
                  BasePrice: 137.344465,
                },
                {
                  BasePrice: 137.344465,
                },
              ],
            ],
            TotalFare: 4591,
            TotalTax: 528.1458,
            RoomPromotion: [],
            CancelPolicies: [
              {
                Index: '1',
                FromDate: '07-01-2024 00:00:00',
                ChargeType: 'Percentage',
                CancellationCharge: 100,
              },
            ],
            MealType: 'BreakFast',
            IsRefundable: false,
            WithTransfers: false,
            provider_price: 4500.78,
            brandingfee: 4682,
            totalBasePrice: 4062.649274700003,
            totalbasepricebrandingfee: 79.65978970000013,
          },
        ],
        RateConditions: [
          'Early check out will attract full cancellation charge unless otherwise specified.',
        ],
      },
    ],
  },
};
export { preeBookNotAvail, preeBookFakeData };
