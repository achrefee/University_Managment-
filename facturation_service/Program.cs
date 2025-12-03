using FacturationService.Data;
using FacturationService.Repositories;
using FacturationService.Security;
using FacturationService.Services;
using SoapCore;
using System.ServiceModel.Channels;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddSingleton<MongoDbContext>();
builder.Services.AddSingleton<IInscriptionFeeRepository, InscriptionFeeRepository>();
builder.Services.AddSingleton<JwtValidator>();
builder.Services.AddScoped<IFacturationService, FacturationServiceImpl>();

builder.Services.AddSoapCore();

var app = builder.Build();

// Configure SOAP endpoint
((IApplicationBuilder)app).UseSoapEndpoint<IFacturationService>(
    "/FacturationService.asmx",
    new SoapEncoderOptions
    {
        MessageVersion = MessageVersion.Soap11,
        WriteEncoding = System.Text.Encoding.UTF8
    },
    SoapSerializer.DataContractSerializer
);

// Health check endpoint
app.MapGet("/health", () => new 
{ 
    status = "healthy", 
    service = "facturation-service",
    timestamp = DateTime.UtcNow 
});

// Root endpoint
app.MapGet("/", () => new
{
    message = "Facturation Service",
    wsdl = "/FacturationService.asmx?wsdl",
    health = "/health"
});

var port = builder.Configuration.GetValue<int>("ServiceSettings:Port", 8083);
app.Run($"http://0.0.0.0:{port}");
