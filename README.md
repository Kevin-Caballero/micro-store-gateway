# Gateway Service - Micro Store

🚪 **Gateway Service** es el punto único de entrada para el sistema de microservicios Micro Store. Actúa como API Gateway manejando todas las peticiones HTTP y coordinando la comunicación con los microservicios internos.

## 🎯 Propósito

El Gateway Service es responsable de:

- **Enrutamiento de peticiones** a los microservicios correspondientes
- **Autenticación y autorización** (cuando aplique)
- **Rate limiting** y throttling
- **Composición de respuestas** de múltiples servicios
- **Validación de entrada** usando DTOs compartidas
- **Logging y monitoreo** de todas las peticiones

## 🏗️ Arquitectura

```
Client Request → Gateway → NATS → Microservices
                   ↓
              HTTP Response
```

### Módulos Principales

- **Products Module**: Maneja endpoints relacionados con productos
- **Orders Module**: Gestiona endpoints de órdenes
- **NATS Module**: Configuración del transporte de mensajes

## 📋 API Endpoints

### Products

| Método   | Endpoint        | Descripción                | Body               |
| -------- | --------------- | -------------------------- | ------------------ |
| `GET`    | `/products`     | Listar todos los productos | -                  |
| `GET`    | `/products/:id` | Obtener producto por ID    | -                  |
| `POST`   | `/products`     | Crear nuevo producto       | `CreateProductDto` |
| `PATCH`  | `/products/:id` | Actualizar producto        | `UpdateProductDto` |
| `DELETE` | `/products/:id` | Eliminar producto          | -                  |

### Orders

| Método  | Endpoint      | Descripción              | Body             |
| ------- | ------------- | ------------------------ | ---------------- |
| `GET`   | `/orders`     | Listar todas las órdenes | -                |
| `GET`   | `/orders/:id` | Obtener orden por ID     | -                |
| `POST`  | `/orders`     | Crear nueva orden        | `CreateOrderDto` |
| `PATCH` | `/orders/:id` | Actualizar orden         | `UpdateOrderDto` |

## 🔧 Configuración

### Variables de Entorno

```env
PORT=3000
NATS_SERVERS=nats://nats-server:4222
```

### Dependencias Principales

- **@nestjs/core**: Framework base
- **@nestjs/microservices**: Cliente NATS
- **class-validator**: Validación de DTOs
- **shared**: Librerías compartidas del proyecto

## 🚀 Desarrollo

### Instalación

```bash
npm install
```

### Comandos Disponibles

```bash
# Desarrollo con hot reload
npm run start:dev

# Producción
npm run start:prod

# Build
npm run build

# Tests
npm run test
npm run test:e2e
```

### Desarrollo Local

Para desarrollo local necesitas:

1. **NATS Server** corriendo (puerto 4222)
2. **Products Service** disponible
3. **Orders Service** disponible

```bash
# Opción 1: Solo el gateway (requiere servicios externos)
npm run start:dev

# Opción 2: Usar Docker Compose (desde la raíz del proyecto)
cd ../..
npm start
```

## 🔌 Integración con Microservicios

### Comunicación NATS

El Gateway usa patrones de mensajes para comunicarse:

```typescript
// Ejemplo: Obtener productos
@Get()
async findAll() {
  return this.client.send('findAllProducts', {});
}

// Ejemplo: Crear orden
@Post()
async create(@Body() createOrderDto: CreateOrderDto) {
  return this.client.send('createOrder', createOrderDto);
}
```

### Patrones de Mensajes

| Patrón            | Servicio | Descripción                 |
| ----------------- | -------- | --------------------------- |
| `findAllProducts` | Products | Obtener todos los productos |
| `findOneProduct`  | Products | Obtener un producto         |
| `createProduct`   | Products | Crear producto              |
| `updateProduct`   | Products | Actualizar producto         |
| `removeProduct`   | Products | Eliminar producto           |
| `findAllOrders`   | Orders   | Obtener todas las órdenes   |
| `findOneOrder`    | Orders   | Obtener una orden           |
| `createOrder`     | Orders   | Crear orden                 |
| `updateOrder`     | Orders   | Actualizar orden            |

## 🛡️ Validación y Errores

### DTOs de Validación

```typescript
// Ejemplo de validación
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;
}
```

### Manejo de Errores

- **400 Bad Request**: Datos de entrada inválidos
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error en microservicio
- **503 Service Unavailable**: Microservicio no disponible

## 📊 Monitoreo

### Health Check

```bash
GET /health
```

### Logs

Los logs incluyen:

- Request/Response times
- Error tracking
- NATS message patterns
- Service availability

## 🔗 Enlaces Relacionados

- [Products Service](../products/README.md)
- [Orders Service](../orders/README.md)
- [Shared DTOs](../../shared/README.md)
- [Arquitectura General](../../docs/README.md)

---

**Puerto por defecto**: 3000  
**Framework**: NestJS + TypeScript  
**Transporte**: NATS  
**Autor**: Kevin Caballero
