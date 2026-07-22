import { Suspense } from 'react';
import OrdersContent from './OrdersContent';
import { SectionLabel } from '@/components/account/SectionLabel';

function OrdersFallback() {
  return (
    <div>
      <SectionLabel>Orders</SectionLabel>
      <div style={{ padding: '3rem', textAlign: 'center', color: 'oklch(0.556 0 0)' }}>
        Loading orders...
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<OrdersFallback />}>
      <OrdersContent />
    </Suspense>
  );
}
