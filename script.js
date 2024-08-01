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
