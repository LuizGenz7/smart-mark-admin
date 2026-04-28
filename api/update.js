export default function handler(req, res) {
  const config = {
    latestVersion: "54.1.0",
    minimumVersion: "54.0.3",
    updateUrl: "https://smart-mark-admin.vercel.app/update",
    message: "New features + bug fixes 🔥",
  };

  const currentVersion = req.query.version || "0.0.0";

  const isUpdateAvailable =
    compareVersions(currentVersion, config.latestVersion) === -1;

  const isForceUpdate =
    compareVersions(currentVersion, config.minimumVersion) === -1;

  res.status(200).json({
    ...config,
    isUpdateAvailable,
    isForceUpdate,
    currentVersion,
  });
}