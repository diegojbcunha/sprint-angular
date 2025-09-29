# Ford Dashboard

Uma aplicação moderna de dashboard Angular para gerenciamento de veículos Ford com autenticação e visualização de dados em tempo real.

<img width="1920" height="1080" alt="Captura de tela 2025-09-29 161949" src="https://github.com/user-attachments/assets/8bf9dc89-2957-4f30-a549-061fb65ca43a" />
<img width="1920" height="1080" alt="Captura de tela 2025-09-29 162415" src="https://github.com/user-attachments/assets/a8ea91ef-fb08-4a5c-a4d3-f650bcd4023d" />
<img width="1920" height="1080" alt="Captura de tela 2025-09-29 162429" src="https://github.com/user-attachments/assets/1c6a1b6d-fcb6-4cc5-8966-884715bc02f6" />
<img width="1920" height="1080" alt="Captura de tela 2025-09-29 162441" src="https://github.com/user-attachments/assets/cf022109-2480-41c5-8a0d-a7a932800ca8" />
<img width="1920" height="1080" alt="Captura de tela 2025-09-29 162452" src="https://github.com/user-attachments/assets/fce5750e-f537-49fb-a9a5-b12191cda3ff" />
<img width="1920" height="1080" alt="Captura de tela 2025-09-29 162505" src="https://github.com/user-attachments/assets/5e02af08-2c68-4b1c-80fb-57ebc5b26360" />
<img width="1920" height="1080" alt="Captura de tela 2025-09-29 162513" src="https://github.com/user-attachments/assets/7346ba2d-6dfd-44bd-b722-9b0277b9abcb" />
<img width="1920" height="1080" alt="Captura de tela 2025-09-29 162520" src="https://github.com/user-attachments/assets/9feba12f-16b4-4f40-b42a-eb567093e120" />

## Índice

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Executando a Aplicação](#executando-a-aplicação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Autenticação](#autenticação)
- [Endpoints da API](#endpoints-da-api)
- [Componentes](#componentes)
- [Desenvolvimento](#desenvolvimento)
- [Observações](#obersações)

## Funcionalidades

- **Sistema de Autenticação Seguro** - Login obrigatório com proteção de rotas
- **Dashboard em Tempo Real** - Estatísticas de veículos e dados de vendas
- **Página Inicial** - Galeria de veículos com informações detalhadas
- **Guardas de Rota** - Rotas protegidas impedindo acesso não autorizado
- **Design Responsivo** - Layout responsivo com Bootstrap 5
- **Angular Moderno** - Construído com Angular 19 e componentes standalone
- **Sessões Persistentes** - Estado de autenticação baseado em localStorage

## Tecnologias

### Frontend
- **Angular 19** - Framework Angular mais recente com componentes standalone
- **TypeScript** - JavaScript com tipagem segura
- **Bootstrap 5.3.8** - Framework CSS responsivo
- **RxJS** - Programação reativa com observables
- **Angular Router** - Navegação client-side com guardas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework para aplicações web
- **CORS** - Compartilhamento de recursos entre origens

## Pré-requisitos

Antes de executar este projeto, certifique-se de ter os seguintes itens instalados:

- **Node.js** (v18 ou superior)
- **npm** (vem com o Node.js)
- **Angular CLI** (v19 ou superior)

```bash
npm install -g @angular/cli
```

## Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd sprint-angular
```

2. **Instale as Dependências do Frontend**
```bash
cd angular
npm install
```

3. **Instale as Dependências do Backend**
```bash
cd ../api
npm install
```

## Executando a Aplicação

### Iniciar o Servidor da API Backend
```bash
cd api
node api.js
```
O servidor da API será iniciado em `http://localhost:3001`

### Iniciar o Servidor de Desenvolvimento Frontend
```bash
cd angular
npm start
# ou
ng serve
```
A aplicação estará disponível em `http://localhost:4200`

## Estrutura do Projeto

```
sprint-angular/
├── angular/                    # Aplicação Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/     # Componentes Angular
│   │   │   │   ├── dashboard/  # Componente do dashboard
│   │   │   │   ├── home/       # Componente da página inicial
│   │   │   │   └── login/      # Componente de login
│   │   │   ├── guards/         # Guardas de rota
│   │   │   │   ├── auth.guard.ts    # Guarda de autenticação
│   │   │   │   └── login.guard.ts   # Guarda da página de login
│   │   │   ├── models/         # Modelos TypeScript
│   │   │   ├── services/       # Serviços Angular
│   │   │   │   └── auth.service.ts  # Serviço de autenticação
│   │   │   ├── app.component.ts
│   │   │   ├── app.config.ts
│   │   │   └── app.routes.ts   # Roteamento da aplicação
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.css
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
└── api/                        # API Backend Node.js
    ├── api.js                  # Servidor Express
    └── package.json
```

## Autenticação

A aplicação implementa um sistema de autenticação seguro:

### Credenciais de Login
- **Usuário**: `admin`
- **Senha**: `123456`

### Fluxo de Autenticação
1. Usuários devem fazer login para acessar rotas protegidas (`/home`, `/dashboard`)
2. Estado de autenticação é armazenado no localStorage
3. Guardas de rota impedem acesso não autorizado
4. Redirecionamento automático para usuários não autenticados

### Proteção de Rotas
- **Rotas Protegidas**: `/home`, `/dashboard`
- **Rotas Públicas**: `/login`
- **Rota Padrão**: Redireciona para `/login`

## Endpoints da API

### Autenticação
- `POST /login` - Autenticação do usuário
  ```json
  {
    "nome": "admin",
    "senha": "123456"
  }
  ```

### Veículos
- `GET /veiculos` - Obter todos os veículos
- `GET /dashboard` - Obter estatísticas do dashboard

## Componentes

### Componente Home
- Exibição da galeria de veículos
- Modal de detalhes do veículo
- Tratamento de erro de imagem com placeholders

### Componente Dashboard
- Estatísticas de vendas
- Contagem de veículos conectados
- Métricas de atualização de software
- Estados de carregamento e tratamento de erros

### Componente Login
- Formulário de autenticação do usuário
- Alternância de visibilidade da senha
- Validação de formulário
- Redirecionamento automático para usuários autenticados

## Desenvolvimento

### Padrões de Código
- **Modo strict do TypeScript** habilitado
- Arquitetura de **componentes standalone**
- **Programação reativa** com RxJS
- **Prevenção de vazamentos de memória** com limpeza adequada de subscriptions
- **Classes utilitárias do Bootstrap** para estilização consistente

### Construindo para Produção
```bash
cd angular
ng build --prod
```

### Executando Testes
```bash
cd angular
ng test
```

### Linting
```bash
cd angular
ng lint
```

## Deploy

### Deploy do Frontend
1. Construa a aplicação: `ng build --prod`
2. Faça deploy da pasta `dist/` para seu servidor web

### Deploy do Backend
1. Certifique-se de que o Node.js está instalado no seu servidor
2. Faça upload da pasta `api/`
3. Instale as dependências: `npm install`
4. Inicie o servidor: `node api.js`
5. Configure o gerenciador de processos (PM2 recomendado)

## Contribuindo

1. Faça um fork do repositório
2. Crie uma branch para sua feature: `git checkout -b feature/nova-funcionalidade`
3. Faça commit das suas mudanças: `git commit -am 'Adicionar nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Envie um pull request

## Licença

Este projeto está licenciado sob a Licença MIT.

## Autores

- **Diego Cunha**

## Observações

Este projeto foi desenvolvido com fins educacionais, com base na proposta da empresa FORD fornecida pela Instituição.

---

**Construído com ❤️ usando Angular 19 e Node.js**
