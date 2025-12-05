# Facturation Service Dockerfile (.NET)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS builder

WORKDIR /app

# Copy csproj and restore
COPY *.csproj ./
RUN dotnet restore

# Copy everything and build
COPY . .
RUN dotnet publish -c Release -o out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0

WORKDIR /app

# Copy published output
COPY --from=builder /app/out .

# Expose port
EXPOSE 8083

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8083/health || exit 1

# Run application
ENTRYPOINT ["dotnet", "FacturationService.dll"]
