import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { router } from "./router/router";
const app = new Hono();

app.use(logger());

app.use("*", cors());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api", router);

export default app;
