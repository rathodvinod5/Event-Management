import { ethers } from "ethers";
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
        const date = new Date(timestamp).toLocaleDateString();
        console.error('Date: ', date);
        return null;

        // Check if the date is valid
        if (isNaN(date.getTime())) {
            console.error('Invalid Date');
        } else {
            // Format the date to a human-readable string
            const formattedDate = date.toLocaleString(); // Default locale string
            console.log('Formatted Date:', formattedDate);

            // Custom formatted date
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // Months are zero-based
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();

            const customFormattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const customFormattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            const dateTime = `${customFormattedDate}  ${customFormattedTime}`;
            console.log(`Custom Formatted Date: `, dateTime);
            return dateTime;
        }
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