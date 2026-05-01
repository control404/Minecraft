export default function handler(req, res) {
    const botToken = '8606085102:AAGYTrjx6BjMYh_GXtw7o1vRz4zSiieHMCA';
    const chatId = '-1003769181399';
    
    // Используем максимально простые переменные без async/await
    const source = req.query.from || 'Direct';
    const country = req.headers['x-vercel-ip-country'] || '??';
    
    const text = encodeURIComponent(`🚀 Клик!\n📍 Источник: ${source}\n🌍 ГЕО: ${country}`);

    // Отправляем запрос «в фоне», не заставляя сервер ждать ответа
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${text}`)
        .catch(err => console.log("TG error"));

    // Моментальный редирект, как в самом первом рабочем варианте
    res.setHeader('Location', 'https://craftdudl.site');
    res.status(302).end();
}