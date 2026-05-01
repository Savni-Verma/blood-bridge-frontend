import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveDonorProfile, getMyProfile, toggleAvailability } from '../services/api'

function DonorProfile() {
  const [bloodGroup, setBloodGroup] = useState('')
  const [city, setCity] = useState('')
  const [lastDonationDate, setLastDonationDate] = useState('')
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [toggling, setToggling] = useState(false)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => { fetchProfile() }, [])

  const fetchProfile = async () => {
    try {
      const res = await getMyProfile()
      setProfile(res.data)
      setBloodGroup(res.data.bloodGroup || '')
      setCity(res.data.city || '')
      setLastDonationDate(res.data.lastDonationDate || '')
    } catch (err) {
      // No profile yet
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await saveDonorProfile({ bloodGroup, city, lastDonationDate })
      setSuccess('Profile saved successfully!')
      fetchProfile()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save!')
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async () => {
    setToggling(true)
    setError('')
    setSuccess('')
    try {
      await toggleAvailability()
      setSuccess('Availability updated!')
      fetchProfile()
    } catch (err) {
      setError('Failed to update availability!')
    } finally {
      setToggling(false)
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
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Back</button>
      </nav>

      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Donor Profile</h1>
          <p style={styles.subtitle}>Manage your donor information</p>
        </div>

        {profile && (
          <div style={styles.statusCard} className="animate-fadeInUp">
            <div style={styles.statusLeft}>
              <div style={styles.statusAvatar}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style={styles.statusName}>{user.name}</h3>
                <p style={styles.statusEmail}>{user.email}</p>
                <div style={styles.statusChips}>
                  <span style={styles.chip}>
                    🩸 {bloodGroupLabels[profile.bloodGroup] || profile.bloodGroup}
                  </span>
                  <span style={styles.chip}>📍 {profile.city}</span>
                </div>
              </div>
            </div>
            <div style={styles.statusRight}>
              <div style={{
                ...styles.statusBadge,
                backgroundColor: profile.available ? '#F0FFF4' : '#FFF5F5',
                color: profile.available ? '#276749' : '#C53030',
                borderColor: profile.available ? '#C6F6D5' : '#FED7D7',
              }}>
                {profile.available ? '✅ Available' : '❌ Unavailable'}
              </div>
              <button
                style={{
                  ...styles.toggleBtn,
                  backgroundColor: profile.available ? '#FFF5F5' : '#F0FFF4',
                  color: profile.available ? '#C53030' : '#276749',
                  borderColor: profile.available ? '#FED7D7' : '#C6F6D5',
                }}
                onClick={handleToggle}
                disabled={toggling}
              >
                {toggling ? 'Updating...' : profile.available ? 'Set Unavailable' : 'Set Available'}
              </button>
            </div>
          </div>
        )}

        {!profile && (
          <div style={styles.noprofile}>
            <p style={styles.noprofileIcon}>🩸</p>
            <p style={styles.noprofileText}>You haven't created a donor profile yet</p>
            <p style={styles.noprofileHint}>Fill the form below to become a donor</p>
          </div>
        )}

        {error && <div style={styles.errorBox}>⚠️ {error}</div>}
        {success && <div style={styles.successBox}>✅ {success}</div>}

        <div style={styles.formCard} className="animate-fadeInUp">
          <h3 style={styles.formTitle}>
            {profile ? 'Update Profile' : 'Create Donor Profile'}
          </h3>
          <form onSubmit={handleSave} style={styles.form}>
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
              <label style={styles.label}>📅 Last Donation Date (Optional)</label>
              <input
                style={styles.input}
                type="date"
                value={lastDonationDate}
                onChange={(e) => setLastDonationDate(e.target.value)}
              />
            </div>

            <button style={styles.saveBtn} type="submit" disabled={loading}>
              {loading ? 'Saving...' : profile ? 'Update Profile →' : 'Create Profile →'}
            </button>
          </form>
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
  navBrand: { fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: '#E53E3E', fontWeight: '700' },
  backBtn: {
    padding: '0.5rem 1rem', backgroundColor: '#FFF5F5', color: '#E53E3E',
    border: '1.5px solid #E53E3E', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem',
  },
  content: { maxWidth: '600px', margin: '0 auto', padding: '2rem' },
  header: { textAlign: 'center', marginBottom: '2rem' },
  title: { fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: '#1A202C', marginBottom: '0.5rem' },
  subtitle: { color: '#718096' },
  statusCard: {
    background: 'white', padding: '1.5rem', borderRadius: '20px',
    boxShadow: '0 8px 30px rgba(229,62,62,0.08)', marginBottom: '1.5rem',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
  },
  statusLeft: { display: 'flex', alignItems: 'center', gap: '1rem' },
  statusAvatar: {
    width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#E53E3E',
    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '1.3rem', flexShrink: 0,
  },
  statusName: { color: '#1A202C', fontWeight: '700', marginBottom: '0.2rem' },
  statusEmail: { color: '#A0AEC0', fontSize: '0.85rem', marginBottom: '0.5rem' },
  statusChips: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  chip: {
    backgroundColor: '#FFF5F5', color: '#C53030', padding: '0.2rem 0.6rem',
    borderRadius: '999px', fontSize: '0.8rem', fontWeight: '500',
  },
  statusRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' },
  statusBadge: {
    padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem',
    fontWeight: '600', border: '1px solid',
  },
  toggleBtn: {
    padding: '0.5rem 1rem', border: '1.5px solid', borderRadius: '8px',
    fontWeight: '600', fontSize: '0.85rem', backgroundColor: 'transparent',
  },
  noprofile: {
    textAlign: 'center', padding: '2rem', background: 'white',
    borderRadius: '16px', marginBottom: '1.5rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  },
  noprofileIcon: { fontSize: '2.5rem', marginBottom: '0.75rem' },
  noprofileText: { color: '#2D3748', fontWeight: '600', marginBottom: '0.3rem' },
  noprofileHint: { color: '#A0AEC0', fontSize: '0.9rem' },
  errorBox: {
    backgroundColor: '#FFF5F5', border: '1px solid #FED7D7', color: '#C53030',
    padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1rem',
  },
  successBox: {
    backgroundColor: '#F0FFF4', border: '1px solid #C6F6D5', color: '#276749',
    padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1rem',
  },
  formCard: {
    background: 'white', padding: '2rem', borderRadius: '20px',
    boxShadow: '0 8px 30px rgba(229,62,62,0.08)',
  },
  formTitle: {
    fontFamily: 'Playfair Display, serif', fontSize: '1.3rem',
    color: '#1A202C', marginBottom: '1.5rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.85rem', fontWeight: '600', color: '#2D3748' },
  input: {
    padding: '0.85rem 1rem', borderRadius: '10px', border: '1.5px solid #EDF2F7',
    fontSize: '1rem', backgroundColor: '#F7FAFC', outline: 'none',
  },
  saveBtn: {
    padding: '0.9rem', backgroundColor: '#E53E3E', color: 'white',
    border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '600',
  },
}

export default DonorProfile