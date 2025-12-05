using System.Net.Http;
using System.Text.Json;
using System.Security.Claims;

namespace FacturationService.Security;

public class JwtValidator
{
    private readonly IConfiguration _configuration;
    private readonly HttpClient _httpClient;
    private static readonly string OAUTH_SERVICE_URL = "http://localhost:8081";

    public JwtValidator(IConfiguration configuration)
    {
        _configuration = configuration;
        _httpClient = new HttpClient();
    }

    public async Task<(bool isValid, ClaimsPrincipal? principal, OAuthUserInfo? userInfo)> ValidateTokenAsync(string token)
    {
        try
        {
            // URL encode the token to handle special characters
            var encodedToken = Uri.EscapeDataString(token);
            var response = await _httpClient.GetAsync($"{OAUTH_SERVICE_URL}/api/auth/validate?token={encodedToken}");
            
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var userInfo = JsonSerializer.Deserialize<OAuthUserInfo>(content, new JsonSerializerOptions 
                { 
                    PropertyNameCaseInsensitive = true 
                });
                
                if (userInfo != null)
                {
                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Email, userInfo.Email ?? ""),
                        new Claim(ClaimTypes.Name, $"{userInfo.FirstName} {userInfo.LastName}"),
                        new Claim("role", userInfo.Role ?? ""),
                        new Claim("userId", userInfo.UserId ?? "")
                    };
                    
                    var identity = new ClaimsIdentity(claims, "OAuth");
                    var principal = new ClaimsPrincipal(identity);
                    
                    return (true, principal, userInfo);
                }
            }
            
            // Log error for debugging
            Console.WriteLine($"OAuth validation failed. Status: {response.StatusCode}");
            return (false, null, null);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"OAuth validation error: {ex.Message}");
            return (false, null, null);
        }
    }

    // Synchronous wrapper for compatibility
    public (bool isValid, ClaimsPrincipal? principal) ValidateToken(string token)
    {
        var result = ValidateTokenAsync(token).GetAwaiter().GetResult();
        return (result.isValid, result.principal);
    }

    public string? GetClaimValue(ClaimsPrincipal principal, string claimType)
    {
        return principal.FindFirst(claimType)?.Value;
    }

    public bool HasRole(ClaimsPrincipal principal, string role)
    {
        var userRole = principal.FindFirst("role")?.Value;
        // Accept both ROLE_ prefixed and non-prefixed formats
        return userRole == role || userRole == $"ROLE_{role}" || $"ROLE_{userRole}" == role;
    }

    public bool IsAdmin(ClaimsPrincipal principal)
    {
        var role = principal.FindFirst("role")?.Value;
        return role == "ROLE_ADMIN" || role == "ADMIN";
    }
}

public class OAuthUserInfo
{
    public string? Token { get; set; }
    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Role { get; set; }
    public string? UserId { get; set; }
}
