# Use uma imagem base oficial do Python.
FROM python:3.9-slim-buster

# Define o diretório de trabalho dentro do container.
WORKDIR /app

# Adiciona o diretório de trabalho ao PYTHONPATH para que o Python encontre a pasta 'src'.
ENV PYTHONPATH="/app"

# Copia o arquivo requirements.txt para o diretório de trabalho no container.
COPY requirements.txt .

# Instala as dependências Python listadas no requirements.txt.
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo o restante do seu código (da raiz do projeto) para o diretório /app no container.
COPY . .

# Expõe a porta que seu aplicativo Flask está configurado para ouvir internamente.
EXPOSE 5000

# Comando para iniciar o seu aplicativo Flask com Gunicorn.
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "main:app"]