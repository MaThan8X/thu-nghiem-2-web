// File: js/app.js
// JSON Viewer for THU NGHIEM 2 — giữ dữ liệu trước <form>, xóa HTML, xuống dòng mỗi record

document.addEventListener('DOMContentLoaded', () => {
  const fetchBtn    = document.getElementById('fetchBtn');
  const apiUrlInput = document.getElementById('apiUrl');
  const output      = document.getElementById('output');
  const errorMsg    = document.getElementById('errorMsg');
  const PROXY_BASE = 'https://steady-tarsier-066280.netlify.app/.netlify/functions/proxy?url=';


  async function fetchAndDisplay() {
    const rawUrl = apiUrlInput.value.trim();
    if (!rawUrl) {
      errorMsg.textContent = 'Vui lòng nhập URL API.';
      return;
    }
    errorMsg.textContent = '';
    output.textContent   = 'Đang tải…';

    try {
      const res  = await fetch(PROXY_BASE + encodeURIComponent(rawUrl));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();

      // 1. Lấy phần trước <form
      let clean = text.split(/<form[\s\S]*/i)[0];

      // 2. Loại bỏ mọi thẻ HTML (an toàn)
      clean = clean.replace(/<\/?[^>]+(>|$)/g, '');

      // 3. Xóa thẻ <br>
      clean = clean.replace(/<br\s*\/?>/gi, '');

      // 4. Giữ nguyên dấu ; và chèn xuống dòng sau mỗi record "value=...;"
      clean = clean.replace(/(value=-?\d+;)/g, '$1\n');

      output.textContent = clean.trim();
    } catch (err) {
      output.textContent   = '';
      errorMsg.textContent = `Lỗi: ${err.message}`;
    }
  }

  fetchBtn.addEventListener('click', fetchAndDisplay);
  apiUrlInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') fetchAndDisplay();
  });
});
