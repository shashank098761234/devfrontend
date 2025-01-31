import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "./utils/constants";

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);

  useEffect(() => {
    verifyPremiumUser();
  }, []);

  const verifyPremiumUser = async () => {
    const res = await axios.get(BASE_URL + "/premium/verify", {
      withCredentials: true,
    });

    if (res.data.isPremium) {
      setIsUserPremium(true);
    }
  };

  const handlePayment = async (paymentType) => {
    const order = await axios.post(
      BASE_URL + "/payment/create",
      { membershipType: paymentType },
      { withCredentials: true }
    );

    const { amount, keyId, currency, notes, orderId } = order.data;

    const options = {
      key: keyId, // Replace with your Razorpay key_id
      amount: amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: currency,
      name: "Dev Tinder",
      description: "Connect to other developer",
      order_id: orderId, // This is the order_id created in the backend
      prefill: {
        name: notes.firstName + " " + notes.lastName,
        email: notes.email,
        contact: "9999999999",
      },
      theme: {
        color: "#F37254",
      },
      handler: verifyPremiumUser,
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return !isUserPremium ? (
    <div className="m-10">
      <div className="flex w-full">
        <div className="card bg-base-300 rounded-box grid h-200 flex-grow place-items-center">
          <h1 className="font-bold text-3xl">Silver membership</h1>
          <button
            onClick={() => handlePayment("silver")}
            className="btn btn-secondary my-5"
          >
            Buy Silver Membership
          </button>
        </div>
        <div className="divider divider-horizontal">OR</div>
        <div className="card bg-base-300 rounded-box grid h-200 flex-grow place-items-center">
          <h1 className="font-bold text-3xl">Gold membership</h1>

          <button
            onClick={() => handlePayment("gold")}
            className="btn btn-primary my-5"
          >
            Buy Gold Membership
          </button>
        </div>
      </div>
    </div>
  ) : (
    "You are premium user"
  );
};

export default Premium;
