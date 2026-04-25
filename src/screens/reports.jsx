import React, { useMemo, useState } from "react";
import PrimaryButon from "../components/PrimaryButon";
import { buildWeeklyAttendance } from "../utils/build-report";

/* ================= TEST DATA ================= */

const STATUSES = ["P", "A", "S", "H"];

const randomStatus = () =>
  STATUSES[Math.floor(Math.random() * STATUSES.length)];

const generatePupils = (count = 50) =>
  Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    name: `Student ${i + 1}`,
  }));

const getAllDates = (start, end) => {
  const dates = [];
  const current = new Date(start);
  const last = new Date(end);

  while (current <= last) {
    dates.push(new Date(current).toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

const pupils = generatePupils(50);
const dates = getAllDates("2026-01-11", "2026-04-10");

const fullTermMock = {
  termDuration: {
    start: "2026-01-11",
    end: "2026-04-10",
  },

  records: dates.map((date) => ({
    date,
    data: pupils.map((p) => ({
      id: p.id,
      name: p.name,
      status: randomStatus(),
    })),
  })),
};

const Reports = () => {
  const [active, setActive] = useState(null);
  const [showTable, setShowTable] = useState(false);

  const data = Array.from({ length: 10 }).map((_, i) => ({
    grade: `Grade ${i + 1}`,
    term: "Term 1",
  }));

  function handleSelect(grade, term) {
    setActive({ grade, term });
    setShowTable(false);
  }

  const reportData = useMemo(() => {
    if (!showTable) return null;
    return buildWeeklyAttendance(fullTermMock);
  }, [showTable]);

  /* ================= PRINT FUNCTION ================= */
  const handlePrint = () => {
    const el = document.getElementById("print-area");
    const title = document.getElementById("term-title");
    if (!el) return;

    const win = window.open("", "_blank");

    win.document.write(`
      <html>
        <head>
          <title>Attendance Report</title>
          <style>
            body {
              font-family: Arial;
              padding: 20px;
              
            }
             h2,h4 {
             text-align: center;
             }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            th, td {
              border: 1px solid #999;
              padding: 5px;
              text-align: center;
              font-size: 10px;
            }

            th {
              background: #111;
              color: white;
            }

            .text-green { color: green; }
            .text-red { color: red; }
            .text-gray { color: gray; }

          </style>
        </head>
        <body>
        <h2>${title.innerHTML}</h2>
          ${el.innerHTML}
        </body>
      </html>
    `);

    win.document.close();
    win.focus();

    setTimeout(() => {
      win.print();
      win.close();
    }, 300);
  };

  const renderTable = (weeks, title) => (
    <div className="mb-10 bg-slate-900 rounded-xl p-4">
      {title && (
        <h4 className="text-slate-500 text-center font-bold mb-3">{title}</h4>
      )}

      <div className="border border-slate-700 rounded-lg px-1 py-2">
        <table className="w-full   text-center text-[10px]">
          {/* HEADER */}
          <thead>
            <tr>
              <th className="px-2" rowSpan={2} style={{ textAlign: "left" }}>
                <div className="border border-orange-900 rounded-sm h-full py-4 px-2 w-full">
                  Student
                </div>
              </th>

              {weeks.map((week) => (
                <th className="px-1" key={week.week} colSpan={week.days.length}>
                  <div className="border border-orange-900 py-1 rounded-sm">
                    W{week.week}
                  </div>
                </th>
              ))}
            </tr>

            <tr>
              {weeks.map((week) =>
                week.days.map((d) => (
                  <th className="py-1 px-px" key={d.date}>
                    <div className="border border-orange-900 py-1 rounded-sm">
                      {d.day}
                    </div>
                  </th>
                )),
              )}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {reportData.pupils.map((pupil) => (
              <tr key={pupil.id}>
                <td className="px-2 pb-0.5" style={{ textAlign: "left" }}>
                  <div className="border border-orange-900 py-1 px-2 rounded-sm">
                    {pupil.name}
                  </div>
                </td>

                {weeks.map((week) =>
                  week.days.map((d) => {
                    const status =
                      reportData.attendanceMap?.[d.date]?.[pupil.id];

                    return (
                      <td className="size-6 p-0.5" key={d.date}>
                        <div
                          className={`w-full flex items-center justify-center h-full rounded-sm
                          ${
                            status === "P"
                              ? "bg-green-500"
                              : status === "A"
                                ? "bg-red-500"
                                : status === "S"
                                  ? "bg-orange-500"
                                  : status === "H"
                                    ? "bg-blue-500"
                                    : "bg-gray-500/30"
                          }
                        `}
                        >
                          {status || "-"}
                        </div>
                      </td>
                    );
                  }),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col space-y-6">
      {/* TITLE */}
      <p className="text-xl font-bold text-slate-500 text-center">
        Generate Reports
      </p>

      {/* CLASS GRID */}
      <div className="grid grid-cols-3 gap-4">
        {data.map((item) => {
          const isActive =
            active?.grade === item.grade && active?.term === item.term;

          return (
            <div
              key={item.grade}
              className="flex items-center justify-between bg-slate-900 p-4 rounded-xl"
            >
              <p className="text-lg font-semibold text-orange-500">
                {item.grade}
              </p>

              <button
                onClick={() => handleSelect(item.grade, item.term)}
                className={`px-4 cursor-pointer py-2 rounded-lg text-sm ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : "bg-slate-800 text-slate-300"
                }`}
              >
                {item.term}
              </button>
            </div>
          );
        })}
      </div>

      {/* GENERATE */}
      <PrimaryButon
        text={
          active?.grade ? `Generate Report For ${active.grade}` : "Select Class"
        }
        action={() => setShowTable(true)}
      />

      {/* PRINT BUTTON */}
      {showTable && reportData && (
        <button
          onClick={handlePrint}
          className="bg-green-600 text-white px-4 py-2 rounded-lg w-fit"
        >
          Print Report
        </button>
      )}

      {/* TABLE SPLIT */}
      {showTable &&
        reportData &&
        (() => {
          const mid = Math.ceil(reportData.weeks.length / 2);

          return (
            <>
              <h1
                id="term-title"
                className="text-orange-400 font-bold mb-3 text-center"
              >
                FORM 2C TERM 2
              </h1>
              <div id="print-area" className="">
                {renderTable(reportData.weeks.slice(0, mid), "Weeks 1 - Mid")}

                {renderTable(reportData.weeks.slice(mid), "Weeks Mid - End")}
              </div>
            </>
          );
        })()}
    </div>
  );
};

export default Reports;
