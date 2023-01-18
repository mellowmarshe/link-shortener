export interface Env {
  KV: KVNamespace;
  SECRET: string;
}

interface Link {
  url: string;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    if (request.method == "PUT") {
      return put(request, env, ctx);
    } else if (request.method == "GET") {
      return get(request, env, ctx);
    } else if (request.method == "DELETE") {
      return delete_(request, env, ctx);
    }

    return Response.json({ status: "Unsupported method" }, { status: 405 });
  },
};

async function put(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const authorization = request.headers.get("Authorization");

  if (!authorization || authorization != env.SECRET) {
    return Response.json({ status: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json<Link>();
  const key = (Math.random() + 1).toString(36).substring(6);

  await env.KV.put(key, JSON.stringify(body));

  return Response.json({ key: key });
}

async function get(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const url = new URL(request.url);
  const { pathname } = url;
  const id = pathname.replace("/", "");

  const link = await env.KV.get<Link>(id, { type: "json" });

  if (!link) {
    return Response.json({ status: "Unknown id" }, { status: 404 });
  }

  return Response.redirect(link.url, 301);
}

async function delete_(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const authorization = request.headers.get("Authorization");

  if (!authorization || authorization != env.SECRET) {
    return Response.json({ status: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const { pathname } = url;

  const id = pathname.replace("/", "");

  if (!id) {
    return Response.json({ status: "Unknown id" }, { status: 404 });
  }

  await env.KV.delete(id);

  return Response.json({ status: "Ok" });
}
