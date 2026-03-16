import React, { useState } from 'react';
import WalletConnect from './components/WalletConnect';
import AddQuestion from './components/AddQuestion';
import TakeQuiz from './components/TakeQuiz';
import './index.css';

function App() {
  const [address, setAddress] = useState(null);
  const [activeTab, setActiveTab] = useState('take'); // 'take' or 'add'

  return (
    <div className="container">
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '4rem 0',
        marginBottom: '2rem'
      }}>
        <div style={{ position: 'relative' }}>
          <h1 className="title-font" style={{ fontSize: '7rem', letterSpacing: '-0.02em', margin: 0 }}>
            quiz<br/>questions
          </h1>
          <p style={{ color: 'var(--hot-pink)', fontSize: '1.2rem', marginTop: '1rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            Decentralized / Soroban
          </p>
        </div>
        
        <WalletConnect onConnect={(addr) => setAddress(addr)} />
      </header>

      <main>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
          <button 
            className={activeTab === 'take' ? 'btn-primary' : 'btn-outline'} 
            onClick={() => setActiveTab('take')}
          >
            Take a Quiz
          </button>
          <button 
            className={activeTab === 'add' ? 'btn-primary' : 'btn-outline'} 
            onClick={() => setActiveTab('add')}
          >
            Add Question
          </button>
        </div>

        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {activeTab === 'take' && <TakeQuiz publicKey={address} />}
          {activeTab === 'add' && <AddQuestion publicKey={address} />}
        </div>
      </main>
      
      <footer style={{ 
        marginTop: '4rem', 
        padding: '2rem 0', 
        textAlign: 'center', 
        color: 'var(--text-muted)',
        fontSize: '0.875rem'
      }}>
        <p>Built for the Stellar ecosystem.</p>
        <p style={{ marginTop: '0.5rem', opacity: 0.6 }}>Contract ID: CAMP4KWUOXJOHCGPMUNPMEHAJOKSRM6NZ2CBSFST5Z6HDYLKHBV2BQN4</p>
      </footer>
    </div>
  );
}

export default App;
