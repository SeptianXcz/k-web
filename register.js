document.getElementById('toggleFormBtn').onclick = () => {
  document.querySelector('.form-area').style.display = 'block';
};

async function register() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const statusEl = document.getElementById('status');

  if (!username || !password) {
    statusEl.textContent = 'Silakan isi semua field.';
    statusEl.className = 'status error';
    return;
  }

  const OWNER = 'SeptianXcz';
  const REPO = 'Karladb';
  const PATH = 'public/listusers.json';
  const GITHUB_TOKEN = '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';

  try {
    const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    const data = await res.json();
    const content = JSON.parse(atob(data.content));

    if (content.some(u => u.nama.toLowerCase() === username.toLowerCase())) {
      statusEl.textContent = 'Username sudah terdaftar.';
      statusEl.className = 'status error';
      return;
    }

    content.push({
      nama: username,
      password: password,
      nomor: [],
      status: 'active'
    });

    const updated = btoa(JSON.stringify(content, null, 2));

    const updateRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        message: `Register ${username} via Web`,
        content: updated,
        sha: data.sha
      })
    });

    if (!updateRes.ok) throw new Error('Gagal update file GitHub.');

    statusEl.textContent = 'Registrasi berhasil!';
    statusEl.className = 'status success';

    setTimeout(() => {
      window.location.href = 'https://k-web-blue.vercel.app/karla.zip';
    }, 1000);v

  } catch (err) {
    console.error(err);
    statusEl.textContent = 'Gagal registrasi. Periksa koneksi atau token.';
    statusEl.className = 'status error';
  }
}
