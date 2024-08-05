import { useEventManagementContext } from "@/app/context/EventContractContext";
import { useState } from "react";
import { Input, Button, Message, MessageHeader, Form } from "semantic-ui-react";

const TransferTickets = ({ eventId }) => {
  const [newEventId, setNewEventId] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [toAddress, setToAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, toggleSuccessMessage] = useState(false);

  const { eventManagementContract } = useEventManagementContext();

  const onSubmit = () => {
    if(!quantity && quantity <= 0 && toAddress) {
      setErrorMessage("Please input a valid number of tickets to buy!");
      return;
    }
    setLoading(true);

    transferTickets();
  }

  async function transferTickets() {
    try {
      // Call the transferTickets function with msg.value
      const tx = await eventManagementContract.transferTicket(eventId ? eventId : newEventId, quantity, toAddress);
      console.log("Transaction sent:", tx);

      // Wait for the transaction to be mined
    //   const receipt = await tx.wait();
      console.log("Transaction mined:",);
      toggleSuccessMessage(true);
    } catch (error) {
      console.error("Error transferring tickets:", error.message);
      if(error.message.includes('sufficient quantity')) {
        setErrorMessage("You don't have sufficient tickets to transfer!");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
      <div style={{ width: '100%', padding: '10px', height: '100%' }}>
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

          <label style={{ marginTop: '20px' }}>Quantity</label>
          <Input 
            value={quantity} 
            type='number'
            required
            fluid
            onChange={event => setQuantity(event.target.value)}
          />

          <label style={{ marginTop: '20px' }}>To Address</label>
          <Input 
            value={toAddress} 
            type='text'
            placeholder="0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            required
            fluid
            onChange={event => setToAddress(event.target.value)}
          />

          <Message error header="Oops!" content={errorMessage} />
          <Button 
            style={{ marginTop: '20px' }} 
            loading={loading} 
            primary
          >
            Transfer Tickets
          </Button>

          {showSuccessMessage ? (
            <Message info>
              <MessageHeader>You transferred {quantity} tickets to {toAddress}</MessageHeader>
              {/* <p>Transaction id: </p> */}
            </Message>
          ) : null}
        </Form>
      </div>
  );
}

export default TransferTickets;