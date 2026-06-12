import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { C } from '@/styles/theme';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ height: '100vh', display: 'flex', overflow: 'hidden', animation: 'fadeIn 200ms ease-out' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Topbar />
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', background: C.contentBg }}>{children}</div>
      </div>
    </div>
  );
}
