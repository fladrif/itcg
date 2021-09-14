import { AUTH_COOKIE_NAME, AUTH_HEADER, verifyJWT } from './utils';
import { db } from './db';

export async function extractAuth(ctx: any, next: any) {
  const authCookie = ctx.cookies.get(AUTH_COOKIE_NAME);
  if (!authCookie) ctx.throw(400, 'User not authenticated');

  const userID = verifyJWT(authCookie);
  const userIDExists = await db.userIDExist(userID);
  if (!userIDExists) ctx.throw(400, 'User not authenticated');

  ctx.header[AUTH_HEADER] = userID;
  await next();
}
