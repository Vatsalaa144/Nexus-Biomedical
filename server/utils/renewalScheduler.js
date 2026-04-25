const cron = require("node-cron");
const Membership = require("../models/Membership");
const { sendRenewalReminder } = require("../services/membershipMailService");

/**
 * Runs every day at 09:00 AM IST.
 *
 * Finds annual members whose paidAt date matches today's date one year ago
 * and who have not had this renewal reminder sent yet.
 */
const startRenewalScheduler = () => {
  cron.schedule("0 9 * * *", async () => {
    console.log("Running annual membership renewal check...");

    try {
      const today = new Date();

      const windowStart = new Date(
        today.getFullYear() - 1,
        today.getMonth(),
        today.getDate(),
        0, 0, 0, 0,
      );
      const windowEnd = new Date(
        today.getFullYear() - 1,
        today.getMonth(),
        today.getDate(),
        23, 59, 59, 999,
      );

      const dueMembers = await Membership.find({
        membershipType: "annual",
        status: "payment_confirmed",
        paidAt: { $gte: windowStart, $lte: windowEnd },
        renewalReminderSentAt: null,
      });

      if (dueMembers.length === 0) {
        console.log("No renewal reminders due today.");
        return;
      }

      console.log(`Sending renewal reminders to ${dueMembers.length} member(s)...`);

      for (const member of dueMembers) {
        try {
          await sendRenewalReminder(member);

          member.renewalReminderSentAt = new Date();
          await member.save();

          console.log(`Renewal reminder sent to ${member.email}`);
        } catch (err) {
          console.error(`Failed for ${member.email}:`, err.message);
        }
      }
    } catch (err) {
      console.error("Renewal scheduler error:", err.message);
    }
  }, {
    timezone: "Asia/Kolkata",
  });

  console.log("Annual renewal reminder scheduler started (runs daily at 09:00 AM IST).");
};

module.exports = { startRenewalScheduler };
