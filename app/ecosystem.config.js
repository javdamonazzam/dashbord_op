module.exports = {
  apps: [
    {
      name: "my-next-app",
      cwd: "/home/dashbord_op/app",
      script: "pnpm",
      args: "exec next start",
      interpreter: "bash",
      env: {
        PORT: 9000,
        NODE_ENV: "production"
      },
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000
    }
  ]
};