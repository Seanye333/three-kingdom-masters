import { Component, type ReactNode } from 'react';

interface Props {
  /** Friendly name shown to the user when this boundary catches an error. */
  fallbackLabel?: string;
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Catches any render-time exception in its subtree and shows a fallback
 * panel instead of letting the whole page go blank.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string }): void {
    // eslint-disable-next-line no-console
    console.error('[TKM error boundary]', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            background: '#2a1f15',
            border: '1px solid #b8442e',
            color: '#e8d9b0',
            padding: '1rem 1.5rem',
            margin: '1rem',
            fontFamily: '"Songti SC", serif',
          }}
        >
          <div style={{ fontSize: '1.1rem', color: '#b8442e', letterSpacing: '0.2rem' }}>
            ⚠ {this.props.fallbackLabel ?? 'A panel crashed'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#c0a878', marginTop: '0.5rem', fontFamily: 'ui-monospace, monospace' }}>
            {this.state.error.message}
          </div>
          <div style={{ marginTop: '0.7rem' }}>
            <button
              onClick={() => this.setState({ error: null })}
              style={{
                background: '#3a2d20',
                border: '1px solid #d4a84a',
                color: '#d4a84a',
                padding: '0.3rem 0.8rem',
                fontFamily: 'inherit',
                cursor: 'pointer',
                marginRight: '0.5rem',
              }}
            >
              Retry
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'none',
                border: '1px solid #5a4530',
                color: '#c0a878',
                padding: '0.3rem 0.8rem',
                fontFamily: 'inherit',
                cursor: 'pointer',
              }}
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
