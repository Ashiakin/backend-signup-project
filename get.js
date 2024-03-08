import { DoorDashClient } from "@doordash/sdk";
import "dotenv/config";

const client = new DoorDashClient({
    developer_id: process.env.DEVELOPER_ID,
    key_id: process.env.KEY_ID,
    signing_secret: process.env.SIGNING_SECRET,
});

const response = client
  .getDelivery('c7dafa81-e23d-4074-97e2-fb4b6853af9b')
  .then(response => {
    console.log(response.data);
  })
  .catch(err => {
    console.log(err);
  });

console.log(response)