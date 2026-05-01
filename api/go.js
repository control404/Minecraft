export default async function handler(req, res) {
  // 1. Твои данные из настроек Supabase
  const SUPABASE_URL = 'https://exlicdagocuvbjgjcdjv.supabase.co'; 
  const SUPABASE_KEY = 'sb_publishable_WCWYAHvWLJoKblmD5q9Tcw_jqWQVEAu';

  const botToken = '8606085102:AAGYTrjx6BjMYh_GXtw7o1vRz4zSiiehMCA';
  const chatId = '-1003769181399';
  
  const from = req.query.from || 'direct';
  let finalUrl = 'https://craftdudl.site'; // Запасная ссылка

  try {
    // ТУТ МЫ ОБРАЩАЕМСЯ К ТВОЕЙ ТАБЛИЦЕ site_settings
    const settingsResp = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?id=eq.main_link&select=url`, {
      headers: { 
        'apikey': SUPABASE_KEY, 
        'Authorization': `Bearer ${SUPABASE_KEY}` 
      }
    });
    
    if (settingsResp.ok) {
      const settings = await settingsResp.json();
      if (settings[0]?.url) {
        finalUrl = settings[0].url;
      }
    }

    // ТУТ МЫ ПИШЕМ КЛИК В ТАБЛИЦУ click_stats
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
    }).catch(e => console.error("Stat error"));

  } catch (e) {
    console.error("Critical error:", e.message);
  }

  // УВЕДОМЛЕНИЕ В ТГ
  const tgMessage = `🚀 Клик! \n📍 Источник: ${from} \n🔗 Куда: ${finalUrl}`;
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: tgMessage })
  }).catch(() => {});

  // РЕДИРЕКТ
  res.setHeader('Location', finalUrl);
  return res.status(302).end();
}