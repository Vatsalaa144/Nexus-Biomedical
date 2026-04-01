const cron       = require("node-cron");
const Membership = require("../models/Membership");
const { sendRenewalReminder } = require("../services/membershipMailService");

/**
 * Runs every day at 09:00 AM.
 *
 * Finds all annual members whose approvedAt date matches today's date
 * one year ago (same day and month), and who haven't had a reminder sent yet.
 *
 * Example: approved on 2024-03-31 → reminder fires on 2025-03-31
 */
const startRenewalScheduler = () => {
  cron.schedule("0 9 * * *", async () => {
    console.log("🔄 Running annual membership renewal check...");

    try {
      const today = new Date();

      // Build a date window: same calendar day last year (midnight → midnight)
      const windowStart = new Date(
        today.getFullYear() - 1,
        today.getMonth(),
        today.getDate(),
        0, 0, 0, 0
      );
      const windowEnd = new Date(
        today.getFullYear() - 1,
        today.getMonth(),
        today.getDate(),
        23, 59, 59, 999
      );

      // Find annual members approved exactly one year ago who haven't been reminded
      const dueMembers = await Membership.find({
        membershipType:       "annual",
        status:               "approved",
        approvedAt:           { $gte: windowStart, $lte: windowEnd },
        renewalReminderSentAt: null,
      });

      if (dueMembers.length === 0) {
        console.log("✅ No renewal reminders due today.");
        return;
      }

      console.log(`📧 Sending renewal reminders to ${dueMembers.length} member(s)...`);

      for (const member of dueMembers) {
        try {
          await sendRenewalReminder(member);

          // Mark as sent so we don't email them again
          member.renewalReminderSentAt = new Date();
          await member.save();

          console.log(`  ✅ Renewal reminder sent to ${member.email}`);
        } catch (err) {
          // Log individual failure — don't stop the loop
          console.error(`  ❌ Failed for ${member.email}:`, err.message);
        }
      }

    } catch (err) {
      console.error("❌ Renewal scheduler error:", err.message);
    }
  });

  console.log("⏰ Annual renewal reminder scheduler started (runs daily at 09:00 AM).");
};

module.exports = { startRenewalScheduler };
