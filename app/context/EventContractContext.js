// context/Web3Context.js
"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import EVENT_MANAGMENT_ABI from "../../artifacts/contracts/EventManegmentContract.sol/EventManagement.json";
import { Loader } from 'semantic-ui-react';

const CONTRACT_ADDRESS = "0x94d92F12598165389047320086B9640Eb2681fFf";

const EventManagementContext = createContext();

export const useEventManagementContext = () => useContext(EventManagementContext);


const EventManagementContextProvider = ({ children }) => {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [eventManagementContract, setEventManagementContract] = useState(null);

  useEffect(() => {
    connectToContract();
  }, []);

  const connectToContract = async () => {
    if (window.ethereum && !connecting) {
      setConnecting(true);

      try {
        // get accounts associtated with wallet
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // const provider = new ethers.BrowserProvider(window.ethereum);

        const signer = provider.getSigner();

        // get contract details
        const data = new ethers.Contract(CONTRACT_ADDRESS, EVENT_MANAGMENT_ABI.abi, signer);
        console.log('contract data: ', data);

        setProvider(provider);
        setSigner(signer);
        setEventManagementContract(data);

      } catch (error) {
        console.log("Error fetching data from contract", error);
        setError(error);
      }

      setConnecting(false);
    } 
  }

  return (
    <EventManagementContext.Provider value={{ provider, signer, account, eventManagementContract }}>
        {error ? (
            <div><h1>Error in connecting</h1></div>
        ) : connecting ? (
            <div>
                <Loader />
            </div>
        ) : children }
    </EventManagementContext.Provider>
  );
};

export default EventManagementContextProvider;
