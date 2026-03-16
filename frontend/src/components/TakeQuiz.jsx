import React, { useState } from 'react';
import { getQuestion, checkAnswer } from '../soroban';

export default function TakeQuiz({ publicKey }) {
  const [loadId, setLoadId] = useState('');
  const [questionData, setQuestionData] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchQuestion = async (e) => {
    e.preventDefault();
    if (!loadId) return;

    setLoading(true);
    setStatus('Fetching from blockchain...');
    setQuestionData(null);
    setUserAnswer('');
    
    try {
      const q = await getQuestion(loadId);
      if (q && q.question) {
        setQuestionData(q);
        setStatus('');
      } else {
        setStatus('Question not found or invalid format.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Failed to fetch question. Check console.');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (e) => {
    e.preventDefault();
    if (!userAnswer) {
      setStatus('Please enter an answer.');
      return;
    }

    setLoading(true);
    setStatus('Verifying answer...');

    try {
      const isCorrect = await checkAnswer(publicKey, loadId, userAnswer);
      
      if (isCorrect) {
        setStatus('✅ Correct! Well done.');
      } else {
        setStatus('❌ Incorrect. Try again!');
      }
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card animate-fade-in" style={{ marginTop: '2rem' }}>
      <h2 className="text-gradient" style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>Take a Quiz</h2>
      
      {!questionData && (
        <form onSubmit={fetchQuestion} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Enter Question ID</label>
            <input 
              type="number" 
              placeholder="e.g. 1" 
              value={loadId} 
              onChange={(e) => setLoadId(e.target.value)} 
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '...' : 'Load'}
          </button>
        </form>
      )}

      {questionData && (
        <div style={{ padding: '1.5rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Question #{questionData.id}</span>
            <button 
              className="btn-outline" 
              style={{ padding: '4px 12px', fontSize: '0.875rem' }}
              onClick={() => { setQuestionData(null); setStatus(''); }}
            >
              Back
            </button>
          </div>
          <p style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '1.5rem' }}>
            "{questionData.question}"
          </p>
          
          <form onSubmit={submitAnswer} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Your answer..." 
              value={userAnswer} 
              onChange={(e) => setUserAnswer(e.target.value)} 
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Verifying...' : 'Submit Answer'}
            </button>
          </form>
        </div>
      )}

      {status && (
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1.25rem', 
          border: `4px solid ${status.includes('✅') ? 'var(--success)' : status.includes('❌') || status.includes('Error') ? 'var(--error)' : 'var(--hot-pink)'}`,
          background: '#000',
          color: status.includes('✅') ? 'var(--success)' : status.includes('❌') || status.includes('Error') ? 'var(--error)' : '#fff',
          textTransform: 'uppercase',
          fontWeight: 'bold',
          letterSpacing: '0.05em'
        }}>
          {status}
        </div>
      )}
    </div>
  );
}
