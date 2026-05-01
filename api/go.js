export default function handler(req, res) {
  const botToken = '8606085102:AAGYTrjx6BjMYh_GXtw7o1vRz4zSiieHMCA';
  const chatId = '-1003769181399';
  
  // Достаем источник из ссылки (?from=...)
  const source = req.query.from || 'Direct';
  
  // Вставляем источник в твой рабочий текст
  const text = encodeURIComponent(`🚀 Клик! \n📍 Источник: ${source} \n🔗 Сайт: craftdudl.site`);

  // Твоя рабочая схема отправки
  fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${text}`)
    .catch(err => console.error("Ошибка ТГ"));

  // Твой рабочий редирект
  res.setHeader('Location', 'https://craftdudl.site');
  res.status(302).end();
}