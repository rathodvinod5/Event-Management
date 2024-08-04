import { useEventManagementContext } from "@/app/context/EventContractContext";
import { useState } from "react";
import { Input, Button, Message, Card, Form } from "semantic-ui-react";

const PurchaseTickets = ({ eventId }) => {
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, toggleSuccessMessage] = useState(false);

  const { eventManagementContract } = useEventManagementContext();

  const onSubmit = () => {
    if(!quantity && quantity <= 0) {
      setErrorMessage("Please input a valid number of tickets to buy!");
      return;
    }
    setLoading(true);

    const quantity = 2;
    const pricePerTicketInEther = "0.05";
    // buyTickets(eventId, quantity, pricePerTicketInEther);
  }

  async function buyTickets(eventId, quantity, pricePerTicketInEther) {
    try {
      // Calculate the total price in Wei
      const totalPriceInWei = ethers.utils.parseUnits(pricePerTicketInEther.toString(), "ether").mul(quantity);

      // Call the buyTickets function with msg.value
      const tx = await eventManagementContract.buyTickets(eventId, quantity, { value: totalPriceInWei });
      console.log("Transaction sent:", tx.hash);

      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      console.log("Transaction mined:", receipt);

      // Parse the events from the receipt
      receipt.events.forEach((event) => {
        if (event.event === "TicketPurchased") {
          console.log("Ticket Purchased:");
          console.log("Event Name:", event.args.eventName);
          console.log("Event Date:", new Date(event.args.eventDate.toNumber() * 1000));
          console.log("Price:", ethers.utils.formatUnits(event.args.price, "ether"));
          console.log("Quantity:", event.args.quantity.toString());
          console.log("Buyer:", event.args.buyer);
        }
      });
    } catch (error) {
      console.error("Error buying tickets:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
      <div style={{ width: '100%', padding: '10px' }}>
        <Form onSubmit={onSubmit} error={!!errorMessage}>
          <label style={{ marginTop: '20px' }}>Quantity</label>
          <Input 
            value={quantity} 
            type='number'
            required
            fluid
            onChange={event => setQuantity(event.target.value)}
          />

          <Message error header="Oops!" content={errorMessage} />
          <Button 
            style={{ marginTop: '20px' }} 
            loading={loading} 
            primary
          >
            Buy Tickets
          </Button>

          {showSuccessMessage ? (
            <Message info>
              <MessageHeader>You purchased {quantity} tickets</MessageHeader>
              <p>Transaction id: </p>
            </Message>
          ) : null}
        </Form>
      </div>
  );
}

export default PurchaseTickets;