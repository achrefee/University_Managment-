using System.ServiceModel;
using FacturationService.DTOs;

namespace FacturationService.Services;

[ServiceContract]
public interface IFacturationService
{
    [OperationContract]
    List<InscriptionFeeDto> GetAllFees(string token);

    [OperationContract]
    InscriptionFeeDto? GetFeeById(string token, string feeId);

    [OperationContract]
    List<InscriptionFeeDto> GetFeesByStudentId(string token, string studentId);

    [OperationContract]
    InscriptionFeeDto CreateFee(string token, InscriptionFeeDto feeDto);

    [OperationContract]
    bool UpdatePaymentStatus(string token, PaymentUpdateDto paymentUpdate);

    [OperationContract]
    bool DeleteFee(string token, string feeId);

    [OperationContract]
    FeeStatisticsDto GetStatistics(string token);
}
