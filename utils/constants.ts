import { isDev } from "./helpers";

export const pricingPlans = [
  {
    name: "Basic",
    price: 49,
    description: "Perfect for occasional use",
    items: [
      "5 PDF summaries per month",
      "Standard processing speed",
      "Email support",
    ],
    id: "basic",
    paymentLink: isDev ? "https://buy.stripe.com/test_3cscMQcF8548gz6cMM" : "",
    priceId: isDev ? "price_1RA9yVCTlpmJdURCo5eDA5T5" : "",
  },
  {
    name: "Pro",
    price: 129,
    description: "For professionals and teams",
    items: [
      "Unlimited PDF summaries",
      "Priority processing",
      "24/7 priority support",
      "Markdown Export",
    ],
    id: "pro",
    paymentLink: isDev ? "https://buy.stripe.com/test_28o7sw7kO7cg6Yw7st" : "",
    priceId: isDev ? "price_1RA9yVCTlpmJdURCk8Oi1pwO" : "",
  },
];
