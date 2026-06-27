export const stripeAutoTopUpAttempt = sqliteTable("stripe_auto_top_up_attempt", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  stripeInvoiceId: text("stripe_invoice_id").unique(),
  amountUsd: integer("amount_usd").notNull(),
  status: text("status").notNull(),
  failureReason: text("failure_reason"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .defaultNow()
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  completedAt: integer("completed_at", { mode: "timestamp" }),
}, (table) => [
  index("idx_stripe_auto_top_up_attempt_user_id").on(table.userId),
  index("idx_stripe_auto_top_up_attempt_status").on(table.status),
]);

export const stripeCheckoutCredits = sqliteTable("stripe_checkout_credits", {
  sessionId: text("session_id").primaryKey(),
  eventId: text("event_id").notNull(),
  eventType: text("event_type").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  pollenCredited: real("pollen_credited").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .defaultNow()
    .notNull(),
}, (table) => [
  index("idx_stripe_checkout_credits_user_id").on(table.userId),
]);

export const rewards = sqliteTable("rewards", {
  id: text("id").primaryKey(),
  // Idempotency guard. Encodes the quest's completion scope, e.g.
  // "quest:{issue}" or "quest:{questId}:user:{userId}".
  idempotencyKey: text("idempotency_key").notNull().unique(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  // Catalog id of the quest that was earned; null for one-off rewards.
  questId: text("quest_id"),
  // Quest title snapshotted when earned, so history renders it directly.
  title: text("title").notNull(),
  // Optional quest link snapshotted when earned.
  url: text("url"),
  pollenAmount: real("pollen_amount").notNull(),
  // Which balance bucket will be credited when claimed: "tier" or "pack".
  balanceBucket: text("balance_bucket").notNull(),
  earnedAt: integer("earned_at", { mode: "timestamp" })
    .defaultNow()
    .notNull(),
  claimedAt: integer("claimed_at", { mode: "timestamp" }),
}, (table) => [
  index("idx_rewards_user_id").on(table.userId),
]);
