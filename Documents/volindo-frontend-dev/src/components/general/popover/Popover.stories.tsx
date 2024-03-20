import type { Meta, StoryObj } from '@storybook/react';
import hotelsStyles from '@components/hotels/search/hotel-search.module.scss';
import TravelersRooms from '@components/hotels/search/TravelersRooms/TravelersRooms';

import Popover from './Popover';

const meta: Meta<typeof Popover> = {
  component: Popover,
  title: 'Components/general/Popover',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

/**
 * Default use of the `Popover` component.
 */
export const Default: Story = {
  args: {
    children: <>Content of Popover</>,
  },
};

/**
 * The use of the `Popover` component with placement and custom margin.
 */
export const WithPlacement: Story = {
  args: {
    children: <>Popover with placement</>,
    placement: 'right-start',
    margin: 20,
  },
};

/**
 * The use of the `Popover` component on Hotels to display the `TravelersRooms` component.
 */
export const HotelsTravelers: Story = {
  args: {
    buttonLabel: '1 Room, 2 travelers',
    classNameMenu: hotelsStyles.hotelSearch_travelers_menu,
    classNameButton: hotelsStyles.hotelSearch_travelers_button,
    placement: 'bottom-end',
    children: (
      <TravelersRooms
        actualRooms={[
          { number_of_adults: 2, number_of_children: 0, children_age: [] },
        ]}
        origin=""
        onAddRoom={() => {}}
        onRemoveRoom={() => {}}
        onAddTraveler={() => {}}
        onRemoveTraveler={() => {}}
      />
    ),
  },
};
