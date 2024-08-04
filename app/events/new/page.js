"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Header as PageHeader, Form, FormField, Message, Button, Input, Divider } from "semantic-ui-react";
import { ethers } from 'ethers';
import { useEventManagementContext } from "@/app/context/EventContractContext";

const NewEvent = () => {
  const [name, setName] = useState("");
  const [organiser, setOrganiser] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [price, setPrice] = useState("");
  const [totalTickets, setTotalTickets] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [minDate, setMinDate] = useState("");

  const { eventManagementContract } = useEventManagementContext();
  const router = useRouter();

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    setMinDate(`${year}-${month}-${day}`);
  }, []);

  const onSubmit = async () => {
    setErrorMessage("");

    if(!name) 
      setErrorMessage("Please input a event name!");
    else if(!organiser)
      setErrorMessage("Please input event organisers address!");
    else if(organiser.length < 42) 
      setErrorMessage("Please input address starting with 0x<40>");
    else if(!price && price < 0)
      setErrorMessage("Please input  a valid price");
    else if(!totalTickets || totalTickets <= 0) 
        setErrorMessage("Please input a valid number of tickets");
    else setErrorMessage("");

    if(name && organiser && eventDate && price > 0 && totalTickets > 0) {
        setLoading(true);
        const currentTimeStamp = Math.floor(new Date(eventDate).getTime() / 1000);
        console.log("current timeStamp: ", currentTimeStamp, new Date(currentTimeStamp).toDateString());

        try {
            // await eventManagementContract.createEvent(
            //     name, 
            //     organiser, 
            //     currentTimeStamp, 
            //     parseInt(price), 
            //     totalTickets
            // );
            router.replace('/', { scroll: true });
        }catch(error) {
          console.log("Error: ", error.message);
          setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    }
  }

  return (
    <div>
      <div style={{ height: '50px' }}></div>
      <Link href={`/`} className='primary-text'>
        Back
      </Link>
      <div className="ui divider"></div>
      <PageHeader as="h3">New Event</PageHeader>
      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <FormField>
          <label style={{ marginTop: '20px' }}>Name</label>
          <Input 
            placeholder="Name of the event"
            value={name} 
            type='text'
            required
            fluid
            onChange={event => setName(event.target.value)}
          />

          <label style={{ marginTop: '20px' }}>Organisers Address</label>
          <Input 
            value={organiser} 
            type='text'
            placeholder="0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            required
            fluid
            onChange={event => setOrganiser(event.target.value)}
          />

          <label style={{ marginTop: '20px' }}>Date</label>
          <Input 
            value={eventDate} 
            type='date'
            placeholder="dd/mm/yyyy"
            min={minDate}
            required
            fluid
            onChange={event => setEventDate(event.target.value)}
          />

          <label style={{ marginTop: '20px' }}>Price</label>
          <Input 
            label="wei" 
            labelPosition='right' 
            value={price} 
            type='number'
            required
            fluid
            onChange={event => setPrice(event.target.value)}
          />

          <label style={{ marginTop: '20px' }}>Total Ticket</label>
          <Input 
            value={totalTickets} 
            type='number'
            required
            fluid
            onChange={event => setTotalTickets(event.target.value)}
          />
        </FormField>

        <Message error header="Oops!" content={errorMessage} />
        <Button loading={loading} primary>Create!</Button>
      </Form>
    </div>
  );
}

export default NewEvent;