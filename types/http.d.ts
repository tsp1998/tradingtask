import { IncomingMessage } from "http";

/**
 * Extending the IncomingMessage interface
 */
declare module "http" {
  interface IncomingMessage {
    hash?: string
  }
}
