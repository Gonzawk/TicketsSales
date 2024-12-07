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
---

## 👤 Funcionalidades para Usuarios

La aplicación está diseñada con una interfaz clara y organizada, ofreciendo a los usuarios diferentes menús para gestionar sus datos y operaciones:

### 📄 Menú Usuario
- **Ver y Modificar Datos**:
  - Los usuarios podrán acceder a sus datos personales registrados.
  - Podrán realizar modificaciones según sea necesario, como actualizar su nombre, correo, número de celular o contraseña.

### 🎟️ Menú Eventos
- **Lista de Eventos Disponibles**:
  - Los usuarios podrán visualizar una lista de eventos disponibles, junto con:
    - Nombre del evento.
    - Ubicación.
    - Fecha y hora.
    - Precio por entrada.
    - Cantidad de entradas disponibles.
- **Reserva de Entradas**:
  - Al seleccionar un evento, el usuario puede **reservar una entrada**.
  - Esta acción generará automáticamente un pago pendiente que deberá ser validado por un administrador:
    - **Pago Confirmado**: La entrada será activada y asignada al usuario.
    - **Pago Cancelado**: La entrada será devuelta al stock.
- **Búsqueda de Eventos**:
  - Los usuarios pueden buscar eventos por:
    - **Nombre del Evento**.
    - **Ubicación**.
    - **Fecha**.

### 📋 Menú Entradas
- **Lista de Entradas**:
  - Los usuarios podrán ver una lista completa de las entradas que han adquirido.
  - Cada entrada incluirá información como:
    - Nombre del evento.
    - Ubicación y fecha del evento.
    - Estado de la entrada (Activa, Pendiente de Pago, Cancelada).
- **Detalles de una Entrada**:
  - Los usuarios pueden buscar una entrada específica por su **ID**.
  - Detalles proporcionados:
    - Código QR único asociado a la entrada.
    - Información del evento (nombre, ubicación, fecha).
    - Estado de la entrada.

### 💳 Menú Pagos
- **Lista de Pagos Realizados**:
  - Los usuarios podrán acceder a un historial de todos los pagos generados.
  - Cada pago mostrará detalles como:
    - Fecha del pago.
    - Monto total.
    - Estado del pago (Pendiente, Confirmado, Cancelado).
- **Detalles de un Pago**:
  - Los usuarios pueden buscar un pago específico por su **ID** para ver detalles adicionales.

---

### 🛡️ Notas de Seguridad
- La autenticación está gestionada mediante **JWT**, garantizando un acceso seguro.
- Las contraseñas de los usuarios se almacenan encriptadas utilizando **BCrypt**.
- Cada usuario tiene acceso únicamente a sus datos, entradas y pagos, protegiendo la privacidad.

---
---

## 🛠️ Funcionalidades para Administradores

Los administradores cuentan con un conjunto avanzado de herramientas para gestionar usuarios, eventos, entradas y pagos. Estas funcionalidades están organizadas en menús específicos:

### 👥 Menú Usuarios
- **Lista de Usuarios**:
  - Acceso a una lista de todos los usuarios registrados en el sistema.
  - Detalles disponibles:
    - Nombre.
    - Correo electrónico.
    - Número de celular.
    - Rol asignado.
- **Registrar un Usuario**:
  - Permite al administrador registrar nuevos usuarios ingresando:
    - Nombre.
    - Correo electrónico.
    - Número de celular.
    - Contraseña.
    - **Rol del Usuario** (Usuario o Administrador).

### 🎟️ Menú Eventos
- **Lista de Eventos**:
  - Visualización de todos los eventos registrados, incluyendo:
    - Nombre del evento.
    - Descripción.
    - Ubicación.
    - Fecha y hora.
    - Precio.
    - Cantidad de entradas disponibles.
- **Registrar un Evento**:
  - Permite crear un nuevo evento ingresando los siguientes datos:
    - Nombre.
    - Descripción.
    - Ubicación.
    - Fecha y hora.
    - Cantidad de entradas disponibles.
    - Precio.
  - Los eventos registrados estarán disponibles automáticamente para los usuarios.

### 📋 Menú Entradas
- **Lista de Entradas**:
  - Permite listar todas las entradas creadas, con información como:
    - Evento asociado.
    - ID de la entrada.
    - Usuario que la reservó.
    - Estado de la entrada (Activa, Pendiente, Cancelada, Usada).
- **Detalles de una Entrada**:
  - Permite buscar una entrada específica por su **ID** para acceder a toda la información asociada.
- **Lector QR**:
  - Herramienta clave para validar el uso de entradas en tiempo real:
    - El administrador activa el lector QR y utiliza la cámara para escanear el código QR de la entrada.
    - El sistema verifica el estado de la entrada y devuelve uno de los siguientes resultados:
      - **Confirmado**: La entrada es válida y se registra como usada.
      - **Error**: La entrada no está activa, ya está usada o su estado es inválido.

### 💳 Menú Pagos
- **Lista de Pagos**:
  - Visualización de todos los pagos realizados en el sistema, con detalles como:
    - ID del pago.
    - Monto total.
    - Usuario que realizó el pago.
    - Estado del pago (Pendiente, Confirmado, Cancelado).
- **Detalles de un Pago**:
  - Permite buscar un pago específico por su **ID** para revisar información adicional.
- **Pagos Pendientes**:
  - Lista exclusiva de todos los pagos con estado **Pendiente**.
  - Funcionalidades adicionales:
    - **Confirmar Pago**:
      - El administrador verifica la validez del pago y lo confirma.
      - Al confirmar el pago:
        - La entrada reservada por el usuario se activa y queda lista para su uso.
      - Si el pago no es válido, puede dejarse en estado **Pendiente** o ser cancelado manualmente.

---

### 🔐 Seguridad para Administradores
- Todas las acciones realizadas por el administrador requieren autenticación JWT.
- Solo los usuarios con rol de **Administrador** tienen acceso a estas funcionalidades avanzadas.

---
---

### 📖 Instalacion y configuracion.

**Requisitos Previos**

Antes de comenzar asegurese de tener instalado:
1. Visual Studio (con las cargas de trabajo necesarias para el desarrollo con .NET Core).
2. Visual Studio Code o cualquier otro editor de tu preferencia.
3. Base de datos MySQL(recomiendo SQL Server Management Studio 20).
4. Node .js y npm.
5. React.

---

**Instruciones**
- 1.Abre tu terminal y ejecuta: 
```bash
 git clone <https://github.com/Gonzawk/TicketsSales.git>
```


- 2.Cambia al directorio del proyecto. 
```bash
cd TicketSales
```

 
- 3.Crear la **Base de Datos** (*Script en el proyecto*). 


- 4.Abrir la solucion del proyecto API en **Visual Studio** (`TicketSales.Api.sln`).


- 5.Modificar en este el archivo `appsettings.json` para configurar la cadena de conexión con tu base de datos MySQL. Ejemplo:
```json
{
  "ConnectionStrings": {
     "DefaultConnection": "Servidor=localhost;Base de datos=TicketSalesDB;Id de usuario=<usuario>;Contraseña=<contraseña>;" 
    }
}
```


- 6.Restaura las dependencias de la API ejecutando el siguiente comando en la consola del administrador de paquetes de Visual Studio.
```bash
dotnet restore
```


- 7.Ejecuta la API (presiona **F5** o selecciona la opcion **Iniciar sin depuración** para ejecutar el servidor.


- 8.Abra la carpeta del proyecto de la aplicacion web en **Visual Studio Code**.


- 9.Instala las dependencias de npm necesarias ejecutando:
```bash
npm install 
```


- 10.En este punto solo queda verificar que el frontend tenga configurada correctamente la URL de la API (http://localhost:5000/api/).


**Contribuir**

1.Realiza un fork del repositorio. 

2.Crea una nueva rama para tus cambios: 
```bash 
git checkout -b feature/nueva-funcionalidad
```

3.Realiza tus cambios y subelos a tu repositorio fork.

4.Envia un pull request para revision.

---
---

## 📌 Autor

**👨‍💻 [Gonzalo Daniel Paz]**  _@GonzaDev_
_Full Stack Developer |_  

💼 **Portafolio:** [Portafoliowebgonzalopaz.com](https://portafoliowebgonzalopaz.netlify.app)  
📧 **Correo Electrónico:** [Gonzalopaz@gmail.com](mailto:gdp43191989@gmail.com)  
🌐 **LinkedIn:** [linkedin.com/in/gonzalodpaz](https://linkedin.com/in/gonzalodpaz/)  
🐦 **Twitter:** [@GonzaPaz]([https://x.com/Gonza77])  
📂 **GitHub:** [github.com/Gonzawk](https://github.com/Gonzawk)  

---

> "El desarrollo es más que código" 🚀

