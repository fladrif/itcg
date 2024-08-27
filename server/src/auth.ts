import {
  AUTH_COOKIE_NAME,
  AUTH_HEADER,
  SERVER_AUTH_HEADER,
  SERVER_CLIENT_HEADER,
  SERVER_ID,
  verifyJWT,
} from './utils';
import * as db from './db';

export async function extractAuth(ctx: any, next: any) {
  const authCookie = ctx.cookies.get(AUTH_COOKIE_NAME);
  if (!authCookie) ctx.throw(400, 'User not authenticated');

  try {
    const userID = verifyJWT(authCookie);
    const userIDExists = await db.userIDExist(userID);
    if (!userIDExists) ctx.throw(400, 'User not authenticated');

    ctx.header[AUTH_HEADER] = userID;
  } catch (e) {
    ctx.throw(422, 'User not authenticated');
  }

  await next();
}

export async function adminAuth(ctx: any, next: any) {
  const userID = ctx.header[AUTH_HEADER];
  const roles = await db.getRolesById(userID);
  if (!roles.some((r) => r.name === 'admin')) {
    ctx.throw(400, 'User not authenticated');
  }

  await next();
}

export async function serverAuth(ctx: any, next: any) {
  const authHeader = ctx.get(SERVER_AUTH_HEADER);
  if (!authHeader) ctx.throw(400, 'User not authenticated');

  try {
    const serverID = verifyJWT(authHeader);
    if (!serverID || serverID !== SERVER_ID) ctx.throw(400, 'User not authenticated');
  } catch (e) {
    ctx.throw(422, 'User not authenticated');
  }

  await next();
}

export function generateCredentials(ctx: any): string {
  const userID = ctx.get(SERVER_CLIENT_HEADER);

  return userID;
}

export async function authenticateCredentials(
  credentials: any,
  playerMetadata: any
): Promise<boolean> {
  try {
    const id = verifyJWT(credentials);
    return id === playerMetadata.credentials;
  } catch (e) {
    return false;
  }
}
