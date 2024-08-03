"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Header as PageHeader, Loader } from "semantic-ui-react";
import { useEventManagementContext } from "../../context/EventContractContext";
import { RenderEventDetails } from "./EventDetails";

const EventDetails = ({ params }) => {
  const [loading, setLoading] = useState(false);
  const [eventDetails, setEventDetails] = useState(null);
  const { eventManagementContract } = useEventManagementContext();
  const { eventId } = params;

  console.log('eventId: ', eventId);

  useEffect(() => {
    if(!eventDetails) {
      setLoading(true);
      getEventDetailsData();
    }
  }, []);

  const getEventDetailsData = async () => {
    if(eventId) {
      try {
        const event = await eventManagementContract.events(eventId);
        setEventDetails(event);
      } catch (error) {
        console.log('error while fetching data: ', error.message)
      } finally {
        setLoading(false);
      }
    }
  }

  return(
    <div>
      <div style={{ height: '50px' }}></div>
      <Link href={`/`} className='primary-text'>
        Back
      </Link>

      <div class="ui divider"></div>
      <PageHeader as="h3">Event Details</PageHeader>
      {!eventDetails && loading ? <Loader /> 
        : eventDetails && !loading 
          ? (
            <RenderEventDetails eventDetails={eventDetails} />
          ) : (
            <p>No Data Found</p>
          )}
    </div>
  );
}

export default EventDetails;