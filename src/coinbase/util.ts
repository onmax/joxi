import { ICoinbaseAccountsResponse, ICoinbaseTransactionResponse } from "../types/coinbase.d.ts";
import { log } from "../util/logger.ts";
import { getHeaders } from "./auth.ts";

const BASE_URL = "https://api.coinbase.com/v2"

type CoinbaseResponse = ICoinbaseAccountsResponse | ICoinbaseTransactionResponse
export async function get<T extends CoinbaseResponse>(endpoint: string): Promise<T["data"]> {
    let nextPage: string | null = endpoint
    const results: T['data'] = []

    while (nextPage !== null) {
        const url = `${BASE_URL}${nextPage}`
        const headers = await getHeaders('GET', `/v2${nextPage}`);
        log(`GET ${url}`)

        const res = await fetch(url, { headers })

        if (!res.ok && ~~res.status !== 200) {
            log(`Error ${res.status} | ${res.statusText} `)
        }
        
        if (res.body === null) {
            log(`Empty body response`)
            return results
        }

        const json = JSON.parse(await res.text()) as T

        // @ts-ignore always same type
        results.push(...json.data as T['data'])

        nextPage = json.pagination?.next_uri?.split('/v2')[1] || null
    }

    return results
}
