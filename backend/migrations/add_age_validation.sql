-- Adicionar validação de idade (maior de 18 anos)
ALTER TABLE usuarios
ADD CONSTRAINT check_idade CHECK (idade >= 18); 