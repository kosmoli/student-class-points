async function keepSupabaseAlive(env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY secret");
  }

  const url = `${env.SUPABASE_URL.replace(/\/$/, "")}/rest/v1/classes?select=id&limit=1`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      apikey: env.SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_PUBLISHABLE_KEY}`
    },
    cf: { cacheTtl: 0, cacheEverything: false }
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase keep-alive failed (${response.status}): ${details}`);
  }

  console.log("Supabase database was queried successfully.");
}

export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },

  async scheduled(controller, env, ctx) {
    await keepSupabaseAlive(env);
  }
};
