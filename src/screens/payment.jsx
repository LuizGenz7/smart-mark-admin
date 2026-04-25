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
    <div className="flex items-center justify-center p-6 bg-slate-950">
      <div className="w-full max-w-2xl bg-slate-900 rounded-3xl shadow-2xl p-8 relative overflow-hidden">

        {/* STATUS BADGE */}
        <div
          className={`absolute top-5 right-5 px-3 py-1 rounded-full text-xs font-semibold ${
            isOverdue
              ? "bg-red-500/20 text-red-400"
              : isExpiringSoon
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-green-500/20 text-green-400"
          }`}
        >
          {status}
        </div>

        {/* PLAN HERO SECTION */}
        <div className="text-center mt-2">
          <p className="text-slate-400 text-sm uppercase tracking-widest">
            Subscription Plan
          </p>

          <h1 className="text-5xl font-extrabold text-white mt-2">
            {payment.plan}
          </h1>

          <div className="flex justify-center gap-3 mt-4">
            <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs">
              {meta.plan}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs">
              {meta.cycle}
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-2">
            {payment.cycle} • Auto detected billing structure
          </p>
        </div>

        {/* DATE GRID */}
        <div className="grid grid-cols-2 gap-4 mt-8 text-sm">
          <div className="bg-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-xs">Start Date</p>
            <p className="text-white font-semibold mt-1">
              {payment.paymentStart}
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-xs">Due Date</p>
            <p className="text-white font-semibold mt-1">
              {payment.paymentDue}
            </p>
          </div>
        </div>

        {/* TIME LEFT BIG DISPLAY */}
        <div className="mt-8 text-center bg-slate-800 rounded-2xl py-4">
          <p className="text-slate-400 text-xs uppercase tracking-wider">
            Time Remaining
          </p>

          <p
            className={`text-xl font-bold mt-2 ${
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

        {/* WARNINGS */}
        {isOverdue && (
          <div className="mt-6 bg-red-500/10 text-red-400 text-sm p-4 rounded-xl">
            ⚠ Your subscription has expired. Renew to restore access.
          </div>
        )}

        {isExpiringSoon && !isOverdue && (
          <div className="mt-6 bg-yellow-500/10 text-yellow-400 text-sm p-4 rounded-xl">
            ⏳ Your subscription is ending soon. Consider renewing early.
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;