import React, { useState } from 'react';
import { connectWallet } from '../soroban';

export default function WalletConnect({ onConnect }) {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    setLoading(true);
    setError('');
    try {
      const pubKey = await connectWallet();
      setAddress(pubKey);
      if (onConnect) onConnect(pubKey);
    } catch (err) {
      setError(err.message || 'Failed to connect Freighter');
    } finally {
      setLoading(false);
    }
  };

  const shortenAddress = (addr) => {
    if (!addr) return '';
    const addressStr = typeof addr === 'string' ? addr : (addr.address || String(addr));
    return `${addressStr.slice(0, 6)}...${addressStr.slice(-4)}`;
  };

  return (
    <div className="wallet-container" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      {error && <span style={{ color: 'var(--error)', fontSize: '0.875rem' }}>{error}</span>}
      
      {address ? (
        <span className="glass-card" style={{ padding: '8px 16px', borderRadius: '20px', fontFamily: 'monospace' }}>
          {shortenAddress(address)}
        </span>
      ) : (
        <button 
          className="btn-primary" 
          onClick={handleConnect} 
          disabled={loading}
        >
          {loading ? 'Connecting...' : 'Connect Freighter'}
        </button>
      )}
    </div>
  );
}
