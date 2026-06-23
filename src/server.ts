import app from './app';
import { config } from './shared/config';

const port = config.PORT;

const startServer = (port: number): void => {
  app.listen(port, (): void => {
    console.log(`Server running on port ${port}`);
  });
};

startServer(port);