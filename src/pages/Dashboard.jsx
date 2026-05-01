import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good Morning')
    else if (hour < 18) setGreeting('Good Afternoon')
    else setGreeting('Good Evening')
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (!user) {
    navigate('/login')
    return null
  }

  const cards = [
    {
      icon: '🔍',
      title: 'Search Donors',
      desc: 'Find available blood donors by city and blood group instantly.',
      color: '#E53E3E',
      bg: '#FFF5F5',
      path: '/search'
    },
    {
      icon: '🩸',
      title: 'Donor Profile',
      desc: 'Create or update your donor profile and manage availability.',
      color: '#DD6B20',
      bg: '#FFFAF0',
      path: '/donor-profile'
    },
    {
      icon: '📋',
      title: 'My Requests',
      desc: 'Track sent and received blood requests with real-time status.',
      color: '#2B6CB0',
      bg: '#EBF8FF',
      path: '/requests'
    },
  ]

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>
          <span style={styles.navDrop}>🩸</span>
          <span style={styles.navBrand}>BloodBridge</span>
        </div>
        <div style={styles.navRight}>
          <div style={styles.avatar}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <span style={styles.navName}>{user.name}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <p style={styles.greetingText}>{greeting} 👋</p>
          <h1 style={styles.heroTitle}>{user.name}</h1>
          <p style={styles.heroSub}>What would you like to do today?</p>
        </div>
        <div style={styles.heroBadge}>
          <span style={styles.heroBadgeText}>❤️ You can be someone's hero today</span>
        </div>
      </div>

      {/* Cards */}
      <div style={styles.cardsSection}>
        <div style={styles.grid}>
          {cards.map((card, i) => (
            <div
              key={i}
              style={{
                ...styles.card,
                backgroundColor: card.bg,
                animationDelay: `${i * 0.1}s`
              }}
              className="animate-fadeInUp"
              onClick={() => navigate(card.path)}
            >
              <div style={{ ...styles.cardIcon, backgroundColor: card.color }}>
                {card.icon}
              </div>
              <h3 style={{ ...styles.cardTitle, color: card.color }}>
                {card.title}
              </h3>
              <p style={styles.cardDesc}>{card.desc}</p>
              <div style={{ ...styles.cardArrow, color: card.color }}>
                Explore →
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          🩸 BloodBridge — Connecting donors and seekers since 2024
        </p>
      </footer>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#FFF5F5',
    display: 'flex',
    flexDirection: 'column',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: 'white',
    boxShadow: '0 2px 12px rgba(229,62,62,0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  navDrop: { fontSize: '1.5rem' },
  navBrand: {
    fontFamily: 'Playfair Display, serif',
    fontSize: '1.3rem',
    color: '#E53E3E',
    fontWeight: '700',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#E53E3E',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '1rem',
  },
  navName: {
    color: '#2D3748',
    fontWeight: '500',
    fontSize: '0.95rem',
  },
  logoutBtn: {
    padding: '0.4rem 1rem',
    backgroundColor: '#FFF5F5',
    color: '#E53E3E',
    border: '1.5px solid #E53E3E',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.85rem',
  },
  hero: {
    background: 'linear-gradient(135deg, #E53E3E 0%, #C53030 100%)',
    padding: '3rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  heroContent: {},
  greetingText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '1rem',
    marginBottom: '0.5rem',
  },
  heroTitle: {
    color: 'white',
    fontSize: '2.5rem',
    fontFamily: 'Playfair Display, serif',
    marginBottom: '0.5rem',
  },
  heroSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '1.05rem',
  },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: '0.75rem 1.5rem',
    borderRadius: '999px',
    backdropFilter: 'blur(10px)',
  },
  heroBadgeText: {
    color: 'white',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  cardsSection: {
    padding: '3rem 2rem',
    maxWidth: '1000px',
    margin: '0 auto',
    width: '100%',
    flex: 1,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    padding: '2rem',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    border: '1px solid rgba(0,0,0,0.05)',
    animation: 'fadeInUp 0.5s ease forwards',
    opacity: 0,
  },
  cardIcon: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    marginBottom: '1.25rem',
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    marginBottom: '0.75rem',
    fontFamily: 'Playfair Display, serif',
  },
  cardDesc: {
    color: '#718096',
    fontSize: '0.9rem',
    lineHeight: 1.6,
    marginBottom: '1.5rem',
  },
  cardArrow: {
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  footer: {
    padding: '1.5rem',
    textAlign: 'center',
    borderTop: '1px solid #FED7D7',
  },
  footerText: {
    color: '#A0AEC0',
    fontSize: '0.85rem',
  },
}

export default Dashboard
