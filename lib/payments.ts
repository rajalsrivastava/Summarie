import Stripe from "stripe";
import { getDbConnection } from "./db";

export async function handleCheckoutSessionCompleted({
  session,
  stripe,
}: {
  session: Stripe.Checkout.Session;
  stripe: Stripe;
}) {
  console.log("Checkout session completed", session);
  const customerId = session.customer as string;
  const customer = await stripe.customers.retrieve(customerId);
  const priceId = session.line_items?.data[0].price?.id;

  if ("email" in customer && priceId) {
    const { email, name } = customer;

    const sql = await getDbConnection();

    await createOrUpdateUser({
      sql,
      email: email as string,
      full_name: name as string,
      customer_id: customerId,
      priceId: priceId as string,
      status: "active",
    });
    await createPayment({
      sql,
      session,
      priceId: priceId as string,
      userEmail: email as string,
    });
  }
}

async function createOrUpdateUser({
  sql,
  email,
  full_name,
  customer_id,
  priceId,
  status,
}: {
  sql: any;
  email: string;
  full_name: string;
  customer_id: string;
  priceId: string;
  status: string;
}) {
  try {
    const user = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (user.length === 0) {
      await sql`INSERT INTO users (email, full_name, customer_id,price_id, status) VALUES (${email}, ${full_name}, ${customer_id}, ${priceId}, ${status})`;
    }
  } catch (error) {
    console.log("Error creating or updating user", error);
  }
}

async function createPayment({
  sql,
  session,
  priceId,
  userEmail,
}: {
  sql: any;
  session: Stripe.Checkout.Session;
  priceId: string;
  userEmail: string;
}) {
  try {
    const { amount_total, id, customer_email, status } = session;
    await sql`INSERT INTO payments (amount, status, stripe_payment_id,price_id,user_email) VALUES (${amount_total}, ${status}, ${id}, ${priceId}, ${userEmail})`;
  } catch (error) {
    console.log("Error creating payment", error);
  }
}

export async function handleSubscriptionDeleted({
  subscriptionId,
  stripe,
}: {
  subscriptionId: string;
  stripe: Stripe;
}) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const sql = await getDbConnection();

    await sql`UPDATE users SET status = 'cancelled' WHERE customer_id = ${subscription.customer}`;
    console.log("Subscription canceled successfully");
  } catch (error) {
    console.log("Error handling subscription deleted", error);
    throw error;
  }
}
