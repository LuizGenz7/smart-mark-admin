const config = {
  latestVersion: "1.2.0",
  minimumVersion: "1.0.5",
  updateUrl: "https://smart-mark-admin.vercel.app/update",
  message: "New features + bug fixes 🔥",
};

// 🔥 Version comparison helper
function compareVersions(current, target) {
  const a = current.split(".").map(Number);
  const b = target.split(".").map(Number);

  const maxLen = Math.max(a.length, b.length);

  for (let i = 0; i < maxLen; i++) {
    const numA = a[i] || 0;
    const numB = b[i] || 0;

    if (numA < numB) return -1;
    if (numA > numB) return 1;
  }

  return 0;
}

export default function handler(req, res) {
  const currentVersion = req.query.version || "0.0.0";

  const isUpdateAvailable =
    compareVersions(currentVersion, config.latestVersion) === -1;

  const isForceUpdate =
    compareVersions(currentVersion, config.minimumVersion) === -1;

  res.status(200).json({
    ...config,
    isUpdateAvailable,
    isForceUpdate,
  });
}