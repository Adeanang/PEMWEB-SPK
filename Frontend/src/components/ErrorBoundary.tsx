import React, { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", backgroundColor: "#fff0f0", color: "#d00", minHeight: "100vh", fontFamily: "sans-serif" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Terjadi Kesalahan (Crash)</h1>
          <p style={{ fontWeight: "bold" }}>{this.state.error && this.state.error.toString()}</p>
          <pre style={{ marginTop: "1rem", whiteSpace: "pre-wrap", background: "#f8f8f8", padding: "1rem", borderRadius: "8px", color: "#333", fontSize: "0.85rem", overflowX: "auto" }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{ marginTop: "1rem", padding: "0.5rem 1rem", backgroundColor: "#d00", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Muat Ulang Halaman
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
