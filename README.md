# Renault Omnichannel Chatbot Platform

Este monorepo contiene la plataforma completa de atención automatizada para Renault.

## 📁 Estructura del Proyecto

- `apps/api`: Backend NestJS (PostgreSQL, TypeORM, JWT).
- `apps/bot`: Motor conversacional BuilderBot (WhatsApp Provider).
- `apps/dashboard`: Panel de administración Next.js 15 (Renault Design System).
- `packages/types`: Tipos e interfaces de TypeScript compartidos.

## 🛠 Requisitos Previos

- [Bun](https://bun.sh/) instalado.
- Docker & Docker Compose (para base de datos y servicios locales).

## 🚀 Inicio Rápido (Local)

1. **Instalar dependencias**:
   ```bash
   bun install
   ```

2. **Levantar base de datos y servicios**:
   ```bash
   docker-compose up -d
   ```

3. **Configurar variables de entorno**:
   Copia los archivos `.env.example` a `.env` en cada aplicación:
   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/bot/.env.example apps/bot/.env
   cp apps/dashboard/.env.example apps/dashboard/.env
   ```

4. **Iniciar todo el ecosistema**:
   ```bash
   bun dev
   ```

## 🔗 Accesos Locales

- **Dashboard**: [http://localhost:3000](http://localhost:3000)
- **API**: [http://localhost:3001/api](http://localhost:3001/api)
- **Evolution API**: [http://localhost:8080](http://localhost:8080)

---

## 📅 Roadmap Semana 1

- [x] Inicialización de Monorepo y dependencias.
- [x] Esqueleto de API NestJS con entidades base.
- [x] Flujos de conversación BuilderBot (Renault Experience).
- [x] Sistema de diseño Renault en Dashboard (Next.js).
- [ ] Implementación de Auth real entre Dashboard y API.
- [ ] Visualización de primeros Leads en el Dashboard.
