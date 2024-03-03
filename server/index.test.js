const request = require("supertest");
const app = require("./index");
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
    const privateKey =
      "d7174967549dcfb978ae9f8f3bde909fae300c6f9cbc471a73261d2ef7869e87";
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
      message,
    });

    expect(response.statusCode).toBe(200);
  });

  it("POST /send - fails without signature", async () => {
    const sender = "0x459940270370F1710d7955bF4b599298CbaB1783";
    const recipient = "0xD2Bf0137B23d128285a827f3077Db708736b2025";
    const amount = 10;
    const message = `Transfer ${amount} to ${recipient}`;

    const response = await request(app).post("/send").send({
      sender,
      recipient,
      amount,
      // Omitting signature
      message,
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Signature or message not provided.");
  });
});

it("POST /send - fails without message", async () => {
  const privateKey =
    "d7174967549dcfb978ae9f8f3bde909fae300c6f9cbc471a73261d2ef7869e87";
  const sender = "0x459940270370F1710d7955bF4b599298CbaB1783";
  const recipient = "0xD2Bf0137B23d128285a827f3077Db708736b2025";
  const amount = 10;
  const wallet = new ethers.Wallet(privateKey);
  const flatSig = await wallet.signMessage(
    `Transfer ${amount} to ${recipient}`
  );

  const response = await request(app).post("/send").send({
    sender,
    recipient,
    amount,
    signature: flatSig,
    // Omitting message
  });

  expect(response.statusCode).toBe(400);
  expect(response.body.message).toBe("Signature or message not provided.");
});

it("POST /send - fails with insufficient funds", async () => {
  const privateKey =
    "d7174967549dcfb978ae9f8f3bde909fae300c6f9cbc471a73261d2ef7869e87";
  const sender = "0x459940270370F1710d7955bF4b599298CbaB1783";
  const recipient = "0xD2Bf0137B23d128285a827f3077Db708736b2025";
  const amount = 150; // More than the sender has
  const wallet = new ethers.Wallet(privateKey);
  const message = `Transfer ${amount} to ${recipient}`;
  const flatSig = await wallet.signMessage(message);

  const response = await request(app).post("/send").send({
    sender,
    recipient,
    amount,
    signature: flatSig,
    message,
  });

  expect(response.statusCode).toBe(400);
  expect(response.body.message).toBe("Not enough funds!");
});

it("POST /send - fails with signature verification failed", async () => {
  const privateKey =
    "d7174967549dcfb978ae9f8f3bde909fae300c6f9cbc471a73261d2ef7869e87";
  const wrongSender = "0x459940270370F1710d7955bF4b599298CbaB1783";
  const recipient = "0xD2Bf0137B23d128285a827f3077Db708736b2025";
  const amount = 10;
  const wallet = new ethers.Wallet(privateKey);

  const message = `Transfer ${amount} to ${recipient} from the wrong sender`;
  const flatSig = await wallet.signMessage(message);

  const response = await request(app)
    .post("/send")
    .send({
      sender: wrongSender,
      recipient,
      amount,
      signature: flatSig,
      message: `Transfer ${amount} to ${recipient} some different message`,
    });

  expect(response.statusCode).toBe(403);
  expect(response.body.message).toBe("Signature verification failed.");
});
