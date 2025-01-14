# API Documentation

## Create Wallet
- **Endpoint**: `/api/wallet`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "sender": "0x...",
    "recipient": "0x...",
    "amount": 50
  }
  ```
- **Response**:
  - **Success**: `201 Created`
  - **Error**: `400 Bad Request`

## Send Amount
- **Endpoint**: `/api/wallet/send`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "sender": "0x...",
    "recipient": "0x...",
    "amount": 50,
    "signature": "0x..."
  }
  ```
- **Response**:
  - **Success**: `200 OK`
  - **Error**: `400 Bad Request`, `403 Forbidden`