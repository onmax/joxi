import { CreatePageParameters, QueryDatabaseResponse } from "https://deno.land/x/notion_sdk@v1.0.4/src/api-endpoints.ts";
import { Client } from "https://deno.land/x/notion_sdk@v1.0.4/src/mod.ts";
import { ItemProperties, NotionAccount, NotionTransaction } from "../types/index.d.ts";
import { DatabaseType, NotionItem } from "./models.ts";

const notion = new Client({
    auth: Deno.env.get("NOTION_TOKEN"),
})

export const databases: Record<DatabaseType, string> = {
    transactions: "c3c449aa4fab42bfaea5348817773e29",
    accounts: "923b821b2f60439fb2dd0126f391ec4a"
}

const OPERATION_BATCH_SIZE = 10

/**
 * Gets all pages from the Notion database.
 */
export async function getDatabaseEntries<T extends DatabaseType>(database_id: string) {
    const pages: Record<string, NotionItem<T>> = {}

    let cursor = undefined
    while (true) {
        const response = await notion.databases.query({
            database_id,
            start_cursor: cursor ?? undefined,
        }) as QueryDatabaseResponse

        console.log(`Got ${response.results.length} pages from Notion.`)

        response.results
            .filter((page) => "properties" in page)
            .map(page => ({ id: page.id, properties: "properties" in page ? page.properties : {} as ItemProperties }))
            .forEach(({ id, properties }) => pages[id] = properties as unknown as (NotionItem<T>))

        if (!response.has_more) break
        cursor = response.next_cursor
    }

    return pages
}

function chunk<T>(items: T[], batchSize: number): T[][] {
    const chunks = []
    for (let i = 0; i < items.length; i += batchSize) {
        chunks.push(items.slice(i, i + batchSize))
    }
    return chunks
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Creates new pages in Notion.
 *
 * https://developers.notion.com/reference/post-page
 */
export async function createEntries<T extends NotionTransaction | NotionAccount>(parentDatabaseId: string, pagesToCreate: T[]) {
    const pagesToCreateChunks = chunk(pagesToCreate, OPERATION_BATCH_SIZE)
    for (const pagesToCreateBatch of pagesToCreateChunks) {
        for (const newPage of pagesToCreateBatch) {
            // @ts-ignore Types error from notion
            await notion.pages.create({
                parent: { database_id: parentDatabaseId, type: "database_id" },
                properties: newPage as CreatePageParameters["properties"],
            })
            await sleep(200)
        }
        console.log(`Completed batch size: ${pagesToCreateBatch.length}`)
    }
}
