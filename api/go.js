export default function handler(req, res) {
    const botToken = '8606085102:AAGYTrjx6BjMYh_GXtw7o1vRz4zSiieHMCA';
    const chatId = '-1003769181399';
    
    // Безопасно получаем данные
    const source = req.query.from || 'Прямой переход';
    const country = req.headers['x-vercel-ip-country'] || '??';
    const city = req.headers['x-vercel-ip-city'] || '??';
    
    // Формируем текст без лишних спецсимволов, чтобы не было ошибок
    const message = `🚀 Клик!\n📍 Источник: ${source}\n🌍 ГЕО: ${country} (${city})\n🔗 Сайт: craftdudl.site`;
    const text = encodeURIComponent(message);

    // Отправляем запрос в ТГ
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${text}`)
        .catch(err => console.log("Ошибка отправки"));

    // Моментальный редирект на главную
    res.writeHead(302, { Location: 'https://craftdudl.site' });
    res.end();
}