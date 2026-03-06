import { Context, Next } from "hono";
import { validateSession_server } from "../services/server-validate";
import { isDev } from "../helper";

type User = {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
  email: string;
  phone: string;
  aadhar_no: string | null;
  pan_no: string | null;
  max_login: number;
  role: string;
};
export type UserSession = {
  user: User;
  app_session_id: string;
};

export const authenticate = async (c: Context, next: Next) => {
  const app_session_id = c.req.header('app-session-id');
  if (!app_session_id) {
    if (isDev()) return await next();
    return c.json({ message: 'Token Missing header' }, 401);
  }

  const data = await validateSession_server(app_session_id);

  // const user = await pgdb.query.UserSchema.findFirst({}); // user_id for checking
  // if (!user) {
  //   return;
  //   // c.json({ message: 'User not found' }, 404);
  // }


  const user = data.user;

  const userSession: UserSession = {
    user: user,
    // mo: mo,
    // partner,
    app_session_id: app_session_id,
  };

  c.set('user_session', userSession);

  return next();
};

export const getAuthSession = (c: Context) => {
  const val: UserSession = c.get('user_session');

  if (!val) {
    throw new Error ('User session not found');
  }

  return val;
};
