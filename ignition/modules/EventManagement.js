const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const EventManagement = buildModule("EventManagement", (m) => {
  const event = m.contract("EventManagement"); 

  return { event };
});

module.exports = EventManagement;