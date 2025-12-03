using MongoDB.Driver;
using FacturationService.Models;

namespace FacturationService.Data;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(IConfiguration configuration)
    {
        var connectionString = configuration["MongoDB:ConnectionString"];
        var databaseName = configuration["MongoDB:DatabaseName"];
        
        var client = new MongoClient(connectionString);
        _database = client.GetDatabase(databaseName);
    }

    public IMongoCollection<InscriptionFee> InscriptionFees => 
        _database.GetCollection<InscriptionFee>("inscriptionFees");
}
