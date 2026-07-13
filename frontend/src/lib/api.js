const API_BASE = '/api';

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('ncert_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
}

async function apiFetchBlob(path, options = {}) {
  const token = localStorage.getItem('ncert_token');
  const headers = { ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) throw new Error('Audio request failed');
  return res.blob();
}

// Auth
export const register = (data) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) });
export const login = async (email, password) => {
  const form = new URLSearchParams();
  form.append('username', email);
  form.append('password', password);
  let res;
  try {
    res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
    });
  } catch (networkErr) {
    throw new Error('Cannot reach the server. Make sure the backend is running on port 8082.');
  }
  const text = await res.text();
  if (!text || !text.trim()) {
    throw new Error('Server returned an empty response. Please restart the backend server.');
  }
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Server returned an invalid response. Please restart the backend server.');
  }
  if (!res.ok) {
    throw new Error(data?.detail || 'Login failed');
  }
  return data;
};
export const getMe = () => apiFetch('/auth/me');
export const linkStudent = (email) => apiFetch('/auth/link-student', { method: 'POST', body: JSON.stringify({ student_email: email }) });
export const linkParent = (email) => apiFetch('/auth/link-parent', { method: 'POST', body: JSON.stringify({ parent_email: email }) });

export const getSimplifyHistory = () => apiFetch('/simplify/history');
export const getCachedPage = (pageId) => apiFetch(`/simplify/page/${pageId}`);
export const deleteCachedPage = (pageId) => apiFetch(`/simplify/page/${pageId}`, { method: 'DELETE' });
export const deleteAllCachedPages = () => apiFetch('/simplify/page', { method: 'DELETE' });
export const simplifyPage = (text, language = 'en', classLevel = 10, subject = 'default', eli10 = false, pageId = null) =>
  apiFetch('/simplify', { method: 'POST', body: JSON.stringify({ text, language, class_level: classLevel, subject, eli10, page_id: pageId }) });

export async function* simplifyStream(text, language = 'en', classLevel = 10, subject = 'default', eli10 = false, pageId = null) {
  const token = localStorage.getItem('ncert_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_BASE}/simplify/stream`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ text, language, class_level: classLevel, subject, eli10, page_id: pageId })
  });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Stream request failed' }));
    throw new Error(err.detail || 'Stream request failed');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    yield decoder.decode(value, { stream: true });
  }
}

// ✅ FIX: Added missing detectSubject export — required for GradeBanner in StudentView
export const detectSubject = (text, classLevel = null) =>
  apiFetch('/simplify/detect', { 
    method: 'POST', 
    body: JSON.stringify({ 
      text: text.slice(0, 800), 
      class_level: classLevel 
    }) 
  });

// Doubt chat
export const askDoubt = (question, context = '', language = 'en', sessionId = null, userId = null, pageId = null) =>
  apiFetch('/doubt', { method: 'POST', body: JSON.stringify({ question, context, language, session_id: sessionId, user_id: userId, page_id: pageId }) });
export const getDoubtHistory = (sessionId, context = '', userId = null, pageId = null) => {
  const queryParams = new URLSearchParams();
  if (context) queryParams.append('context', context);
  if (userId) queryParams.append('user_id', userId);
  if (pageId) queryParams.append('page_id', pageId);
  const qStr = queryParams.toString();
  return apiFetch(`/doubt/history/${sessionId}${qStr ? '?' + qStr : ''}`);
};
export const getChatSessions = (userId) =>
  apiFetch(`/doubt/sessions/${userId}`);
export const clearDoubt = (sessionId) =>
  apiFetch(`/doubt/${sessionId}`, { method: 'DELETE' });

// Quiz
export const generateQuiz = (text, classLevel = 10, language = 'en', pageId = null, docId = null) =>
  apiFetch('/quiz/generate', { method: 'POST', body: JSON.stringify({ text, class_level: classLevel, language, page_id: pageId, doc_id: docId }) });
export const submitQuizScore = (userId, pageId, correct, total) =>
  apiFetch('/quiz/score', { method: 'POST', body: JSON.stringify({ user_id: userId, page_id: pageId, correct, total }) });

// Flashcards
export const generateFlashcards = (text, classLevel = 10, language = 'en', pageId = null, docId = null) =>
  apiFetch('/flashcards/generate', { method: 'POST', body: JSON.stringify({ text, class_level: classLevel, language, page_id: pageId, doc_id: docId }) });

// Audio
export const generateAudio = async (text, language = 'en') => {
  const token = localStorage.getItem('ncert_token');
  const res = await fetch(`${API_BASE}/audio/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ text, language }),
  });
  if (!res.ok) throw new Error('Audio generation failed');
  return res.blob();
};

// Upload
export const uploadPDF = async (file, language = 'en', classLevel = 10, subject = 'default', eli10 = false) => {
  const form = new FormData();
  form.append('file', file);
  form.append('language', language);
  form.append('class_level', classLevel);
  form.append('subject', subject);
  form.append('eli10', eli10);
  const token = localStorage.getItem('ncert_token');
  const res = await fetch(`${API_BASE}/upload/pdf`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  if (!res.ok) {
    if (res.status === 413) {
      throw new Error('PDF file size exceeds Vercel limit (4.5MB). Please copy-paste the text or upload a smaller PDF chapter.');
    }
    const text = await res.text().catch(() => '');
    if (text.includes('Request Entity Too Large') || text.includes('Request En')) {
      throw new Error('PDF file size exceeds Vercel limit (4.5MB). Please copy-paste the text or upload a smaller PDF chapter.');
    }
    throw new Error('Failed to upload PDF. Please make sure the file is valid.');
  }
  return res.json();
};
export const uploadImage = async (file) => {
  const form = new FormData();
  form.append('file', file);
  const token = localStorage.getItem('ncert_token');
  const res = await fetch(`${API_BASE}/upload/image`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  if (!res.ok) {
    if (res.status === 413) {
      throw new Error('Image file size exceeds Vercel limit (4.5MB). Please copy-paste the text or upload a smaller image.');
    }
    const text = await res.text().catch(() => '');
    if (text.includes('Request Entity Too Large') || text.includes('Request En')) {
      throw new Error('Image file size exceeds Vercel limit (4.5MB). Please copy-paste the text or upload a smaller image.');
    }
    throw new Error('Failed to upload image. Please make sure the file is valid.');
  }
  return res.json();
};

// Progress
export const saveProgress = (pageId, status = 'completed', quizScore = 0, timeSpent = 0) =>
  apiFetch('/progress', { method: 'POST', body: JSON.stringify({ page_id: pageId, status, quiz_score: quizScore, time_spent: timeSpent }) });
export const getMyProgress = () => apiFetch('/progress/me');
export const getChildrenProgress = () => apiFetch('/progress/children');

// Gamification
export const getMyGamification = () => apiFetch('/gamification/me');
export const getLeaderboard = () => apiFetch('/gamification/leaderboard');

// Assignments
export const createAssignment = (studentId, pageId, description) =>
  apiFetch('/assignments', { method: 'POST', body: JSON.stringify({ student_id: studentId, page_id: pageId, description }) });
export const getMyAssignments = () => apiFetch('/assignments/my');
export const getStudents = () => apiFetch('/assignments/students');

// Goals
export const createGoal = (studentId, targetXp, rewardName) =>
  apiFetch('/goals', { method: 'POST', body: JSON.stringify({ student_id: studentId, target_xp: targetXp, reward_name: rewardName }) });
export const getParentGoals = () => apiFetch('/goals/parent');
export const getStudentGoals = () => apiFetch('/goals/student');

// Curriculum
export const getSyllabusRoadmap = (subject = 'science') => apiFetch(`/curriculum/roadmap?subject=${subject}`);
export const getClassSubjects = () => apiFetch('/curriculum/subjects');

// Mock Exams
export const generateMockExam = (pageId, language = 'en') =>
  apiFetch('/exams/generate', { method: 'POST', body: JSON.stringify({ page_id: pageId, language }) });
export const evaluateMockExam = (examId, answers) =>
  apiFetch('/exams/evaluate', { method: 'POST', body: JSON.stringify({ exam_id: examId, answers }) });