export default async function handler(req, res) {
    const botToken = '8606085102:AAGYTrjx6BjMYh_GXtw7o1vRz4zSiieHMCA';
    const chatId = '-1003769181399';
    
    const source = req.query.from || 'Прямой переход';
    const country = req.headers['x-vercel-ip-country'] || '??';
    const city = req.headers['x-vercel-ip-city'] || '??';
    
    const message = `🚀 Клик!\n📍 Источник: ${source}\n🌍 ГЕО: ${country} (${city})`;
    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

    try {
        // Ждем, пока телеграм подтвердит получение
        await fetch(url);
    } catch (e) {
        console.error("Ошибка:", e);
    }

    // Только после этого делаем редирект
    res.redirect(302, 'https://craftdudl.site');
}