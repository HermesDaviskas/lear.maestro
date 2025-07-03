const { exec } = require("child_process");

exec("npm run dev", { cwd: "./frontend", stdio: "inherit", shell: true });