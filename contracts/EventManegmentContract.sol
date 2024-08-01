// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;

contract EventManagement {
    struct Event {
        string eventName;
        address payable eventOrganiser;
        uint eventDate;
        uint price;
        uint totalTickets;
        uint remaininTickets;
    }
    uint eventNumber;
    mapping(address => mapping(uint => uint)) tickets;
    mapping(uint => Event) public events; // update smart contract(i.e, recompile once again)
    address owner;

    constructor() {
        owner = msg.sender;
    }

     modifier isEventExists(uint _eventId) {
        require(events[_eventId].eventDate != 0, "Event doesn't exists");
        _;
    }

    modifier isBeforeEventDate(uint _eventId) {
        require(block.timestamp < events[_eventId].eventDate, "This event has ended!");
        _;
    }

    modifier isFutureDate(uint _eventDate) {
        require(_eventDate > block.timestamp, "Event date should be of future date.");
        _;
    }

    event CampaignAdded(string _eventName, address _eventOrganizer, uint _eventDate, 
        uint _price, uint _totalTickets);

    event TicketPurchased(string _eventName, uint _eventDate, uint _price, uint _quantity);

    event TicketsTransferred(string _eventName, uint _eventDate, address _from, 
        address _toAddress, uint _quantity);

    function createEvent(string memory _eventName, address _eventOrganiser, uint _eventDate, 
        uint _price, uint _totalTickets) public isFutureDate(_eventDate) {

            eventNumber++;
            events[eventNumber] = Event(_eventName, payable(_eventOrganiser), _eventDate, _price, 
                _totalTickets, _totalTickets);

            emit CampaignAdded(_eventName, _eventOrganiser, _eventDate, _price, _totalTickets);
    }

    function buyTickets(uint _eventId, uint _quantity) public payable isEventExists(_eventId)
        isBeforeEventDate(_eventId) {
        require(events[_eventId].eventDate > block.timestamp, "This event has Ended!");
        require(events[_eventId].remaininTickets > 0, "All the tickets are out!");
        require(events[_eventId].remaininTickets >= _quantity, "Remaining tickets are less then the quantity!");
        require(msg.value >= events[_eventId].price *_quantity, "Please send suffiencient price to buy tickets!");

        events[_eventId].eventOrganiser.transfer(msg.value);
        tickets[msg.sender][_eventId] += _quantity;
        events[_eventId].remaininTickets -= _quantity;

        emit TicketPurchased(events[_eventId].eventName, events[_eventId].eventDate, 
                events[_eventId].price, _quantity);
    }

    function transferTicket(uint _eventId, uint _quantity, address _toAddress) public isEventExists(_eventId)
        isBeforeEventDate(_eventId) {
            require(tickets[msg.sender][_eventId] >= _quantity, "You don't have sufficient quantity!");

            tickets[msg.sender][_eventId] -= _quantity;
            tickets[_toAddress][_eventId] += _quantity;

        emit TicketsTransferred(events[_eventId].eventName, events[_eventId].eventDate, 
                msg.sender, _toAddress, _quantity);
    }
}