const roomSearchMock = {
  statuscode: 200,
  result: [
    {
      CityName: 'Miami',
      CountryName: 'USA',
      HotelName: 'Homewood Suites by Hilton Miami Airport West',
      Id: '94e8794a-6cb8-4d18-bf5a-ee602eb44082',
      Description:
        '<p>HeadLine : Near CityPlace Doral</p><p>Location : When you stay at Homewood Suites by Hilton Miami Airport West in Miami, you ll be near the airport, within a 15-minute drive of Dolphin Mall and Florida International University.  This hotel is 11.1 mi (17.8 km) from PortMiami and 3.2 mi (5.2 km) from Miami Airport Convention Center.</p><p>Rooms : Make yourself at home in one of the 124 guestrooms, featuring kitchenettes with refrigerators and stovetops. Complimentary wired and wireless Internet access keeps you connected, and cable programming provides entertainment. Conveniences include phones, as well as laptop-compatible safes and microwaves.</p><p>Dining : Grab a bite from the snack bar/deli serving guests of Homewood Suites by Hilton Miami Airport West. A complimentary buffet breakfast is served on weekdays from 6:30 AM to 9:30 AM and on weekends from 7:00 AM to 10:00 AM.</p><p>CheckIn Instructions : <ul>  <li>Extra-person charges may apply and vary depending on property policy</li><li>Government-issued photo identification and a credit card may be required at check-in for incidental charges</li><li>Special requests are subject to availability upon check-in and may incur additional charges; special requests cannot be guaranteed</li><li>The name on the credit card used at check-in to pay for incidentals must be the primary name on the guestroom reservation</li><li>This property accepts credit cards, debit cards, and cash</li><li>Safety features at this property include a fire extinguisher and a smoke detector</li>  </ul></p><p>Special Instructions : Front desk staff will greet guests on arrival.</p>&nbsp;<br/><b>Disclaimer notification: Amenities are subject to availability and may be chargeable as per the hotel policy.</b>',
      HotelFacilities: [
        'Wheelchair-accessible registration desk',
        'Television in common areas',
        'Wheelchair-accessible fitness center',
        'Wheelchair-accessible pool',
        'Well-lit path to entrance',
        'Internet access in public areas - high speed',
        'Dry cleaning/laundry service',
        'Long-term parking (surcharge)',
        'RV, bus, truck parking (surcharge)',
        'Number of meeting rooms - 1',
        'Conference space size (meters) - 84',
        'Swimming pool',
        'Free wired Internet',
        'Free WiFi',
        'Braille or raised signage',
        'Number of outdoor pools - 1',
        'Assistive listening devices available',
        'In-room accessibility (in select rooms)',
        'Bicycle rentals nearby',
        'Wheelchair accessible parking',
        'Roll-in shower (in select rooms)',
        'Internet access - wireless',
        'Accessible bathroom (in select rooms)',
        'Free Buffet Breakfast',
        'Free airport transportation',
        'Accessible airport shuttle',
        'Wheelchair-accessible on-site restaurant',
        'Free breakfast',
        'Multilingual staff',
        'Electric car charging station',
        'Daily',
        'Wheelchair-accessible meeting spaces/business center',
        'Coffee/tea in common areas',
        'Laundry facilities',
        'elevator',
        'Fitness facilities',
        'Basketball on site',
        'Uncovered parking',
        'Wheelchair accessible (may have limitations)',
        'Wheelchair-accessible concierge desk',
        'Wheelchair-accessible van parking',
        'Wheelchair-accessible path to elevator',
        'Conference space size (feet) - 900',
        'Stair-free path to entrance',
        'Luggage storage',
        'Express check-out',
        'Business center',
        '24-hour front desk',
        'Safe-deposit box at front desk',
        'Smoke-free property',
        'Snack bar/deli',
        'Free self parking',
        'Conference space',
        'ATM/banking',
        'Pool sun loungers',
      ],
      Images: [
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqEJnK1x6Qljk0hVscbAZpIj+aBih2xjCCE=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqFEs21k9nUvB9efhplIJigRutWOdF3iY/s=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqHmFIi3wSJezL11CzYhj0pu+6aMJ90ETO8=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqFLAcUDpSOmmOyvFeSpxWglFKBgKPuUTr0=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqG/MT95cUry9V5wB05n/NEbY2ccpnq3dJ0=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqEJnK1x6Qljk0hVscbAZpIj+aBih2xjCCE=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqHMIClrNRPwdy6ndUpNR4GU5uSAtRmWszg=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqFzHmSa33ESG5a01lRRXHTbQNQ0ztkG6rc=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqGlO5CoZvrXKov0B4EFMTXadz5jEa55ZQs=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqGPH198rXrqEuzhpnNFP6urDCu1Hntx2Ic=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqEw3erUO8ZkSqUyy6ubRSR80j/vYiY1pHw=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqEqMnUWQN2da6PD4mFXfQXHgtXlUdWlcGw=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqFOxnMGTZXPJmAQbseRNEhF2cVNrayE0GQ=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqFmUucGjVXhXBpdxHmlOD+XWECT8mXcuVo=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqHBvM2AIeZoi3OlFgLcAb4pp/ya+dELvTY=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqHg4Lv08QcZTIp+tQqqNbmXFOd/neGmUB0=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqFtVZTfwt27oP93ZGI3cxVWPl+ok2SF8Kg=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqFZgyDmDZgJIe7/eTEPTAhNLiPbFz6077Q=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqHfe0tzVY2A4ssLQwEX2q/U1sf+zgJQWTA=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqHLwDw5+c6rDNXqk+vGlgZMwj4edqz/GvQ=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqEzbA7vg1LeZ8+40WnyhKIy3f8kuFEK64s=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqHvr6q2Z5pn1mldYLx8cgaVvUsql58R9Zg=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqHck19YLxJkFMaWH9tWWBIHMs9qhyxGt0s=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqFsvEtrxi0LIUhdsdTQBe08vkB2IBbHjxA=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqF29CUb9PSraAXkkjppPkfiPNGglsoteLY=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqHom25hYrMK4sUayKBSqUsrPGfxQlcWlMY=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqGoOtUFYCn9tBQS79H65L1hnhTvcWIKlTg=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqHav/CWi1f91rLmQspHCy7jy0m2Cf1BfFw=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqHbRszD3rEg5fcZegtKlnBB5VcT5bLOTh0=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5cnXBPA5qtgzmEk81OdW4gOACJSM44eMnSkPolkbCGAuWMC3o4nOPsWBQMzW7SabqEWjJ8porb9MZ/b/rD0unejZ26SkxWJ548=',
      ],
      Address:
        '3590 Northwest 74Th Avenue, MiamiFlorida 33122, Miami, 33122, USA',
      Map: '25.807556|-80.31876',
      CountryCode: 'US',
      HotelRating: 3,
      CheckInTime: '4:00 PM',
      CheckOutTime: '12:00 PM',
      index: 167474,
      block: 84,
      Currency: 'USD',
      Rooms: [
        {
          Name: ['1 KING BED STUDIO SUITE NONSMOKING'],
          BookingCode: '1259854!TB!1!TB!fe25a508-93b7-422d-bec9-b08d3a0a8c17',
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
          TotalTax: 517.79,
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
          ProviderPrice: 4500.78,
          brandingfee: 91,
        },
        {
          Name: ['1KG MOBILITY/HEARING ACCESS RI SHW STUDIO NSM'],
          BookingCode: '1259854!TB!2!TB!fe25a508-93b7-422d-bec9-b08d3a0a8c17',
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
          TotalTax: 517.79,
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
          ProviderPrice: 4500.78,
          brandingfee: 91,
        },
        {
          Name: ['1 KING BED 1 BEDROOM SUITE NONSMOKING'],
          BookingCode: '1259854!TB!3!TB!fe25a508-93b7-422d-bec9-b08d3a0a8c17',
          Inclusion: 'Buffet Breakfast',
          DayRates: [
            [
              {
                BasePrice: 145.471485,
              },
              {
                BasePrice: 145.471485,
              },
              {
                BasePrice: 145.471485,
              },
              {
                BasePrice: 145.471485,
              },
              {
                BasePrice: 145.471485,
              },
              {
                BasePrice: 145.471485,
              },
              {
                BasePrice: 145.471485,
              },
              {
                BasePrice: 145.471485,
              },
              {
                BasePrice: 145.471485,
              },
              {
                BasePrice: 145.471485,
              },
              {
                BasePrice: 145.471485,
              },
              {
                BasePrice: 145.471485,
              },
              {
                BasePrice: 145.471485,
              },
              {
                BasePrice: 145.471485,
              },
              {
                BasePrice: 145.471485,
              },
              {
                BasePrice: 145.471485,
              },
              {
                BasePrice: 145.471485,
              },
              {
                BasePrice: 145.471485,
              },
              {
                BasePrice: 145.471485,
              },
              {
                BasePrice: 145.471485,
              },
              {
                BasePrice: 145.471485,
              },
              {
                BasePrice: 145.471485,
              },
              {
                BasePrice: 145.471485,
              },
              {
                BasePrice: 145.471485,
              },
              {
                BasePrice: 145.471485,
              },
              {
                BasePrice: 145.471485,
              },
              {
                BasePrice: 145.471485,
              },
              {
                BasePrice: 145.471485,
              },
              {
                BasePrice: 145.471485,
              },
            ],
          ],
          TotalFare: 4863,
          TotalTax: 548.43,
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
          ProviderPrice: 4767.11,
          brandingfee: 96,
        },
        {
          Name: ['2 QUEEN BEDS 1 BEDROOM SUITE NONSMOKING'],
          BookingCode: '1259854!TB!4!TB!fe25a508-93b7-422d-bec9-b08d3a0a8c17',
          Inclusion: 'Buffet Breakfast',
          DayRates: [
            [
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
            ],
          ],
          TotalFare: 5135,
          TotalTax: 579.06,
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
          ProviderPrice: 5033.42,
          brandingfee: 101,
        },
        {
          Name: ['2QN MOBILITY/HEARING ACCESS RI SHWR STE NSMK'],
          BookingCode: '1259854!TB!5!TB!fe25a508-93b7-422d-bec9-b08d3a0a8c17',
          Inclusion: 'Buffet Breakfast',
          DayRates: [
            [
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
              {
                BasePrice: 153.598505,
              },
            ],
          ],
          TotalFare: 5135,
          TotalTax: 579.06,
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
          ProviderPrice: 5033.42,
          brandingfee: 101,
        },
        {
          Name: ['1 KING BED STUDIO SUITE NONSMOKING'],
          BookingCode: '1259854!TB!6!TB!fe25a508-93b7-422d-bec9-b08d3a0a8c17',
          Inclusion: 'Buffet Breakfast',
          DayRates: [
            [
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
            ],
          ],
          TotalFare: 5185,
          TotalTax: 584.8,
          RoomPromotion: [],
          CancelPolicies: [
            {
              Index: '1',
              FromDate: '23-03-2024 00:00:00',
              ChargeType: 'Percentage',
              CancellationCharge: 100,
            },
            {
              Index: '1',
              FromDate: '07-01-2024 00:00:00',
              ChargeType: 'Fixed',
              CancellationCharge: 0,
            },
          ],
          MealType: 'BreakFast',
          IsRefundable: true,
          WithTransfers: false,
          ProviderPrice: 5083.27,
          brandingfee: 102,
        },
        {
          Name: ['1KG MOBILITY/HEARING ACCESS RI SHW STUDIO NSM'],
          BookingCode: '1259854!TB!7!TB!fe25a508-93b7-422d-bec9-b08d3a0a8c17',
          Inclusion: 'Buffet Breakfast',
          DayRates: [
            [
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
              {
                BasePrice: 155.119605,
              },
            ],
          ],
          TotalFare: 5185,
          TotalTax: 584.8,
          RoomPromotion: [],
          CancelPolicies: [
            {
              Index: '1',
              FromDate: '23-03-2024 00:00:00',
              ChargeType: 'Percentage',
              CancellationCharge: 100,
            },
            {
              Index: '1',
              FromDate: '07-01-2024 00:00:00',
              ChargeType: 'Fixed',
              CancellationCharge: 0,
            },
          ],
          MealType: 'BreakFast',
          IsRefundable: true,
          WithTransfers: false,
          ProviderPrice: 5083.27,
          brandingfee: 102,
        },
        {
          Name: ['1 KING BED STUDIO SUITE NONSMOKING'],
          BookingCode: '1259854!TB!8!TB!fe25a508-93b7-422d-bec9-b08d3a0a8c17',
          Inclusion: 'Buffet Breakfast',
          DayRates: [
            [
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
            ],
          ],
          TotalFare: 5217,
          TotalTax: 588.4,
          RoomPromotion: [],
          CancelPolicies: [
            {
              Index: '1',
              FromDate: '27-03-2024 00:00:00',
              ChargeType: 'Percentage',
              CancellationCharge: 100,
            },
            {
              Index: '1',
              FromDate: '07-01-2024 00:00:00',
              ChargeType: 'Fixed',
              CancellationCharge: 0,
            },
          ],
          MealType: 'BreakFast',
          IsRefundable: true,
          WithTransfers: false,
          ProviderPrice: 5114.6,
          brandingfee: 103,
        },
        {
          Name: ['1KG MOBILITY/HEARING ACCESS RI SHW STUDIO NSM'],
          BookingCode: '1259854!TB!9!TB!fe25a508-93b7-422d-bec9-b08d3a0a8c17',
          Inclusion: 'Buffet Breakfast',
          DayRates: [
            [
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
              {
                BasePrice: 156.075725,
              },
            ],
          ],
          TotalFare: 5217,
          TotalTax: 588.4,
          RoomPromotion: [],
          CancelPolicies: [
            {
              Index: '1',
              FromDate: '27-03-2024 00:00:00',
              ChargeType: 'Percentage',
              CancellationCharge: 100,
            },
            {
              Index: '1',
              FromDate: '07-01-2024 00:00:00',
              ChargeType: 'Fixed',
              CancellationCharge: 0,
            },
          ],
          MealType: 'BreakFast',
          IsRefundable: true,
          WithTransfers: false,
          ProviderPrice: 5114.6,
          brandingfee: 103,
        },
        {
          Name: ['1 KING BED 1 BEDROOM SUITE NONSMOKING'],
          BookingCode: '1259854!TB!10!TB!fe25a508-93b7-422d-bec9-b08d3a0a8c17',
          Inclusion: 'Buffet Breakfast',
          DayRates: [
            [
              {
                BasePrice: 164.30053,
              },
              {
                BasePrice: 164.30053,
              },
              {
                BasePrice: 164.30053,
              },
              {
                BasePrice: 164.30053,
              },
              {
                BasePrice: 164.30053,
              },
              {
                BasePrice: 164.30053,
              },
              {
                BasePrice: 164.30053,
              },
              {
                BasePrice: 164.30053,
              },
              {
                BasePrice: 164.30053,
              },
              {
                BasePrice: 164.30053,
              },
              {
                BasePrice: 164.30053,
              },
              {
                BasePrice: 164.30053,
              },
              {
                BasePrice: 164.30053,
              },
              {
                BasePrice: 164.30053,
              },
              {
                BasePrice: 164.30053,
              },
              {
                BasePrice: 164.30053,
              },
              {
                BasePrice: 164.30053,
              },
              {
                BasePrice: 164.30053,
              },
              {
                BasePrice: 164.30053,
              },
              {
                BasePrice: 164.30053,
              },
              {
                BasePrice: 164.30053,
              },
              {
                BasePrice: 164.30053,
              },
              {
                BasePrice: 164.30053,
              },
              {
                BasePrice: 164.30053,
              },
              {
                BasePrice: 164.30053,
              },
              {
                BasePrice: 164.30053,
              },
              {
                BasePrice: 164.30053,
              },
              {
                BasePrice: 164.30053,
              },
              {
                BasePrice: 164.30053,
              },
            ],
          ],
          TotalFare: 5492,
          TotalTax: 619.41,
          RoomPromotion: [],
          CancelPolicies: [
            {
              Index: '1',
              FromDate: '23-03-2024 00:00:00',
              ChargeType: 'Percentage',
              CancellationCharge: 100,
            },
            {
              Index: '1',
              FromDate: '07-01-2024 00:00:00',
              ChargeType: 'Fixed',
              CancellationCharge: 0,
            },
          ],
          MealType: 'BreakFast',
          IsRefundable: true,
          WithTransfers: false,
          ProviderPrice: 5384.13,
          brandingfee: 108,
        },
        {
          Name: ['1 KING BED 1 BEDROOM SUITE NONSMOKING'],
          BookingCode: '1259854!TB!11!TB!fe25a508-93b7-422d-bec9-b08d3a0a8c17',
          Inclusion: 'Buffet Breakfast',
          DayRates: [
            [
              {
                BasePrice: 165.310975,
              },
              {
                BasePrice: 165.310975,
              },
              {
                BasePrice: 165.310975,
              },
              {
                BasePrice: 165.310975,
              },
              {
                BasePrice: 165.310975,
              },
              {
                BasePrice: 165.310975,
              },
              {
                BasePrice: 165.310975,
              },
              {
                BasePrice: 165.310975,
              },
              {
                BasePrice: 165.310975,
              },
              {
                BasePrice: 165.310975,
              },
              {
                BasePrice: 165.310975,
              },
              {
                BasePrice: 165.310975,
              },
              {
                BasePrice: 165.310975,
              },
              {
                BasePrice: 165.310975,
              },
              {
                BasePrice: 165.310975,
              },
              {
                BasePrice: 165.310975,
              },
              {
                BasePrice: 165.310975,
              },
              {
                BasePrice: 165.310975,
              },
              {
                BasePrice: 165.310975,
              },
              {
                BasePrice: 165.310975,
              },
              {
                BasePrice: 165.310975,
              },
              {
                BasePrice: 165.310975,
              },
              {
                BasePrice: 165.310975,
              },
              {
                BasePrice: 165.310975,
              },
              {
                BasePrice: 165.310975,
              },
              {
                BasePrice: 165.310975,
              },
              {
                BasePrice: 165.310975,
              },
              {
                BasePrice: 165.310975,
              },
              {
                BasePrice: 165.310975,
              },
            ],
          ],
          TotalFare: 5526,
          TotalTax: 623.23,
          RoomPromotion: [],
          CancelPolicies: [
            {
              Index: '1',
              FromDate: '27-03-2024 00:00:00',
              ChargeType: 'Percentage',
              CancellationCharge: 100,
            },
            {
              Index: '1',
              FromDate: '07-01-2024 00:00:00',
              ChargeType: 'Fixed',
              CancellationCharge: 0,
            },
          ],
          MealType: 'BreakFast',
          IsRefundable: true,
          WithTransfers: false,
          ProviderPrice: 5417.25,
          brandingfee: 109,
        },
        {
          Name: ['2 QUEEN BEDS 1 BEDROOM SUITE NONSMOKING'],
          BookingCode: '1259854!TB!12!TB!fe25a508-93b7-422d-bec9-b08d3a0a8c17',
          Inclusion: 'Buffet Breakfast',
          DayRates: [
            [
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
            ],
          ],
          TotalFare: 5799,
          TotalTax: 654.03,
          RoomPromotion: [],
          CancelPolicies: [
            {
              Index: '1',
              FromDate: '23-03-2024 00:00:00',
              ChargeType: 'Percentage',
              CancellationCharge: 100,
            },
            {
              Index: '1',
              FromDate: '07-01-2024 00:00:00',
              ChargeType: 'Fixed',
              CancellationCharge: 0,
            },
          ],
          MealType: 'BreakFast',
          IsRefundable: true,
          WithTransfers: false,
          ProviderPrice: 5684.99,
          brandingfee: 114,
        },
        {
          Name: ['2QN MOBILITY/HEARING ACCESS RI SHWR STE NSMK'],
          BookingCode: '1259854!TB!13!TB!fe25a508-93b7-422d-bec9-b08d3a0a8c17',
          Inclusion: 'Buffet Breakfast',
          DayRates: [
            [
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
              {
                BasePrice: 173.481455,
              },
            ],
          ],
          TotalFare: 5799,
          TotalTax: 654.03,
          RoomPromotion: [],
          CancelPolicies: [
            {
              Index: '1',
              FromDate: '23-03-2024 00:00:00',
              ChargeType: 'Percentage',
              CancellationCharge: 100,
            },
            {
              Index: '1',
              FromDate: '07-01-2024 00:00:00',
              ChargeType: 'Fixed',
              CancellationCharge: 0,
            },
          ],
          MealType: 'BreakFast',
          IsRefundable: true,
          WithTransfers: false,
          ProviderPrice: 5684.99,
          brandingfee: 114,
        },
        {
          Name: ['2 QUEEN BEDS 1 BEDROOM SUITE NONSMOKING'],
          BookingCode: '1259854!TB!14!TB!fe25a508-93b7-422d-bec9-b08d3a0a8c17',
          Inclusion: 'Buffet Breakfast',
          DayRates: [
            [
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
            ],
          ],
          TotalFare: 5835,
          TotalTax: 658.04,
          RoomPromotion: [],
          CancelPolicies: [
            {
              Index: '1',
              FromDate: '27-03-2024 00:00:00',
              ChargeType: 'Percentage',
              CancellationCharge: 100,
            },
            {
              Index: '1',
              FromDate: '07-01-2024 00:00:00',
              ChargeType: 'Fixed',
              CancellationCharge: 0,
            },
          ],
          MealType: 'BreakFast',
          IsRefundable: true,
          WithTransfers: false,
          ProviderPrice: 5719.88,
          brandingfee: 115,
        },
        {
          Name: ['2QN MOBILITY/HEARING ACCESS RI SHWR STE NSMK'],
          BookingCode: '1259854!TB!15!TB!fe25a508-93b7-422d-bec9-b08d3a0a8c17',
          Inclusion: 'Buffet Breakfast',
          DayRates: [
            [
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
              {
                BasePrice: 174.546225,
              },
            ],
          ],
          TotalFare: 5835,
          TotalTax: 658.04,
          RoomPromotion: [],
          CancelPolicies: [
            {
              Index: '1',
              FromDate: '27-03-2024 00:00:00',
              ChargeType: 'Percentage',
              CancellationCharge: 100,
            },
            {
              Index: '1',
              FromDate: '07-01-2024 00:00:00',
              ChargeType: 'Fixed',
              CancellationCharge: 0,
            },
          ],
          MealType: 'BreakFast',
          IsRefundable: true,
          WithTransfers: false,
          ProviderPrice: 5719.88,
          brandingfee: 115,
        },
        {
          Name: ['1KG 2QN BEDS 2BDRM 2 BA ACCESSIBLE STE NOSMOK'],
          BookingCode: '1259854!TB!16!TB!fe25a508-93b7-422d-bec9-b08d3a0a8c17',
          Inclusion: 'Buffet Breakfast',
          DayRates: [
            [
              {
                BasePrice: 210.487645,
              },
              {
                BasePrice: 210.487645,
              },
              {
                BasePrice: 210.487645,
              },
              {
                BasePrice: 210.487645,
              },
              {
                BasePrice: 210.487645,
              },
              {
                BasePrice: 210.487645,
              },
              {
                BasePrice: 210.487645,
              },
              {
                BasePrice: 210.487645,
              },
              {
                BasePrice: 210.487645,
              },
              {
                BasePrice: 210.487645,
              },
              {
                BasePrice: 210.487645,
              },
              {
                BasePrice: 210.487645,
              },
              {
                BasePrice: 210.487645,
              },
              {
                BasePrice: 210.487645,
              },
              {
                BasePrice: 210.487645,
              },
              {
                BasePrice: 210.487645,
              },
              {
                BasePrice: 210.487645,
              },
              {
                BasePrice: 210.487645,
              },
              {
                BasePrice: 210.487645,
              },
              {
                BasePrice: 210.487645,
              },
              {
                BasePrice: 210.487645,
              },
              {
                BasePrice: 210.487645,
              },
              {
                BasePrice: 210.487645,
              },
              {
                BasePrice: 210.487645,
              },
              {
                BasePrice: 210.487645,
              },
              {
                BasePrice: 210.487645,
              },
              {
                BasePrice: 210.487645,
              },
              {
                BasePrice: 210.487645,
              },
              {
                BasePrice: 210.487645,
              },
            ],
          ],
          TotalFare: 7036,
          TotalTax: 793.54,
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
          ProviderPrice: 6897.68,
          brandingfee: 138,
        },
        {
          Name: ['1KG 2QN BEDS 2BDRM 2 BA ACCESSIBLE STE NOSMOK'],
          BookingCode: '1259854!TB!17!TB!fe25a508-93b7-422d-bec9-b08d3a0a8c17',
          Inclusion: 'Buffet Breakfast',
          DayRates: [
            [
              {
                BasePrice: 237.7262,
              },
              {
                BasePrice: 237.7262,
              },
              {
                BasePrice: 237.7262,
              },
              {
                BasePrice: 237.7262,
              },
              {
                BasePrice: 237.7262,
              },
              {
                BasePrice: 237.7262,
              },
              {
                BasePrice: 237.7262,
              },
              {
                BasePrice: 237.7262,
              },
              {
                BasePrice: 237.7262,
              },
              {
                BasePrice: 237.7262,
              },
              {
                BasePrice: 237.7262,
              },
              {
                BasePrice: 237.7262,
              },
              {
                BasePrice: 237.7262,
              },
              {
                BasePrice: 237.7262,
              },
              {
                BasePrice: 237.7262,
              },
              {
                BasePrice: 237.7262,
              },
              {
                BasePrice: 237.7262,
              },
              {
                BasePrice: 237.7262,
              },
              {
                BasePrice: 237.7262,
              },
              {
                BasePrice: 237.7262,
              },
              {
                BasePrice: 237.7262,
              },
              {
                BasePrice: 237.7262,
              },
              {
                BasePrice: 237.7262,
              },
              {
                BasePrice: 237.7262,
              },
              {
                BasePrice: 237.7262,
              },
              {
                BasePrice: 237.7262,
              },
              {
                BasePrice: 237.7262,
              },
              {
                BasePrice: 237.7262,
              },
              {
                BasePrice: 237.7262,
              },
            ],
          ],
          TotalFare: 7947,
          TotalTax: 896.23,
          RoomPromotion: [],
          CancelPolicies: [
            {
              Index: '1',
              FromDate: '23-03-2024 00:00:00',
              ChargeType: 'Percentage',
              CancellationCharge: 100,
            },
            {
              Index: '1',
              FromDate: '07-01-2024 00:00:00',
              ChargeType: 'Fixed',
              CancellationCharge: 0,
            },
          ],
          MealType: 'BreakFast',
          IsRefundable: true,
          WithTransfers: false,
          ProviderPrice: 7790.29,
          brandingfee: 156,
        },
        {
          Name: ['1KG 2QN BEDS 2BDRM 2 BA ACCESSIBLE STE NOSMOK'],
          BookingCode: '1259854!TB!18!TB!fe25a508-93b7-422d-bec9-b08d3a0a8c17',
          Inclusion: 'Buffet Breakfast',
          DayRates: [
            [
              {
                BasePrice: 239.192975,
              },
              {
                BasePrice: 239.192975,
              },
              {
                BasePrice: 239.192975,
              },
              {
                BasePrice: 239.192975,
              },
              {
                BasePrice: 239.192975,
              },
              {
                BasePrice: 239.192975,
              },
              {
                BasePrice: 239.192975,
              },
              {
                BasePrice: 239.192975,
              },
              {
                BasePrice: 239.192975,
              },
              {
                BasePrice: 239.192975,
              },
              {
                BasePrice: 239.192975,
              },
              {
                BasePrice: 239.192975,
              },
              {
                BasePrice: 239.192975,
              },
              {
                BasePrice: 239.192975,
              },
              {
                BasePrice: 239.192975,
              },
              {
                BasePrice: 239.192975,
              },
              {
                BasePrice: 239.192975,
              },
              {
                BasePrice: 239.192975,
              },
              {
                BasePrice: 239.192975,
              },
              {
                BasePrice: 239.192975,
              },
              {
                BasePrice: 239.192975,
              },
              {
                BasePrice: 239.192975,
              },
              {
                BasePrice: 239.192975,
              },
              {
                BasePrice: 239.192975,
              },
              {
                BasePrice: 239.192975,
              },
              {
                BasePrice: 239.192975,
              },
              {
                BasePrice: 239.192975,
              },
              {
                BasePrice: 239.192975,
              },
              {
                BasePrice: 239.192975,
              },
            ],
          ],
          TotalFare: 7996,
          TotalTax: 901.76,
          RoomPromotion: [],
          CancelPolicies: [
            {
              Index: '1',
              FromDate: '27-03-2024 00:00:00',
              ChargeType: 'Percentage',
              CancellationCharge: 100,
            },
            {
              Index: '1',
              FromDate: '07-01-2024 00:00:00',
              ChargeType: 'Fixed',
              CancellationCharge: 0,
            },
          ],
          MealType: 'BreakFast',
          IsRefundable: true,
          WithTransfers: false,
          ProviderPrice: 7838.36,
          brandingfee: 157,
        },
      ],
      LowestTotalFare: 4591,
      CategoriesFound: [
        'Accessible Hotel',
        '',
        'Pool',
        'Dry cleaning',
        'Car parking',
        'Meeting room',
        'Conference rooms',
        'WIFI',
        'Free breakfast',
        'Airport shuttle',
        'Coffee in room',
        'Laundry service',
        'Fitness',
        'Check-in',
        'Business services',
        '24-hour check-in',
        'Reception safe',
        'Bar',
        'ATM',
      ],
    },
  ],
  num_nights: 29,
  guestsRooms: [
    {
      Adults: 2,
      ChildrenAges: [],
    },
  ],
};

export default roomSearchMock;
