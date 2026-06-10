// OPC 隐式访问统计器 —— 静默收集，不影响用户体验
(function () {
  // 不在统计页面自身触发
  if (location.pathname.includes("stats.html")) return;

  // 防抖动：同一会话 3 秒内重复加载不重复记录
  const last = sessionStorage.getItem("opc_track_ts");
  if (last && Date.now() - parseInt(last, 10) < 3000) return;
  sessionStorage.setItem("opc_track_ts", String(Date.now()));

  async function collect() {
    try {
      // 获取 IP 与地理位置（ipapi.co 免费额度约 3 万次/月）
      const geoRes = await fetch("https://ipapi.co/json/");
      const geo = await geoRes.json();

      const record = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        ip: geo.ip || "unknown",
        city: geo.city || "未知",
        region: geo.region || "未知",
        country: geo.country_name || "未知",
        time: new Date().toISOString(),
        page: location.pathname + location.search,
      };

      // 本地存储（本浏览器视角）
      const key = "opc_visit_log";
      const logs = JSON.parse(localStorage.getItem(key) || "[]");
      logs.push(record);
      if (logs.length > 500) logs.shift(); // 保留最近 500 条
      localStorage.setItem(key, JSON.stringify(logs));

      // 上报到 Supabase
      const SUPABASE_URL = "https://uwhntylvimegzdtsfwkc.supabase.co";
      const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3aG50eWx2aW1lZ3pkdHNmd2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNTI4MTcsImV4cCI6MjA5NjYyODgxN30.OEuJdbahdfXyy3MgWFTw2-vn3oZrHwH0MTBroyFCV98";
      if (SUPABASE_URL && SUPABASE_KEY) {
        fetch(`${SUPABASE_URL}/rest/v1/visits`, {
          method: "POST",
          headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json", Prefer: "return=minimal" },
          body: JSON.stringify(record),
        }).catch(() => {});
      }
    } catch (e) {
      // 静默失败，绝不干扰正常页面
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", collect);
  } else {
    collect();
  }
})();
