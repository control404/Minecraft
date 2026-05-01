export default async function handler(req, res) {
  // 1. Проверь URL (без слеша в конце) и Ключ (длинная строка)
  const SUPABASE_URL = 'https://exlicdagocuvbjgjcdjv.supabase.co/rest/v1/'; 
  const SUPABASE_KEY = 'sb_publishable_WCWYAHvWLJoKblmD5q9Tcw_jqWQVEAu';

  const botToken = '8606085102:AAGYTrjx6BjMYh_GXtw7o1vRz4zSiiehMCA';
  const chatId = '-1003769181399';
  const from = req.query.from || 'direct';
  let finalUrl = 'https://craftdudl.site'; // Запасная ссылка

  try {
    // ПОПЫТКА 1: Получаем ссылку из базы
    const settingsResp = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?id=eq.main_link&select=url`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    
    if (settingsResp.ok) {
      const settings = await settingsResp.json();
      if (settings[0]?.url) finalUrl = settings[0].url;
    }

    // ПОПЫТКА 2: Логируем клик
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '0.0.0.0';
    fetch(`${SUPABASE_URL}/rest/v1/click_stats`, {
      method: 'POST',
      headers: { 
        'apikey': SUPABASE_KEY, 
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        button_id: from,
        user_ip: ip,
        user_agent: req.headers['user-agent'] || 'unknown'
      })
    }).catch(e => console.log("DB Write Error"));

  } catch (e) {
    console.error("System Error:", e);
  }

  // ОТПРАВКА В ТГ (вынесено из try, чтобы работало всегда)
  const message = `🚀 Клик! \n📍 Источник: ${from} \n🔗 Куда: ${finalUrl}`;
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message })
  }).catch(e => {});

  // РЕДИРЕКТ
  res.setHeader('Location', finalUrl);
  return res.status(302).end();
}