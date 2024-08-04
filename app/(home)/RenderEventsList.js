import Link from "next/link";
import { useState, useEffect } from "react";
import { Card, Loader } from "semantic-ui-react";

export const RenderCampaignList = ({ eventManagementContract }) => {
    const [isLoading, setLoading] = useState(false);
    const [eventList, setEventList] = useState([]);

    useEffect(() => {
      if(!eventList.length) {
        setLoading(true);
        getEventsList();
      }
    }, []);

    const getEventsList = async () => {
        try {
            let totalEvents = await eventManagementContract.eventNumber();
            totalEvents = totalEvents.toString();
            const events = await Promise.all(
                Array(parseInt(totalEvents.toString())).fill().map((element, index) => {
                    return eventManagementContract.events(index + 1);
                })
            );
            if(totalEvents) setEventList(events);
        } catch(error) {
            console.log('error while fetching event list: ', error.message)
        } finally {
          setLoading(false);
        }
        
    }

    const items = eventList.map((event, index) => {
        return {
          header: event.eventName,
          description: (
            <div>
              <p>{new Date(event.eventDate * 1000).toLocaleDateString()}</p>
              <Link href={`/events/${index + 1}`}>
                <p className="text-sky-500">View Event Details</p>
              </Link>
            </div>
          ),
          fluid: true
        };
      });
  
    return (
      <div>
        {isLoading ? (<div class="ui active centered inline loader"></div>)
          : !isLoading && eventList ? (<Card.Group items={items} />) 
            : (<p>No Data</p>)}
      </div>
    );
  }

  export default RenderCampaignList;