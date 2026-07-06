const level = process.env.LOG_LEVEL || "info";
const levels = ["trace", "debug", "info", "warn", "error", "fatal"];
const levelIndex = levels.indexOf(level);

const log = (lvl: string, arg1: string | object, arg2?: string | unknown) => {
  if (levels.indexOf(lvl) < levelIndex) return;
  const prefix = `[${lvl.toUpperCase()}] [${process.env.NODE_ENV || "development"}]`;
  let msg = "";
  let data: unknown = undefined;

  if (typeof arg1 === "string") {
    msg = arg1;
    data = arg2;
  } else if (typeof arg1 === "object" && arg1 !== null) {
    data = arg1;
    msg = typeof arg2 === "string" ? arg2 : "";
  }

  const logFn =
    lvl === "warn" || lvl === "error" || lvl === "fatal"
      ? console.error
      : console.log;

  if (data !== undefined) {
    logFn(prefix, msg, data);
  } else {
    logFn(prefix, msg);
  }
};

export const logger = {
  trace: (arg1: string | object, arg2?: string | unknown) =>
    log("trace", arg1, arg2),
  debug: (arg1: string | object, arg2?: string | unknown) =>
    log("debug", arg1, arg2),
  info: (arg1: string | object, arg2?: string | unknown) =>
    log("info", arg1, arg2),
  warn: (arg1: string | object, arg2?: string | unknown) =>
    log("warn", arg1, arg2),
  error: (arg1: string | object, arg2?: string | unknown) =>
    log("error", arg1, arg2),
  fatal: (arg1: string | object, arg2?: string | unknown) =>
    log("fatal", arg1, arg2),
};
