# MALAC Blockchain API Documentation
This documentation includes endpoint descriptions, sample `curl` commands, and their outputs. 

## Base URL
`http://localhost:3000/api`

## Endpoints

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