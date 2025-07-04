import app from './app';
import { config } from './config';

// Start server
app.listen(config.server.port, () => {
  console.log(`Server running on port ${config.server.port}`);
  console.log(`API available at http://localhost:${config.server.port}`);
});

export default app;
