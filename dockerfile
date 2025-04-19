# ---------- Build React frontend ----------
    FROM node:20 AS frontend-build
    WORKDIR /app
    COPY ordermanager.client/ ./ordermanager.client/
    WORKDIR /app/ordermanager.client
    ENV VITE_DISABLE_HTTPS=true
    RUN npm install
    RUN npm run build
    
    # ---------- Build ASP.NET Core backend ----------
    FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
    WORKDIR /src
    COPY OrderManager.Server/ ./OrderManager.Server/
    COPY --from=frontend-build /app/ordermanager.client/dist ./OrderManager.Server/wwwroot/
    WORKDIR /src/OrderManager.Server
    RUN dotnet restore
    RUN dotnet publish -c Release -o /app/publish
    
    # ---------- Runtime image ----------
    FROM mcr.microsoft.com/dotnet/aspnet:8.0
    WORKDIR /app
    COPY --from=build /app/publish .
    ENTRYPOINT ["dotnet", "OrderManager.Server.dll"]
    