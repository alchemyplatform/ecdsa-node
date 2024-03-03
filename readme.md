## ECDSA Node

This project is an example of using a client and server to facilitate transfers between different addresses. Since there is just a single server on the back-end handling transfers, this is clearly very centralized. We won't worry about distributed consensus for this project.

However, something that we would like to incoporate is Public Key Cryptography. By using Elliptic Curve Digital Signatures we can make it so the server only allows transfers that have been signed for by the person who owns the associated address.

### Video instructions
For an overview of this project as well as getting started instructions, check out the following video:

https://www.loom.com/share/0d3c74890b8e44a5918c4cacb3f646c4
 
### Client

The client folder contains a [react app](https://reactjs.org/) using [vite](https://vitejs.dev/). To get started, follow these steps:

1. Open up a terminal in the `/client` folder
2. Run `npm install` to install all the depedencies
3. Run `npm run dev` to start the application 
4. Now you should be able to visit the app at http://127.0.0.1:5173/

### Server

The server folder contains a node.js server using [express](https://expressjs.com/). To run the server, follow these steps:

1. Open a terminal within the `/server` folder 
2. Run `npm install` to install all the depedencies 
3. Run `npm run start` to start server with nodemon*
4. To run tests with coverage use `npm run test:coverage`

The application should connect to the default server port (3042) automatically! 

_Hint_ - Use [nodemon](https://www.npmjs.com/package/nodemon) instead of `node` to automatically restart the server on any changes.


### Example wallets

Private keys and public addresses that are stored in `index.js` on backend, one can generate more using `generate.js` script

```sh
Private Key: d7174967549dcfb978ae9f8f3bde909fae300c6f9cbc471a73261d2ef7869e87
Public Key: 02fcf05d916b4600bd986770d37a5483d8ea0f8140c4e73297e0e7aa7cbaeccf71
toHex: 0x459940270370F1710d7955bF4b599298CbaB1783

Private Key: b1a8527873d6b62a786ab65d59da195c6c4a102a9abd96186b69c40407d2f0d9
Public Key: 02589d1315270a9ae5e46191dc8a46eb36953ab4572e88f707700dd134aa67429b
toHex: 0x1aE9C871e288131414879Aa02550dB90394c4432

Private Key: f2c23bd541a1d6735fdb8a9b0eeaa0a26e5e21aec6c95204359e0456d5df5102
Public Key: 02a3c5b3456fc616ed729504731922b099b994e132897067489eebc5e31c7589d5
toHex: 0xD2Bf0137B23d128285a827f3077Db708736b2025
```