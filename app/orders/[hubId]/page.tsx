"use client"
import Title from "../../../components/Title"
import { Chip, Spinner, Table, Tabs, TextInput } from "@space-metaverse-ag/space-ui"
import { usePathname, useRouter } from "next/navigation";
import { useGetSpaceOrdersQuery } from "../../../api/space";
import { getStatusColor, getStatusLabel } from "../../../lib/helpers";
import { useMemo, useState } from "react";
import { Stack } from "@mui/material";

export default function Orders() {
  const pathname = usePathname();
  const router = useRouter();
  const hubId = pathname?.split("/")[2];

  const [tabFilter, setTabFilter] = useState('All Orders');

  const {
    data: getSpaceData,
    error: getSpaceError,
    isLoading: isGetSpaceLoading
  } = useGetSpaceOrdersQuery({ hubId: String(hubId) }, { skip: !hubId })

  const rows = (getSpaceData?.orders || [])?.filter(row => row.status !== 'payment_processing')

  const filteredRows = rows.filter(row => {
    if (tabFilter === 'Unfulfilled') {
      return row.fulfillment_status && row.fulfillment_status !== 'Fulfilled' && row.status === 'payment_succeeded'
    } else if (tabFilter === 'Fulfilled') {
      return row.fulfillment_status && row.fulfillment_status === 'Fulfilled'
    } else if (tabFilter === 'Return Requests') {
      return true
    } else {
      return true
    }
  }).map((order) => ({
    key: order.order_sid,
    orderNumber: <span style={{ color: '#3332FE' }}>{order.order_sid}</span>,
    orderDate: new Date(order.created_at).toDateString(),
    customer: order.customer.name,
    status: <Chip label={getStatusLabel(order.status) || ''} color={getStatusColor(order.status)} />,
    items: order.order_items.length + " items",
    fulfillmentStatus: <Chip label={getStatusLabel(order.fulfillment_status) || 'Unfulfilled'} color={getStatusColor(order.fulfillment_status)} />,
    deliveryType: order.delivery_type || "-",
    total: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format((order.amount / 100) + (order.shipping_cost / 100)),
  })).reverse()

  const handleRowClick = (row: any) => {
    router.push(`/orders/${hubId}/${row.key}`)
  }

  const tabs = useMemo(() => ([
    `Unfulfilled (${rows?.filter((order) => order.fulfillment_status && order.fulfillment_status !== 'Fulfilled' && order.status === 'payment_succeeded').length || 0})`,
    `Fulfilled (${rows?.filter((order) => order.fulfillment_status === 'Fulfilled').length || 0})`,
    `Return Requests (${0})`,
    `All Orders (${rows?.length || 0})`,
  ]), [rows])

  const activeTab = useMemo(() => {
    switch (tabFilter) {
      case 'Unfulfilled':
        return tabs[0]
      case 'Fulfilled':
        return tabs[1]
      case 'Return Requests':
        return tabs[2]
      case 'All Orders':
        return tabs[3]
      default:
        return tabs[3]
    }
  }, [tabFilter, tabs])

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case tabs[0]:
        setTabFilter('Unfulfilled')
        break;
      case tabs[1]:
        setTabFilter('Fulfilled')
        break;
      case tabs[2]:
        setTabFilter('Return Requests')
        break;
      case tabs[3]:
        setTabFilter('')
        break;
    }
  }

  return (
    <div>
      <Title>Orders</Title>
      <Stack flexDirection='row' justifyContent='space-between' alignItems='center' mb={2}>
        <Tabs tabs={tabs} style={{ maxWidth: '50rem' }} onChange={handleTabChange} activeTab={activeTab} />
        {/* <TextInput placeholder='Search orders' label="Search" /> */}
      </Stack>
      {
        filteredRows.length === 0 && !isGetSpaceLoading && <p>No orders yet</p>
      }
      {
        filteredRows.length > 0 && !isGetSpaceLoading && (
          <Table
            rows={filteredRows}
            columns={["Order #", "Order Date", "Customer", "Payment Status", "Items", "Fulfillment Status", "Delivery Type", "Total"]}
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