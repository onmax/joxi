import { DateResponse, PartialUserObjectResponse, RichTextItemResponse, RollupFunction, SelectPropertyResponse, StringRequest, TextRequest } from "https://deno.land/x/notion_sdk@v1.0.4/src/api-endpoints.ts";

export type ItemProperties = Record<
    string,
    | { type: "number"; number: number | null; id: string }
    | { type: "url"; url: string | null; id: string }
    | {
        type: "select"
        select: SelectPropertyResponse | null
        id: string
    }
    | {
        type: "multi_select"
        multi_select: Array<SelectPropertyResponse>
        id: string
    }
    | { type: "date"; date: DateResponse | null; id: string }
    | { type: "email"; email: string | null; id: string }
    | { type: "phone_number"; phone_number: string | null; id: string }
    | { type: "checkbox"; checkbox: boolean; id: string }
    | {
        type: "files"
        files: Array<
            | {
                file: { url: string; expiry_time: string }
                name: StringRequest
                type?: "file"
            }
            | {
                external: { url: TextRequest }
                name: StringRequest
                type?: "external"
            }
        >
        id: string
    }
    | {
        type: "created_by"
        created_by: PartialUserObjectResponse
        id: string
    }
    | { type: "created_time"; created_time: string; id: string }
    | {
        type: "last_edited_by"
        last_edited_by: PartialUserObjectResponse
        id: string
    }
    | { type: "last_edited_time"; last_edited_time: string; id: string }
    | {
        type: "formula"
        formula:
        | { type: "string"; string: string | null }
        | { type: "date"; date: DateResponse | null }
        | { type: "number"; number: number | null }
        | { type: "boolean"; boolean: boolean | null }
        id: string
    }
    | { type: "title"; title: Array<RichTextItemResponse>; id: string }
    | {
        type: "rich_text"
        rich_text: Array<RichTextItemResponse>
        id: string
    }
    | {
        type: "people"
        people: Array<PartialUserObjectResponse>
        id: string
    }
    | { type: "relation"; relation: Array<{ id: string }>; id: string }
    | {
        type: "rollup"
        rollup:
        | {
            type: "number"
            number: number | null
            function: RollupFunction
        }
        | {
            type: "date"
            date: DateResponse | null
            function: RollupFunction
        }
        | {
            type: "array"
            array: Array<
                | { type: "title"; title: Array<RichTextItemResponse> }
                | {
                    type: "rich_text"
                    rich_text: Array<RichTextItemResponse>
                }
                | {
                    type: "people"
                    people: Array<PartialUserObjectResponse>
                }
                | { type: "relation"; relation: Array<{ id: string }> }
            >
            function: RollupFunction
        }
        id: string
    }
>

export interface NotionPropertyDate { type: "date"; date: DateResponse | null; id: string }
export interface NotionPropertyTitle { type: "title"; title: Array<RichTextItemResponse>; id: string }
export interface NotionPropertySelect {
    type: "select"
    select: SelectPropertyResponse | null
    id: string
}
export interface NotionPropertyRichText {
    type: "rich_text"
    rich_text: Array<RichTextItemResponse>
    id: string
}
export interface NotionPropertyNumber { type: "number"; number: number | null; id: string }
export type NotionProperty = NotionPropertyDate | NotionPropertyTitle | NotionPropertySelect | NotionPropertyNumber

export interface NotionTransaction {
    "ID": NotionPropertyTitle
    "Currency": NotionPropertySelect
    "Booking Date": NotionPropertyDate
    "Amount": NotionPropertyNumber
    "Value Date": NotionPropertyDate
    "Creditor Name": NotionPropertyRichText
    "Creditor Account": NotionPropertyRichText
    "Debtor Name": NotionPropertyRichText
    "Meta": NotionPropertyRichText
}

export interface NotionAccount {
    "ID": NotionPropertyTitle
    "Created": NotionPropertyDate
    "Last Accessed": NotionPropertyDate
    "IBAN": NotionPropertyRichText
    "Status": NotionPropertySelect
    "Owner": NotionPropertyRichText
    "Currency": NotionPropertySelect
    "BBAN": NotionPropertyRichText
    "Name": NotionPropertyRichText
    "BIC": NotionPropertyRichText
    "Balance": NotionPropertyNumber
    "Bank": NotionPropertyRichText
    "Access During": NotionPropertyNumber
}
