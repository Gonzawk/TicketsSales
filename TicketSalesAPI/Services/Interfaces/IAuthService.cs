using TicketSalesAPI.Models;

namespace TicketSalesAPI.Services.Interfaces
{
    public interface IAuthService
    {
        string GenerateJwtToken(User user);  // Genera el token JWT
        bool ValidateJwtToken(string token);  // Valida el token JWT
    }
}
