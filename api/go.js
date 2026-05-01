export default function handler(req, res) {
    const botToken = '8606085102:AAGYTrjx6BjMYh_GXtw7o1vRz4zSiieHMCA';
    const chatId = '-1003769181399';
    
    // Получаем источник из ссылки (?from=...)
    const source = req.query.from || 'Прямой переход';
    
    // Получаем ГЕО (страну и город) из заголовков Vercel
    const country = req.headers['x-vercel-ip-country'] || 'Неизвестно';
    const city = req.headers['x-vercel-ip-city'] || 'Неизвестно';
    
    // Собираем красивое сообщение
    const message = `🚀 *Новый клик!*
📍 *Источник:* ${source}
🌍 *ГЕО:* ${country} (${city})
🔗 *Сайт:* craftdudl.site`;

    const text = encodeURIComponent(message);

    // Отправляем в ТГ (добавили parse_mode=Markdown для жирного шрифта)
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${text}&parse_mode=Markdown`)
        .catch(err => console.error("Ошибка ТГ"));

    // Редирект
    res.setHeader('Location', 'https://craftdudl.site');
    res.status(302).end();
}