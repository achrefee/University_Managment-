using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace FacturationService.Security;

public class JwtValidator
{
    private readonly IConfiguration _configuration;

    public JwtValidator(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public (bool isValid, ClaimsPrincipal? principal) ValidateToken(string token)
    {
        try
        {
            var secret = _configuration["Jwt:Secret"];
            if (string.IsNullOrEmpty(secret))
            {
                throw new InvalidOperationException("JWT Secret is not configured");
            }

            var key = Encoding.ASCII.GetBytes(secret);
            var tokenHandler = new JwtSecurityTokenHandler();

            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            };

            var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);
            return (true, principal);
        }
        catch (Exception)
        {
            return (false, null);
        }
    }

    public string? GetClaimValue(ClaimsPrincipal principal, string claimType)
    {
        return principal.FindFirst(claimType)?.Value;
    }

    public bool HasRole(ClaimsPrincipal principal, string role)
    {
        var userRole = principal.FindFirst("role")?.Value;
        return userRole == role;
    }

    public bool IsAdmin(ClaimsPrincipal principal)
    {
        return HasRole(principal, "ROLE_ADMIN");
    }
}
