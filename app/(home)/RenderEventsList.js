import Link from "next/link";
import { useState, useEffect } from "react";
import { Card } from "semantic-ui-react";

export const RenderCampaignList = ({ eventManagementContract }) => {
    const [eventList, setEventList] = useState([]);

    useEffect(() => {
      console.log('in useEffect of RenderList');
      if(!eventList.length) {
        getEventsList();
      }
    }, []);

    const getEventsList = async () => {
        console.log('in getEventsList')
        try {
            let totalEvents = await eventManagementContract.eventNumber();
            totalEvents = totalEvents.toString();
            const events = await Promise.all(
                Array(parseInt(totalEvents.toString())).fill().map((element, index) => {
                    return eventManagementContract.events(index + 1);
                })
            );
            // console.log('event list: ', totalEvents, events)
            if(totalEvents) setEventList(events);
        } catch(error) {
            console.log('error while fetching event list: ', error.message)
        }
        
    }

    const items = eventList.map((event, index) => {
        return {
          header: event.eventName,
          description: (
            <Link href={`/events/${index + 1}`}>
              <p className="text-sky-500">View Event Details</p>
            </Link>
          ),
          fluid: true
        };
      });
  
    return <Card.Group items={items} />;
  }

  export default RenderCampaignList;