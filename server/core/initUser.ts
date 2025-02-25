import { createHash } from "crypto"
import express from "express"
import { UsersMap } from "../../types/user"

const initUser = (req: express.Request, usersMap: UsersMap) => {
  const address = req.headers['x-forwarded-for'] || req.socket.remoteAddress || ""
  const userAgent = req.headers['user-agent'] || ""

  const finalValue = address + userAgent

  const hash = createHash("sha256").update(finalValue).digest('hex');
  req.hash = hash

  if (hash in usersMap) { return }

  usersMap[hash] = { subscribedTokensMap: [] }
}

export default initUser