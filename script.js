// Copy-to-clipboard for payment details
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.querySelector(btn.dataset.copy);
    navigator.clipboard.writeText(target.textContent.trim()).then(() => {
      const original = btn.textContent;
      btn.textContent = 'Copied ✓';
      setTimeout(() => (btn.textContent = original), 1500);
    });
  });
});

// Lightbox for proof screenshots — tap a thumbnail to view full-size
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxError = document.getElementById('lightboxError');
if (lightbox) {
  document.querySelectorAll('.proof-thumb').forEach(img => {
    img.addEventListener('click', () => {
      lightboxError.hidden = true;
      lightboxImg.hidden = false;
      lightboxImg.src = img.src;
      lightbox.hidden = false;
    });
  });
  lightboxImg.addEventListener('error', () => {
    lightboxImg.hidden = true;
    lightboxError.hidden = false;
  });
  const closeLightbox = () => { lightbox.hidden = true; lightboxImg.src = ''; };
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
}

// Code generation form
const form = document.getElementById('codeForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoader = submitBtn.querySelector('.btn-loader');
const resultBox = document.getElementById('result');
const codeOutput = document.getElementById('codeOutput');
const errorBox = document.getElementById('errorBox');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorBox.hidden = true;
  resultBox.hidden = true;

  const email = document.getElementById('email').value.trim();
  if (!email) return;

  submitBtn.disabled = true;
  btnText.hidden = true;
  btnLoader.hidden = false;

  try {
    const res = await fetch('/api/generate-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Something went wrong, try again.');
    }

    const data = await res.json();
    codeOutput.textContent = data.code;
    resultBox.hidden = false;
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.hidden = false;
  } finally {
    submitBtn.disabled = false;
    btnText.hidden = false;
    btnLoader.hidden = true;
  }
});
