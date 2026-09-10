import { Component, type ErrorInfo, type ReactNode } from 'react';

export default class AppErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application render failed:', error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="grid min-h-screen place-items-center bg-[#fbf8f3] px-5 text-center text-[#211c18]">
        <div className="max-w-lg">
          <p className="editorial-eyebrow">Visitiga Media</p>
          <h1 className="text-4xl font-semibold tracking-tight">Halaman mengalami kendala</h1>
          <p className="mt-4 leading-7 text-[#6f6258]">Muat ulang halaman untuk mencoba kembali. Jika kendala berlanjut, Anda tetap dapat kembali ke beranda.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => window.location.reload()} className="editorial-button editorial-button--primary">Muat ulang</button>
            <a href="/" className="editorial-button editorial-button--outline">Kembali ke beranda</a>
          </div>
        </div>
      </main>
    );
  }
}
