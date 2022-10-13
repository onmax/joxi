import { BlockObjectResponse, CreatePageParameters, QueryDatabaseResponse } from "https://deno.land/x/notion_sdk@v1.0.4/src/api-endpoints.ts";
import { Client } from "https://deno.land/x/notion_sdk@v1.0.4/src/mod.ts";
import { ItemProperties, NotionAccount, NotionTransaction } from "../types/index.d.ts";
import { DatabaseType, NotionItem } from "./models.ts";

const NOTION_TOKEN = Deno.env.get("NOTION_TOKEN") as string
const NOTION_MAIN_PAGE_ID = Deno.env.get("NOTION_MAIN_PAGE_ID") as string

if (!NOTION_TOKEN || !NOTION_MAIN_PAGE_ID) {
    throw new Error("Notion token or main page id not found")
}

const notion = new Client({
    auth: NOTION_TOKEN,
})

const OPERATION_BATCH_SIZE = 10

export async function getDatabaseId(database: DatabaseType) {
    const results = (await notion.blocks.children.list({ block_id: NOTION_MAIN_PAGE_ID, page_size: 50 })).results as BlockObjectResponse[]
    const databaseId = (results).filter(r =>
        r?.type === "child_database" &&
        r.child_database?.title.toLowerCase() === database.toLowerCase()
    )?.[0].id || '' // Not the cleanest code in earth...
    return databaseId
}



/**
 * Gets all pages from the Notion database.
 */
export async function getDatabaseEntries<T extends DatabaseType>(databaseId: string) {
    const pages: Record<string, NotionItem<T>> = {}

    let cursor = undefined
    while (true) {
        const response = await notion.databases.query({
            database_id: databaseId,
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
