import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="alert alert--danger" role="alert" aria-live="assertive">
            <h3>Something went wrong</h3>
            <p>An error occurred while rendering this component. Please try refreshing the page.</p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{ marginTop: '1rem' }}>
                <summary>Error details</summary>
                <pre
                  style={{
                    marginTop: '0.5rem',
                    padding: '1rem',
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    borderRadius: '4px',
                    overflow: 'auto',
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo && (
                    <span style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
                      {this.state.errorInfo.componentStack}
                    </span>
                  )}
                </pre>
              </details>
            )}
            <div style={{ marginTop: '1rem' }}>
              <button
                className="button button--primary"
                onClick={this.handleReset}
                aria-label="Try again"
              >
                Try Again
              </button>
              <button
                className="button button--secondary"
                onClick={() => window.location.reload()}
                style={{ marginLeft: '0.5rem' }}
                aria-label="Reload page"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
