import { RouterContext } from '@koa/router';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

import { UserNonce } from './types';
import { CLIENT } from '../../src/config';

export const AUTH_HEADER = 'UserAuth';
export const SERVER_AUTH_HEADER = 'ServerAuth';
export const SERVER_CLIENT_HEADER = 'CanonicalUserID';
export const AUTH_COOKIE_NAME = 'token';
export const USER_COOKIE_NAME = 'user';

export const SERVER_ID = uuidv4();

const JWT_SECRET = 'somethingtobechanged';

interface JWTPayload {
  id: string;
}

export interface VerificationPayload {
  username: string;
  passhash: string;
}

export interface BodyPayload extends VerificationPayload {
  cnonce: string;
  username: string;
  password: string;
}

export async function verify(
  ctx: RouterContext,
  userNonces: UserNonce[]
): Promise<VerificationPayload> {
  const token = ctx.cookies.get(AUTH_COOKIE_NAME);
  if (token) ctx.throw(400, 'You are already signed in');

  const body = ctx.request.body;
  const validBody = validateBody(body);

  if (!validBody) ctx.throw(400, '12: Please retry submission');
  if (!body.cnonce) ctx.throw(400, '13: Please retry submission');
  if (!body.username) ctx.throw(400, 'No username provided');
  if (!body.password) ctx.throw(400, 'No password provided');

  const unIndex = userNonces.findIndex((un) => un.username === body.username);
  if (unIndex < 0) ctx.throw(400, '14: Please retry submission');

  const nonce = userNonces[unIndex].nonce;
  userNonces.splice(unIndex, 1);

  const passhash = CryptoJS.AES.decrypt(body.password, `${nonce}${body.cnonce}`).toString(
    CryptoJS.enc.Utf8
  );

  return {
    username: body.username,
    passhash,
  };
}

export function validUsername(username: string): boolean {
  const validRegexp = new RegExp('^[a-z0-9A-Z]+$');
  return validRegexp.test(username);
}

export function adqLengthUsername(username: string): boolean {
  return username.length >= 5 && username.length <= 15;
}

export function signJWT(userID: string): string {
  const user: JWTPayload = { id: userID };
  const secret = jwt.sign(user, JWT_SECRET);
  return secret;
}

export function verifyJWT(token: string): string {
  const decode = jwt.verify(token, JWT_SECRET) as JWTPayload;
  return decode.id;
}

export function setCookies(ctx: RouterContext, username: string, id: string) {
  ctx.cookies.set(AUTH_COOKIE_NAME, signJWT(id), {
    sameSite: 'lax',
    maxAge: 31536000000,
  });
  ctx.cookies.set(USER_COOKIE_NAME, username, {
    sameSite: 'lax',
    domain: CLIENT,
    secure: false,
    httpOnly: false,
    maxAge: 31536000000,
  });
  ctx.body = 200;
}

function validateBody(body: unknown): body is BodyPayload {
  return (
    !!(body as BodyPayload).cnonce &&
    !!(body as BodyPayload).username &&
    !!(body as BodyPayload).password
  );
}
