const cron = require("node-cron");
const { WithdrawalModel } = require("../models/withdrawal");
const { UserModel } = require("../models/user");
const axios = require("axios");

cron.schedule("0 * * * *", async (res) => {
  try {
    // Find all queued withdrawals
    const withdrawals = await WithdrawalModel.find({ status: "queued" });
    // Loop through each withdrawal
    for (const withdrawal of withdrawals) {
      // Check the status of the transfer
      const response = await axios.get(
        `https://api.paystack.co/transfer/${withdrawal.transferCode}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        }
      );
      // Check if the transfer is successful
      if (response.data.data.event === "transfer.success") {
        // Find the user
        const user = await UserModel.findById(withdrawal.user);

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        // Deduct from the wallet
        user.wallet -= withdrawal.amount;

        // Deduct from the wallet
        user.wallet -= withdrawal.amount;
        await user.save();
        // Update the withdrawal status
        withdrawal.status = "success";
        await withdrawal.save();
      } else if (response.data.data.event === "transfer.failed") {
        // Update the withdrawal status
        withdrawal.status = "failed";
        await withdrawal.save();
      } else if (response.data.data.event === "transfer.reversed") {
        // Update the withdrawal status
        withdrawal.status = "reversed";
        await withdrawal.save();
      }
    }
  } catch (error) {
    console.log(error);
  }
});
