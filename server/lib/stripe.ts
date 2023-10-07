import Stripe from "stripe"
const STRIPE_API_KEY ='sk_test_51LsUcmSFOJuxojaiebwJDXaPFXUUZQNU5VVRfAa0UaYd7cjWuRDkZpaG9Nbsl4bh8NsQfeYeZxd15Ea6OuYbP5E800GiRNyAMW' 
export const stripe = new Stripe(STRIPE_API_KEY!, {
  apiVersion: "2023-08-16",
  typescript: true,
});
