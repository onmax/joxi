import type { INordigenObAccess } from "../types/index.d.ts";
import { log } from "../util/logger.ts";

const BASE_URL = "https://ob.nordigen.com/api/v2"

// read from env
const NORDIGEN_SECRET = Deno.env.get("NORDIGEN_SECRET");
const NORDIGEN_KEY = Deno.env.get("NORDIGEN_KEY");

if (!NORDIGEN_SECRET || !NORDIGEN_KEY) {
    const envs = { NORDIGEN_SECRET, NORDIGEN_KEY }
    const missing = Object.entries(envs).filter(([_, value]) => !value).map(([key]) => key).join(", ")
    throw new Error(`Missing env variables: ${missing}`)
}

const secrets = {
    "secret_id": NORDIGEN_KEY as string,
    "secret_key": NORDIGEN_SECRET as string
}

const baseHeaders = {
    "Accept": "application/json",
    "Content-type": "application/json",
} as HeadersInit

let accessToken: string

async function setAccessToken() {
    const data = await post<INordigenObAccess>(`/token/new/`, secrets)
    log(`Got access token: ${!!data.access}`)
    accessToken = data.access
}

export async function get<T>(endpoint: string): Promise<T> {
    if (!accessToken) {
        await setAccessToken()
    }

    const url = `${BASE_URL}${endpoint}`
    const headers = {
        ...baseHeaders,
        "Authorization": `Bearer ${accessToken}`
    }
    log(`GET ${url}`)

    const res = await fetch(url, { headers })
    const json = await res.json()

    if (json.status_code && ~~json.status_code !== 200) {
        log(`Error ${json.status_code} | ${json.detail}`)
    }

    return json as T
}

export async function post<T>(endpoint: string, body: Record<string, string>): Promise<T> {
    const url = `${BASE_URL}${endpoint}`
    log(`POST ${url}`)

    const res = await fetch(url, { headers: baseHeaders, body: JSON.stringify(body), method: "POST" })
    const json = await res.json()
    return json as T
}
