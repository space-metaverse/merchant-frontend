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

  const rows = (getSpaceData?.orders || []).filter(row => {
    if (tabFilter === 'Unfulfilled') {
      return row.fulfillment_status !== 'Fulfilled'
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

  const tabs = useMemo(() => ([
    `Unfilfilled (${getSpaceData?.orders?.filter((order) => order.fulfillment_status !== 'Fulfilled').length || 0})`,
    `Return Requests (${0})`,
    `All Orders (${getSpaceData?.orders?.length || 0})`,
  ]), [getSpaceData?.orders])

  const activeTab = useMemo(() => {
    switch (tabFilter) {
      case 'Unfulfilled':
        return tabs[0]
      case 'Return Requests':
        return tabs[1]
      case 'All Orders':
        return tabs[2]
      default:
        return tabs[2]
    }
  }, [tabFilter, tabs])

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case tabs[0]:
        setTabFilter('Unfulfilled')
        break;
      case tabs[1]:
        setTabFilter('Return Requests')
        break;
      case tabs[2]:
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