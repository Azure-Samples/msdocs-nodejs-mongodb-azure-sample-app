
LOCATION='eastus'                                        # Use 'az account list-locations --output table' to list locations
RESOURCE_GROUP_NAME='msdocs-expressjs-mongodb-tutorial'

WEB_APP_NAME='msdocs-expressjs-mongodb-123'              # Change 123 to any three characters to form a unique name across Azure
APP_SERVICE_PLAN_NAME='msdocs-expressjs-mongodb-plan-123'    
RUNTIME='NODE|14-lts'                                    # az webapp list-runtimes --linux --output table (For Windows remove --linux flag)

COSMOS_ACCOUNT_NAME='msdocs-expressjs-mongodb-123'       # Replace 123 with any three characters to form a unique name

# Create a resource group
az group create \
    --location $LOCATION \
    --name $RESOURCE_GROUP_NAME

# Create an app service plan
az appservice plan create \
    --name $APP_SERVICE_PLAN_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --sku B1 \
    --is-linux

# Create the web app in the app service
az webapp create \
    --name $WEB_APP_NAME \
    --runtime $RUNTIME \
    --plan $APP_SERVICE_PLAN_NAME \
    --resource-group $RESOURCE_GROUP_NAME 

# Create the Cosmos DB (In MongoDB compatibility mode)
az cosmosdb create \
    --name $COSMOS_ACCOUNT_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --kind MongoDB

# mongoose will automatically create the database if it does not exists.
# You can also create it explicitly by uncommenting the following lines

#MONGO_DATABASE_NAME='azure-todo-app'
#az cosmosdb mongodb database create \
#    -a $COSMOS_ACCOUNT_NAME \
#    --resource-group $RESOURCE_GROUP_NAME \
#    -n $MONGO_DATABASE_NAME


# Get the connection string and put it in an environment variable so it can be used in the next step
COSMOS_DB_CONNECTION_STRING=`az cosmosdb keys list \
    --type connection-strings \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $COSMOS_ACCOUNT_NAME \
    --query "connectionStrings[?description=='Primary MongoDB Connection String'].connectionString" \
    --output tsv`

# Add a DATABSE_URL setting to the web app settings with the value of the connection string
az webapp config appsettings set \
    --name $WEB_APP_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --settings DATABASE_URL=$COSMOS_DB_CONNECTION_STRING
