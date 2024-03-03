const request = require("supertest");
const app = require("./index")
const { ethers } = require("ethers");

describe("API tests", () => {
  it("GET /balance/:address - success", async () => {
    const address = "0x459940270370F1710d7955bF4b599298CbaB1783";
    const response = await request(app).get(`/balance/${address}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.balance).toBeDefined();
    expect(response.body.balance).toBe(100);
  });

  it("POST /send - success", async () => {
    const privateKey = 'd7174967549dcfb978ae9f8f3bde909fae300c6f9cbc471a73261d2ef7869e87';
    const sender = "0x459940270370F1710d7955bF4b599298CbaB1783";
    const recipient = "0xD2Bf0137B23d128285a827f3077Db708736b2025";
    const amount = 10;
    const wallet = new ethers.Wallet(privateKey);
    const message = `Transfer ${amount} to ${recipient}`;
    const flatSig = await wallet.signMessage(message);

    const response = await request(app).post("/send").send({
      sender,
      recipient,
      amount,
      signature: flatSig,
      message
    });

    expect(response.statusCode).toBe(200);
});


});
