"use client";
import Link from "next/link";
import { Button, Table, Header as PageHeader, TableBody } from "semantic-ui-react";
import { useEventManagementContext } from "../context/EventContractContext";
import RenderCampaignList from "./RenderEventsList";

const HomePage = () => {
  const { eventManagementContract } = useEventManagementContext();

  return(
    <div>
      <div style={{ height: '50px' }}></div>
      <PageHeader as="h3">All Events</PageHeader>
      <Link href="/events/new">
        <Button 
          floated="right" 
          content="Create Event" 
          icon="add circle" 
          primary 
        />
      </Link>
      <RenderCampaignList eventManagementContract={eventManagementContract} />
    </div>
  );
}

export default HomePage;