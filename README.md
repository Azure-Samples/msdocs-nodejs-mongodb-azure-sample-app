---
page_type: sample
languages:
- azdeveloper
- javascript
- bicep
products:
- azure
- azure-app-service
- azure-virtual-network
- azure-key-vault
- azure-cache-redis
urlFragment: msdocs-nodejs-mongodb-azure-sample-app
name: Deploy a Express.js web app with MongoDB in Azure
description: This is a CRUD web app that uses Express.js and Azure DocumentDB.
---
<!-- YAML front-matter schema: https://review.learn.microsoft.com/en-us/help/contribute/samples/process/onboarding?branch=main#supported-metadata-fields-for-readmemd -->

# Deploy a Express.js web app with MongoDB in Azure

This is a CRUD (create-read-update-delete) web app that uses Express.js and Azure DocumentDB. The Node.js app is hosted in a fully managed Azure App Service. This app is designed to be be run locally Linux Node.js container in Azure App Service. You can either deploy this project by following the tutorial [*Tutorial: Deploy a Node.js + MongoDB web app to Azure*](https://learn.microsoft.com/azure/app-service/tutorial-nodejs-mongodb-app) or by using the [Azure Developer CLI (azd)](https://learn.microsoft.com/azure/developer/azure-developer-cli/overview) according to the instructions below.

The default azd deployment creates a private Azure DocumentDB managed cluster, not a
Cosmos DB RU-based MongoDB account. Existing application deployments can still use
`AZURE_COSMOS_CONNECTIONSTRING`; local development uses `MONGODB_URI`.

**New environments only:** this template does not migrate data. Do not deploy it over
an existing RU-based environment. Read the [infrastructure, credential, cost, rotation,
and cleanup guidance](infra/README.md) before provisioning.

## Run the sample

This project has a [dev container configuration](.devcontainer/), which makes it easier to develop apps locally, deploy them to Azure, and monitor them. The easiest way to run this sample application is inside a GitHub codespace. Follow these steps:

1. Fork this repository to your account. For instructions, see [Fork a repo](https://docs.github.com/get-started/quickstart/fork-a-repo).

1. From the repository root of your fork, select **Code** > **Codespaces** > **+**.

1. In the codespace terminal, run the following command:

    ```shell
    npm install && npm start
    ```

1. When you see the message `Your application running on port 3000 is available.`, click **Open in Browser**.

### Quick deploy

This project is designed to work well with the [Azure Developer CLI](https://learn.microsoft.com/azure/developer/azure-developer-cli/overview), which makes it easier to develop apps locally, deploy them to Azure, and monitor them. 

🎥 Watch a deployment of the code in [this screencast](https://www.youtube.com/watch?v=JDlZ4TgPKYc).

Steps for deployment:

1. Sign up for a [free Azure account](https://azure.microsoft.com/free/)
2. Install the [Azure Dev CLI](https://learn.microsoft.com/azure/developer/azure-developer-cli/install-azd). (If you opened this repository in a Dev Container, it's already installed for you.)
3. Log in to Azure.

    ```shell
    azd auth login
    ```

4. Provision and deploy all the resources into a **new, uniquely named environment**:

    ```shell
    azd up
    ```

    It will also securely prompt for `documentDbAdministratorPassword` (no default).
    Do not save the password in `.env`, command arguments, or source control.

    It will prompt you to create a deployment environment name, pick a subscription, and provide a location (like `westeurope`). Then it will provision the resources in your account and deploy the latest code. Verify the selected region supports all resources and the chosen DocumentDB configuration before provisioning. Do not retry a different location over an existing environment; review any partially created resources first.

5. When `azd` has finished deploying, you'll see an endpoint URI in the command output. Visit that URI, and you should see the CRUD app! 🎉 If you see an error, open the Azure Portal from the URL in the command output, navigate to the App Service, select Logstream, and check the logs for any errors.

6. When you've made any changes to the app code, you can just run:

    ```shell
    azd deploy
    ```

## Local validation

```shell
node --test tests/database.test.js
# Requires Bicep on PATH (or set BICEP_BIN to its executable path):
node --test tests/infrastructure.test.js
```

These are offline checks, not deployment or database connectivity tests. See
[cloud acceptance and cleanup](infra/README.md#local-checks-and-cloud-acceptance).

## Getting help

If you're working with this project and running into issues, please post in [Issues](/issues).
