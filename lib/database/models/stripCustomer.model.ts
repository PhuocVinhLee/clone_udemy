import { Schema, model, models } from "mongoose";
import { describe } from "node:test";

const StripeCustomerSchema = new Schema({
  userId: {
    type: String,
  },
  stripCustomerId: {
    type: String,
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const StripeCustomer = models?.StripeCustomer || model("StripeCustomer", StripeCustomerSchema);

export default StripeCustomer;
