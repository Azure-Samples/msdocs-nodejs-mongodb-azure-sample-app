RESOURCE_GROUP_NAME='msdocs-expressjs-mongodb-tutorial'


# Removing a resource group will delete all Azure resources inside the resource group!
az group delete \
    --name $RESOURCE_GROUP_NAME