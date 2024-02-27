import { qrcode } from "https://deno.land/x/qrcode@v2.0.0/mod.ts";
import { Application, Router } from 'https://deno.land/x/oak@v12.6.1/mod.ts'
import { decodeBase64 } from "https://deno.land/std@0.204.0/encoding/base64.ts";

const router = new Router();

router
  .get("/api", async (context) => {
    // Extract the URL query parameter
    const url = context.request.url.searchParams.get("url");
    if (!url) {
      context.response.status = 400; // Bad Request if URL is not provided
      context.response.body = { error: "URL query parameter is required" };
      return;
    }

    try {
      const base64Image = await qrcode(url); 
      const binaryImage = new Uint8Array(decodeBase64(base64Image.split(",")[1]));
      context.response.body = binaryImage;
    } catch (error) {
      context.response.status = 500; // Internal Server Error
      context.response.body = { error: "Failed to generate QR code" };
    }
  });

const app = new Application()

app.use(router.routes())
app.use(router.allowedMethods())

await app.listen({ port: 54321 })
