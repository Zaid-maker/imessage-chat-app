import * as dotenv from "dotenv";
import express from "express";
import { createServer } from "http";

const main = async () => {
  dotenv.config();

  const app = express();
  const httpServer = createServer(app);

  const PORT = 4000;

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );

  console.log(`Server is now running on http://localhost:${PORT}/graphql`);
};

main().catch((err) => console.log(err));
