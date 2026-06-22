import app from "./app";

const PORT: number = 3000;

const startServer = (port: number): void => {
  app.listen(port, (): void => {
    console.log(`Server running on port ${port}`);
  });
};

startServer(PORT);