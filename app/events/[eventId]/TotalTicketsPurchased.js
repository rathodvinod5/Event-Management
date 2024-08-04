import { useEventManagementContext } from "@/app/context/EventContractContext";
import { useState } from "react";
import { Input, Button, Message, Card, Form } from "semantic-ui-react";

const TotalTicketsPurchased = ({ eventId }) => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessMessage, toggleSuccessMessage] = useState(false);

  const { eventManagementContract } = useEventManagementContext();

  const onSubmit =  async () => {
    if(!address && address.length < 42) {
      setErrorMessage("Please input a valid address!");
      return;
    }

    setLoading(true);
    try {
        const tickets = await eventManagementContract.tickets(address, eventId);
        console.log('Tickets: ', tickets);
    } catch(error) {
        console.log('ERROR: ', error.Message);
    } finally {
        setLoading(false);
    }
  }

  return (
      <div style={{ width: '100%', padding: '10px' }}>
        <Form onSubmit={onSubmit} error={!!errorMessage}>
          <label style={{ marginTop: '20px' }}>Address</label>
          <Input 
            value={address} 
            type='text'
            placeholder="0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            required
            fluid
            onChange={event => setAddress(event.target.value)}
          />

          {showSuccessMessage ? (
            <Message info>
              <MessageHeader>You purchased {quantity} tickets</MessageHeader>
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