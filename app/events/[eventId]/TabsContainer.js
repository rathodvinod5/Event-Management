import React from 'react';
import { Tab, Grid, Card } from 'semantic-ui-react';
import PurchaseTickets from './PurchaseTicket';
import TotalTicketsPurchased from './TotalTicketsPurchased';

const TabsContainer = ({ eventId }) => {
  const panes = [
    { menuItem: 'Buy Tickets', render: () => <Tab.Pane><PurchaseTickets eventId={eventId} /></Tab.Pane> },
    { menuItem: 'Total Tickets', render: () => <Tab.Pane><TotalTicketsPurchased eventId={eventId} /></Tab.Pane> },
  ];

  return (
    <Card style={{ width: '100%', padding: '10px' }}>
      <Tab panes={panes} />
    </Card>
  );
}

export default TabsContainer;
