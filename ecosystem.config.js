module.exports = {
  apps: [
    {
      name: "proxy",
      script: "proxy-server/proxy-server.js",
    },
    {
      name: "frontend",
      cwd: "frontend",
      script: "npm",
      args: "run dev",
    },
  ],
};
