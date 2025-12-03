using FacturationService.Models;

namespace FacturationService.Repositories;

public interface IInscriptionFeeRepository
{
    Task<List<InscriptionFee>> GetAllAsync();
    Task<InscriptionFee?> GetByIdAsync(string id);
    Task<List<InscriptionFee>> GetByStudentIdAsync(string studentId);
    Task<InscriptionFee> CreateAsync(InscriptionFee fee);
    Task<bool> UpdateAsync(string id, InscriptionFee fee);
    Task<bool> UpdatePaymentStatusAsync(string id, string status, decimal paidAmount, 
        string? paymentMethod, string? transactionId, DateTime? paymentDate, string? notes);
    Task<bool> DeleteAsync(string id);
    Task<(int total, decimal totalAmount, decimal totalPaid, int paidCount, int pendingCount, int overdueCount)> GetStatisticsAsync();
}
