# CostFlow Calculator - TODO

## Banco de Dados
- [x] Criar tabela de cálculos salvos (calculations)
- [x] Criar tabela de leads/contatos (leads)
- [x] Criar tabela de países e taxas (countries_rates)
- [x] Executar migração do schema

## Backend (tRPC)
- [x] Implementar procedure para calcular custos
- [x] Implementar procedure para salvar cálculo
- [x] Implementar procedure para listar cálculos do usuário
- [x] Implementar procedure para salvar lead (formulário de contato)
- [x] Implementar procedure para buscar taxas de câmbio
- [x] Implementar procedure para listar países disponíveis

## Frontend
- [x] Criar página inicial com hero section
- [x] Implementar seletor de moeda (USD/BRL)
- [x] Implementar seletor de país
- [x] Implementar input de volume de mensagens
- [x] Implementar seletor de tipo de mensagem (Marketing/Utilidade/Autenticação)
- [x] Implementar cálculo em tempo real
- [x] Exibir resultados (custo total, taxa por mensagem, volume)
- [x] Criar seção explicativa sobre tipos de mensagem
- [x] Criar seção de níveis de volume (tiers)
- [x] Implementar formulário de contato/lead
- [x] Adicionar design responsivo
- [x] Implementar tema verde (WhatsApp style)

## Integração
- [x] Configurar conexão com PostgreSQL do Aiven
- [x] Testar todas as operações do banco
- [x] Validar cálculos com dados reais

## Deploy
- [ ] Copiar arquivos para repositório GitHub
- [ ] Fazer commit e push
- [ ] Criar checkpoint do projeto
