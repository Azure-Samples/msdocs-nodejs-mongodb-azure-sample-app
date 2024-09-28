---
page_type: sample
languages:
- azdeveloper
- javascript
- bicep
products:
- azure
- azure-app-service
- azure-cosmos-db
- azure-virtual-network
- azure-key-vault
- azure-cache-redis
urlFragment: msdocs-nodejs-mongodb-azure-sample-app
name: Deploy a Express.js web app with MongoDB in Azure
description: This is a CRUD web app that uses Express.js and Azure Cosmos DB.
---
<!-- YAML front-matter schema: https://review.learn.microsoft.com/en-us/help/contribute/samples/process/onboarding?branch=main#supported-metadata-fields-for-readmemd -->

# Deploy a Express.js web app with MongoDB in Azure

This is a CRUD (create-read-update-delete) web app that uses Express.js and Azure Cosmos DB. The Node.js app is hosted in a fully managed Azure App Service. This app is designed to be be run locally Linux Node.js container in Azure App Service. You can either deploy this project by following the tutorial [*Tutorial: Deploy a Node.js + MongoDB web app to Azure*](https://learn.microsoft.com/azure/app-service/tutorial-nodejs-mongodb-app) or by using the [Azure Developer CLI (azd)](https://learn.microsoft.com/azure/developer/azure-developer-cli/overview) according to the instructions below.

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

4. Provision and deploy all the resources:

    ```shell
    azd up
    ```

    It will prompt you to create a deployment environment name, pick a subscription, and provide a location (like `westeurope`). Then it will provision the resources in your account and deploy the latest code. If you get an error with deployment, changing the location (like to "centralus") can help, as there may be availability constraints for some of the resources.

5. When `azd` has finished deploying, you'll see an endpoint URI in the command output. Visit that URI, and you should see the CRUD app! 🎉 If you see an error, open the Azure Portal from the URL in the command output, navigate to the App Service, select Logstream, and check the logs for any errors.

6. When you've made any changes to the app code, you can just run:

    ```shell
    azd deploy
    ```

## Getting help

If you're working with this project and running into issues, please post in [Issues](/issues).
