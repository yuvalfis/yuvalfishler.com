const document = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>UpWest Scope of Work</title>
    <style>
      html, body { width: 100%; height: 100%; margin: 0; }
      iframe { display: block; width: 100%; height: 100dvh; border: 0; }
    </style>
  </head>
  <body>
    <iframe
      src="/soc/upwest/working-agreement.html"
      title="UpWest Scope of Work"
    ></iframe>
  </body>
</html>
`;

export function GET(): Response {
  return new Response(document, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
      Vary: "Cookie",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
