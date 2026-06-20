import { OrderStatus } from '@/types';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span className={`badge badge-${status}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
