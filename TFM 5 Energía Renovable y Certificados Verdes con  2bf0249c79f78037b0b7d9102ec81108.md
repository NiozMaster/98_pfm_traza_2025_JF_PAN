# TFM 5: Energía Renovable y Certificados Verdes con Blockchain

## Plataforma Blockchain para Trazabilidad Energética y Certificados Verdes

**Máster en Blockchain · Trabajo Final de Máster**

---

## Índice de Contenidos

1. Descripción del Proyecto TFM
2. Contexto del Sector Energético
3. Problemas Reales a Resolver
4. Aspectos Clave del TFM
5. Componentes Recomendados del MVP
6. Proyecto de Referencia: Power Ledger
7. Datos del Proyecto Power Ledger
8. Tecnologías y Modelo de Negocio
9. Cómo Inspirarse sin Copiar

---

## 1. Descripción del Proyecto TFM

**Título provisional:** "Plataforma Blockchain para Trazabilidad Energética y Certificados Verdes"

El alumno deberá desarrollar un MVP que registre la generación y consumo energético de una instalación renovable ficticia (solar, eólica, microhidro, biogás...). El objetivo es tokenizar la energía producida, emitir certificados verdes verificables y construir un sistema transparente de trazabilidad energética.

### Objetivo Formativo

Implementar:

- **Registro periódico de energía producida:** Simulación de datos de generación (cada X minutos/horas)
- **Tokenización de energía:** kWh → tokens o créditos verdes
- **Certificados verdes verificables:** Emisión digital de certificados renovables
- **Dashboard energético:** Visualización de producción/consumo en tiempo real
- **Mercado P2P (opcional):** Comercio peer-to-peer de energía entre prosumidores

### Resultado Esperado

Dashboard con gráficas de producción/consumo, histórico de certificados verdes y verificaciones en blockchain que demuestren el origen renovable de la energía.

---

## 2. Contexto del Sector Energético

El sector energético está en plena transición hacia fuentes renovables. La trazabilidad energética es necesaria para:

- **Certificados verdes:** Demostrar origen renovable de la energía
- **Garantías de origen:** Acreditar que la energía consumida es limpia
- **Medición transparente:** Registro preciso de producción y consumo
- **Acuerdos PPA (Power Purchase Agreement):** Contratos entre productores y consumidores
- **Comercio P2P:** Intercambio de energía entre prosumidores

### Tipos de Energía Renovable

| **Fuente** | **Características** |
| --- | --- |
| **Solar fotovoltaica** | Paneles solares, producción diurna variable |
| **Eólica** | Aerogeneradores, producción según viento |
| **Hidroeléctrica** | Centrales mini-hidro, producción constante |
| **Biomasa/Biogás** | Combustión de materia orgánica |
| **Geotérmica** | Calor del subsuelo |

---

## 3. Problemas Reales a Resolver

### Certificados Duplicados o Falsificados

Certificados verdes que pueden ser vendidos múltiples veces o falsificados sin forma efectiva de verificación.

### Falta de Registros Precisos por Instalación

Dificultad para rastrear exactamente cuánta energía renovable produce cada instalación en tiempo real.

### Empresas que No Pueden Auditar Consumo Renovable Real

Compañías que compran "energía verde" sin poder verificar realmente de dónde proviene.

### Falta de Tokenización de Energía Generada

Imposibilidad de representar digitalmente la energía como activo transferible.

### Mercados Centralizados Opacos

Comercio de energía y certificados controlado por intermediarios sin transparencia.

---

## 4. Aspectos Clave a Tener en Cuenta en el TFM

### 1. Generación de Energía Simulada

Crear datos de producción energética realistas:

**Ejemplo solar:**

- Producción nula de noche (00:00-06:00)
- Rampa ascendente (06:00-12:00)
- Pico al mediodía (12:00-14:00)
- Rampa descendente (14:00-20:00)
- Variabilidad por nubes

**Fuentes de datos:**

- Simulación con funciones matemáticas
- APIs meteorológicas (opcional)
- Datasets históricos de producción

### 2. Registro Periódico On-Chain

Definir frecuencia de registro:

- **Tiempo real (cada minuto):** Muy costoso en blockchain pública
- **Cada hora:** Balance entre precisión y costo
- **Cada día:** Registro diario agregado (más económico)
- **Rollups:** Agregar múltiples lecturas en una sola transacción

### 3. Tokenización

Convertir kWh en tokens digitales:

**Opciones:**

- **1 token = 1 kWh:** Representación directa
- **1 token = 10 kWh:** Reducir cantidad de tokens
- **Tokens no fungibles (NFT):** Para lotes específicos de energía
- **Tokens fungibles (ERC-20):** Para energía intercambiable

**Ejemplo:**

```
Planta solar produce 100 kWh en 1 hora
→ Se mintean 100 tokens de energía solar
→ Tokens pueden ser transferidos/vendidos

```

### 4. Certificados Verdes Verificables

Emitir certificados digitales que acrediten origen renovable:

**Datos del certificado:**

- Instalación generadora (nombre, ubicación, tipo)
- Cantidad de energía (kWh)
- Periodo de generación (fecha/hora)
- Hash del certificado en blockchain
- Firma digital del operador

**Estándares:**

- RECs (Renewable Energy Certificates)
- GOs (Guarantees of Origin) - Europa
- I-RECs (International RECs)

### 5. Dashboard de Producción

Visualización clara para usuarios:

**Gráficas esenciales:**

- Producción en tiempo real (gauge/medidor)
- Histórico de producción (línea temporal)
- Comparativa producción vs consumo
- Certificados verdes emitidos
- Tokens de energía disponibles

**Tecnologías recomendadas:**

- Chart.js / Recharts / D3.js
- Actualización en tiempo real (WebSockets/polling)

### 6. Mercado P2P (Opcional Avanzado)

Permitir intercambio de energía entre usuarios:

**Escenario:**

- Casa A tiene excedente solar → vende tokens
- Casa B necesita energía → compra tokens
- Smart contract gestiona la transacción automáticamente

**Consideraciones:**

- Precio dinámico (oferta/demanda)
- Matching de órdenes (order book)
- Liquidación automática

---

## 5. Componentes Recomendados del MVP

### 5.1. Smart Contract

El contrato inteligente debe incluir como mínimo las siguientes estructuras:

```solidity
// ⚠️ TU TAREA: Definir estos enums
enum EnergySource { Solar, Wind, Hydro, Biomass, Geothermal }
enum CertificateStatus { Valid, Retired, Revoked }
enum OrderStatus { Open, Filled, Cancelled }

// ⚠️ TU TAREA: Implementar estos structs
struct Installation {
    uint256 id;
    address owner;
    string name;
    string location;
    EnergySource energySource;
    uint256 capacity;         // Capacidad en kW
    uint256 dateRegistered;
    uint256 totalGenerated;   // Total kWh generados
    bool isActive;
}

struct GenerationRecord {
    uint256 id;
    uint256 installationId;
    uint256 kwh;
    uint256 timestamp;
    int256 temperature;       // Temperatura ambiente * 10
    string weatherConditions; // "Soleado", "Nublado", etc.
}

struct GreenCertificate {
    uint256 id;
    uint256 installationId;
    uint256 energyAmount;     // kWh certificados
    uint256 issuedDate;
    uint256 periodStart;
    uint256 periodEnd;
    CertificateStatus status;
    address owner;
    string metadataURI;       // IPFS con detalles
}

struct TradeOrder {
    uint256 id;
    address seller;
    uint256 certificateId;
    uint256 pricePerKwh;      // Precio en wei por kWh
    OrderStatus status;
    uint256 createdAt;
}

struct Actor {
    address actorAddress;
    string name;
    string actorType;         // "Producer", "Consumer", "Prosumer"
    bool isActive;
}

// Variables de estado
address public admin;
uint256 public nextInstallationId = 1;
uint256 public nextRecordId = 1;
uint256 public nextCertificateId = 1;
uint256 public nextOrderId = 1;

// Mappings
mapping(uint256 => Installation) public installations;
mapping(uint256 => GenerationRecord) public generationRecords;
mapping(uint256 => GreenCertificate) public certificates;
mapping(uint256 => TradeOrder) public tradeOrders;
mapping(address => Actor) public actors;
mapping(uint256 => uint256[]) public installationRecords; // installationId => recordIds
mapping(address => uint256[]) public ownerInstallations;
mapping(address => uint256[]) public ownerCertificates;

// Tokens de energía (ERC20-like)
mapping(address => uint256) public energyTokenBalance;
uint256 public totalEnergyTokens;

// Eventos
event InstallationRegistered(uint256 indexed installationId, address indexed owner, string name, EnergySource energySource);
event EnergyGenerated(uint256 indexed recordId, uint256 indexed installationId, uint256 kwh, uint256 timestamp);
event EnergyTokensMinted(address indexed recipient, uint256 amount);
event GreenCertificateIssued(uint256 indexed certificateId, uint256 indexed installationId, uint256 energyAmount);
event CertificateRetired(uint256 indexed certificateId, address indexed owner);
event TradeOrderCreated(uint256 indexed orderId, address indexed seller, uint256 certificateId, uint256 price);
event TradeExecuted(uint256 indexed orderId, address indexed buyer, address indexed seller, uint256 price);
event ActorRegistered(address indexed actorAddress, string name, string actorType);

// ⚠️ TU TAREA: Programar estas funciones principales

// Gestión de Actores
function registerActor(string memory _name, string memory _actorType) public;
function getActor(address _actorAddress) public view returns (Actor memory);
function deactivateActor(address _actorAddress) public;

// Gestión de Instalaciones
function registerInstallation(string memory _name, string memory _location, EnergySource _source, uint256 _capacity) public returns (uint256);
function getInstallation(uint256 _installationId) public view returns (Installation memory);
function updateInstallationStatus(uint256 _installationId, bool _isActive) public;
function getOwnerInstallations(address _owner) public view returns (uint256[] memory);

// Registro de Generación
function recordGeneration(uint256 _installationId, uint256 _kwh, int256 _temperature, string memory _weatherConditions) public returns (uint256);
function getGenerationRecord(uint256 _recordId) public view returns (GenerationRecord memory);
function getInstallationRecords(uint256 _installationId) public view returns (GenerationRecord[] memory);
function getTotalGeneration(uint256 _installationId) public view returns (uint256);

// Tokens de Energía
function mintEnergyTokens(address _recipient, uint256 _amount) public;
function transferEnergyTokens(address _to, uint256 _amount) public;
function getEnergyTokenBalance(address _owner) public view returns (uint256);

// Certificados Verdes
function issueGreenCertificate(uint256 _installationId, uint256 _energyAmount, uint256 _periodStart, uint256 _periodEnd, string memory _metadataURI) public returns (uint256);
function retireCertificate(uint256 _certificateId) public;
function transferCertificate(uint256 _certificateId, address _to) public;
function getCertificate(uint256 _certificateId) public view returns (GreenCertificate memory);
function getOwnerCertificates(address _owner) public view returns (uint256[] memory);

// Mercado P2P
function createTradeOrder(uint256 _certificateId, uint256 _pricePerKwh) public returns (uint256);
function executeTrade(uint256 _orderId) public payable;
function cancelTradeOrder(uint256 _orderId) public;
function getActiveOrders() public view returns (TradeOrder[] memory);

// Funciones auxiliares
function verifyRenewableOrigin(uint256 _certificateId) public view returns (bool);
function calculateCertificateValue(uint256 _certificateId, uint256 _pricePerKwh) public view returns (uint256);

```

### 5.2. Modelo de Datos

Estructura JSON para registro de generación:

```json
{
  "installationId": "SOLAR-ES-001",
  "name": "Planta Solar Comunidad Almócita",
  "location": "Almócita, Almería, España",
  "type": "Solar Fotovoltaica",
  "capacity": "50 kW",
  "generation": {
    "timestamp": 1710002212,
    "kwh": 45.8,
    "weather": "Soleado",
    "efficiency": 91.6
  },
  "certificate": {
    "certificateId": "CERT-GREEN-2025-001",
    "hash": "0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    "standard": "I-REC"
  },
  "blockchainAnchor": {
    "network": "Polygon",
    "txHash": "0xabc123...",
    "blockNumber": 12345678
  }
}

```

### 5.3. Tests Recomendados (sc/test/RenewableEnergy.t.sol)

```solidity
// ⚠️ TU TAREA: Escribir y hacer pasar estos tests
contract RenewableEnergyTest is Test {
    // Setup y configuración inicial
    function setUp() public { }

    // Tests de gestión de actores
    function testRegisterProducer() public { }
    function testRegisterConsumer() public { }
    function testRegisterProsumer() public { }
    function testDeactivateActor() public { }

    // Tests de registro de instalaciones
    function testRegisterSolarInstallation() public { }
    function testRegisterWindInstallation() public { }
    function testRegisterHydroInstallation() public { }
    function testInstallationIdIncrementation() public { }
    function testGetInstallation() public { }
    function testUpdateInstallationStatus() public { }
    function testGetOwnerInstallations() public { }

    // Tests de registro de generación
    function testRecordGeneration() public { }
    function testRecordGenerationWithTemperature() public { }
    function testRecordGenerationWithWeather() public { }
    function testGetGenerationRecord() public { }
    function testGetInstallationRecords() public { }
    function testGetTotalGeneration() public { }
    function testGenerationUpdatesInstallationTotal() public { }

    // Tests de tokens de energía
    function testMintEnergyTokens() public { }
    function testTransferEnergyTokens() public { }
    function testGetEnergyTokenBalance() public { }
    function testCannotTransferMoreThanBalance() public { }
    function testTotalEnergyTokensTracking() public { }

    // Tests de certificados verdes
    function testIssueGreenCertificate() public { }
    function testCertificateIdIncrementation() public { }
    function testGetCertificate() public { }
    function testRetireCertificate() public { }
    function testCannotRetireAlreadyRetired() public { }
    function testTransferCertificate() public { }
    function testGetOwnerCertificates() public { }

    // Tests de mercado P2P
    function testCreateTradeOrder() public { }
    function testExecuteTrade() public { }
    function testCancelTradeOrder() public { }
    function testGetActiveOrders() public { }
    function testCannotExecuteCancelledOrder() public { }
    function testCannotExecuteFilledOrder() public { }
    function testTradeTransfersCertificate() public { }
    function testTradePayment() public { }

    // Tests de verificación
    function testVerifyRenewableOrigin() public { }
    function testCalculateCertificateValue() public { }

    // Tests de validaciones
    function testOnlyOwnerCanRecordGeneration() public { }
    function testCannotRecordGenerationForNonExistentInstallation() public { }
    function testCannotIssueDecertificateForNonExistentInstallation() public { }
    function testOnlyOwnerCanTransferCertificate() public { }
    function testOnlySellerCanCancelOrder() public { }
    function testInactiveInstallationCannotRecordGeneration() public { }

    // Tests de casos edge
    function testRecordZeroGeneration() public { }
    function testNegativeTemperature() public { }
    function testMultipleGenerationsSameDay() public { }
    function testCertificateForMultiplePeriods() public { }
    function testMultipleCertificatesForSameInstallation() public { }

    // Tests de flujo completo
    function testCompleteSolarEnergyFlow() public { }
    function testCompleteP2PTradingFlow() public { }
    function testCommunityEnergyProject() public { }
    function testMonthlyGenerationAndCertification() public { }
}
```

### 5.4. Arquitectura Recomendada

Componentes técnicos sugeridos:

- **Blockchain:** EVM (Polygon o similar por bajo costo de transacciones frecuentes)
- **Backend:** Node.js / Python
- **Base de datos:** SQLite / MongoDB (para agregaciones rápidas)
- **Frontend:** React / HTML+JavaScript
- **Smart Contracts:** Solidity
- **Gráficas:** Chart.js / Recharts para visualización de producción
- **Simulación IoT:** Script que genera datos cada X minutos
- **Oráculos (opcional):** Chainlink para datos meteorológicos reales

---

## 6. Proyecto de Referencia: Power Ledger

### 6.1. ¿Qué es Power Ledger?

Power Ledger es una plataforma de software energético que permite rastrear, trazar y comercializar cada kWh de energía renovable. Combina medición (smart meters, IoT) con contratos inteligentes y mercados de certificados verdes.

### 6.2. Enlaces Oficiales

- 🌐 **Sitio web:** [https://powerledger.io](https://powerledger.io/)
- 🐦 **Twitter/X:** [https://x.com/Powerledger_io](https://x.com/Powerledger_io)

### 6.3. Problema que Resuelve

**Necesidad de seguir el origen de la energía:**

- Consumidores y empresas quieren saber si su energía es realmente verde
- Certificados tradicionales no garantizan trazabilidad granular
- Imposible verificar origen hora por hora

**Emisión y comercio de certificados de energía renovable:**

- Certificados verdes que pueden duplicarse
- Mercados opacos sin transparencia de precios
- Proceso manual y costoso

**Mercados P2P de energía:**

- Prosumidores (productores+consumidores) que generan excedentes
- Imposibilidad de vender directamente a vecinos
- Dependencia de utilities tradicionales

### 6.4. Cómo lo Resuelve

**Track, Trace & Trade cada kWh:**

- Medición inteligente conectada a blockchain
- Registro inmutable de cada unidad de energía
- Trazabilidad completa desde generación hasta consumo

**Marketplace de energía:**

- Productores ofrecen energía excedente
- Consumidores compran directamente (P2P)
- Precios transparentes y liquidación automática

**Certificados digitales verificables:**

- Emisión automática de certificados verdes
- Verificación instantánea on-chain
- Compatibilidad con estándares internacionales

**Software como plataforma (SaaS):**

- Integración con medidores inteligentes existentes
- APIs para utilities y operadores de red
- Dashboard para prosumidores y consumidores

---

## 7. Datos del Proyecto Power Ledger

### 7.1. Información Corporativa

**Sede y fundación:**

- Fundada en 2016
- Sede en Perth, Australia
- Clasificada como scale-up en sector climate/energy tech

**Financiación:**

- Múltiples rondas desde 2017
- Considerada una de las primeras plataformas de trading de energía renovable basada en blockchain

### 7.2. Países con Proyectos Desplegados

**Australia:**

- País de origen con múltiples proyectos piloto
- Trading P2P en barrios residenciales
- Integración con operadores de red

**Tailandia:**

- Proyecto destacado en Bangkok (distrito T77)
- Empresa BCPG como partner
- Intercambio P2P entre edificios: centro comercial, colegio internacional, apartamentos

**Vietnam:**

- Proyecto pionero de trading P2P de energía renovable
- Parte de expansión en Asia-Pacífico

**España:**

- Proyecto en Almócita (Almería)
- Una de las primeras comunidades energéticas del país
- Esquema de autoconsumo colectivo

**Otros países:**

- **India:** Proyectos de certificados verdes
- **Japón:** Integración con mercado energético
- **Estados Unidos:** Pilotos en varios estados
- **Francia:** Comunidades energéticas locales
- **Austria:** Proyectos de autoconsumo
- **Reino Unido:** Integración con smart grids

**Total:** Más de 30 proyectos en 12 países según datos públicos

### 7.3. Casos de Éxito Relevantes

**Comunidad Almócita (España):**

- Pequeño pueblo rural en Almería
- Paneles solares compartidos
- Autoconsumo colectivo entre vecinos
- Referencia para replicar en otras localidades españolas

**Bangkok T77 (Tailandia):**

- Edificios comerciales y residenciales
- Microred con producción solar propia
- Trading P2P en tiempo real
- Gestión inteligente de consumo

---

## 8. Tecnologías y Modelo de Negocio

### 8.1. Stack Tecnológico de Power Ledger

**Blockchain:**

- Blockchain híbrida (permissioned + pública)
- Combina escalabilidad con transparencia
- Compatible con múltiples redes

**IoT y Smart Meters:**

- Integración con medidores inteligentes
- Lectura automática de producción/consumo
- Conectividad en tiempo real

**Tokens energéticos:**

- Tokenización de kWh generados
- Tokens transferibles entre usuarios
- Smart contracts para liquidación automática

**APIs e integraciones:**

- Integración con utilities existentes
- Compatibilidad con operadores de red
- Dashboard para usuarios finales

### 8.2. Modelo de Negocio

**Software as a Service (SaaS):**

- Suscripciones para utilities y comunidades
- Licencias para operadores de red
- Comisiones por transacciones en marketplace

**Productos principales:**

- **TraceX:** Trazabilidad y certificados verdes
- **xGrid:** Trading P2P de energía
- **VisionX:** Analytics y visualización

**Clientes objetivo:**

- Utilities y distribuidoras eléctricas
- Comunidades energéticas locales
- Empresas con objetivos de sostenibilidad
- Gobiernos y autoridades regulatorias

---

## 9. Cómo Inspirarse sin Copiar

**IMPORTANTE:** El objetivo de este TFM NO es copiar Power Ledger, sino crear tu propio sistema energético adaptado a un escenario específico.

### 9.1. Lo que DEBES Hacer

- **Definir un escenario energético propio:** Comunidad local, parque solar, empresa con autoconsumo
- **Simular producción de energía:** Datos realistas de generación según tipo de fuente
- **Modelar tokenización propia:** Decidir cómo representar energía como token
- **Diseñar certificados verdes propios:** Esquema de emisión y verificación
- **Crear dashboard energético:** Visualización adaptada a tu caso de uso

### 9.2. Lo que NO DEBES Hacer

- ❌ Copiar el código de Power Ledger (no es open source)
- ❌ Usar exactamente los mismos nombres de productos (TraceX, xGrid, etc.)
- ❌ Replicar su modelo de negocio sin adaptación
- ❌ Presentar tu TFM como "Power Ledger pero más simple"

### 9.3. Ejemplos de Adaptación

**Caso original (Power Ledger):**

```
Comunidad en Australia → Paneles solares → Trading P2P → Certificados digitales

```

**Tu adaptación (comunidad rural España):**

```
Pueblo en Castilla-La Mancha → Parque solar comunitario → Autoconsumo colectivo → Certificados verdes NFT

```

**Tu adaptación (empresa industrial Chile):**

```
Fábrica con techo solar → Medición cada hora → Tokens por kWh excedente → Venta a red o vecinos

```

**Tu adaptación (edificio residencial México):**

```
Edificio con paneles solares → Smart meters en apartamentos → Distribución proporcional → Dashboard por residente

```

**Tu adaptación (campus universitario Colombia):**

```
Universidad con instalación eólica → Registro académico blockchain → Certificados para investigación → Gamificación ahorro energético

```

---

## 10. Ideas de Casos de Uso para tu TFM

### Opción 1: Comunidad Energética Rural

- Pueblo con instalación solar compartida
- Distribución de energía entre vecinos
- Certificados verdes para toda la comunidad
- Dashboard accesible para no técnicos

### Opción 2: Empresa con Autoconsumo Industrial

- Fábrica con paneles solares en tejado
- Medición de producción vs consumo
- Venta de excedentes a red
- Certificados para reporting de sostenibilidad

### Opción 3: Edificio Residencial Inteligente

- Edificio con generación solar
- Smart meters por apartamento
- Distribución proporcional de energía
- Gamificación de ahorro energético

### Opción 4: Parque Solar Tokenizado

- Instalación solar de mediana escala
- Inversores compran tokens de capacidad
- Reciben dividendos en tokens de energía
- Certificados verdes negociables

### Opción 5: Campus Universitario Sostenible

- Universidad con múltiples fuentes renovables
- Integración con sistema académico
- Investigación sobre datos energéticos
- Educación en blockchain aplicada