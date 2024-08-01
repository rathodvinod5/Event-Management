const assert = require("assert");
const { ethers } = require("hardhat");
// import { ethers as ethers572 } from 'ethers';


describe("EventManagement contract", function () {
  let EventManagement;
  let eventManagement;
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let address;

  beforeEach(async function () {
    try {
      address = await ethers.getSigners();
      [owner, addr1, addr2, ...addrs] = address;
      EventManagement = await ethers.getContractFactory("EventManagement");
      eventManagement = await EventManagement.deploy();
    } catch(error) {
      console.log('error in establishing connection: ', error)
    }
  });

  // #region The first test case
  it("should create an event", async () => { 
    const eventName = "The first event";
    const eventOraganizer = owner.address;
    const eventDate = Math.floor(Date.now() / 1000) + 86400;
    const eventPrice = ethers.parseUnits("1", "ether");
    const totalTickets = 100;

    await eventManagement.createEvent(eventName, eventOraganizer, eventDate, eventPrice, totalTickets);

    const event = await eventManagement.events(1);
    assert.equal(event.eventName, eventName);
    assert.equal(event.eventOrganiser, eventOraganizer);
    assert.equal(event.eventDate.toString(), eventDate.toString());
    assert.equal(event.price.toString(), eventPrice.toString());
    assert.equal(event.totalTickets, totalTickets);
    assert.equal(event.remaininTickets, totalTickets);
  });
  // #endregion

  it("should buy tickets", async () => {
    const eventName = "The first event";
    const eventOraganizer = owner.address;
    const eventDate = Math.floor(Date.now() / 1000) + 86400;
    const eventPrice = ethers.parseUnits("1", "ether");
    const totalTickets = 100;

    await eventManagement.createEvent(eventName, eventOraganizer, eventDate, eventPrice, totalTickets);

    const quantity = 2;
    const value = ethers.parseUnits("2","ether");
    const eventId = 1;

    await eventManagement.connect(addr1).buyTickets(eventId, quantity, { value });
    const event = await eventManagement.events(1);
    const ticketsPurchased = await eventManagement.tickets(addr1.address, eventId);

    assert.strictEqual(event.remaininTickets.toString(), (totalTickets - quantity).toString());
    assert.strictEqual(ticketsPurchased.toString(), quantity.toString());
  });

  it("should transfer tickets", async () => {
    const eventName = "The first event";
    const eventOraganizer = owner.address;
    const eventDate = Math.floor(Date.now() / 1000) + 86400;
    const eventPrice = ethers.parseUnits("1", "ether");
    const totalTickets = 100;

    await eventManagement.createEvent(eventName, eventOraganizer, eventDate, eventPrice, totalTickets);

    const quantity = 4;
    const value = ethers.parseUnits("4","ether");
    const eventId = 1;

    await eventManagement.connect(addr1).buyTickets(eventId, quantity, { value });
    await eventManagement.connect(addr1).transferTicket(eventId, quantity / 2, addr2.address);
    const remainingTicketsForAddr1 = await eventManagement.tickets(addr1.address, eventId);
    const remainingTicketsForAddr2 = await eventManagement.tickets(addr2.address, eventId);

    assert.strictEqual(parseInt(remainingTicketsForAddr1), 2);
    assert.strictEqual(parseInt(remainingTicketsForAddr2), 2);
  });

  it("should not allow buying tickets after the event date", async function () {
    const eventName = "Test Event";
    const eventOrganiser = owner.address;
    const eventDate = Math.floor(Date.now() / 1000) - 86400; // 1 day in the past
    const price = ethers.parseUnits("1", "ether");
    const totalTickets = 100;

    try {
      // await eventManagement.connect(addr1).buyTickets(eventId, quantity, { value });
      await eventManagement.createEvent(eventName, eventOrganiser, eventDate, price, totalTickets);
      assert.fail("Expected an error but did not get one");
    } catch (error) {
      assert(error.message.includes("Event date should be of future date."), `Unexpected error message: ${error.message}`);
    }
  });

  // #region The last test
  it("should not allow transferring more tickets than owned", async () => {
    const eventName = "The first event";
    const eventOraganizer = owner.address;
    const eventDate = Math.floor(Date.now() / 1000) + 86400;
    const eventPrice = ethers.parseUnits("1", "ether");
    const totalTickets = 100;

    await eventManagement.createEvent(eventName, eventOraganizer, eventDate, eventPrice, totalTickets);

    const quantity = 2;
    const value = ethers.parseUnits("2","ether");
    const eventId = 1;

    await eventManagement.connect(addr1).buyTickets(eventId, quantity, { value });
    try {
      await eventManagement.connect(addr1).transferTicket(eventId, quantity + 2, addr2.address);
      assert.fail("Expected an error but did not get one")
    }catch(error) {
      assert(error.message.includes("You don't have sufficient quantity!"), "Expected 'You don't have sufficient quantity!' but got another error");
    }
  });
});
