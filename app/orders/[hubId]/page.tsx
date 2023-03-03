"use client"
import Title from "../../../components/Title"
import { Chip, Spinner, Table } from "@space-metaverse-ag/space-ui"
import { usePathname } from "next/navigation";
import { useGetSpaceOrdersQuery } from "../../../api/space";

const getStatusLabel = (status: string) => {
  switch (status) {
    case "payment_succeeded":
      return "Paid";
    case "payment_failed":
      return "Failed";
    case "payment_pending":
      return "Pending";
    case "payment_processing":
      return "Processing";
    default:
      return status;
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "payment_succeeded":
      return "green";
    case "payment_failed":
      return "red";
    case "payment_created":
      return "blue";
    case "payment_processing":
      return "orange";
    default:
      return 'blue';
  }
}

export default function Orders() {
  const pathname = usePathname();
  const hubId = pathname?.split("/")[2];

  const {
    data: getSpaceData,
    error: getSpaceError,
    isLoading: isGetSpaceLoading
  } = useGetSpaceOrdersQuery({ hubId: String(hubId) }, { skip: !hubId })

  const rows = (getSpaceData?.orders || []).map((order) => ({
    orderNumber: <span style={{ color: '#3332FE' }}>{order.order_sid}</span>,
    orderDate: new Date(order.created_at).toDateString(),
    customer: order.customer.name,
    items: order.order_items.length + " items",
    status: <Chip label={getStatusLabel(order.status)} color={getStatusColor(order.status)} />,
    total: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(order.amount),
  }))

  return (
    <div>
      <Title>Orders</Title>
      {
        rows && rows.length === 0 && !isGetSpaceLoading && <p>No orders yet</p>
      }
      {
        rows && rows.length > 0 && !isGetSpaceLoading && (
          <Table
            rows={rows}
            columns={["Order #", "Order Date", "Customer", "Items", "Status", "Total"]}
            withBorder={false}
          />
        )
      }
      {
        isGetSpaceLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10rem' }}>
            <Spinner />
          </div>
        )
      }
    </div>
  )
}