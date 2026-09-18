function fillSample(el) {
  document.getElementById('complaintText').value = el.textContent;
}

document.getElementById('submitBtn').addEventListener('click', async () => {
  const text = document.getElementById('complaintText').value.trim();
  if (!text) {
    alert('Please type a complaint first.');
    return;
  }

  const resultBox = document.getElementById('result');
  resultBox.style.display = 'none';

  try {
    const res = await fetch('/api/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    const data = await res.json();

    document.getElementById('category').textContent = data.category;
    document.getElementById('department').textContent = data.department;
    document.getElementById('reviewNote').style.display = data.needsHumanReview ? 'block' : 'none';
    resultBox.style.display = 'block';
  } catch (err) {
    alert('Something went wrong classifying the complaint. Check the browser console for details.');
    console.error(err);
  }
});
