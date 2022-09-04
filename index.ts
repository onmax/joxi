const BASE_URL = "https://www.saltedge.com/api/v5"

// read from env
const APP_ID = Deno.env.get("APP_ID");
const SECRET = Deno.env.get("SECRET");
const CUSTOMER_ID = Deno.env.get("CUSTOMER_ID");

console.log("fetching connections", { APP_ID, SECRET, CUSTOMER_ID })


async function fetchConnection() {
    /**
     * curl -v -H "Accept: application/json" \
        -H "Content-type: application/json" \
        -H "App-id: $APP_ID" \
        -H "Secret: $SECRET" \
        -X GET \
        https://www.saltedge.com/api/v5/connections?customer_id=$CUSTOMER_ID
     */

        // list environments in bash
        // env | grep -i deno
    const url = `${BASE_URL}/connections?customer_id=${CUSTOMER_ID}`
    const headers = {
        "Accept": "application/json",
        "Content-type": "application/json",
        "App-id": APP_ID,
        "Secret": SECRET
    } as HeadersInit

    const res = await fetch(url, { headers: headers })
    const body = await res.json()
    console.log(body)
    return body
}

fetchConnection()