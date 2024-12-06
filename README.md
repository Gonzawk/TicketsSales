# 🎫 TicketSalesApp

**TicketSalesApp** es una aplicación web integral diseñada para la gestión de ventas de entradas, control de accesos mediante códigos QR y administración de roles de usuario. Este proyecto combina una base sólida de backend, un frontend moderno y un enfoque seguro en el manejo de datos y autenticación.

---

## 🚀 Tecnologías Utilizadas

### 📊 Base de Datos
- ![SQL Server](https://img.shields.io/badge/SQL%20Server-CC2927?style=flat&logo=microsoft-sql-server&logoColor=white)  
  **SQL Server**: Utilizamos una base de datos relacional con procedimientos almacenados (**Stored Procedures**) para manejar de manera eficiente las transacciones y consultas complejas.

### 🖥️ Backend
- ![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-512BD4?style=flat&logo=dotnet&logoColor=white)  
  **Framework**: ASP.NET Core programado en **C#**.
- **Estructura del Proyecto**:
  - **Controladores**: Manejan las solicitudes entrantes, delegan la lógica de negocio y responden al cliente.
  - **Servicios**: Contienen la lógica de negocio y aseguran una separación clara de responsabilidades.
  - **Interfaces**: Definen los contratos de los servicios para fomentar la mantenibilidad y escalabilidad.
  - **Modelos**: Representan las entidades de datos y facilitan la interacción con la base de datos.
- **Autenticación y Seguridad**:
  - ![BCrypt](https://img.shields.io/badge/BCrypt-228B22?style=flat&logo=lock&logoColor=white)  
    **BCrypt**: Proporciona encriptación de contraseñas para asegurar los datos de los usuarios.
  - ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=json-web-tokens&logoColor=white)  
    **JWT**: Implementado para autenticación segura y gestión de roles de usuario.
- **Herramientas de Prueba**:
  - ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat&logo=swagger&logoColor=black)  
    **Swagger**: Documentación y pruebas interactivas de la API.
  - ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=flat&logo=postman&logoColor=white)  
    **Postman**: Pruebas adicionales para garantizar la robustez de las URL.

### 🌐 Frontend
- ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)  
  **Framework**: React.
- **Bibliotecas Adicionales**:
  - Generación y lectura de códigos QR para facilitar el acceso y la validación de entradas.
  - Otros componentes para mejorar la experiencia de usuario (UX) y el diseño visual.

---

### 📖 ¿Cómo Funciona?

**TicketSalesApp** sigue principios de arquitectura moderna y profesional:  
1. Las solicitudes de los usuarios son gestionadas por los controladores del backend.  
2. Los servicios manejan la lógica de negocio y se comunican con los procedimientos almacenados en la base de datos.  
3. El frontend React consume la API del backend para ofrecer una experiencia fluida y dinámica.  
4. Los roles de usuario (Administrador y Cliente) se gestionan mediante JWT, garantizando un acceso seguro y basado en permisos.

---
