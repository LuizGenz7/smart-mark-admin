import React from "react";
import {
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

/* ================= HELPERS ================= */

const openLink = (url) => {
  if (!url) return;
  window.open(url, "_blank");
};

const sendEmail = () => openLink("mailto:genzlewis@gmail.com");
const sendWhatsApp = () =>
  openLink("https://wa.me/260962063468");
const makeCall = () =>
  openLink("tel:+260962063468");

/* ================= SCREEN ================= */

const Support = () => {
  const appVersion = "1.0.0";
  const year = new Date().getFullYear();

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex justify-center p-6">
      <div className="w-full max-w-md space-y-6">

        {/* TITLE */}
        <div className="text-center">
          <p className="text-xl font-bold">
            Support the Developer
          </p>
          <p className="text-sm text-slate-400 mt-1">
            If you enjoy{" "}
            <span className="text-white font-semibold">
              Smart Mark System
            </span>
            , your support helps improve and maintain the app.
          </p>
        </div>

        {/* SUPPORT CARD */}
        <div className="bg-slate-900 rounded-xl p-5 space-y-4">

          <div>
            <p className="font-semibold text-white">
              Buy Me a Coffee ☕
            </p>
            <p className="text-xs text-slate-400">
              Support development and future improvements.
            </p>
          </div>

          <div>
            <p className="font-semibold text-white">
              Support & Contact
            </p>
            <p className="text-xs text-slate-400">
              Reach out for support or feedback:
            </p>
          </div>

          {/* CONTACT LIST */}
          <div className="space-y-2">

            {/* EMAIL */}
            <button
              onClick={sendEmail}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition"
            >
              <EnvelopeIcon className="size-5 text-orange-500" />
              <span className="text-sm text-slate-300">
                genzlewis@gmail.com
              </span>
            </button>

            {/* WHATSAPP */}
            <button
              onClick={sendWhatsApp}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition"
            >
              <ChatBubbleLeftRightIcon className="size-5 text-green-500" />
              <span className="text-sm text-slate-300">
                +260 962 063 468
              </span>
            </button>

            {/* CALL */}
            <button
              onClick={makeCall}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition"
            >
              <PhoneIcon className="size-5 text-blue-400" />
              <span className="text-sm text-slate-300">
                +260 962 063 468
              </span>
            </button>

            {/* PRIMARY BUTTON */}
            <button
              onClick={sendWhatsApp}
              className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium transition"
            >
              Chat on WhatsApp
            </button>

          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center text-xs text-slate-500 border-t border-slate-800 pt-4">
          <p>Thank you for supporting independent development.</p>
          <p className="mt-2">
            App Version {appVersion} <br />
            © {year} Smart Mark
          </p>
        </div>

      </div>
    </div>
  );
};

export default Support;