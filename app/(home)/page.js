"use client";
import Link from "next/link";
import { Button, Table, Header as PageHeader, TableBody, Container, Grid, GridColumn } from "semantic-ui-react";
import { useEventManagementContext } from "../context/EventContractContext";
import RenderCampaignList from "./RenderEventsList";

const HomePage = () => {
  const { eventManagementContract } = useEventManagementContext();

  return(
    <div>
      <div style={{ height: '50px' }}></div>
      <PageHeader as="h3">All Events</PageHeader>
      <Grid>
        <GridColumn width={10}>
          <RenderCampaignList eventManagementContract={eventManagementContract} />
        </GridColumn>

        <GridColumn width={6}>
          <Link href="/events/new">
            <Button 
              // floated="right" 
              content="Create Event" 
              icon="add circle" 
              primary 
            />
          </Link>
          <Link href="/tickets">
            <Button 
              // floated="right" 
              content="Tickets" 
              primary 
            />
          </Link>
        </GridColumn>
      </Grid>
    </div>
  );
}

export default HomePage;