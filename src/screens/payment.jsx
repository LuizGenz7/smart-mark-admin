import React from "react";
import {
  formatDate,
  getDayDifference,
  getToday,
} from "../utils/date-helpers";
import usePaymentStore from "../stores/payment";
import { detectPlan } from "../utils/pay";

const Payment = () => {
  const payment = usePaymentStore((s) => s.payment);

  if (!payment) return null;

  const meta = detectPlan(payment.paymentStart, payment.paymentDue);

  const today = formatDate(getToday());
  const dueDate = payment.paymentDue;

  const daysRemaining = getDayDifference(today, dueDate);

  const isOverdue = daysRemaining < 0;
  const isExpiringSoon = daysRemaining <= 7 && daysRemaining >= 0;

  let status = "Active";
  if (isOverdue) status = "Overdue";
  else if (isExpiringSoon) status = "Expiring Soon";

  const displayDays = isOverdue
    ? "Expired"
    : daysRemaining === 0
    ? "Due Today"
    : `${daysRemaining} days left`;

  return (
    <div className="min-h-screen bg-slate-950 p-4 flex justify-center">

      <div className="w-full max-w-md space-y-4">

        {/* HEADER CARD */}
        <div className="bg-slate-900 rounded-2xl p-5 relative overflow-hidden">

          {/* STATUS */}
          <div
            className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
              isOverdue
                ? "bg-red-500/20 text-red-400"
                : isExpiringSoon
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-green-500/20 text-green-400"
            }`}
          >
            {status}
          </div>

          <p className="text-slate-400 text-xs uppercase tracking-widest">
            Subscription Plan
          </p>

          <h1 className="text-3xl font-extrabold text-white mt-1">
            {payment.plan}
          </h1>

          <div className="flex gap-2 flex-wrap mt-3">
            <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs">
              {meta.plan}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs">
              {meta.cycle}
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-2">
            {payment.cycle} billing cycle
          </p>
        </div>

        {/* TIME STATUS */}
        <div className="bg-slate-900 rounded-2xl p-5 text-center">

          <p className="text-slate-400 text-xs uppercase tracking-wider">
            Time Remaining
          </p>

          <p
            className={`text-2xl font-bold mt-2 ${
              isOverdue
                ? "text-red-400"
                : isExpiringSoon
                ? "text-yellow-400"
                : "text-green-400"
            }`}
          >
            {displayDays}
          </p>

        </div>

        {/* DATES */}
        <div className="grid grid-cols-2 gap-3">

          <div className="bg-slate-900 rounded-xl p-4">
            <p className="text-slate-400 text-xs">Start</p>
            <p className="text-white font-semibold text-sm mt-1">
              {payment.paymentStart}
            </p>
          </div>

          <div className="bg-slate-900 rounded-xl p-4">
            <p className="text-slate-400 text-xs">Due</p>
            <p className="text-white font-semibold text-sm mt-1">
              {payment.paymentDue}
            </p>
          </div>

        </div>

        {/* WARNING */}
        {isOverdue && (
          <div className="bg-red-500/10 text-red-400 text-sm p-4 rounded-xl">
            ⚠ Your subscription has expired. Please renew to continue using the system.
          </div>
        )}

        {isExpiringSoon && !isOverdue && (
          <div className="bg-yellow-500/10 text-yellow-400 text-sm p-4 rounded-xl">
            ⏳ Your subscription is ending soon. Renew early to avoid interruption.
          </div>
        )}

        {/* CTA BUTTON */}
        <button
          className={`w-full py-3 rounded-xl font-semibold text-white transition ${
            isOverdue
              ? "bg-red-500 hover:bg-red-600"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {isOverdue ? "Renew Now" : "Manage Subscription"}
        </button>

      </div>
    </div>
  );
};

export default Payment;