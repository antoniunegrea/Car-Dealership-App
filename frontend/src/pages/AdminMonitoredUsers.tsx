import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface MonitoredUser {
  id: number;
  user: {
    id: number;
    username: string;
  };
  flagged: boolean;
  actionCount: number | null;
  lastChecked: string;
}

const AdminMonitoredUsers: React.FC = () => {
  const [users, setUsers] = useState<MonitoredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMonitoredUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/admin/monitored-users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch monitored users');
        const data = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching monitored users');
      } finally {
        setLoading(false);
      }
    };
    fetchMonitoredUsers();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #ccc', padding: 32 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Monitored Users Dashboard</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ padding: 12, border: '1px solid #eee' }}>User ID</th>
            <th style={{ padding: 12, border: '1px solid #eee' }}>Username</th>
            <th style={{ padding: 12, border: '1px solid #eee' }}>Action Count</th>
            <th style={{ padding: 12, border: '1px solid #eee' }}>Status</th>
            <th style={{ padding: 12, border: '1px solid #eee' }}>Last Checked</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} style={{ textAlign: 'center' }}>
              <td style={{ padding: 10, border: '1px solid #eee' }}>{user.user.id}</td>
              <td style={{ padding: 10, border: '1px solid #eee' }}>{user.user.username}</td>
              <td style={{ padding: 10, border: '1px solid #eee' }}>{user.actionCount || 0}</td>
              <td style={{ padding: 10, border: '1px solid #eee' }}>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '4px',
                  backgroundColor: user.flagged ? '#ffebee' : '#e8f5e9',
                  color: user.flagged ? '#c62828' : '#2e7d32'
                }}>
                  {user.flagged ? 'Flagged' : 'Normal'}
                </span>
              </td>
              <td style={{ padding: 10, border: '1px solid #eee' }}>
                {new Date(user.lastChecked).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button 
        style={{ 
          marginTop: 24, 
          padding: '8px 24px', 
          borderRadius: 4, 
          background: '#1976d2', 
          color: '#fff', 
          border: 'none', 
          fontWeight: 'bold', 
          cursor: 'pointer' 
        }} 
        onClick={() => navigate('/dealerships')}
      >
        Back to Home
      </button>
    </div>
  );
};

export default AdminMonitoredUsers; 