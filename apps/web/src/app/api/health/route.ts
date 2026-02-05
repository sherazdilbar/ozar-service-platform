export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      apiUrl: process.env.NEXT_PUBLIC_API_URL,
      nodeEnv: process.env.NODE_ENV,
    }
  });
}
