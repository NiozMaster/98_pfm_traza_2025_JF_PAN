# Documentación de Páginas - Sistema de Trazabilidad Alimentaria

## 📋 Resumen

Este documento describe todas las páginas y componentes creados para el TFM 1: Sistema de Trazabilidad Alimentaria con Blockchain.

## 🏗️ Estructura de Páginas

### Páginas Principales

#### 1. `/` - Página Principal
- **Ruta:** `web/src/app/page.tsx`
- **Descripción:** Página de inicio que permite conectar MetaMask y registrar nuevos actores
- **Funcionalidades:**
  - Conexión de wallet (MetaMask)
  - Formulario de registro de actores
  - Información sobre el sistema

#### 2. `/dashboard` - Dashboard Principal
- **Ruta:** `web/src/app/dashboard/page.tsx`
- **Descripción:** Panel de control con estadísticas y accesos rápidos
- **Funcionalidades:**
  - Estadísticas de lotes, eventos y certificados
  - Accesos rápidos a funcionalidades principales
  - Información del sistema

#### 3. `/batches` - Gestión de Lotes
- **Ruta:** `web/src/app/batches/page.tsx`
- **Descripción:** Lista todos los lotes de productos alimentarios
- **Funcionalidades:**
  - Visualización de todos los lotes
  - Acceso rápido para crear nuevo lote
  - Tarjetas informativas de cada lote

#### 4. `/batches/create` - Crear Lote
- **Ruta:** `web/src/app/batches/create/page.tsx`
- **Descripción:** Formulario para crear un nuevo lote
- **Funcionalidades:**
  - Formulario de creación de lote
  - Validación de campos
  - Información sobre el proceso

#### 5. `/batches/[id]` - Detalle de Lote
- **Ruta:** `web/src/app/batches/[id]/page.tsx`
- **Descripción:** Vista detallada de un lote específico
- **Funcionalidades:**
  - Información completa del lote
  - Timeline de eventos
  - Lista de certificados
  - Formularios para registrar eventos y emitir certificados
  - Sistema de tabs para navegación

#### 6. `/events` - Eventos
- **Ruta:** `web/src/app/events/page.tsx`
- **Descripción:** Historial completo de eventos registrados
- **Funcionalidades:**
  - Lista de todos los eventos
  - Filtrado por lote
  - Enlaces a lotes relacionados

#### 7. `/certificates` - Certificados
- **Ruta:** `web/src/app/certificates/page.tsx`
- **Descripción:** Gestión y visualización de certificados
- **Funcionalidades:**
  - Lista de certificados
  - Filtrado por estado (todos, válidos, expirados, revocados)
  - Enlaces a lotes relacionados

#### 8. `/actors` - Actores
- **Ruta:** `web/src/app/actors/page.tsx`
- **Descripción:** Gestión de actores del sistema
- **Funcionalidades:**
  - Lista de actores registrados
  - Formulario de registro de nuevos actores
  - Información de roles y ubicaciones
  - Desactivación de actores (solo admin)

## 🧩 Componentes Reutilizables

### Componentes de Visualización

#### 1. `BatchCard`
- **Ruta:** `web/src/components/BatchCard.tsx`
- **Descripción:** Tarjeta para mostrar información de un lote
- **Props:**
  - `batchId`: ID del lote
  - `product`: Nombre del producto
  - `origin`: Origen del lote
  - `quantity`: Cantidad en kg
  - `status`: Estado del lote
  - `dateCreated`: Fecha de creación

#### 2. `BatchTimeline`
- **Ruta:** `web/src/components/BatchTimeline.tsx`
- **Descripción:** Timeline visual de eventos de un lote
- **Props:**
  - `events`: Array de eventos del lote

#### 3. `CertificateCard`
- **Ruta:** `web/src/components/CertificateCard.tsx`
- **Descripción:** Tarjeta para mostrar información de un certificado
- **Props:**
  - `certificateId`: ID del certificado
  - `certificateType`: Tipo de certificado
  - `issuer`: Emisor del certificado
  - `issuedDate`: Fecha de emisión
  - `expiryDate`: Fecha de expiración
  - `status`: Estado del certificado
  - `batchId`: ID del lote asociado

### Componentes de Formularios

#### 4. `ActorForm`
- **Ruta:** `web/src/components/ActorForm.tsx`
- **Descripción:** Formulario para registrar un nuevo actor
- **Props:**
  - `onSubmit`: Función callback al enviar
  - `isLoading`: Estado de carga

#### 5. `BatchForm`
- **Ruta:** `web/src/components/BatchForm.tsx`
- **Descripción:** Formulario para crear un nuevo lote
- **Props:**
  - `onSubmit`: Función callback al enviar
  - `isLoading`: Estado de carga

#### 6. `EventForm`
- **Ruta:** `web/src/components/EventForm.tsx`
- **Descripción:** Formulario para registrar un evento
- **Props:**
  - `batchId`: ID del lote
  - `onSubmit`: Función callback al enviar
  - `isLoading`: Estado de carga

#### 7. `CertificateForm`
- **Ruta:** `web/src/components/CertificateForm.tsx`
- **Descripción:** Formulario para emitir un certificado
- **Props:**
  - `batchId`: ID del lote
  - `onSubmit`: Función callback al enviar
  - `isLoading`: Estado de carga

### Componentes de Navegación

#### 8. `Header`
- **Ruta:** `web/src/components/Header.tsx`
- **Descripción:** Barra de navegación principal
- **Funcionalidades:**
  - Conexión/desconexión de wallet
  - Navegación entre páginas
  - Visualización de dirección del wallet

## 🎨 Características de Diseño

### Estilos
- Diseño moderno y limpio
- Colores consistentes para estados y roles
- Responsive design
- Transiciones suaves
- Iconos emoji para mejor UX

### Estados de Lotes
- `Created`: Azul (#3b82f6)
- `InTransit`: Naranja (#f59e0b)
- `Processing`: Púrpura (#8b5cf6)
- `QualityCheck`: Verde (#10b981)
- `Exported`: Cyan (#06b6d4)
- `Delivered`: Verde oscuro (#059669)

### Roles de Actores
- `Producer` (Productor): Verde (#10b981)
- `Processor` (Procesador): Azul (#3b82f6)
- `Transporter` (Transportista): Naranja (#f59e0b)
- `Exporter` (Exportador): Púrpura (#8b5cf6)
- `Authority` (Autoridad): Rojo (#ef4444)

### Estados de Certificados
- `Valid`: Verde (#10b981)
- `Expired`: Rojo (#ef4444)
- `Revoked`: Gris (#6b7280)

## 🔌 Integración con Smart Contracts

### TODO: Integraciones Pendientes

Todas las páginas tienen marcadores `// TODO:` donde se debe integrar con el smart contract:

1. **Registro de Actores:** `page.tsx` y `actors/page.tsx`
2. **Creación de Lotes:** `batches/create/page.tsx`
3. **Registro de Eventos:** `batches/[id]/page.tsx` y `events/page.tsx`
4. **Emisión de Certificados:** `batches/[id]/page.tsx` y `certificates/page.tsx`
5. **Carga de Datos:** Todas las páginas tienen funciones `load*()` que necesitan conectarse al smart contract

### Estructura de Datos Esperada

El smart contract debe implementar las siguientes estructuras según el TFM 1:

```solidity
enum BatchStatus { Created, InTransit, Processing, QualityCheck, Exported, Delivered }
enum ActorRole { None, Producer, Processor, Transporter, Exporter, Authority }
enum CertificateStatus { Valid, Expired, Revoked }

struct Batch {
    uint256 id;
    address creator;
    string product;
    string origin;
    uint256 quantity;
    uint256 dateCreated;
    BatchStatus status;
    uint256[] certificateIds;
    uint256[] eventIds;
}

struct BatchEvent {
    uint256 id;
    uint256 batchId;
    string eventType;
    address actor;
    string location;
    uint256 timestamp;
    string metadata;
}

struct Certificate {
    uint256 id;
    uint256 batchId;
    string certificateType;
    string issuer;
    string documentHash;
    uint256 issuedDate;
    uint256 expiryDate;
    CertificateStatus status;
}

struct Actor {
    address actorAddress;
    string name;
    ActorRole role;
    string location;
    bool isActive;
}
```

## 📝 Notas de Implementación

1. **Datos de Ejemplo:** Actualmente todas las páginas usan datos de ejemplo. Deben reemplazarse con llamadas al smart contract.

2. **Validación de Roles:** La validación de roles (quién puede crear lotes, emitir certificados, etc.) debe implementarse en el smart contract.

3. **Manejo de Errores:** Se deben agregar mejores mensajes de error y manejo de excepciones.

4. **Carga Asíncrona:** Todas las operaciones de carga deben mostrar estados de carga apropiados.

5. **Confirmaciones:** Las transacciones blockchain deben mostrar confirmaciones apropiadas.

## 🚀 Próximos Pasos

1. Integrar todas las funciones con el smart contract
2. Agregar manejo de errores más robusto
3. Implementar notificaciones de transacciones
4. Agregar tests unitarios para componentes
5. Optimizar rendimiento de carga de datos
6. Agregar paginación para listas grandes
7. Implementar búsqueda y filtros avanzados

