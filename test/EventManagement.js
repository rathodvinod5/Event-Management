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
  it("should create an event", async function () {
    try {
        const eventName = "Test Event";
        const eventOrganiser = owner.address;
        const eventDate = Math.floor(Date.now() / 1000) + 86400; // 1 day in the future
        const price = ethers.parseUnits("1", "ether");
        const totalTickets = 100;

        await eventManagement.createEvent(eventName, eventOrganiser,eventDate, price, totalTickets);

        const event = await eventManagement.events(1);
        assert.strictEqual(event.eventName, eventName);
        assert.strictEqual(event.eventOrganiser, eventOrganiser);
        assert.strictEqual(event.eventDate.toNumber(), eventDate);
        assert.strictEqual(event.price.toString(), price.toString());
        assert.strictEqual(event.totalTickets.toNumber(), totalTickets);
    } catch(error) {
        console.log('ERROR: ', error)
    }
  });
  // #endregion

  it.skip("should buy tickets", async function () {
    const eventName = "Test Event";
    const eventOrganiser = owner.address;
    const eventDate = Math.floor(Date.now() / 1000) + 86400;
    const price = ethers.utils.parseEther("1");
    const totalTickets = 100;

    await eventManagement.createEvent(
      eventName,
      eventOrganiser,
      eventDate,
      price,
      totalTickets
    );

    const eventId = 1;
    const quantity = 2;
    const value = ethers.utils.parseEther("2");

    await eventManagement.connect(addr1).buyTickets(eventId, quantity, { value });

    const remainingTickets = await eventManagement.events(eventId);
    const ticketsBought = await eventManagement.tickets(addr1.address, eventId);

    assert.strictEqual(remainingTickets.remaininTickets.toNumber(), totalTickets - quantity);
    assert.strictEqual(ticketsBought.toNumber(), quantity);
  });

  it.skip("should transfer tickets", async function () {
    const eventName = "Test Event";
    const eventOrganiser = owner.address;
    const eventDate = Math.floor(Date.now() / 1000) + 86400;
    const price = ethers.utils.parseEther("1");
    const totalTickets = 100;

    await eventManagement.createEvent(
      eventName,
      eventOrganiser,
      eventDate,
      price,
      totalTickets
    );

    const eventId = 1;
    const quantity = 2;
    const value = ethers.utils.parseEther("2");

    await eventManagement.connect(addr1).buyTickets(eventId, quantity, { value });

    const transferQuantity = 1;

    await eventManagement.connect(addr1).transferTicket(eventId, transferQuantity, addr2.address);

    const ticketsAddr1 = await eventManagement.tickets(addr1.address, eventId);
    const ticketsAddr2 = await eventManagement.tickets(addr2.address, eventId);

    assert.strictEqual(ticketsAddr1.toNumber(), quantity - transferQuantity);
    assert.strictEqual(ticketsAddr2.toNumber(), transferQuantity);
  });

  it.skip("should not allow buying tickets after the event date", async function () {
    const eventName = "Test Event";
    const eventOrganiser = owner.address;
    const eventDate = Math.floor(Date.now() / 1000) - 86400; // 1 day in the past
    const price = ethers.utils.parseEther("1");
    const totalTickets = 100;

    await eventManagement.createEvent(
      eventName,
      eventOrganiser,
      eventDate,
      price,
      totalTickets
    );

    const eventId = 1;
    const quantity = 2;
    const value = ethers.utils.parseEther("2");

    try {
      await eventManagement.connect(addr1).buyTickets(eventId, quantity, { value });
      assert.fail("Expected an error but did not get one");
    } catch (error) {
      assert(error.message.includes("This event has ended!"), "Expected 'This event has ended!' but got another error");
    }
  });

  // #region The last test
  it.skip("should not allow transferring more tickets than owned", async function () {
    const eventName = "Test Event";
    const eventOrganiser = owner.address;
    const eventDate = Math.floor(Date.now() / 1000) + 86400;
    const price = ethers.utils.parseEther("1");
    const totalTickets = 100;

    await eventManagement.createEvent(
      eventName,
      eventOrganiser,
      eventDate,
      price,
      totalTickets
    );

    const eventId = 1;
    const quantity = 2;
    const value = ethers.utils.parseEther("2");

    await eventManagement.connect(addr1).buyTickets(eventId, quantity, { value });

    const transferQuantity = 3; // More than owned

    try {
      await eventManagement.connect(addr1).transferTicket(eventId, transferQuantity, addr2.address);
      assert.fail("Expected an error but did not get one");
    } catch (error) {
      assert(error.message.includes("You don't have sufficient quantity!"), "Expected 'You don't have sufficient quantity!' but got another error");
    }
  });
});
