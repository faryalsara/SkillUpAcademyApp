
export default async function handler(req: any, res: any) {
  // Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }

  // Read the secret key from Vercel environment variables
  const apiKey = (
    globalThis as typeof globalThis & {
      process: { env: Record<string, string | undefined> };
    }
  ).process.env.REQRES_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'ReqRes API key is not configured on the server.',
    });
  }

  try {
    const response = await fetch('https://reqres.in/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(req.body),
    });

    const responseText = await response.text();

    res.setHeader('Content-Type', 'application/json');

    return res.status(response.status).send(responseText);
  } catch (error) {
    console.error('ReqRes proxy error:', error);

    return res.status(500).json({
      error: 'Unable to connect to ReqRes.',
    });
  }
}
