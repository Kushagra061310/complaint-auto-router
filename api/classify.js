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
      const text = (parsed.text || '').trim();
      if (!text) {
        res.status(400).json({ error: 'Please describe the complaint before submitting.' });
        return;
      }
      const result = classify(text);
      res.status(200).json(result);
    } catch (e) {
      res.status(400).json({ error: 'Invalid request body' });
    }
  });
};

function classify(text) {
  const lower = text.toLowerCase();

  const categoryKeywords = {
    'Academic': [
      'exam', 'grade', 'marks', 'syllabus', 'professor', 'lecture', 'assignment',
      'result', 'paper', 'datesheet', 'teaching', 'class', 'attendance', 'internal',
      'practical', 'lab record', 'thesis', 'project guide', 'viva', 'revaluation',
      'answer sheet', 'answer script', 'curriculum', 'timetable'
    ],
    'Hostel/Infrastructure': [
      'hostel', 'room', 'mess', 'food', 'water', 'electricity', 'socket', 'washroom',
      'clean', 'hygiene', 'furniture', 'lift', 'elevator', 'block', 'stairs',
      'generator', 'power cut', 'light', 'fan', 'ac', 'air conditioner', 'parking',
      'gate', 'security guard', 'cctv', 'garden', 'ground', 'playground', 'sports',
      'gym', 'court', 'equipment', 'canteen', 'drinking water', 'cooler', 'leak',
      'leakage', 'ceiling', 'wall', 'paint', 'construction', 'noise', 'garbage',
      'drainage', 'pest', 'insect'
    ],
    'Administrative': [
      'certificate', 'fee', 'fees', 'receipt', 'scholarship', 'transcript', 'bonafide',
      'admin', 'document', 'id card', 'registration', 'refund', 'migration',
      'admission', 'form', 'application', 'library fine', 'no dues', 'leaving certificate',
      'hostel allotment', 'seat allotment', 'office', 'counter'
    ],
    'IT/Technical': [
      'wifi', 'wi-fi', 'internet', 'login', 'portal', 'password', 'computer', 'lab',
      'software', 'website', 'server', 'network', 'printer', 'biometric', 'attendance machine',
      'e-learning', 'app', 'crash', 'error', 'system down', 'projector', 'screen',
      'email', 'account locked'
    ],
    'Faculty/Staff Behavior': [
      'rude', 'misconduct', 'harassment', 'inappropriate', 'unprofessional', 'behavior',
      'behaviour', 'disrespect', 'unresponsive', 'bullying', 'ragging', 'favoritism',
      'favouritism', 'bias', 'shouted', 'insulted', 'humiliated', 'threat', 'threatened'
    ]
  };

  const departmentNames = {
    'Academic': 'Academic Affairs Office',
    'Hostel/Infrastructure': 'Hostel & Facilities Management',
    'Administrative': 'Administrative Office',
    'IT/Technical': 'IT Support Desk',
    'Faculty/Staff Behavior': 'Dean of Student Affairs (Human Review Required)'
  };

  const scores = {};
  const matches = {};
  for (const [category, words] of Object.entries(categoryKeywords)) {
    const found = words.filter((word) => lower.includes(word));
    scores[category] = found.length;
    matches[category] = found;
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
    matchScore: bestScore,
    matchedKeywords: matches[bestCategory]
  };
}