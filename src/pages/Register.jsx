import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../services/api'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await registerUser({ name, email, password, phoneNumber: phone })
      localStorage.setItem('user', JSON.stringify(res.data))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.leftContent}>
          <div style={styles.badge}>🩸 BloodBridge</div>
          <h1 style={styles.bigText}>Join the<br/>Community<br/>of Heroes.</h1>
          <p style={styles.subText}>Every donor is a hero. Register today and save lives.</p>
          <div style={styles.features}>
            {['Find donors instantly', 'Toggle availability anytime', 'Track your requests'].map((f, i) => (
              <div key={i} style={styles.feature}>
                <span style={styles.check}>✓</span>
                <span style={styles.featureText}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.card} className="animate-fadeInUp">
          <h2 style={styles.title}>Create account</h2>
          <p style={styles.subtitle}>Start saving lives today</p>

          {error && (
            <div style={styles.errorBox}>⚠️ {error}</div>
          )}

          <form onSubmit={handleRegister} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Priya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                type="email"
                placeholder="priya@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>📞 Phone Number</label>
              <input
                style={styles.input}
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button style={styles.button} type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p style={styles.linkText}>
            Already have an account?{' '}
            <Link to="/login" style={styles.link}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { display: 'flex', minHeight: '100vh' },
  left: {
    flex: 1, backgroundColor: '#E53E3E', padding: '3rem',
    display: 'flex', alignItems: 'center',
  },
  leftContent: {},
  badge: {
    display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white', padding: '0.4rem 1rem', borderRadius: '999px',
    fontSize: '0.85rem', fontWeight: '600', marginBottom: '2rem',
  },
  bigText: {
    fontSize: '3.5rem', color: 'white', lineHeight: 1.1,
    marginBottom: '1.5rem', fontFamily: 'Playfair Display, serif',
  },
  subText: {
    color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem',
    marginBottom: '2.5rem', lineHeight: 1.6,
  },
  features: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  feature: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  check: {
    backgroundColor: 'rgba(255,255,255,0.2)', color: 'white',
    width: '24px', height: '24px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.8rem', fontWeight: '700', flexShrink: 0,
  },
  featureText: { color: 'rgba(255,255,255,0.9)', fontSize: '1rem' },
  right: {
    flex: 1, display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '2rem', backgroundColor: '#FFF5F5',
  },
  card: {
    background: 'white', padding: '2.5rem', borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(229,62,62,0.12)', width: '100%', maxWidth: '420px',
  },
  title: {
    fontSize: '1.8rem', color: '#1A202C', marginBottom: '0.5rem',
    fontFamily: 'Playfair Display, serif',
  },
  subtitle: { color: '#718096', marginBottom: '2rem', fontSize: '0.95rem' },
  errorBox: {
    backgroundColor: '#FFF5F5', border: '1px solid #FED7D7',
    color: '#C53030', padding: '0.75rem 1rem', borderRadius: '10px',
    marginBottom: '1.5rem', fontSize: '0.9rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.85rem', fontWeight: '600', color: '#2D3748' },
  input: {
    padding: '0.85rem 1rem', borderRadius: '10px',
    border: '1.5px solid #EDF2F7', fontSize: '1rem',
    outline: 'none', backgroundColor: '#F7FAFC',
  },
  button: {
    padding: '0.9rem', backgroundColor: '#E53E3E', color: 'white',
    border: 'none', borderRadius: '10px', fontSize: '1rem',
    fontWeight: '600', marginTop: '0.5rem',
  },
  linkText: { textAlign: 'center', marginTop: '1.5rem', color: '#718096', fontSize: '0.9rem' },
  link: { color: '#E53E3E', fontWeight: '600', textDecoration: 'none' },
}

export default Register