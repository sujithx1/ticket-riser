import { env } from "bun";

export const validateSession_server = async (app_session_id: string) => {
  const res = await fetch(`${env.MDS_AUTH_URL}/api/validate-session/server`, {
    method: 'POST',
    body: JSON.stringify({ app_session_id: app_session_id }),
  });
  
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }
  return data;
};
