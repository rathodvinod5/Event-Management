"use client";
import Link from "next/link";
import { Header as PageHeader } from "semantic-ui-react";
import TabsContainer from "../components/tabs-container/TabsContainer";

const Tickets = () => {
  return (
    <div>
      <div style={{ height: '50px' }}></div>
      <Link href={`/`} className='primary-text'>
        Back
      </Link>

      <div class="ui divider"></div>
      <PageHeader as="h3">Tickets</PageHeader>
      <TabsContainer />
    </div>
  );
}

export default Tickets;