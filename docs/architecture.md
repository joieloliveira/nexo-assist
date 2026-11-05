# Arquitetura inicial

- `apps/web`: interface Next.js do funcionário e do analista.
- `apps/api`: API HTTP, validações e regras de negócio.
- `packages/agent`: integração futura com Mastra e provedor LLM.
- `packages/shared`: tipos e contratos compartilhados.

A implementação da persistência, autenticação simulada, auditoria das decisões e integração do agente será realizada em etapas. Nenhum desses recursos está pronto neste scaffold.
