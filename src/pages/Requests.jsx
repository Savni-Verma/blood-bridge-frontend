import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSentRequests, getReceivedRequests, updateRequestStatus } from '../services/api'

function Requests() {
  const [sentRequests, setSentRequests] = useState([])
  const [receivedRequests, setReceivedRequests] = useState([])
  const [activeTab, setActiveTab] = useState('sent')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => { fetchRequests() }, [])

  const fetchRequests = async () => {
    try {
      const sent = await getSentRequests()
      setSentRequests(sent.data)
      const received = await getReceivedRequests()
      setReceivedRequests(received.data)
    } catch (err) {
      setError('Failed to fetch requests!')
    }
  }

  const handleStatus = async (id, status) => {
    setUpdatingId(id)
    setError('')
    setSuccess('')
    try {
      await updateRequestStatus(id, status)
      setSuccess(`Request ${status.toLowerCase()} successfully!`)
      fetchRequests()
    } catch (err) {
      setError('Failed to update status!')
    } finally {
      setUpdatingId(null)
    }
  }

  const bloodGroupLabels = {
    Apos: 'A+', Aneg: 'A-', Bpos: 'B+', Bneg: 'B-',
    Opos: 'O+', Oneg: 'O-', ABpos: 'AB+', ABneg: 'AB-'
  }

  const statusConfig = {
    PENDING: { bg: '#FFFBEB', color: '#B7791F', border: '#F6E05E', label: '⏳ Pending' },
    ACCEPTED: { bg: '#F0FFF4', color: '#276749', border: '#C6F6D5', label: '✅ Accepted' },
    REJECTED: { bg: '#FFF5F5', color: '#C53030', border: '#FED7D7', label: '❌ Rejected' },
    COMPLETED: { bg: '#EBF8FF', color: '#2B6CB0', border: '#BEE3F8', label: '🎉 Completed' },
  }

  const RequestCard = ({ req, isReceived }) => {
    const status = statusConfig[req.status] || statusConfig.PENDING
    return (
      <div style={styles.card} className="animate-fadeInUp">
        <div style={styles.cardTop}>
          <div style={styles.cardAvatar}>
            {isReceived
              ? req.seeker?.name?.charAt(0).toUpperCase()
              : req.donor?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={styles.cardInfo}>
            <h4 style={styles.cardName}>
              {isReceived ? req.seeker?.name : req.donor?.name}
            </h4>
            <p style={styles.cardRole}>
              {isReceived ? '🆘 Seeker' : '🩸 Donor'}
            </p>
          </div>
          <div style={{
            ...styles.statusBadge,
            backgroundColor: status.bg,
            color: status.color,
            borderColor: status.border,
          }}>
            {status.label}
          </div>
        </div>

        <div style={styles.cardChips}>
          <span style={styles.chip}>
            🩸 {bloodGroupLabels[req.bloodGroup] || req.bloodGroup}
          </span>
          <span style={styles.chip}>📍 {req.city}</span>
          {req.urgent && <span style={styles.urgentChip}>⚡ Urgent</span>}
        </div>

        {isReceived && req.status === 'PENDING' && (
          <div style={styles.actions}>
            <button
              style={styles.acceptBtn}
              onClick={() => handleStatus(req.id, 'ACCEPTED')}
              disabled={updatingId === req.id}
            >
              {updatingId === req.id ? 'Updating...' : '✓ Accept'}
            </button>
            <button
              style={styles.rejectBtn}
              onClick={() => handleStatus(req.id, 'REJECTED')}
              disabled={updatingId === req.id}
            >
              {updatingId === req.id ? 'Updating...' : '✕ Reject'}
            </button>
          </div>
        )}

        {!isReceived && req.status === 'ACCEPTED' && (
          <button
            style={styles.completedBtn}
            onClick={() => handleStatus(req.id, 'COMPLETED')}
            disabled={updatingId === req.id}
          >
            {updatingId === req.id ? 'Updating...' : '🎉 Mark as Completed'}
          </button>
        )}
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <div style={styles.navLogo}>
          <span>🩸</span>
          <span style={styles.navBrand}>BloodBridge</span>
        </div>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
          ← Back
        </button>
      </nav>

      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>My Requests</h1>
          <p style={styles.subtitle}>Track all your blood requests</p>
        </div>

        {error && <div style={styles.errorBox}>⚠️ {error}</div>}
        {success && <div style={styles.successBox}>✅ {success}</div>}

        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(activeTab === 'sent' ? styles.activeTab : {}) }}
            onClick={() => setActiveTab('sent')}
          >
            📤 Sent ({sentRequests.length})
          </button>
          <button
            style={{ ...styles.tab, ...(activeTab === 'received' ? styles.activeTab : {}) }}
            onClick={() => setActiveTab('received')}
          >
            📥 Received ({receivedRequests.length})
          </button>
        </div>

        <div style={styles.list}>
          {activeTab === 'sent' && (
            sentRequests.length === 0
              ? <div style={styles.empty}>
                  <p style={styles.emptyIcon}>📤</p>
                  <p style={styles.emptyText}>No sent requests yet</p>
                  <p style={styles.emptyHint}>Search donors and send a request!</p>
                </div>
              : sentRequests.map(req => (
                  <RequestCard key={req.id} req={req} isReceived={false} />
                ))
          )}

          {activeTab === 'received' && (
            receivedRequests.length === 0
              ? <div style={styles.empty}>
                  <p style={styles.emptyIcon}>📥</p>
                  <p style={styles.emptyText}>No received requests yet</p>
                  <p style={styles.emptyHint}>Create a donor profile to receive requests!</p>
                </div>
              : receivedRequests.map(req => (
                  <RequestCard key={req.id} req={req} isReceived={true} />
                ))
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#FFF5F5' },
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1rem 2rem', backgroundColor: 'white',
    boxShadow: '0 2px 12px rgba(229,62,62,0.08)',
  },
  navLogo: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  navBrand: {
    fontFamily: 'Playfair Display, serif', fontSize: '1.3rem',
    color: '#E53E3E', fontWeight: '700',
  },
  backBtn: {
    padding: '0.5rem 1rem', backgroundColor: '#FFF5F5', color: '#E53E3E',
    border: '1.5px solid #E53E3E', borderRadius: '8px', fontWeight: '600',
  },
  content: { maxWidth: '700px', margin: '0 auto', padding: '2rem' },
  header: { textAlign: 'center', marginBottom: '2rem' },
  title: {
    fontFamily: 'Playfair Display, serif', fontSize: '2rem',
    color: '#1A202C', marginBottom: '0.5rem',
  },
  subtitle: { color: '#718096' },
  errorBox: {
    backgroundColor: '#FFF5F5', border: '1px solid #FED7D7',
    color: '#C53030', padding: '0.75rem 1rem',
    borderRadius: '10px', marginBottom: '1rem',
  },
  successBox: {
    backgroundColor: '#F0FFF4', border: '1px solid #C6F6D5',
    color: '#276749', padding: '0.75rem 1rem',
    borderRadius: '10px', marginBottom: '1rem',
  },
  tabs: { display: 'flex', gap: '1rem', marginBottom: '1.5rem' },
  tab: {
    flex: 1, padding: '0.85rem', backgroundColor: 'white', color: '#718096',
    border: '1.5px solid #EDF2F7', borderRadius: '12px', cursor: 'pointer',
    fontSize: '0.95rem', fontWeight: '500', transition: 'all 0.2s',
  },
  activeTab: {
    backgroundColor: '#E53E3E', color: 'white', border: '1.5px solid #E53E3E',
  },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: {
    background: 'white', padding: '1.5rem', borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  },
  cardTop: {
    display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem',
  },
  cardAvatar: {
    width: '44px', height: '44px', borderRadius: '50%',
    backgroundColor: '#E53E3E', color: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '1.1rem', flexShrink: 0,
  },
  cardInfo: { flex: 1 },
  cardName: { color: '#1A202C', fontWeight: '700', marginBottom: '0.2rem' },
  cardRole: { color: '#A0AEC0', fontSize: '0.85rem' },
  statusBadge: {
    padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem',
    fontWeight: '600', border: '1px solid', whiteSpace: 'nowrap',
  },
  cardChips: {
    display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem',
  },
  chip: {
    backgroundColor: '#FFF5F5', color: '#C53030',
    padding: '0.25rem 0.65rem', borderRadius: '999px',
    fontSize: '0.8rem', fontWeight: '500',
  },
  urgentChip: {
    backgroundColor: '#FFFBEB', color: '#B7791F',
    padding: '0.25rem 0.65rem', borderRadius: '999px',
    fontSize: '0.8rem', fontWeight: '500',
  },
  actions: { display: 'flex', gap: '0.75rem' },
  acceptBtn: {
    flex: 1, padding: '0.6rem', backgroundColor: '#F0FFF4', color: '#276749',
    border: '1.5px solid #C6F6D5', borderRadius: '8px',
    fontWeight: '600', fontSize: '0.9rem',
  },
  rejectBtn: {
    flex: 1, padding: '0.6rem', backgroundColor: '#FFF5F5', color: '#C53030',
    border: '1.5px solid #FED7D7', borderRadius: '8px',
    fontWeight: '600', fontSize: '0.9rem',
  },
  completedBtn: {
    width: '100%', padding: '0.6rem', backgroundColor: '#EBF8FF',
    color: '#2B6CB0', border: '1.5px solid #BEE3F8',
    borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem', marginTop: '0.5rem',
  },
  empty: { textAlign: 'center', padding: '3rem' },
  emptyIcon: { fontSize: '3rem', marginBottom: '1rem' },
  emptyText: { color: '#2D3748', fontWeight: '600', marginBottom: '0.5rem' },
  emptyHint: { color: '#A0AEC0', fontSize: '0.9rem' },
}

export default Requests