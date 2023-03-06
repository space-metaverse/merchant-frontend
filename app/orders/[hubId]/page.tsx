"use client"
import Title from "../../../components/Title"
import { Chip, Spinner, Table } from "@space-metaverse-ag/space-ui"
import { usePathname, useRouter } from "next/navigation";
import { useGetSpaceOrdersQuery } from "../../../api/space";
import { getStatusColor, getStatusLabel } from "../../../lib/helpers";

export default function Orders() {
  const pathname = usePathname();
  const router = useRouter();
  const hubId = pathname?.split("/")[2];

  const {
    data: getSpaceData,
    error: getSpaceError,
    isLoading: isGetSpaceLoading
  } = useGetSpaceOrdersQuery({ hubId: String(hubId) }, { skip: !hubId })

  const rows = (getSpaceData?.orders || []).map((order) => ({
    key: order.order_sid,
    orderNumber: <span style={{ color: '#3332FE' }}>{order.order_sid}</span>,
    orderDate: new Date(order.created_at).toDateString(),
    customer: order.customer.name,
    items: order.order_items.length + " items",
    status: <Chip label={getStatusLabel(order.status) || ''} color={getStatusColor(order.status)} />,
    total: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(order.amount),
  }))

  const handleRowClick = (row: any) => {
    console.log(row)
    router.push(`/orders/${hubId}/${row.key}`)
  }

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
            onRowClick={handleRowClick}
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