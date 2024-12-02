using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TicketSalesAPI.Models;
using TicketSalesAPI.Services.Interfaces;

namespace TicketSalesAPI.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;  // Para leer la configuración de appsettings.json

        public AuthService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateJwtToken(User user)
        {
            // Asegúrate de que el usuario tiene la propiedad UsuarioId y Rol configurados correctamente.
            var claims = new[]
            {
        new Claim(ClaimTypes.NameIdentifier, user.UsuarioId.ToString()), // ID del usuario
        new Claim(ClaimTypes.Name, user.Nombre), // Nombre del usuario (puedes cambiarlo si usas otro campo como nombre)
        new Claim(ClaimTypes.Role, user.Rol), // Rol del usuario
        new Claim("UserId", user.UsuarioId.ToString()) // Agregar el claim UserId si lo necesitas explícitamente
    };

            var secretKey = _configuration["Jwt:SecretKey"]; // Asegúrate de que este valor esté en appsettings.json
            var issuer = _configuration["Jwt:Issuer"]; // Asegúrate de que este valor esté en appsettings.json
            var audience = _configuration["Jwt:Audience"]; // Asegúrate de que este valor esté en appsettings.json

            if (string.IsNullOrEmpty(secretKey) || string.IsNullOrEmpty(issuer) || string.IsNullOrEmpty(audience))
            {
                throw new InvalidOperationException("JWT settings are not configured properly.");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }



        public bool ValidateJwtToken(string token)
        {
            try
            {
                // Obtener los valores desde el appsettings.json
                var secretKey = _configuration["Jwt:SecretKey"];
                var issuer = _configuration["Jwt:Issuer"];
                var audience = _configuration["Jwt:Audience"];

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

                var tokenHandler = new JwtSecurityTokenHandler();
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidIssuer = issuer,
                    ValidAudience = audience,
                    IssuerSigningKey = key
                }, out var validatedToken);

                return true;
            }
            catch
            {
                return false;  // Si el token no es válido, se atrapa la excepción y se retorna falso
            }
        }
    }
}
