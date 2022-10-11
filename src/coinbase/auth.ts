const COINBASE_KEY = Deno.env.get("COINBASE_KEY");
const COINBASE_SECRET = Deno.env.get("COINBASE_SECRET");

const BASE_HEADERS = {
    'CB-ACCESS-KEY': COINBASE_KEY,
    'Content-Type': 'application/json'
}

const rawKey = new TextEncoder().encode(COINBASE_SECRET);
const key = await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "HMAC", hash: "SHA-256" },
    false, //extractable
    ["sign"], //uses
);


export async function getHeaders(method: 'GET' | 'POST', path: `/v2${string}`, body = '') {
    const currentDate = Date.now() / 1000
    const timestamp = Math.floor(currentDate).toString()
    const message = timestamp + method + path + body
    const signature = await crypto.subtle.sign(
        { name: "HMAC" },
        key,
        new TextEncoder().encode(message)
    );
    const signatureHex = new Uint8Array(signature).reduce((s, b) => s + b.toString(16).padStart(2, "0"), "");

    return {
        ...BASE_HEADERS,
        'CB-ACCESS-TIMESTAMP': timestamp,
        'CB-ACCESS-SIGN': signatureHex
    } as HeadersInit
}
