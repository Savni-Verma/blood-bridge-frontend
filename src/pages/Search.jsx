import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchDonors, sendRequest } from '../services/api'

function Search() {
  const [city, setCity] = useState('')
  const [bloodGroup, setBloodGroup] = useState('')
  const [donors, setDonors] = useState([])
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [requestingId, setRequestingId] = useState(null)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await searchDonors(city, bloodGroup)
      const filtered = res.data.filter(
        donor => donor.user.email !== user.email
      )
      setDonors(filtered)
      setSearched(true)
    } catch (err) {
      setError('Search failed! Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRequest = async (donor) => {
    setRequestingId(donor.id)
    setError('')
    setSuccess('')
    try {
      await sendRequest({
        bloodGroup,
        city,
        urgent: false,
        donorEmail: donor.user.email
      })
      setSuccess(`Request sent to ${donor.user.name} successfully!`)
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed!')
    } finally {
      setRequestingId(null)
    }
  }

  const bloodGroupLabels = {
    Apos: 'A+', Aneg: 'A-', Bpos: 'B+', Bneg: 'B-',
    Opos: 'O+', Oneg: 'O-', ABpos: 'AB+', ABneg: 'AB-'
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
          <h1 style={styles.title}>Find Blood Donors</h1>
          <p style={styles.subtitle}>Search available donors in your city</p>
        </div>

        <div style={styles.searchCard}>
          <form onSubmit={handleSearch} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>📍 City</label>
              <input
                style={styles.input}
                type="text"
                placeholder="e.g. Bhopal"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>🩸 Blood Group</label>
              <select
                style={styles.input}
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                required
              >
                <option value="">Select Blood Group</option>
                <option value="Apos">A+</option>
                <option value="Aneg">A-</option>
                <option value="Bpos">B+</option>
                <option value="Bneg">B-</option>
                <option value="Opos">O+</option>
                <option value="Oneg">O-</option>
                <option value="ABpos">AB+</option>
                <option value="ABneg">AB-</option>
              </select>
            </div>

            <button style={styles.searchBtn} type="submit" disabled={loading}>
              {loading ? 'Searching...' : '🔍 Search Donors'}
            </button>
          </form>
        </div>

        {error && <div style={styles.errorBox}>⚠️ {error}</div>}
        {success && <div style={styles.successBox}>✅ {success}</div>}

        {searched && (
          <div style={styles.results}>
            <h3 style={styles.resultsTitle}>
              {donors.length > 0
                ? `Found ${donors.length} donor${donors.length > 1 ? 's' : ''}`
                : 'No donors found'}
            </h3>

            {donors.length === 0 && (
              <div style={styles.emptyState}>
                <p style={styles.emptyIcon}>😔</p>
                <p style={styles.emptyText}>No available donors found</p>
                <p style={styles.emptyHint}>Try a different city or blood group</p>
              </div>
            )}

            <div style={styles.donorGrid}>
              {donors.map((donor, i) => (
                <div
                  key={donor.id}
                  style={{ ...styles.donorCard, animationDelay: `${i * 0.1}s` }}
                  className="animate-fadeInUp"
                >
                  <div style={styles.donorTop}>
                    <div style={styles.donorAvatar}>
                      {donor.user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 style={styles.donorName}>{donor.user.name}</h4>
                      <p style={styles.donorEmail}>{donor.user.email}</p>
                    </div>
                    <div style={styles.availableBadge}>✅ Available</div>
                  </div>

                  <div style={styles.donorDetails}>
                    <div style={styles.detailChip}>
                      🩸 {bloodGroupLabels[donor.bloodGroup] || donor.bloodGroup}
                    </div>
                    <div style={styles.detailChip}>📍 {donor.city}</div>
                    {donor.user.phoneNumber && (
                      <div style={styles.detailChip}>
                        📞 {donor.user.phoneNumber}
                      </div>
                    )}
                    {donor.lastDonationDate && (
                      <div style={styles.detailChip}>
                        📅 {donor.lastDonationDate}
                      </div>
                    )}
                  </div>

                  <button
                    style={styles.requestBtn}
                    onClick={() => handleRequest(donor)}
                    disabled={requestingId === donor.id}
                  >
                    {requestingId === donor.id ? 'Sending...' : 'Send Request →'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
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
  content: { maxWidth: '800px', margin: '0 auto', padding: '2rem' },
  header: { textAlign: 'center', marginBottom: '2rem' },
  title: {
    fontFamily: 'Playfair Display, serif', fontSize: '2rem',
    color: '#1A202C', marginBottom: '0.5rem',
  },
  subtitle: { color: '#718096', fontSize: '1rem' },
  searchCard: {
    background: 'white', padding: '2rem', borderRadius: '20px',
    boxShadow: '0 8px 30px rgba(229,62,62,0.08)', marginBottom: '1.5rem',
  },
  form: { display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' },
  inputGroup: {
    display: 'flex', flexDirection: 'column', gap: '0.4rem',
    flex: 1, minWidth: '180px',
  },
  label: { fontSize: '0.85rem', fontWeight: '600', color: '#2D3748' },
  input: {
    padding: '0.85rem 1rem', borderRadius: '10px',
    border: '1.5px solid #EDF2F7', fontSize: '1rem',
    backgroundColor: '#F7FAFC', outline: 'none',
  },
  searchBtn: {
    padding: '0.85rem 1.5rem', backgroundColor: '#E53E3E', color: 'white',
    border: 'none', borderRadius: '10px', fontSize: '1rem',
    fontWeight: '600', whiteSpace: 'nowrap',
  },
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
  results: { marginTop: '1rem' },
  resultsTitle: { fontSize: '1.1rem', color: '#2D3748', fontWeight: '600', marginBottom: '1rem' },
  emptyState: { textAlign: 'center', padding: '3rem' },
  emptyIcon: { fontSize: '3rem', marginBottom: '1rem' },
  emptyText: { color: '#2D3748', fontWeight: '600', marginBottom: '0.5rem' },
  emptyHint: { color: '#A0AEC0', fontSize: '0.9rem' },
  donorGrid: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  donorCard: {
    background: 'white', padding: '1.5rem', borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    animation: 'fadeInUp 0.5s ease forwards', opacity: 0,
  },
  donorTop: {
    display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem',
  },
  donorAvatar: {
    width: '48px', height: '48px', borderRadius: '50%',
    backgroundColor: '#E53E3E', color: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '1.2rem', flexShrink: 0,
  },
  donorName: { color: '#1A202C', fontWeight: '700', marginBottom: '0.2rem' },
  donorEmail: { color: '#A0AEC0', fontSize: '0.85rem' },
  availableBadge: {
    marginLeft: 'auto', backgroundColor: '#F0FFF4', color: '#276749',
    padding: '0.3rem 0.75rem', borderRadius: '999px',
    fontSize: '0.8rem', fontWeight: '600',
  },
  donorDetails: {
    display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem',
  },
  detailChip: {
    backgroundColor: '#FFF5F5', color: '#C53030',
    padding: '0.3rem 0.75rem', borderRadius: '999px',
    fontSize: '0.85rem', fontWeight: '500',
  },
  requestBtn: {
    width: '100%', padding: '0.75rem', backgroundColor: '#E53E3E',
    color: 'white', border: 'none', borderRadius: '10px',
    fontWeight: '600', fontSize: '0.95rem',
  },
}

export default Search