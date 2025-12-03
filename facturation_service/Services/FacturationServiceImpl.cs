using System.ServiceModel;
using FacturationService.DTOs;
using FacturationService.Models;
using FacturationService.Repositories;
using FacturationService.Security;

namespace FacturationService.Services;

public class FacturationServiceImpl : IFacturationService
{
    private readonly IInscriptionFeeRepository _repository;
    private readonly JwtValidator _jwtValidator;

    public FacturationServiceImpl(
        IInscriptionFeeRepository repository,
        JwtValidator jwtValidator)
    {
        _repository = repository;
        _jwtValidator = jwtValidator;
    }

    private void ValidateAdminToken(string token)
    {
        if (string.IsNullOrEmpty(token))
        {
            throw new FaultException("Authentication token is required");
        }

        var (isValid, principal) = _jwtValidator.ValidateToken(token);
        if (!isValid || principal == null)
        {
            throw new FaultException("Invalid or expired token");
        }

        if (!_jwtValidator.IsAdmin(principal))
        {
            throw new FaultException("Access denied. Admin privileges required.");
        }
    }

    public List<InscriptionFeeDto> GetAllFees(string token)
    {
        ValidateAdminToken(token);

        var fees = _repository.GetAllAsync().Result;
        return fees.Select(MapToDto).ToList();
    }

    public InscriptionFeeDto? GetFeeById(string token, string feeId)
    {
        ValidateAdminToken(token);

        var fee = _repository.GetByIdAsync(feeId).Result;
        return fee != null ? MapToDto(fee) : null;
    }

    public List<InscriptionFeeDto> GetFeesByStudentId(string token, string studentId)
    {
        ValidateAdminToken(token);

        var fees = _repository.GetByStudentIdAsync(studentId).Result;
        return fees.Select(MapToDto).ToList();
    }

    public InscriptionFeeDto CreateFee(string token, InscriptionFeeDto feeDto)
    {
        ValidateAdminToken(token);

        var fee = new InscriptionFee
        {
            StudentId = feeDto.StudentId,
            StudentName = feeDto.StudentName,
            StudentEmail = feeDto.StudentEmail,
            AcademicYear = feeDto.AcademicYear,
            Amount = feeDto.Amount,
            Currency = feeDto.Currency,
            PaymentStatus = feeDto.PaymentStatus,
            PaidAmount = feeDto.PaidAmount,
            DueDate = feeDto.DueDate,
            PaymentDate = feeDto.PaymentDate,
            PaymentMethod = feeDto.PaymentMethod,
            TransactionId = feeDto.TransactionId,
            Notes = feeDto.Notes
        };

        var createdFee = _repository.CreateAsync(fee).Result;
        return MapToDto(createdFee);
    }

    public bool UpdatePaymentStatus(string token, PaymentUpdateDto paymentUpdate)
    {
        ValidateAdminToken(token);

        // Calculate new status based on paid amount
        var fee = _repository.GetByIdAsync(paymentUpdate.FeeId).Result;
        if (fee == null)
        {
            throw new FaultException("Fee not found");
        }

        var newPaidAmount = paymentUpdate.PaidAmount;
        var status = newPaidAmount >= fee.Amount ? "PAID" 
            : newPaidAmount > 0 ? "PARTIAL" 
            : "PENDING";

        return _repository.UpdatePaymentStatusAsync(
            paymentUpdate.FeeId,
            status,
            newPaidAmount,
            paymentUpdate.PaymentMethod,
            paymentUpdate.TransactionId,
            paymentUpdate.PaymentDate,
            paymentUpdate.Notes
        ).Result;
    }

    public bool DeleteFee(string token, string feeId)
    {
        ValidateAdminToken(token);
        return _repository.DeleteAsync(feeId).Result;
    }

    public FeeStatisticsDto GetStatistics(string token)
    {
        ValidateAdminToken(token);

        var stats = _repository.GetStatisticsAsync().Result;
        return new FeeStatisticsDto
        {
            TotalFees = stats.total,
            TotalAmount = stats.totalAmount,
            TotalPaid = stats.totalPaid,
            TotalPending = stats.totalAmount - stats.totalPaid,
            PaidCount = stats.paidCount,
            PendingCount = stats.pendingCount,
            OverdueCount = stats.overdueCount
        };
    }

    private static InscriptionFeeDto MapToDto(InscriptionFee fee)
    {
        return new InscriptionFeeDto
        {
            Id = fee.Id,
            StudentId = fee.StudentId,
            StudentName = fee.StudentName,
            StudentEmail = fee.StudentEmail,
            AcademicYear = fee.AcademicYear,
            Amount = fee.Amount,
            Currency = fee.Currency,
            PaymentStatus = fee.PaymentStatus,
            PaidAmount = fee.PaidAmount,
            DueDate = fee.DueDate,
            PaymentDate = fee.PaymentDate,
            PaymentMethod = fee.PaymentMethod,
            TransactionId = fee.TransactionId,
            Notes = fee.Notes,
            CreatedAt = fee.CreatedAt,
            UpdatedAt = fee.UpdatedAt
        };
    }
}
