import { Request } from "express";

/**
 * Extending the Express Request interface
 */
declare module "express-serve-static-core" {
  interface Request {
    hash?: string;
  }
}
