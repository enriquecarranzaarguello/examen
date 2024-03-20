import type { Meta, StoryObj } from '@storybook/react';

import DescriptionCard from './DescriptionCard';

const meta: Meta<typeof DescriptionCard> = {
  component: DescriptionCard,
};

export default meta;
type Story = StoryObj<typeof DescriptionCard>;

export const Primary: Story = {
  args: {
    description:
      '<p>HeadLine : In West Drayton (Heathrow Villages)</p><p>Location : Located in West Drayton (Heathrow Villages), Sheraton Heathrow Hotel is within a 15-minute drive of Windsor Castle and Windsor Racecourse. This 4-star hotel is 7.2 mi (11.5 km) from Twickenham Stadium and 7.4 mi (12 km) from Thorpe Park.</p><p>Rooms : Stay in one of 426 guestrooms featuring LCD televisions. Complimentary wireless Internet access keeps you connected, and cable programming is available for your entertainment. Private bathrooms with bathtubs or showers feature complimentary toiletries and hair dryers. Conveniences include phones, as well as safes and desks.</p><p>Dining : You can enjoy a meal at Cast Iron Bar & Grill serving the guests of Sheraton Heathrow Hotel, or stop in at the snack bar/deli. Wrap up your day with a drink at the bar/lounge. Buffet breakfasts are available daily from 6:30 AM to 10:30 AM for a fee.</p><p>CheckIn Instructions : <ul> <li>Extra-person charges may apply and vary depending on property policy</li><li>Government-issued photo identification and a credit card, debit card, or cash deposit may be required at check-in for incidental charges</li><li>Special requests are subject to availability upon check-in and may incur additional charges; special requests cannot be guaranteed</li><li>This property accepts credit cards; cash is not accepted</li><li>Safety features at this property include a carbon monoxide detector, a fire extinguisher, a smoke detector, a security system, a first aid kit, and window guards</li><li>Please note that cultural norms and guest policies may differ by country and by property; the policies listed are provided by the property</li> </ul></p><p>Special Instructions : Front desk staff will greet guests on arrival.</p>&nbsp;<br/><b>Disclaimer notification: Amenities are subject to availability and may be chargeable as per the hotel policy.</b>',
  },
};
