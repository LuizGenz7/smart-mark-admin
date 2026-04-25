import React from "react";

const About = () => {
  const year = new Date().getFullYear();

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex justify-center p-3 sm:p-6">

      <div className="w-full max-w-md space-y-5 sm:space-y-6">

        {/* TITLE */}
        <div className="text-center">
          <p className="text-lg sm:text-xl font-bold">
            About Smart Mark
          </p>
        </div>

        {/* CONTENT CARD */}
        <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 space-y-4 sm:space-y-5 text-xs sm:text-sm text-slate-400 leading-relaxed">

          {/* BASIC INFO */}
          <div className="space-y-1">
            <p>
              <span className="text-white font-semibold">Developer: </span>
              LuizGenz
            </p>

            <p>
              <span className="text-white font-semibold">Application: </span>
              Smart Mark System
            </p>
          </div>

          {/* DESCRIPTION */}
          <p>
            This application was developed by{" "}
            <span className="font-semibold text-slate-300">
              LuizGenz
            </span>
            , a student software developer focused on building secure,
            efficient, and reliable school management systems.
          </p>

          {/* PURPOSE */}
          <p>
            The system helps schools manage pupil attendance in a{" "}
            <span className="font-semibold text-slate-300">
              simple, accurate, and organized
            </span>{" "}
            manner while ensuring data protection.
          </p>

          {/* TERMS */}
          <div className="bg-slate-950/40 p-3 rounded-xl space-y-1">
            <p className="text-white font-semibold">
              Terms & Conditions
            </p>
            <p className="text-xs text-slate-400">
              This application is intended strictly for educational use.
              Unauthorized access, copying, modification, or misuse of the
              system or its data is prohibited.
            </p>
          </div>

          {/* PRIVACY */}
          <div className="bg-slate-950/40 p-3 rounded-xl space-y-1">
            <p className="text-white font-semibold">
              Privacy Policy
            </p>
            <p className="text-xs text-slate-400">
              Only essential school data such as attendance records is stored.
              No data is shared with third parties and is used solely for
              school administration.
            </p>
          </div>

          {/* PERMISSIONS */}
          <div className="bg-slate-950/40 p-3 rounded-xl space-y-1">
            <p className="text-white font-semibold">
              Permissions & Access
            </p>
            <p className="text-xs text-slate-400">
              Access is restricted to{" "}
              <span className="font-semibold text-slate-300">
                Teachers
              </span>{" "}
              and{" "}
              <span className="font-semibold text-slate-300">
                Administrators
              </span>
              . Teachers manage attendance records, while administrators
              control system settings and data.
            </p>
          </div>

          {/* DATA PROTECTION */}
          <div className="bg-slate-950/40 p-3 rounded-xl space-y-1">
            <p className="text-white font-semibold">
              Data Protection
            </p>
            <p className="text-xs text-slate-400">
              Reasonable security measures are applied to protect attendance
              data against unauthorized access, loss, or alteration.
            </p>
          </div>

          {/* FOOTER */}
          <div className="pt-4 border-t border-slate-800 text-center text-[11px] sm:text-xs text-slate-500">
            <p>
              Version 1.0.0 <br />
              © {year} Smart Mark. All rights reserved. <br />
              Unauthorized copying or redistribution is strictly prohibited.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;