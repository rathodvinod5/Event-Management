import { useEventManagementContext } from "@/app/context/EventContractContext";
import { useState } from "react";
import { Input, Button, Message, MessageHeader, Form } from "semantic-ui-react";

const TotalTicketsPurchased = ({ eventId }) => {
  const [newEventId, setNewEventId] = useState(0);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [totalTickets, setTotalTickets] = useState("");

  const { eventManagementContract } = useEventManagementContext();

  const onSubmit =  async () => {
    if(!address && address.length < 42) {
      setErrorMessage("Please input a valid address!");
      return;
    }

    setLoading(true);
    try {
        const tickets = await eventManagementContract.tickets(address, eventId ? eventId : newEventId);
        console.log('Tickets: ', tickets);
        setTotalTickets(tickets.toString());
    } catch(error) {
        console.log('ERROR: ', error.Message);
    } finally {
        setLoading(false);
    }
  }

  return (
      <div style={{ width: '100%', padding: '10px' }}>
        <Form onSubmit={onSubmit} error={!!errorMessage}>
          {!eventId ? (
            <div>
              <label style={{ marginTop: '20px' }}>EventId</label>
              <Input 
                value={newEventId} 
                type='number'
                required
                fluid
                onChange={event => setNewEventId(event.target.value)}
              />
            </div>
          ) : null}

          <label style={{ marginTop: '20px' }}>Address</label>
          <Input 
            value={address} 
            type='text'
            placeholder="0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            required
            fluid
            onChange={event => setAddress(event.target.value)}
          />

          {totalTickets ? (
            <Message info>
              <MessageHeader>You have {totalTickets} tickets for this event.</MessageHeader>
            </Message>
          ) : null}
          <Button 
            style={{ marginTop: '20px' }} 
            loading={loading} 
            primary
          >
            Get Tickets Purchased
          </Button>

        </Form>
      </div>
  );
}

export default TotalTicketsPurchased;