-- Atualizar o ENUM da coluna horario para incluir as opções de café da tarde
ALTER TABLE registros 
MODIFY COLUMN horario ENUM(
  'Cafe - Antes', 
  'Cafe - Depois', 
  'Cafe-Tarde - Antes',
  'Cafe-Tarde - Depois',
  'Almoco - Antes', 
  'Almoco - Depois', 
  'Janta - Antes', 
  'Janta - Depois'
) NOT NULL; 