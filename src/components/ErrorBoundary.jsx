import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1A0F0F',
          color: '#F4E8D8',
          fontFamily: 'system-ui, sans-serif',
          padding: '2rem',
        }}>
          <div style={{ textAlign: 'center', maxWidth: '500px' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              Une erreur est survenue
            </h1>
            <p style={{ color: 'rgba(244,232,216,0.6)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {this.state.error?.message || 'Erreur inattendue'}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#5C3A2E',
                color: 'white',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              Recharger la page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
