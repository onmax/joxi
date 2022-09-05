// -------------
// Types from saltedge.com
export interface ILastAttempt {
    id: string;
    finished: boolean;
    api_mode: string;
    api_version: string;
    locale: string;
    user_present: boolean;
    customer_last_logged_at?: string;
    remote_ip: string;
    finished_recent: boolean;
    partial: boolean;
    automatic_fetch: boolean;
    daily_refresh: boolean;
    categorize: boolean;
    custom_fields: [];
    device_type: string;
    user_agent: string;
    exclude_accounts: [];
    fetch_scopes: [];
    from_date: string;
    to_date: string;
    interactive: boolean;
    store_credentials: boolean;
    include_natures?: boolean;
    show_consent_confirmation: boolean;
    consent_id: string;
    fail_at?: Date;
    fail_message: string;
    fail_error_class: string;
    created_at: Date;
    updated_at: Date;
    success_at?: Date;
    last_stage: string[];
}

export interface IConnectionData {
    id: string;
    secret: string;
    provider_id: string;
    provider_code: string;
    provider_name: string;
    customer_id: string;
    next_refresh_possible_at?: Date;
    created_at: Date;
    updated_at: Date;
    status: string;
    categorization: string;
    daily_refresh: boolean;
    store_credentials: boolean;
    country_code: string;
    last_success_at?: Date;
    show_consent_confirmation: boolean;
    last_consent_id: string;
    last_attempt: ILastAttempt;
}

export interface IMeta {
    next_id?: string;
    next_page?: string;
}

export interface IAccountData {
    id: string
    connection_id: string
    name: string
    nature: string
    balance: number
    currency_code: string
    extra: any[]
    created_at: string
    updated_at: string
}

export interface ITransactionData {
    id: string
    account_id: string
    duplicated: boolean
    mode: string
    status: string
    made_on: string
    amount: number
    currency_code: string
    description: string
    category: string
    extra: ITransactionExtra
    created_at: string
    updated_at: string
}

export interface ITransactionExtra {
    posting_date: string
    account_number: string
    closing_balance: number
    opening_balance: number
    transfer_account_name?: string
    account_balance_snapshot: number
    categorization_confidence: number
}


export interface IConnection {
    data: IConnectionData[];
    meta: IMeta;
}

export interface IAccount {
    data: IAccountData[]
    meta: IMeta
}

export interface ITransaction {
    data: ITransactionData[]
    meta: IMeta
}


// ----------
// Types for the script

export interface Transaction {
    mode: ITransactionData["mode"];
    status: ITransactionData["status"];
    made_on: ITransactionData["made_on"];
    amount: ITransactionData["amount"]
    currency_code: ITransactionData["currency_code"]
    description: ITransactionData["description"]
    category: ITransactionData["category"]
    created_at: ITransactionData["created_at"]
    updated_at: ITransactionData["updated_at"]
}


export interface Account {
    id: IAccountData["id"];
    name: IAccountData["name"];
    currency: IAccountData["currency_code"];
    transactions: Transaction[];
    balance: IAccountData["balance"];
}

export interface Bank {
    id: IConnectionData["id"];
    name: IConnectionData["provider_name"];
    accounts: Account[];
}
