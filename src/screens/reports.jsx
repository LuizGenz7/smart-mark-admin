import React, { useEffect, useMemo, useState } from "react";
import PrimaryButon from "../components/PrimaryButon";
import { buildWeeklyAttendance } from "../utils/build-report";
import useClassStore from "../stores/classes";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../stores/auth";
import useTermStore from "../stores/terms";
import { useDrawerStore } from "../stores/drawer";

/* ================= COMPONENT ================= */

const Reports = () => {
  const [fetchedData, setFetchedData] = useState(null);

  const [selectedFetch, setSelectedFetch] = useState(null);
  const classes = useClassStore((s) => s.classes);
  const fetchTerms = useClassStore((s) => s.fetchTerms);
  const fetchAttendanceData = useClassStore((s) => s.fetchAttendanceData);
  const [activeId, setActiveId] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const toggleCollapsed = useDrawerStore((s) => s.forceClose);
  const user = useAuth((s) => s.user);
  const terms = useTermStore((s) => s.terms);
  // Attendance data
  const [attendanceData, setAttendanceData] = useState(null);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const handleFetchTerms = async (classId) => {
    try {
      const now = Date.now();

      // existing cache entry
      const cachedEntry = fetchedData?.[classId];

      // check if valid cache exists
      if (
        cachedEntry &&
        cachedEntry.data &&
        cachedEntry.timestamp &&
        now - cachedEntry.timestamp < CACHE_DURATION
      ) {
        setSelectedFetch({ classId, terms: cachedEntry.data });
        return; // still fresh, no fetch needed
      }

      const terms = await fetchTerms(user?.schoolId, classId);
      setSelectedFetch({ classId, terms });
      setFetchedData((prev) => ({
        ...prev,
        [classId]: {
          data: terms,
          timestamp: now,
        },
      }));
    } catch (error) {}
  };

  const handleAttendanceFetch = async (classId, term) => {
    try {
      const isFound = terms.find(
        (t) => (t.id.split("_")[0] || t.activeTerm) === term,
      );
      if (!isFound) {
        return;
      }
      const { sortedData, pupils } = await fetchAttendanceData(
        user?.schoolId,
        classId,
        isFound,
      );
      const final = buildWeeklyAttendance(sortedData, pupils);
      toggleCollapsed();
      setAttendanceData(final);
      setShowTable(true);
    } catch (error) {}
  };

  /* ================= PRINT ================= */

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
            body { font-family: Arial; padding: 20px; }
            h2 { text-align: center; }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            th, td {
              border: 1px solid #999;
              padding: 5px;
              text-align: center;
              font-size: 10px;
              text-transform: uppercase;
            }

            th {
              background: #111;
              color: white;
            }
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

  /* ================= TABLE ================= */

  const renderTable = (weeks, title, pupils, attendanceMap) => {
    const getStatus = (d, pupilId) => {
      const value = attendanceMap?.[d.date]?.[pupilId];
      return value && value[0] ? value[0].toLowerCase() : "-";
    };

    const getStatusClass = (status) => {
      switch (status) {
        case "p":
          return "bg-green-500";
        case "a":
          return "bg-red-500";
        case "s":
          return "bg-orange-500";
        case "h":
          return "bg-blue-500";
        default:
          return "bg-gray-500";
      }
    };

    return (
      <div className="mb-10 bg-slate-900 rounded-xl p-4">
        <h4 className="text-slate-400 text-center font-bold mb-3">{title}</h4>

        <div className="border p-2 border-slate-700 rounded-sm overflow-x-auto">
          <table className="w-full text-center text-[10px]">
            <thead>
              <tr>
                <th rowSpan={2} className="text-left pr-2">
                  <div className="border  border-slate-700 rounded-sm flex items-center px-2 text-lg h-9 w-full">
                    Student
                  </div>
                </th>

                {weeks.map((week) => (
                  <th key={week.week} colSpan={week.days.length}>
                    W{week.week}
                  </th>
                ))}
              </tr>

              <tr className="">
                {weeks.flatMap((week) =>
                  week.days.map((d) => (
                    <th className="p-0.5 size-6" key={`${week.week}-${d.date}`}>
                      <div className="border  border-slate-700 w-full size-5 flex items-center justify-center rounded-sm">
                        {d.day}
                      </div>
                    </th>
                  )),
                )}
              </tr>
            </thead>

            <tbody>
              {pupils.map((pupil) => (
                <tr className="" key={pupil.id}>
                  <td className="text-left  pr-2 py-1 h-6">
                    <div className="border  border-slate-700 h-5 flex items-center px-2 rounded-sm">
                      {pupil.name}
                    </div>
                  </td>

                  {weeks.flatMap((week) =>
                    week.days.map((d) => {
                      const status = getStatus(d, pupil.id);

                      return (
                        <td
                          className="p-0.5 size-6"
                          key={`${pupil.id}-${week.week}-${d.date}`}
                        >
                          <div
                            className={`uppercase flex items-center justify-center size-5 rounded-sm text-white ${getStatusClass(
                              status,
                            )}`}
                          >
                            {status}
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
  };

  /* ================= UI ================= */

  return (
    <div className="flex flex-col space-y-6">
      {/* TITLE */}
      <p className="text-xl font-bold text-slate-400 text-center">
        Generate Reports
      </p>

      {/* GRID */}
      <div className="grid grid-cols-3 gap-4 items-start">
        {classes.map((cls) => {
          const isOpen = activeId === cls.id;

          return (
            <div
              key={cls.id}
              className="bg-slate-900 max-w-xs rounded-xl p-4 flex flex-col h-fit"
            >
              {/* HEADER */}
              <button
                onClick={() => {
                  setActiveId(isOpen ? null : cls.id);
                  if (!isOpen) handleFetchTerms(cls.id);
                }}
                className="flex items-center justify-between w-full"
              >
                <p className="text-orange-500 font-semibold text-lg">
                  {cls.name}
                </p>

                <ChevronDownIcon
                  className={`size-5 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-orange-500" : "text-slate-400"
                  }`}
                />
              </button>

              {/* DROPDOWN */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-64 opacity-100 mt-3" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-xs text-orange-500 mb-2">
                  Available Term Data
                </p>

                {selectedFetch?.classId === cls.id ? (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedFetch.terms.map((c) => (
                      <div
                        key={c}
                        onClick={() => {
                          const data = { classId: cls.id, term: c };
                          setSelectedData(data);
                        }}
                        className={`${selectedData?.classId === cls.id && selectedData?.term === c ? "bg-orange-500" : "bg-slate-800"} p-3 rounded-lg cursor-pointer active:bg-slate-800/60`}
                      >
                        <p
                          className={`text-center ${selectedData?.classId === cls.id && selectedData?.term === c ? "text-slate-100" : "text-orange-500"} text-sm font-medium`}
                        >
                          {c}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-center text-slate-100">
                    Fetching Data...
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ACTION BUTTON */}
      <div className="w-full justify-center">
        <PrimaryButon
          extra="max-w-2xl "
          text={
            selectedData
              ? `Generate Report for ${selectedData.classId} Term-${selectedData.term}`
              : "Select Class Term"
          }
          action={() =>
            handleAttendanceFetch(selectedData.classId, selectedData.term)
          }
        />
      </div>

      {/* PRINT */}
      {showTable && attendanceData && (
        <button
          onClick={handlePrint}
          className="bg-green-600 text-white px-4 py-2 rounded-lg w-fit"
        >
          Print Report
        </button>
      )}

      {/* TABLE */}
      {showTable && attendanceData ? (
        <>
          <h1
            id="term-title"
            className="text-orange-400 font-bold text-center mb-3"
          >
            FORM 2C TERM 2
          </h1>

          <div id="print-area">
            {(() => {
              const mid = Math.ceil(attendanceData.weeks.length / 2);

              return (
                <>
                  {renderTable(
                    attendanceData.weeks.slice(0, mid),
                    "Weeks 1 - Mid",
                    attendanceData.pupils,
                    attendanceData.attendanceMap,
                  )}
                  {renderTable(
                    attendanceData.weeks.slice(mid),
                    "Weeks Mid - End",
                    attendanceData.pupils,
                    attendanceData.attendanceMap,
                  )}
                </>
              );
            })()}
          </div>
        </>
      ) : (
        showTable && (
          <p className="text-center text-2xl font-black text-orange-500">
            Generating Term Report. Please Wait...
          </p>
        )
      )}
    </div>
  );
};

export default Reports;
