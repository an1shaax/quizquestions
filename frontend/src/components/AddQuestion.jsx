import React, { useState } from 'react';
import { addQuestion } from '../soroban';

export default function AddQuestion({ publicKey }) {
  const [id, setId] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!publicKey) {
      setStatus('Please connect your Freighter wallet first.');
      return;
    }
    
    if (!id || !question || !answer) {
      setStatus('All fields are required.');
      return;
    }

    setLoading(true);
    setStatus('Sending transaction to Soroban Testnet... (Please approve in Freighter)');
    
    try {
      await addQuestion(publicKey, id, question, answer);
      setStatus('Question added successfully!');
      setId('');
      setQuestion('');
      setAnswer('');
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err.message || 'Transaction failed.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card animate-fade-in" style={{ marginTop: '2rem' }}>
      <h2 className="text-gradient" style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>Create Question</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Question ID (Numeric)</label>
          <input 
            type="number" 
            placeholder="e.g. 1" 
            value={id} 
            onChange={(e) => setId(e.target.value)} 
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Question Text</label>
          <textarea 
            rows="3" 
            placeholder="e.g. What is the capital of France?" 
            value={question} 
            onChange={(e) => setQuestion(e.target.value)} 
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Correct Answer</label>
          <input 
            type="text" 
            placeholder="e.g. Paris" 
            value={answer} 
            onChange={(e) => setAnswer(e.target.value)} 
          />
        </div>
        
        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
          {loading ? 'Processing...' : 'Add to Blockchain'}
        </button>
      </form>
      
      {status && (
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1.25rem', 
          border: `4px solid ${status.includes('Error') ? 'var(--error)' : status.includes('success') ? 'var(--success)' : 'var(--hot-pink)'}`,
          background: '#000',
          color: status.includes('Error') ? 'var(--error)' : status.includes('success') ? 'var(--success)' : '#fff',
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
