using MongoDB.Driver;
using FacturationService.Data;
using FacturationService.Models;

namespace FacturationService.Repositories;

public class InscriptionFeeRepository : IInscriptionFeeRepository
{
    private readonly IMongoCollection<InscriptionFee> _fees;

    public InscriptionFeeRepository(MongoDbContext context)
    {
        _fees = context.InscriptionFees;
    }

    public async Task<List<InscriptionFee>> GetAllAsync()
    {
        return await _fees.Find(_ => true).ToListAsync();
    }

    public async Task<InscriptionFee?> GetByIdAsync(string id)
    {
        return await _fees.Find(f => f.Id == id).FirstOrDefaultAsync();
    }

    public async Task<List<InscriptionFee>> GetByStudentIdAsync(string studentId)
    {
        return await _fees.Find(f => f.StudentId == studentId).ToListAsync();
    }

    public async Task<InscriptionFee> CreateAsync(InscriptionFee fee)
    {
        fee.CreatedAt = DateTime.UtcNow;
        fee.UpdatedAt = DateTime.UtcNow;
        await _fees.InsertOneAsync(fee);
        return fee;
    }

    public async Task<bool> UpdateAsync(string id, InscriptionFee fee)
    {
        fee.UpdatedAt = DateTime.UtcNow;
        var result = await _fees.ReplaceOneAsync(f => f.Id == id, fee);
        return result.ModifiedCount > 0;
    }

    public async Task<bool> UpdatePaymentStatusAsync(string id, string status, decimal paidAmount,
        string? paymentMethod, string? transactionId, DateTime? paymentDate, string? notes)
    {
        var update = Builders<InscriptionFee>.Update
            .Set(f => f.PaymentStatus, status)
            .Set(f => f.PaidAmount, paidAmount)
            .Set(f => f.PaymentMethod, paymentMethod)
            .Set(f => f.TransactionId, transactionId)
            .Set(f => f.PaymentDate, paymentDate)
            .Set(f => f.Notes, notes)
            .Set(f => f.UpdatedAt, DateTime.UtcNow);

        var result = await _fees.UpdateOneAsync(f => f.Id == id, update);
        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _fees.DeleteOneAsync(f => f.Id == id);
        return result.DeletedCount > 0;
    }

    public async Task<(int total, decimal totalAmount, decimal totalPaid, int paidCount, int pendingCount, int overdueCount)> GetStatisticsAsync()
    {
        var allFees = await GetAllAsync();
        var now = DateTime.UtcNow;

        var total = allFees.Count;
        var totalAmount = allFees.Sum(f => f.Amount);
        var totalPaid = allFees.Sum(f => f.PaidAmount);
        var paidCount = allFees.Count(f => f.PaymentStatus == "PAID");
        var pendingCount = allFees.Count(f => f.PaymentStatus == "PENDING" || f.PaymentStatus == "PARTIAL");
        var overdueCount = allFees.Count(f => (f.PaymentStatus == "PENDING" || f.PaymentStatus == "PARTIAL") && f.DueDate < now);

        return (total, totalAmount, totalPaid, paidCount, pendingCount, overdueCount);
    }
}
