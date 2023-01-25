const cron = require("node-cron");
const { checkRefundStatus } = require("./checkRefund");
const { RefundModel } = require("../models/refund");
const { sendMail } = require("./email");

cron.schedule("0 * * * *", async () => {
  try {
    const pendingRefunds = await RefundModel.find({
      status: "pending",
    }).populate("user");
    for (const refund of pendingRefunds) {
      const user = refund.user;
      const transactionId = refund.transactionId;
      const paystackRefunds = await checkRefundStatus(transactionId);
      const paystackRefund = paystackRefunds.find(
        (r) => r.transaction === transactionId
      );
      if (paystackRefund.status === "success") {
        refund.status = "success";
        await refund.save();
        user.wallet += refund.amount;
        await user.save();

        sendMail(
          refund.email,
          "Refund Successful",
          `<h1>Your refund of ${refund.amount} was successful.</h1>`
        );
      } else if (paystackRefund.status === "failed") {
        refund.status = "failed";
        await refund.save();
      }
    }
  } catch (error) {
    console.error(error);
  }
});
