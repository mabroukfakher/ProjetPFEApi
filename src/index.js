import express from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import responseTime from "response-time";
import winston from "winston";
import logger from "./lib/logger";
import settings from "./lib/settings";
import security from "./lib/security";
import Router from "./router";


const app = express();


app.set("trust proxy", 1);
app.use(helmet());


app.use(express.static("public/content"));

security.applyMiddleware(app);

app.all("*", (req, res, next) => {
  // CORS headers
  const allowedOrigins = security.getAccessControlAllowOrigin();
  const { origin } = req.headers;
  if (allowedOrigins === "*") {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigins);
  } else if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Key, Authorization , x-access-token"
  );
  next();
});

app.use(responseTime());
app.use(cookieParser(settings.cookieSecretKey));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use("/api", Router);



app.use(logger.sendResponse);

const server = app.listen(settings.apiListenPort, () => {
  const serverAddress = server.address();
  winston.info(`API running at http://localhost:${serverAddress.port}`);
});


