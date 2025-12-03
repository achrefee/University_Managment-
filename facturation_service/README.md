# Facturation Service - .NET C# SOAP

## Overview
.NET C# SOAP web service for managing student inscription fees with admin-only access. This service integrates with the OAuth service for JWT authentication and uses the same MongoDB database.

## Features
- ✅ SOAP Web Service with WSDL
- ✅ JWT authentication integration
- ✅ Admin-only access control
- ✅ Inscription fee management
- ✅ Payment status tracking
- ✅ Fee statistics and reporting
- ✅ MongoDB integration (shared database)

## Technology Stack
- **.NET 8.0** - Framework
- **SoapCore** - SOAP implementation
- **MongoDB.Driver** - Database access
- **System.IdentityModel.Tokens.Jwt** - JWT validation

## Prerequisites
- .NET 8.0 SDK or higher
- MongoDB running on localhost:27017
- OAuth service running on localhost:8081

## Project Structure

```
facturation_service/
├── Models/
│   └── InscriptionFee.cs           # MongoDB model
├── DTOs/
│   └── InscriptionFeeDto.cs        # SOAP data contracts
├── Data/
│   └── MongoDbContext.cs           # MongoDB connection
├── Repositories/
│   ├── IInscriptionFeeRepository.cs
│   └── InscriptionFeeRepository.cs # Database operations
├── Security/
│   └── JwtValidator.cs             # JWT authentication
├── Services/
│   ├── IFacturationService.cs      # SOAP interface
│   └── FacturationServiceImpl.cs   # SOAP implementation
├── Program.cs                       # Application entry point
├── appsettings.json                # Configuration
└── FacturationService.csproj       # Project file
```

## Installation

### 1. Restore Dependencies
```bash
cd facturation_service
dotnet restore
```

### 2. Build Project
```bash
dotnet build
```

## Configuration

Edit `appsettings.json`:

```json
{
  "MongoDB": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "university_oauth"
  },
  "Jwt": {
    "Secret": "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970"
  },
  "ServiceSettings": {
    "Port": 8083,
    "Path": "/FacturationService.asmx"
  }
}
```

**Important**: The `Jwt.Secret` must match the OAuth service!

## Running the Service

```bash
dotnet run
```

The service will start on: `http://localhost:8083`

WSDL: `http://localhost:8083/FacturationService.asmx?wsdl`

## SOAP Operations

### 1. Get All Fees (Admin Only)
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:tem="http://tempuri.org/">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:GetAllFees>
         <tem:token>YOUR_ADMIN_JWT_TOKEN</tem:token>
      </tem:GetAllFees>
   </soapenv:Body>
</soapenv:Envelope>
```

**Response:**
```xml
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
   <s:Body>
      <GetAllFeesResponse xmlns="http://tempuri.org/">
         <GetAllFeesResult>
            <InscriptionFeeDto>
               <Id>507f1f77bcf86cd799439011</Id>
               <StudentId>STU001</StudentId>
               <StudentName>John Doe</StudentName>
               <StudentEmail>john@university.edu</StudentEmail>
               <AcademicYear>2024-2025</AcademicYear>
               <Amount>5000.00</Amount>
               <Currency>USD</Currency>
               <PaymentStatus>PAID</PaymentStatus>
               <PaidAmount>5000.00</PaidAmount>
               <DueDate>2024-09-01T00:00:00</DueDate>
               <PaymentDate>2024-08-15T10:30:00</PaymentDate>
               <PaymentMethod>CARD</PaymentMethod>
               <TransactionId>TXN123456</TransactionId>
            </InscriptionFeeDto>
         </GetAllFeesResult>
      </GetAllFeesResponse>
   </s:Body>
</s:Envelope>
```

### 2. Get Fee by Student ID
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:tem="http://tempuri.org/">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:GetFeesByStudentId>
         <tem:token>YOUR_ADMIN_JWT_TOKEN</tem:token>
         <tem:studentId>STU001</tem:studentId>
      </tem:GetFeesByStudentId>
   </soapenv:Body>
</soapenv:Envelope>
```

### 3. Create New Fee
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:tem="http://tempuri.org/">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:CreateFee>
         <tem:token>YOUR_ADMIN_JWT_TOKEN</tem:token>
         <tem:feeDto>
            <StudentId>STU002</StudentId>
            <StudentName>Jane Smith</StudentName>
            <StudentEmail>jane@university.edu</StudentEmail>
            <AcademicYear>2024-2025</AcademicYear>
            <Amount>5000.00</Amount>
            <Currency>USD</Currency>
            <PaymentStatus>PENDING</PaymentStatus>
            <PaidAmount>0</PaidAmount>
            <DueDate>2024-09-01T00:00:00</DueDate>
         </tem:feeDto>
      </tem:CreateFee>
   </soapenv:Body>
</soapenv:Envelope>
```

### 4. Update Payment Status
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:tem="http://tempuri.org/">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:UpdatePaymentStatus>
         <tem:token>YOUR_ADMIN_JWT_TOKEN</tem:token>
         <tem:paymentUpdate>
            <FeeId>507f1f77bcf86cd799439011</FeeId>
            <PaidAmount>5000.00</PaidAmount>
            <PaymentMethod>CARD</PaymentMethod>
            <TransactionId>TXN789012</TransactionId>
            <PaymentDate>2024-08-20T14:30:00</PaymentDate>
            <Notes>Full payment received</Notes>
         </tem:paymentUpdate>
      </tem:UpdatePaymentStatus>
   </soapenv:Body>
</soapenv:Envelope>
```

### 5. Get Statistics
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:tem="http://tempuri.org/">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:GetStatistics>
         <tem:token>YOUR_ADMIN_JWT_TOKEN</tem:token>
      </tem:GetStatistics>
   </soapenv:Body>
</soapenv:Envelope>
```

**Response:**
```xml
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
   <s:Body>
      <GetStatisticsResponse xmlns="http://tempuri.org/">
         <GetStatisticsResult>
            <TotalFees>150</TotalFees>
            <TotalAmount>750000.00</TotalAmount>
            <TotalPaid>600000.00</TotalPaid>
            <TotalPending>150000.00</TotalPending>
            <PaidCount>120</PaidCount>
            <PendingCount>25</PendingCount>
            <OverdueCount>5</OverdueCount>
         </GetStatisticsResult>
      </GetStatisticsResponse>
   </s:Body>
</s:Envelope>
```

### 6. Delete Fee
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:tem="http://tempuri.org/">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:DeleteFee>
         <tem:token>YOUR_ADMIN_JWT_TOKEN</tem:token>
         <tem:feeId>507f1f77bcf86cd799439011</tem:feeId>
      </tem:DeleteFee>
   </soapenv:Body>
</soapenv:Envelope>
```

## InscriptionFee Model

```csharp
{
  "Id": "string",
  "StudentId": "string",
  "StudentName": "string",
  "StudentEmail": "string",
  "AcademicYear": "string",
  "Amount": decimal,
  "Currency": "string",
  "PaymentStatus": "PENDING|PAID|PARTIAL|OVERDUE",
  "PaidAmount": decimal,
  "DueDate": "DateTime",
  "PaymentDate": "DateTime?",
  "PaymentMethod": "CASH|CARD|TRANSFER|CHECK",
  "TransactionId": "string?",
  "Notes": "string?",
  "CreatedAt": "DateTime",
  "UpdatedAt": "DateTime"
}
```

## Access Control

All operations require **Admin** privileges:
- Token must contain `role: "ROLE_ADMIN"`
- Invalid or expired tokens result in SOAP fault
- Non-admin users receive access denied fault

## Testing with SoapUI

1. **Create new SOAP project** in SoapUI
2. **Set WSDL**: `http://localhost:8083/FacturationService.asmx?wsdl`
3. **Get Admin Token** from OAuth service:
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@university.edu",
    "password": "adminPassword"
  }'
```
4. **Use token** in SOAP requests
5. **Execute operations**

## Error Handling

SOAP faults are returned for:
- Missing or invalid JWT token
- Expired token
- Insufficient privileges (non-admin)
- Fee not found
- Validation errors

**Example Fault:**
```xml
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
   <s:Body>
      <s:Fault>
         <faultcode>s:Client</faultcode>
         <faultstring>Access denied. Admin privileges required.</faultstring>
      </s:Fault>
   </s:Body>
</s:Envelope>
```

## Integration with OAuth Service

1. **Shared Database**: Uses `university_oauth` MongoDB database
2. **JWT Verification**: Validates tokens using same secret
3. **Role Extraction**: Gets user role from JWT claims
4. **Admin-Only**: All operations require ROLE_ADMIN

## Payment Status Workflow

1. **PENDING**: Fee created, no payment
2. **PARTIAL**: Partial payment made
3. **PAID**: Full payment received
4. **OVERDUE**: Past due date with pending/partial status

Status is automatically calculated when updating payment.

## MongoDB Collection

Collection name: `inscriptionFees`

Indexes recommended:
```javascript
db.inscriptionFees.createIndex({ "studentId": 1 })
db.inscriptionFees.createIndex({ "paymentStatus": 1 })
db.inscriptionFees.createIndex({ "dueDate": 1 })
db.inscriptionFees.createIndex({ "academicYear": 1 })
```

## Health Check

```bash
curl http://localhost:8083/health
```

Response:
```json
{
  "status": "healthy",
  "service": "facturation-service",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Development

### Build
```bash
dotnet build
```

### Run
```bash
dotnet run
```

### Watch Mode
```bash
dotnet watch run
```

## Production Checklist

- [ ] Update JWT Secret
- [ ] Configure production MongoDB URI
- [ ] Enable HTTPS
- [ ] Add logging and monitoring
- [ ] Implement rate limiting
- [ ] Add comprehensive tests
- [ ] Set up CI/CD pipeline
- [ ] Configure reverse proxy (nginx/IIS)

## Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running on localhost:27017
- Check connection string in appsettings.json

### 401 Unauthorized
- Verify JWT Secret matches OAuth service
- Check token is valid and not expired
- Ensure token format: entire JWT string (not "Bearer ...")

### 403 Forbidden
- Verify user has ADMIN role
- Check token was issued to admin user

### WSDL Not Loading
- Ensure service is running
- Check firewall settings
- Verify port 8083 is available

## License
[Your License]

## Contact
[Your Contact Information]
