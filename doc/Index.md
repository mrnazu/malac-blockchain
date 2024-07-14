# MALAC Blockchain API Documentation

This documentation includes endpoint descriptions, sample `curl` commands, and their outputs. 

## Table of Contents

1. [Base URL](#base-url)
2. [Blockchain API Endpoints](#blockchain-api-endpoints)
    - [Get the Entire Blockchain](#1-get-the-entire-blockchain)
    - [Get a Specific Block by Index](#2-get-a-specific-block-by-index)
    - [Create a New Transaction](#3-create-a-new-transaction)
    - [Mine a New Block](#4-mine-a-new-block)
    - [Get the Balance of a Specific Address](#5-get-the-balance-of-a-specific-address)
    - [Get the List of Pending Transactions](#6-get-the-list-of-pending-transactions)
    - [Get the Current Mining Difficulty](#7-get-the-current-mining-difficulty)
3. [Node Network API Endpoints](#node-network-api-endpoints)
    - [Add a Peer](#1-add-a-peer)
    - [Sync Blockchain Data](#2-sync-blockchain-data)
    - [Get Node Status](#3-get-node-status)
    - [Get List of Peers](#4-get-list-of-peers)
    - [Remove a Peer](#5-remove-a-peer)

---

## Base URL
`http://localhost:3000/api`

---

## Blockchain API Endpoints

### 1. Get the Entire Blockchain

**Endpoint:** `/blockchain`  
**Method:** `GET`  
**Description:** Retrieves the entire blockchain.

#### Curl Command
```sh
curl http://localhost:3000/api/blockchain
```

#### Response
```json
[
  {
    "index": 0,
    "timestamp": 1720718222985,
    "transactions": [],
    "nonce": "0x0",
    "hash": "0x0",
    "prvHash": "0x0"
  }
]
```

### 2. Get a Specific Block by Index

**Endpoint:** `/block/{index}`  
**Method:** `GET`  
**Description:** Retrieves a specific block by its index.

#### Curl Command
```sh
curl http://localhost:3000/api/block/1
```

#### Response (Block not found)
```sh
Block not found
```

Remember: Block 0 still works since we've added the genesis block to our code.

#### Response (Block found)
```json
{
  "index": 1,
  "timestamp": 1720718403762,
  "transactions": [
    {
      "amount": 100,
      "sender": "Sami",
      "recipient": "Nazi"
    }
  ],
  "nonce": 48880,
  "hash": "0000f8f997df8ac01102c682ea9034261b1f75741dfd7e0132cddeeadb6f3a2e",
  "prvHash": "0x0"
}
```

### 3. Create a New Transaction

**Endpoint:** `/transaction`  
**Method:** `POST`  
**Description:** Creates a new transaction and adds it to the list of unconfirmed transactions.

#### Curl Command
```sh
curl -X POST -H "Content-Type: application/json" -d '{"amount":100, "sender":"Sami", "recipient":"Nazi"}' http://localhost:3000/api/transaction
```

#### Response
```json
{
  "message": "Transaction will be added in block 1"
}
```

### 4. Mine a New Block

**Endpoint:** `/mine`  
**Method:** `GET`  
**Description:** Mines a new block by finding a valid nonce and hash that meet the difficulty criteria, then adds the block to the blockchain.

#### Curl Command
```sh
curl http://localhost:3000/api/mine
```

#### Response
```json
{
  "message": "New block mined successfully",
  "block": {
    "index": 1,
    "timestamp": 1720718403762,
    "transactions": [
      {
        "amount": 100,
        "sender": "Sami",
        "recipient": "Nazi"
      }
    ],
    "nonce": 48880,
    "hash": "0000f8f997df8ac01102c682ea9034261b1f75741dfd7e0132cddeeadb6f3a2e",
    "prvHash": "0x0"
  }
}
```

### 5. Get the Balance of a Specific Address

**Endpoint:** `/balance/{address}`  
**Method:** `GET`  
**Description:** Retrieves the balance of a specific address.

#### Curl Command
```sh
curl http://localhost:3000/api/balance/Sami
```

#### Response
```json
{
  "address": "Sami",
  "balance": -100
}
```

### 6. Get the List of Pending Transactions

**Endpoint:** `/pending-transactions`  
**Method:** `GET`  
**Description:** Retrieves the list of pending transactions.

#### Curl Command
```sh
curl http://localhost:3000/api/pending-transactions
```

#### Response
```json
[]
```

### 7. Get the Current Mining Difficulty

**Endpoint:** `/difficulty`  
**Method:** `GET`  
**Description:** Retrieves the current mining difficulty.

#### Curl Command
```sh
curl http://localhost:3000/api/difficulty
```

#### Response
```json
{
  "difficulty": 4
}
```

---

## Node Network API Endpoints

### 1. Add a Peer

**Endpoint**: `POST /add-peer`  
**Description**: Adds a new peer to the node's peer list.

**Request**:
```sh
curl -X POST http://localhost:3001/add-peer -H "Content-Type: application/json" -d '{"peer": "http://localhost:3002"}'
```

**Response**:
```json
{
  "message": "Peer http://localhost:3002 added successfully"
}
```

**Notes**:
- This endpoint adds the specified peer to the node's list of peers if it is not already present.

### 2. Sync Blockchain Data

**Endpoint**: `POST /sync`  
**Description**: Syncs the blockchain data from a peer.

**Request**:
```sh
curl -X POST http://localhost:3001/sync -H "Content-Type: application/json" -d '{"chain": [{"index": 1, "previousHash": "0", "timestamp": 1633000000000, "data": "Genesis block", "hash": "abcd1234"}]}'
```

**Response**:
```json
{
  "message": "Data received successfully"
}
```

**Notes**:
- This endpoint allows a node to receive and process blockchain data from another peer. The `chain` parameter should be an array representing the blockchain.

### 3. Get Node Status

**Endpoint**: `GET /status`  
**Description**: Retrieves the status of the node, including the port and list of peers.

**Request**:
```sh
curl -X GET http://localhost:3001/status
```

**Response**:
```json
{
  "port": "3001",
  "peers": [
    "http://localhost:3001",
    "http://localhost:3003",
    "http://localhost:3002"
  ]
}
```

**Notes**:
- This endpoint provides the current status of the node, including the port number and the list of connected peers.

### 4. Get List of Peers

**Endpoint**: `GET /peers`  
**Description**: Retrieves the list of all peers connected to the node.

**Request**:
```sh
curl -X GET http://localhost:3001/peers
```

**Response**:
```json
[
  "http://localhost:3001",
  "http://localhost:3003",
  "http://localhost:3002"
]
```

**Notes**:
- This endpoint returns an array of peer URLs that the node is connected to.

### 5. Remove a Peer

**Endpoint**: `DELETE /remove-peer`  
**Description**: Removes a specified peer from the node's peer list.

**Request**:
```sh
curl -X DELETE http://localhost:3001/remove-peer -H "Content-Type: application/json" -d '{"peer": "http://localhost:3002"}'
```

**Response**:
```json
{
  "message": "Peer http://localhost:3002 removed successfully"
}
```

**Notes**:
- This endpoint removes the specified peer from the node’s list if it exists.