using System.Runtime.Serialization;

namespace FacturationService.DTOs;

[DataContract]
public class InscriptionFeeDto
{
    [DataMember]
    public string? Id { get; set; }

    [DataMember]
    public required string StudentId { get; set; }

    [DataMember]
    public required string StudentName { get; set; }

    [DataMember]
    public required string StudentEmail { get; set; }

    [DataMember]
    public required string AcademicYear { get; set; }

    [DataMember]
    public decimal Amount { get; set; }

    [DataMember]
    public string Currency { get; set; } = "USD";

    [DataMember]
    public string PaymentStatus { get; set; } = "PENDING";

    [DataMember]
    public decimal PaidAmount { get; set; }

    [DataMember]
    public DateTime DueDate { get; set; }

    [DataMember]
    public DateTime? PaymentDate { get; set; }

    [DataMember]
    public string? PaymentMethod { get; set; }

    [DataMember]
    public string? TransactionId { get; set; }

    [DataMember]
    public string? Notes { get; set; }

    [DataMember]
    public DateTime CreatedAt { get; set; }

    [DataMember]
    public DateTime UpdatedAt { get; set; }
}

[DataContract]
public class PaymentUpdateDto
{
    [DataMember]
    public required string FeeId { get; set; }

    [DataMember]
    public decimal PaidAmount { get; set; }

    [DataMember]
    public required string PaymentMethod { get; set; }

    [DataMember]
    public string? TransactionId { get; set; }

    [DataMember]
    public DateTime PaymentDate { get; set; }

    [DataMember]
    public string? Notes { get; set; }
}

[DataContract]
public class FeeStatisticsDto
{
    [DataMember]
    public int TotalFees { get; set; }

    [DataMember]
    public decimal TotalAmount { get; set; }

    [DataMember]
    public decimal TotalPaid { get; set; }

    [DataMember]
    public decimal TotalPending { get; set; }

    [DataMember]
    public int PaidCount { get; set; }

    [DataMember]
    public int PendingCount { get; set; }

    [DataMember]
    public int OverdueCount { get; set; }
}
