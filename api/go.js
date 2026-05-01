export default function handler(req, res) {
    const botToken = '8606085102:AAGYTrjx6BjMYh_GXtw7o1vRz4zSiieHMCA';
    const chatId = '-1003769181399';
    
    const text = encodeURIComponent("🚀 Клик по ссылке в био! \n🔗 Сайт: craftdudl.site");

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${text}`)
        .catch(err => console.error("Ошибка ТГ"));

    res.setHeader('Location', 'https://craftdudl.site');
    res.status(302).end();
}