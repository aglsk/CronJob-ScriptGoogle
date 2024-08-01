# Script Cron Job Com Captura de Tela e Envio para o Telegram

Este script Google Apps realiza a captura de tela de um site específico e envia a imagem resultante para um grupo privado no Telegram. O script é configurado para ser executado automaticamente em horários definidos.

## Funcionalidades

1. **Captura de Tela:** Utiliza a ScreenshotAPI para capturar uma imagem de um site especificado.
2. **Envio para o Telegram:** Envia a imagem capturada para um grupo privado no Telegram.
3. **Agendamento:** Configura gatilhos para executar a função de captura e envio três vezes ao dia.

## Configuração

Antes de usar o script, você precisa configurar algumas variáveis:

1. **Chave da ScreenshotAPI:**
   - Substitua `'API_KEY_SCREENSHOTAPI'` com sua chave de API da ScreenshotAPI.
   
2. **URL do Site:**
   - Substitua `'URL_DO_SITE_QUE_DESEJA_FAZER_CRON_JOB'` com o URL do site que deseja capturar.

3. **Token do Bot do Telegram:**
   - Substitua `'TOKEN DO SEU BOT QUE ESTA DENTRO DO GRUPO PRIVADO QUE TENHA SÓ VOCÊ'` com o token do bot do Telegram que você criou.

4. **ID do Chat do Telegram:**
   - Substitua `'CHAT ID DO GRUPO PRIVADO QUE TENHA SÓ VOCÊ'` com o ID do chat do grupo privado no Telegram onde a imagem será enviada.

## Como Usar

1. **Copie o Código:**
   - Copie o código do script para um novo projeto no Google Apps Script.

2. **Configure o Script:**
   - Substitua as variáveis conforme necessário com suas informações.

3. **Crie os Gatilhos:**
   - Execute a função `createTriggers()` uma vez para configurar os gatilhos que irão executar a função `fetchUrlAndSendToTelegram()` diariamente em horários específicos (12h PM, 17h PM e 23h PM).

4. **Salve e Execute:**
   - Salve o projeto e certifique-se de que o script está autorizado a acessar os serviços necessários.

## Código

```javascript
function fetchUrlAndSendToTelegram() {
  try {
    var screenshotApiKey = 'API_KEY_SCREENSHOTAPI'; // Chave de API da ScreenshotAPI
    var screenshotUrl = 'https://shot.screenshotapi.net/screenshot?token=' + screenshotApiKey + '&url=URL_DO_SITE_QUE_DESEJA_FAZER_CRON_JOB&output=image&file_type=png&wait_for_event=load';
    
    // Obtém a captura de tela
    var response = UrlFetchApp.fetch(screenshotUrl, {muteHttpExceptions: true});
    
    Logger.log('Status da resposta da API de captura de tela: ' + response.getResponseCode());
    Logger.log('Resposta da API de captura de tela: ' + response.getContentText());
    
    if (response.getResponseCode() !== 200) {
      Logger.log('Erro ao obter captura de tela: ' + response.getContentText());
      return;
    }
    
    var imageBlob = response.getBlob();
    
    // Envia a captura de tela para o Telegram
    var telegramBotToken = 'TOKEN DO SEU BOT QUE ESTA DENTRO DO GRUPO PRIVADO QUE TENHA SÓ VOCÊ'; // Token do seu bot do Telegram
    var chatId = 'CHAT ID DO GRUPO PRIVADO QUE TENHA SÓ VOCÊ'; // ID do chat do grupo
    var telegramApiUrl = 'https://api.telegram.org/bot' + telegramBotToken + '/sendPhoto';
    
    var formData = {
      'method': 'post',
      'payload': {
        'chat_id': chatId,
        'photo': imageBlob
      }
    };
    
    var telegramResponse = UrlFetchApp.fetch(telegramApiUrl, formData);
    
    Logger.log('Status da resposta do Telegram: ' + telegramResponse.getResponseCode());
    Logger.log('Resposta do Telegram: ' + telegramResponse.getContentText());
    
    if (telegramResponse.getResponseCode() !== 200) {
      Logger.log('Erro ao enviar imagem para o Telegram: ' + telegramResponse.getContentText());
    }
  } catch (error) {
    Logger.log('Erro: ' + error.message);
  }
}

function createTriggers() {
  // Remove triggers existentes para evitar duplicação
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }

  // Cria triggers para executar a função fetchUrlAndSendToTelegram diariamente às 12h PM, 17h PM e 23h PM
  ScriptApp.newTrigger('fetchUrlAndSendToTelegram')
    .timeBased()
    .everyDays(1)
    .atHour(12)
    .create();
    
  ScriptApp.newTrigger('fetchUrlAndSendToTelegram')
    .timeBased()
    .everyDays(1)
    .atHour(17)
    .create();
  
  ScriptApp.newTrigger('fetchUrlAndSendToTelegram')
    .timeBased()
    .everyDays(1)
    .atHour(23)
    .create();
}
