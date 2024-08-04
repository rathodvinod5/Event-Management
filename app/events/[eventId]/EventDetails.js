import { Card } from "semantic-ui-react";

export const RenderEventDetails = ({ eventDetails }) => {

  const [
      eventName,
      organiser,
      eventDate,
      price,
      totalTickets,
      remainingTickets,
    ] = eventDetails;

    const getDate = (timestamp) => {
        // Create a new Date object using the timestamp
        const date = new Date(timestamp * 1000).toLocaleDateString();
        console.error('Date: ', date);
        return date;
    }
    
    const items = [
      { 
        header: eventName, 
        meta: 'Event Name', 
        descripion: 'The Name of the Event',
        style: { overflowWrap: 'break-word' }
      },
      { 
        header: organiser, 
        meta: 'Event Organiser', 
        descripion: 'Address of the organiser who created this event',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: price.toString(),
        meta: 'Pricer per Ticket (wei)',
        descrption: 'Price of single ticket for this event',
      },
      {
        header: getDate(eventDate.toString()),
        meta: 'Event Date',
        descrption: 'Date of the Event on what it is happening',
      },
      {
        header: `${remainingTickets.toString()} / ${totalTickets}`,
        meta: 'Tickets Available',
        descrption: 'Number of contributers who have already donated to this campaign',
      }
    ];

    return <Card.Group items={items} />
  }