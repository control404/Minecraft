export default async function handler(req, res) {
    const botToken = '8606085102:AAGYTrjx6BjMYh_GXtw7o1vRz4zSiieHMCA';
    const chatId = '-1003769181399';
    
    // Получаем параметры. Если их нет, код не упадет, а подставит текст в кавычках.
    const source = req.query.from || "unknown";
    const country = req.headers['x-vercel-ip-country'] || "no-country";
    
    const text = `Click! Source: ${source}, Country: ${country}`;

    try {
        // Простейший GET запрос без сложных объектов
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}`);
    } catch (e) {
        // Даже если ТГ выдаст ошибку, редирект всё равно сработает
    }

    res.writeHead(302, { Location: 'https://craftdudl.site' });
    res.end();
}