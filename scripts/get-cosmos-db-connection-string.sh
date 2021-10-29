# Gets the connection string for the database
#   To connect from a tool like MongoDB Compass, this is what you need. 

az cosmosdb keys list \
    --type connection-strings \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $COSMOS_ACCOUNT_NAME \
    --query "connectionStrings[?description=='Primary MongoDB Connection String'].connectionString" \
    --output tsv