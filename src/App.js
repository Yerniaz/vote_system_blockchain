import React, { useState, useEffect } from "react"; // Add this line

import "./styles/Home.css";
import {
  useContract,
  useContractWrite,
  useQuery, 
  ConnectWallet,
  useContractRead
} from '@thirdweb-dev/react';
const ethers = require("ethers");


export default function Home() {
  const { contract, refresh } = useContract(
    "0x715763cbF3e9B583380b023320c75de236c8E524",
    
      [
        {
          "inputs": [
            {
              "internalType": "string[]",
              "name": "candidateNames",
              "type": "string[]"
            },
            {
              "internalType": "uint256",
              "name": "_votingStartTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_votingEndTime",
              "type": "uint256"
            }
          ],
          "name": "createVotingSession",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "newEndTime",
              "type": "uint256"
            }
          ],
          "name": "extendVotingPeriod",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_voteCost",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "candidateIndex",
              "type": "uint256"
            }
          ],
          "name": "vote",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "voter",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "candidateIndex",
              "type": "uint256"
            }
          ],
          "name": "Voted",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "withdrawFunds",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "candidates",
          "outputs": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "votes",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "candidateIndex",
              "type": "uint256"
            }
          ],
          "name": "getCandidateName",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getNumCandidates",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "candidateIndex",
              "type": "uint256"
            }
          ],
          "name": "getVotesForCandidate",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getWinner",
          "outputs": [
            {
              "internalType": "string",
              "name": "winnerName",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "winnerVotes",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "owner",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "voteCost",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "votes",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "votingEndTime",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "votingStartTime",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ],
    
  );

  // Assuming you fetch the number of candidates asynchronously
  const [numCandidates, setNumCandidates] = useState(0);
  const { data, isLoading, error } = useContractRead(contract, "getNumCandidates");

  const fetchData = async () => {
    const fetchedNumCandidates = await fetchNumCandidates();
    setNumCandidates(fetchedNumCandidates);


  };

  useEffect(() => {
    
    fetchVotes();
    fetchData();
  }, []); 

   async function fetchNumCandidates(){
    return data;
  }

  const candidates = Array.from({ length: numCandidates }, (_, i) => i);
  const candidatesNames = Array.from({ length: numCandidates }, () => "");
  const [candidatesInput, setCandidatesInput] = useState('');
  const [startTimeInput, setStartTimeInput] = useState('');
  const [endTimeInput, setEndTimeInput] = useState('');
  const [votes, setVotes] = useState([]);


  const { mutateAsync: voteMutateAsync } = useContractWrite(contract, "vote");
  const { mutateAsync: createVotingSessionMutateAsync } = useContractWrite(
    contract,
    "createVotingSession"
  );
  const {data: getCandidateVote} = useContractRead(contract, 'getVotesForCandidate');

  
  const fetchVotes = async (candidateIndex) => {
    // Access data property directly
    
    const votesForCandidate =  getCandidateVote.data(candidateIndex);
      
    return votesForCandidate;
  };
 
  function calc(){
    const votesArray = [];
    for (let i = 0; i < numCandidates; i++) {
      fetchVotes(i).then((votesForCandidate) => {
        votesArray.push(votesForCandidate);
        setVotes([...votesArray]);
      });
    }
  }

  useEffect(() => {
    calc(3);
  }, [contract]);


  async function createVotingSession() {
    const candidateNames = ["Candidate A", "Candidate B", "Candidate C"];
    const votingStartTime = Math.floor(Date.now() / 1000); // Current time in epoch
    const votingEndTime = votingStartTime + 3600; // 1 hour later

    await createVotingSessionMutateAsync({
      args: [candidateNames, votingStartTime, votingEndTime],
    });
    
  }

  function formatTime(epochTime) {
    const date = new Date(epochTime * 1000);
    return date.toLocaleString(); // Adjust the format as needed
  }

  

  async function voteForCandidate(index) {
    try {
      await voteMutateAsync({ args: [index] });
      refresh(); 
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="App">
    <header className="App-header">
      <h1 className="App-title">Voting DApp using BNB Chain Testnet</h1>
      <ConnectWallet theme="dark" modalSize="wide" />
    </header>

    <div className="form-container">
        <div className="btn-group-vertical" style={{ width: "160px" }}>
          <button onClick={() => fetchVotes()} className="btn btn-primary pull-center">
            Refresh
          </button>
        </div>

        <div>
        <div>
          <label>
            Candidates (comma-separated):
            <input
              type="text"
              value={candidatesInput}
              onChange={(e) => setCandidatesInput(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Start Time:
            <input
              type="datetime-local"
              value={startTimeInput}
              onChange={(e) => setStartTimeInput(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            End Time:
            <input
              type="datetime-local"
              value={endTimeInput}
              onChange={(e) => setEndTimeInput(e.target.value)}
            />
          </label>
        </div>

        {/* Create Voting Session button */}
        <button onClick={createVotingSession}>Create Voting Session</button>

        </div>
      </div>
      <div className="votes-container">
          <h2>Votes for Each Candidate</h2>
          <ul>
            {votes.map((vote, index) => (
              <li key={index}>
                Candidate {index + 1}: {vote} votes
              </li>
            ))}
          </ul>
        </div>
    </div>
  );
}