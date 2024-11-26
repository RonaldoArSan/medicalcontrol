# Medical Control

Aplicativo móvel para controle e gerenciamento de medicamentos, desenvolvido com React Native.

## 📱 Funcionalidades

- **Autenticação de Usuários**
  - Login
  - Cadastro
  - Recuperação de senha

- **Perfil do Usuário**
  - Visualização e edição de dados pessoais
  - Gerenciamento de informações médicas básicas

- **Gerenciamento de Medicamentos**
  - Cadastro de medicamentos
  - Agendamento de horários
  - Histórico de medicamentos
  - Notificações de lembretes

## 🚀 Tecnologias

- React Native
- TypeScript
- Firebase (Authentication e Firestore)
- React Navigation
- Date-fns
- React Native DateTimePicker

## 📋 Pré-requisitos

- Node.js
- npm ou yarn
- React Native CLI
- Android Studio (para desenvolvimento Android)
- XCode (para desenvolvimento iOS - apenas macOS)

## 🔧 Instalação

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/medicalControl.git
```

2. Instale as dependências
```bash
cd medicalControl
yarn install # ou npm install
```

3. Configure o arquivo de ambiente
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações do Firebase

4. Execute o projeto
```bash
# Para Android
yarn android # ou npm run android

# Para iOS
yarn ios # ou npm run ios
```

## 📱 Telas

- **Auth**
  - SignIn: Tela de login
  - SignUp: Tela de cadastro

- **App**
  - Profile: Gerenciamento de perfil do usuário
  - MedicationList: Lista de medicamentos
  - AddMedication: Cadastro de medicamentos
  - MedicationDetails: Detalhes do medicamento
  - MedicationHistory: Histórico de medicamentos

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✨ Autor

Desenvolvido por Ronaldo Santana
