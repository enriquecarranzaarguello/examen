import SearchMobile from './SearchMobileForm';

export default {
  component: SearchMobile,
};

export const Primary = {
  args: {
    filters: {
      hotel_id: '',
      city: 'Los Angeles-USA',
      destination: 'city|Los Angeles|USA',
      check_in: '2024-03-04',
      check_out: '2024-03-25',
      rooms: [
        {
          number_of_adults: 2,
          number_of_children: 0,
          children_age: [],
        },
      ],
      nationality: 'US',
    },
  },
};
