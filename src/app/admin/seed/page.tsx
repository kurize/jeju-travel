'use client';

import { useState } from 'react';

export default function SeedPage() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    setStatus('正在导入种子数据...');
    try {
      const resp = await fetch('/api/seed', { method: 'POST' });
      const data = await resp.json();
      if (resp.ok) {
        setStatus(`✅ ${data.message}（Trip ID: ${data.tripId}）`);
      } else {
        setStatus(`❌ ${data.message}: ${data.error}`);
      }
    } catch (e) {
      setStatus(`❌ 网络错误: ${e}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px 20px', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '20px', marginBottom: '16px' }}>种子数据管理</h1>
      <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
        点击下方按钮导入济州岛行程模板数据到 Supabase（通过服务端执行）。
      </p>
      <button
        onClick={handleSeed}
        disabled={loading}
        style={{
          padding: '12px 24px', fontSize: '16px', fontWeight: 700,
          backgroundColor: loading ? '#ccc' : '#F5727F', color: '#fff',
          border: 'none', borderRadius: '12px', cursor: loading ? 'default' : 'pointer',
        }}
      >
        {loading ? '导入中...' : '导入济州岛数据'}
      </button>
      {status && (
        <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', backgroundColor: '#f5f5f5', fontSize: '14px' }}>
          {status}
        </div>
      )}
    </div>
  );
}
