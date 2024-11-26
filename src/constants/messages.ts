export const ERROR_MESSAGES = {
  LOAD_MEDICATION: 'Não foi possível carregar os detalhes do medicamento',
  DELETE_MEDICATION: 'Não foi possível excluir o medicamento',
  SAVE_MEDICATION: 'Não foi possível salvar o medicamento',
  RECORD_TAKEN: 'Não foi possível registrar o medicamento como tomado',
  LOAD_HISTORY: 'Não foi possível carregar o histórico',
  LOAD_ALERTS: 'Não foi possível carregar os alertas',
  UPDATE_ALERT: 'Não foi possível atualizar o alerta',
  AUTH_ERROR: 'Usuário não autenticado',
  REQUIRED_FIELDS: 'Por favor, preencha todos os campos obrigatórios',
  PASSWORDS_DONT_MATCH: 'As senhas não coincidem',
};

export const SUCCESS_MESSAGES = {
  MEDICATION_SAVED: 'Medicamento salvo com sucesso!',
  MEDICATION_DELETED: 'Medicamento excluído com sucesso!',
  MEDICATION_TAKEN: 'Registro de medicamento tomado adicionado!',
  USER_CREATED: 'Usuário cadastrado com sucesso!',
};

export const CONFIRM_MESSAGES = {
  DELETE_MEDICATION: {
    title: 'Confirmar Exclusão',
    message: 'Tem certeza que deseja excluir este medicamento?',
    cancel: 'Cancelar',
    confirm: 'Excluir',
  },
};

export const ALERT_TYPES = {
  LOW_STOCK: {
    title: 'Estoque Baixo',
    message: (name: string) => `O medicamento ${name} está com estoque baixo`,
  },
  EXPIRATION: {
    title: 'Medicamento Vencido',
    message: (name: string) => `O medicamento ${name} está próximo do vencimento`,
  },
};
