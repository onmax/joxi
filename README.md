# Joxi

> An **automatic** personal finance tracker for your banks and crypto. All your finance data in Notion. No more manual data entry.

## Features

- 🤖 **Automatic** - Joxi runs every day and automatically updates your Notion database with your transactions.
- 📈 **Data in Notion** - Joxi creates a well-structured database Notion with all your transactions and accounts.
- 📊 **Customizable** - You can customize the database structure and the data that is imported.
- 🏦 **Multi-bank** - Joxi supports multiple banks and crypto wallets.
- 🧑‍💻 **No code** - Joxi is a no-code solution. You don't need to write any code to use it.
- 🛡️ **No custom servers** - You just need to configure a GitHub Action.
- 📦 **Open source** - Joxi is open source and you can contribute to it.
- 📚 **Free** - Joxi is free and you can use it for free.

## How does it work?

1. You grant access to:
   1. Your banks: A GitHub Secret storing your's Nordigen's key, which will allow Joxi to communicate with your banks(through Nordigen).
   2. Your crypto wallets: A GitHub Secret storing your's Coinbase's key, which will allow Joxi to communicate with your crypto wallets in Coinbase.
   3. Your Notion database: A GitHub Secret storing your's Notion API key, which will allow Joxi to write the data to your database.
2. Joxi runs every day using a [GitHub Action](#github-action), and fetches your latest transactions from your banks and crypto wallets using Nordigen and Coinbase APIs.
3. Joxi writes the data to your Notion database.
4. You can now use Notion to analyze your transactions and create reports.

> No one will have access to your data. You can always stop the service at any time.

### GitHub Action

Joxi uses a GitHub Action to run every day and fetch the data. The action is triggered by a cron job, which runs every day at 12:07 AM UTC. You can change this behavior in the source code of the [GitHub Action](/blob/main/.github/workflows/main.yml).

## Requirements

1. A GitHub account.
2. An OB Nordigen account.
3. A Notion account.
4. A bank account or wallet to fetch the data from. Duh.

## Setup

> Before you start, please [fork](/fork) this repository.

1. [Setup in Nordigen](#setup-in-nordigen)
2. [Setup in Coinbase](#setup-in-coinbase)
3. [Setup in Notion](#setup-in-notion)

#### Setup in Nordigen

##### Create the secrets

1. Create an account in [Nordigen OB](https://ob.nordigen.com/signup).
2. Go to [User secrets](https://ob.nordigen.com/user-secrets/) and click in `New Secret Key`. Add a name and allow all the IPs.
3. Create **two** [`New repository secret`](/settings/secrets/actions/new) in GitHub:

   - Name: `NORDIGEN_KEY`. Secret: `ID` token from step 2.
   - Name: `NORDIGEN_SECRET`. Secret: `Key` token from step 2.

##### Creating new connection to a bank.

Learn more about [Nordigen's API](https://nordigen.com/en/account_information_documenation/integration/quickstart_guide/).

---

> You have to do this steps every time you want to connect to a new bank.

This guide will show you how to create an agreement with a bank using Nordigen's UI. You are free to use any other method to create the agreements.

1. Search for your bank in [Nordigen's UI](https://ob.nordigen.com/api/docs#/institutions/retrieve%20all%20supported%20Institutions%20in%20a%20given%20country) and copy the `institution_id`.

> If you don't find your bank, make sure to also search with `payments_enabled` set to `true`.

2. _This step is optional_[^1] Create a new agreement using [Nordigen's UI](https://ob.nordigen.com/api/docs#/agreements/create%20EUA%20v2):

   - Make sure to allow `balances`, `details` and `transactions` in `access_scope` for better results.
   - Change the `institution_id` with the one you copied in step 1.

3. Build the link. Create a new requisitions using [Nordigen's UI](https://ob.nordigen.com/api/docs#/requisitions/requisition%20created):

   - Change the `institution_id` with the one you copied in step 1.
   - If you have create an agreement manually, make siure to change `agreement`.
   - Redirect URL can be a dummy one like `https://example.com`.

[^1] Use this step only if you want to specify other than default end user agreement terms: 90 days of transaction history, 90 days of account access period and full scope of information (details, balances, transactions). If no custom end user agreement is created, default terms will be applied.

#### Setup in Coinbase

TODO

#### Setup in Notion

1. Go to [Notion's Integration page](https://www.notion.com/my-integrations) and create a new integration. Make sure to select: `Read content`, `Update content` and `Insert content`. In `User Capabilities`, you can select `No user information` as no user information will be needed.
2. Copy the `Integration Token`.
3. Create a [`New repository secret`](/settings/secrets/actions/new) in GitHub:

   - Name: `NOTION_TOKEN`
   - Value: `Integration Token` from step 3.

4. Duplicate the [Joxi template](https://onmax.notion.site/Joxi-Template-907135d9cb70445eb99e4f137562353b) and add it to your Notion workspace.
5. Once you have duplicated the template, click on `More options` > `Add connections` > Select your connection you created in step 2.

## Tech stack

- [Nordigen](https://nordigen.com/) - Open Banking API.
- [Coinbase](https://www.coinbase.com/) - Crypto API.
- [Notion](https://www.notion.so/) - Database.
- [GitHub Actions](https://github.com/features/actions)
- [Deno with TypeScript](https://deno.land/)

## Roadmap

- [ ] Improve Notion Template.
- [ ] Add support for [Categorization](https://nordigen.com/en/products/transaction-categorisation/).
- [ ] Add support for Kucoin.