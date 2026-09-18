function fillSample(el) {
  document.getElementById('complaintText').value = el.textContent;
  document.getElementById('errorBox').style.display = 'none';
}

document.getElementById('submitBtn').addEventListener('click', async () => {
  const text = document.getElementById('complaintText').value.trim();
  const resultBox = document.getElementById('result');
  const errorBox = document.getElementById('errorBox');

  errorBox.style.display = 'none';
  resultBox.style.display = 'none';

  if (!text) {
    errorBox.textContent = 'Please type a complaint first.';
    errorBox.style.display = 'block';
    return;
  }

  try {
    const res = await fetch('/api/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    const data = await res.json();

    if (!res.ok) {
      errorBox.textContent = data.error || 'Something went wrong. Please try again.';
      errorBox.style.display = 'block';
      return;
    }

    document.getElementById('category').textContent = data.category;
    document.getElementById('department').textContent = data.department;
    document.getElementById('reviewNote').style.display = data.needsHumanReview ? 'block' : 'none';

    const keywordsEl = document.getElementById('matchedKeywords');
    if (data.matchedKeywords && data.matchedKeywords.length > 0) {
      keywordsEl.textContent = 'Matched on: ' + data.matchedKeywords.join(', ');
      keywordsEl.style.display = 'block';
    } else {
      keywordsEl.textContent = 'No strong keyword match — defaulted to Administrative for manual sorting.';
      keywordsEl.style.display = 'block';
    }

    resultBox.style.display = 'block';
  } catch (err) {
    errorBox.textContent = 'Could not reach the classifier. Check your connection and try again.';
    errorBox.style.display = 'block';
    console.error(err);
  }
});