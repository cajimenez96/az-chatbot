# Documento 2 — Arquitectura Técnica y Estrategia de Desarrollo

# Arquitectura General

WhatsApp / Webchat
↓
Evolution API
↓
n8n
↓
NestJS API
↓
PostgreSQL + Redis

---

# Filosofía Arquitectónica

La lógica principal NO vivirá en n8n.

n8n será utilizado únicamente para:
- automatización
- webhooks
- integraciones
- retries
- tareas programadas

Toda la lógica conversacional y de negocio vivirá en NestJS.

---

# Tecnologías

## Evolution API
Uso:
- conexión con WhatsApp

Link:
https://github.com/EvolutionAPI/evolution-api

---

## n8n

Uso:
- automatizaciones
- retries
- integraciones

Link:
https://n8n.io

Costo:
- self-hosted gratuito

---

## NestJS

Uso:
- backend principal
- motor conversacional
- APIs
- leads
- métricas

Link:
https://nestjs.com

---

## PostgreSQL

Uso:
- persistencia principal

Link:
https://www.postgresql.org

---

## Redis

Uso:
- queues
- retries
- rate limiting

Link:
https://redis.io

---

## Next.js + Vercel

Uso:
- dashboard administrativo

Links:
https://nextjs.org
https://vercel.com

---

## Gemini Flash

Uso:
- IA controlada

Link:
https://ai.google.dev

---

# Estrategia Conversacional

## Plan Básico

Mensaje
↓
NestJS detecta intención
↓
Busca FAQ
↓
Responde
↓
Captura lead
↓
Deriva humano

---

## Plan Pro

Mensaje
↓
FAQ intenta resolver
↓
Si falla
↓
Gemini responde usando contexto controlado
↓
Si no tiene información
↓
Derivación humana

---

# Estrategia Multicliente

Inicialmente:
- deployments separados por cliente
- DB separadas por cliente

Pero el sistema estará preparado para:
tenant_id

permitiendo futura migración SaaS.

---

# Estrategia de Costos

## Infraestructura actual
- 2 vCPU
- 8 GB RAM
- 100 GB SSD
- 1 TB bandwidth

Suficiente para MVP.

---

# Costos Iniciales

| Servicio | Costo |
|---|---|
| VPS | ya disponible |
| n8n self-hosted | gratis |
| PostgreSQL | gratis |
| Redis | gratis |
| Evolution API | gratis |
| Docker | gratis |
| Vercel Hobby | gratis |
| Gemini Flash | muy bajo |

---

# Estrategia IA

Objetivo:
80-90% FAQ
10-20% IA

La IA será solamente fallback.

---

# Manejo de Errores

## WhatsApp
- retries
- colas
- persistencia previa

---

# Backups

## PostgreSQL
- backups diarios
- snapshots semanales

---

# Derivación Humana

Bot
↓
Derivación
↓
Timeout
↓
¿Humano respondió?
↓
NO
↓
Bot retoma

---

# Roadmap

## Fase 1
- WhatsApp
- FAQ
- leads
- derivación humana

## Fase 2
- dashboard
- métricas

## Fase 3
- IA controlada
- omnicanal

---

# Tiempo Estimado

MVP funcional:
6-8 semanas

trabajando:
2-3 horas diarias.
