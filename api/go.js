export default async function handler(req, res) {
  // Твои данные из Supabase (Project Settings -> API)
  const SUPABASE_URL = 'https://exlicdagocuvbjgjcdjv.supabase.co/rest/v1/'; 
  const SUPABASE_KEY = 'sb_publishable_WCWYAHvWLJoKblmD5q9Tcw_jqWQVEAu';

  const botToken = '8606085102:AAGYTrjx6BjMYh_GXtw7o1vRz4zSiieHMCA';
  const chatId = '-1003769181399';

  try {
    // 1. Получаем текущую ссылку из базы
    const settingsResp = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?id=eq.main_link&select=url`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    const settings = await settingsResp.json();
    const finalUrl = settings[0]?.url || 'https://craftdudl.site';

    // 2. Логируем клик для статистики (не ждем ответа, чтобы не тормозить юзера)
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    fetch(`${SUPABASE_URL}/rest/v1/click_stats`, {
      method: 'POST',
      headers: { 
        'apikey': SUPABASE_KEY, 
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        button_id: req.query.from || 'direct',
        user_ip: ip,
        user_agent: req.headers['user-agent']
      })
    }).catch(() => {});

    // 3. Уведомление в ТГ (как в твоем рабочем коде)
    const text = encodeURIComponent(`🚀 Клик! \n📍 Источник: ${req.query.from || 'direct'} \n🔗 Редирект: ${finalUrl}`);
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${text}`).catch(() => {});

    // 4. Мгновенный редирект
    res.setHeader('Location', finalUrl);
    res.status(302).end();

  } catch (e) {
    // Если база тупит — просто отправляем на сайт, чтобы не терять трафик
    res.setHeader('Location', 'https://craftdudl.site');
    res.status(302).end();
  }
}