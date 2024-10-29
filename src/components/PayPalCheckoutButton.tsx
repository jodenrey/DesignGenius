import React from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

interface PayPalCheckoutButtonProps {
  credits: number;
  price: number;
}

const PayPalCheckoutButton: React.FC<PayPalCheckoutButtonProps> = ({ credits, price }) => {
  const handleApprove = (data: any, actions: any) => {
    if (actions.order) {
      return actions.order.capture().then((details: any) => {
        alert(`Transaction completed by ${details.payer.name.given_name}`);
        // Call your API to finalize the transaction and add credits to the user's account
      });
    } else {
      console.error("Order actions not defined");
    }
  };

  return (
    <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! }}>
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: (price / 100).toFixed(2), // Convert cents to PHP format
                },
              },
            ],
          });
        }}
        onApprove={handleApprove}
        onError={(error) => {
          console.error("PayPal error:", error);
          alert("An error occurred during the transaction.");
        }}
        style={{ layout: "vertical", color: "blue", shape: "rect", label: "paypal" }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalCheckoutButton;
