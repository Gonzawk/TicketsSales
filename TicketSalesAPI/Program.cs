using Microsoft.EntityFrameworkCore; // Para usar EF Core
using TicketSalesAPI.Data;
using TicketSalesAPI.Services.Implementations;
using TicketSalesAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Configuraci�n para el servicio de usuarios
builder.Services.AddScoped<IUserService, UserService>();

// Configuraci�n para el servicio de eventos
builder.Services.AddScoped<IEventoService, EventoService>();

// Configuraci�n para el servicio de tickets
builder.Services.AddScoped<ITicketService, TicketService>();

// Configuraci�n para el servicio de autenticaci�n (JWT)
builder.Services.AddScoped<IAuthService, AuthService>();



// Configuraci�n del DataContext para conectar con la base de datos
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// Configuraci�n para la autenticaci�n JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]))
        };
    });

// Configuraci�n para habilitar CORS (Cross-Origin Resource Sharing)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.WithOrigins("http://localhost", "http://localhost:3000", "http://192.168.0.155:3000")  // Aqu� agregas la IP de tu celular
              .AllowAnyHeader()  // Permitir cualquier cabecera
              .AllowAnyMethod()  // Permitir cualquier m�todo (GET, POST, PUT, DELETE)
              .AllowCredentials();  // Permitir credenciales (como cookies, autenticaci�n)
    });
});

// Agregar controladores de API y configuraci�n de JSON para evitar ciclos de referencia
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });


// Habilitar Swagger para documentaci�n de API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuraci�n del pipeline de solicitudes HTTP
var app = builder.Build();

// Configuraci�n del pipeline de solicitudes HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection(); // Asegura que las solicitudes se redirijan a HTTPS

// Habilitar CORS
app.UseCors("AllowSpecificOrigins"); // Usamos la pol�tica de CORS definida

// Habilitar autenticaci�n y autorizaci�n
app.UseAuthentication(); // Esta l�nea debe ir antes de UseAuthorization
app.UseAuthorization();  // Habilitar la autorizaci�n

// Mapea las rutas de los controladores
app.MapControllers();

// Inicia la aplicaci�n
app.Run();
