export function detectPlan(paymentStart, paymentDue) {
  const start = new Date(paymentStart);
  const due = new Date(paymentDue);

  const diffDays = Math.floor((due - start) / (1000 * 60 * 60 * 24));
  const diffMonths = diffDays / 30;

  let cycle = "Unknown";
  let plan = "Basic";
  let indicator = "Undefined";

  // 🔹 very short usage
  if (diffDays <= 7) {
    cycle = "Weekly";
    plan = "Trial";
    indicator = "7-day cycle";
  }

  // 🔹 short course / quick access
  else if (diffDays > 7 && diffDays <= 14) {
    cycle = "Bi-Weekly";
    plan = "Starter";
    indicator = "14-day cycle";
  }

  // 🔹 your original short cycle
  else if (diffDays > 14 && diffDays <= 25) {
    cycle = "Short Cycle";
    plan = "Starter+";
    indicator = "15–25 day cycle";
  }

  // 🔹 monthly standard
  else if (diffDays > 25 && diffDays <= 35) {
    cycle = "Monthly";
    plan = "Basic";
    indicator = "30-day cycle";
  }

  // 🔹 extended monthly
  else if (diffDays > 35 && diffDays <= 60) {
    cycle = "Extended Monthly";
    plan = "Pro";
    indicator = "45–60 day cycle";
  }

  // 🔹 termly (school term style)
  else if (diffDays > 60 && diffDays <= 120) {
    cycle = "Termly";
    plan = "Blaze";
    indicator = "2–4 month cycle";
  }

  // 🔹 semester / long plan
  else if (diffDays > 120 && diffDays <= 200) {
    cycle = "Semester";
    plan = "Premium";
    indicator = "4–6 month cycle";
  }

  // 🔹 yearly
  else if (diffDays > 200) {
    cycle = "Annual";
    plan = "Elite";
    indicator = "6+ month cycle";
  }

  return {
    cycle,
    plan,
    indicator,
    diffDays,
    diffMonths: Number(diffMonths.toFixed(2)),
  };
}