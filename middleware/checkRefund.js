import axios from "axios";

export const checkRefundStatus = async (transactionId) => {
  try {
    const { data } = await axios.get(`https://api.paystack.co/refund`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
      params: {
        transaction: transactionId,
      },
    });
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Error checking refund status");
  }
};
