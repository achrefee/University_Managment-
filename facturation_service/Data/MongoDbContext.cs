using MongoDB.Driver;
using FacturationService.Models;

namespace FacturationService.Data;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(IConfiguration configuration)
    {
        // Support environment variable override for Docker
        var connectionString = Environment.GetEnvironmentVariable("MONGODB_URI") 
            ?? configuration["MongoDB:ConnectionString"] 
            ?? "mongodb://localhost:27017";
            
        var databaseName = Environment.GetEnvironmentVariable("MONGODB_DB_NAME")
            ?? configuration["MongoDB:DatabaseName"] 
            ?? "facturation_db";
        
        var client = new MongoClient(connectionString);
        _database = client.GetDatabase(databaseName);
    }

    public IMongoCollection<InscriptionFee> InscriptionFees => 
        _database.GetCollection<InscriptionFee>("inscriptionFees");
}
