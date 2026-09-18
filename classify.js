module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let body = '';
  req.on('data', (chunk) => { body += chunk; });
  req.on('end', () => {
    try {
      const parsed = JSON.parse(body || '{}');
      const result = classify(parsed.text || '');
      res.status(200).json(result);
    } catch (e) {
      res.status(400).json({ error: 'Invalid request body' });
    }
  });
};

function classify(text) {
  const lower = text.toLowerCase();

  const categoryKeywords = {
    'Academic': ['exam', 'grade', 'marks', 'syllabus', 'professor', 'lecture', 'assignment', 'result', 'paper', 'datesheet', 'teaching', 'class'],
    'Hostel/Infrastructure': ['hostel', 'room', 'mess', 'food', 'water', 'electricity', 'socket', 'washroom', 'clean', 'hygiene', 'furniture'],
    'Administrative': ['certificate', 'fee', 'fees', 'receipt', 'scholarship', 'transcript', 'bonafide', 'admin', 'document', 'id card', 'registration'],
    'IT/Technical': ['wifi', 'wi-fi', 'internet', 'login', 'portal', 'password', 'computer', 'lab', 'software', 'website', 'server', 'network'],
    'Faculty/Staff Behavior': ['rude', 'misconduct', 'harassment', 'inappropriate', 'unprofessional', 'behavior', 'behaviour', 'disrespect', 'unresponsive']
  };

  const departmentNames = {
    'Academic': 'Academic Affairs Office',
    'Hostel/Infrastructure': 'Hostel & Facilities Management',
    'Administrative': 'Administrative Office',
    'IT/Technical': 'IT Support Desk',
    'Faculty/Staff Behavior': 'Dean of Student Affairs (Human Review Required)'
  };

  const scores = {};
  for (const [category, words] of Object.entries(categoryKeywords)) {
    scores[category] = words.reduce((count, word) => count + (lower.includes(word) ? 1 : 0), 0);
  }

  let bestCategory = 'Administrative';
  let bestScore = 0;
  for (const [category, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return {
    category: bestCategory,
    department: departmentNames[bestCategory],
    needsHumanReview: bestCategory === 'Faculty/Staff Behavior',
    matchScore: bestScore
  };
}
