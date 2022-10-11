
import { get } from "./util.ts"
import { INordigenBank } from "../types/index.d.ts"

async function getBanks() {
    const data = await get<INordigenBank[]>(`/institutions/?country=se`)
    // return data.filter(d => d.name === "ICA Banken")[0]
}

getBanks()

// async function createEndUserAgreement(accessToken: string, bankId: string) {
//     const body = {
//         institution_id: bankId,
//         access_scope: [
//             "balances",
//             "details",
//             "transactions"
//         ],
//         "max_historical_days": 530,
//         "access_valid_for_days": 90,
//     }
//     const data = await fetchEndpoint(`/agreements/enduser/`, { ...headers, "Authorization": `Bearer ${accessToken}` }, body)
//     return data
// }

// const agreement = await createEndUserAgreement(access, ica.id)

// async function buildLink(accessToken: string, bankId: string, agreement: string) {
//     const body = {
//         institution_id: bankId,
//         agreement,
//         user_language: "en",
//         reference: '123444444444444',
//         redirect: 'https://www.google.com',
//     }
//     const data = await fetchEndpoint(`/requisitions/`, { ...headers, "Authorization": `Bearer ${accessToken}` }, body)
//     return data
// }

// const link = await buildLink(access, ica.id, agreement.id)