const Hapi = require("@hapi/hapi");
const Qs = require("qs");
const Logger = require("./shared/logger");

const routes = require("./routes");

const logger = new Logger("Hapi");

async function bootstrap() {
  const port = process.env.PORT ?? 9000;
  const hostname = process.env.HOSTNAME ?? "localhost";

  const server = Hapi.server({
    port,
    host: hostname,
    query: {
      parser: Qs.parse,
    },
  });
  routes(server);

  server.route({
    method: "*",
    path: "/{any*}",
    handler: (_req, h) => h.response("404 Error! Page Not Found!").code(404),
  });

  await server.start();
  logger.info("Server running on", server.info.uri);
}

process.on("unhandledRejection", (error) => {
  logger.error(error);
  process.exit(1);
});

bootstrap();
