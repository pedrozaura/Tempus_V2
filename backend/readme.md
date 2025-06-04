# 1. Apague a pasta de versões antigas

rm -rf migrations/

# 2. Apague o banco de dados ou recrie

# (pode ser pelo pgAdmin ou comando DROP DATABASE ...)

# 3. Recrie as migrações do zero

flask db init
flask db migrate -m "estrutura inicial"
flask db upgrade

ou para atualizar o banco de dados ja em execução

flask db migrate -m "Adiciona tabelas Cidade e Previsao"
flask db upgrade
