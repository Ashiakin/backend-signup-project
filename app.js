import express from "express";
const app = express();
const port = 3000;
import path from "path";
import {fileURLToPath} from "url";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";
import { DoorDashClient } from "@doordash/sdk";
import session from "express-session";

app.use(express.urlencoded({extended : false}))
app.use(express.json())


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, (err)=> {
    if(err){
        return console.log("ERROR", err);
    }
    console.log(`App listening on port ${port}`);
});

app.use(express.static(__dirname + "/public"));

app.set("view engine", "pug")

app.get("/order", (req, res) =>{
    res.render("order")
})

app.post("/get-delivery-rate", async (req, res) => {
    const client = new DoorDashClient({
        developer_id: process.env.DEVELOPER_ID,
        key_id: process.env.KEY_ID,
        signing_secret: process.env.SIGNING_SECRET,
    });

    const response = await client.deliveryQuote({
        external_delivery_id: uuidv4(),
        pickup_address: "11 Madison Ave, New York, NY 10010",
        pickup_phone_number: "+16505555555",
        pickup_business_name: "VTX",
        dropoff_address: `${req.body.street}, ${req.body.city} ${req.body.zipcode}` ,
        dropoff_phone_number: req.body.dropoff_phone_number,
        dropoff_contact_given_name: req.body.dropoff_contact_given_name,
        dropoff_contact_family_name: req.body.dropoff_contact_family_name,
        order_value: req.body.order_value,
    });

    res.send(response);
    console.log("QUOTE", response)
})

app.post("/create-delivery", async (req, res) => {
    const client = new DoorDashClient({
        developer_id: process.env.DEVELOPER_ID,
        key_id: process.env.KEY_ID,
        signing_secret: process.env.SIGNING_SECRET,
    });

    const response = await client.deliveryQuoteAccept(
        "69025bf1-cd48-45c7-8d67-823bc5de9b52"
        //session storage solution for external delivery id without having to copy paste from terminal
    );

    

    const clothingTotal = (response.data.order_value / 100).toFixed(2)
    const feeTotal = (response.data.fee / 100).toFixed(2)
    const orderTotal = Number(clothingTotal) + Number(feeTotal)

    const data = {
        clothingTotal: clothingTotal,
        feeTotal: feeTotal,
        orderTotal: orderTotal
    }


    res.render("order", {
    
    clothingTotal: data.clothingTotal,
    feeTotal: data.feeTotal,
    orderTotal: data.orderTotal,
    }
    );
    console.log("ACCEPT", response);

})