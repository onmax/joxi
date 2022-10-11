export interface ICoinbaseTransactionResponse {
    data: ICoinbaseTransaction[]
    pagination: ICoinbasePagination
    warnings: ICoinbaseWarning[]
}

export interface ICoinbaseAccountsResponse {
    data: ICoinbaseAccounts[]
    pagination: ICoinbasePagination
    warnings: ICoinbaseWarning[]
}

export interface ICoinbaseTransaction {
    id: string
    type: string
    status: string
    amount: ICoinbaseAmount
    native_amount: ICoinbaseNativeAmount
    description: string
    created_at: string
    updated_at: string
    resource: string
    resource_path: string
    instant_exchange: boolean
    off_chain_status: string
    network: ICoinbaseNetwork
    to?: ICoinbaseTo
    idem?: string
    application?: ICoinbaseApplication
    details: ICoinbaseDetails
    hide_native_amount: boolean
    from?: ICoinbaseFrom
}

export interface ICoinbaseAmount {
    amount: string
    currency: string
}

export interface ICoinbaseNativeAmount {
    amount: string
    currency: string
}

export interface ICoinbaseNetwork {
    status: string
    status_description: string
}

export interface ICoinbaseTo {
    resource: string
    email: string
    name: string
    avatar_url: string
    currency: string
}

export interface ICoinbaseApplication {
    id: string
    resource: string
    resource_path: string
}

export interface ICoinbaseDetails {
    title: string
    subtitle: string
    header: string
    health: string
}

export interface ICoinbaseFrom {
    id: string
    resource: string
    resource_path: string
    currency: string
}

export interface ICoinbasePagination {
    ending_before: string
    starting_after: string
    previous_ending_before: string
    next_starting_after: string
    limit: number
    order: string
    previous_uri: string
    next_uri: string
}

export interface ICoinbaseWarning {
    id: string
    message: string
    url: string
}

export interface ICoinbaseAccounts {
    id: string
    name: string
    primary: boolean
    type: string
    currency: ICoinbaseCurrency
    balance: ICoinbaseBalance
    created_at: string
    updated_at: string
    resource: string
    resource_path: string
    allow_deposits: boolean
    allow_withdrawals: boolean
}

export interface ICoinbaseCurrency {
    code: string
    name: string
    color: string
    sort_index: number
    exponent: number
    type: string
    address_regex: string
    asset_id: string
    slug: string
    destination_tag_name?: string
    destination_tag_regex?: string
}

export interface ICoinbaseBalance {
    amount: string
    currency: string
}