using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace FacturationService.Models;

public class InscriptionFee
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("studentId")]
    public required string StudentId { get; set; }

    [BsonElement("studentName")]
    public required string StudentName { get; set; }

    [BsonElement("studentEmail")]
    public required string StudentEmail { get; set; }

    [BsonElement("academicYear")]
    public required string AcademicYear { get; set; }

    [BsonElement("amount")]
    public decimal Amount { get; set; }

    [BsonElement("currency")]
    public string Currency { get; set; } = "USD";

    [BsonElement("paymentStatus")]
    public string PaymentStatus { get; set; } = "PENDING"; // PENDING, PAID, PARTIAL, OVERDUE

    [BsonElement("paidAmount")]
    public decimal PaidAmount { get; set; } = 0;

    [BsonElement("dueDate")]
    public DateTime DueDate { get; set; }

    [BsonElement("paymentDate")]
    public DateTime? PaymentDate { get; set; }

    [BsonElement("paymentMethod")]
    public string? PaymentMethod { get; set; } // CASH, CARD, TRANSFER, CHECK

    [BsonElement("transactionId")]
    public string? TransactionId { get; set; }

    [BsonElement("notes")]
    public string? Notes { get; set; }

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("createdBy")]
    public string? CreatedBy { get; set; }

    [BsonElement("updatedBy")]
    public string? UpdatedBy { get; set; }
}
