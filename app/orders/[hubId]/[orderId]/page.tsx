"use client"
import Title from "../../../../components/Title"
import { Button, Checkbox, Chip, Modal, ModalProps, TextInput } from "@space-metaverse-ag/space-ui"
import { useRouter } from "next/navigation";
import { useGetSpaceOrdersQuery, usePatchFullfilOrderMutation } from "../../../../api/space";
import { ArrowBackUp } from "@space-metaverse-ag/space-ui/icons";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Box, Stack } from "@mui/material";
import styled from "styled-components";
import { getStatusColor, getStatusLabel } from "../../../../lib/helpers";
import { useEffect, useRef, useState } from "react";

const PageWrapper = styled.div`
  padding: 0 10%;

  @media (max-width: 1300px) {
    padding: 0;
  }
`

const SectionHeader = styled.h4`
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

const Info = styled(Stack)`
  gap: 0.5rem;
`

const InfoTitle = styled.span`
  color: #71717A;
  font-family: 'Inter', sans-serif;
  
`

const InfoValue = styled.span`
  font-family: 'Inter', sans-serif;
`

const Divider = styled.hr`
  margin: 2rem 0;
  border: 0;
  border-top: 1px solid #E5E7EB;
`

const formatPrice = (price?: number) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format(price ?? 0)

export default function OrderPage({ params }: { params: { hubId: string, orderId: string } }) {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingLink, setTrackingLink] = useState('')
  const [shippingCarrier, setShippingCarrier] = useState('')
  const [sendNotificationEmail, setSendNotificationEmail] = useState(false)

  const router = useRouter()
  const { hubId, orderId } = params

  const modalRef = useRef<ModalProps>(null)

  const {
    data: getSpaceOrdersData,
    error: getSpaceOrdersError,
    isLoading: isGetSpaceOrdersLoading,
    isSuccess: isGetSpaceOrdersSuccess,
    refetch: refetchGetSpaceOrdersQuery,
  } = useGetSpaceOrdersQuery({ hubId: String(hubId) }, { skip: !hubId })

  const [
    patchFullfilOrder,
    {
      data: patchFullfilOrderData,
      error: patchFullfilOrderError,
      isLoading: isPatchFullfilOrderLoading,
      isSuccess: isPatchFullfilOrderSuccess,
    },
  ] = usePatchFullfilOrderMutation();

  const order = getSpaceOrdersData?.orders.find(order => order.order_sid === orderId)

  const handleFulfillOrder = () => {
    patchFullfilOrder({
      data: {
        order_sid: orderId,
        tracking_link: trackingLink,
        tracking_number: trackingNumber,
        shipping_carrier: shippingCarrier,
        fulfillment_status: 'Fulfilled',
        shipping_email_sent_at: 'true'
      }
    })
  }

  useEffect(() => {
    if (isGetSpaceOrdersSuccess) {
      setTrackingNumber(order?.tracking_number || '')
      setTrackingLink(order?.tracking_link || '')
      setShippingCarrier(order?.shipping_carrier || '')
      setSendNotificationEmail(order?.shipping_email_sent_at ? true : false)
    }
  }, [isGetSpaceOrdersSuccess, order])

  useEffect(() => {
    if (isPatchFullfilOrderSuccess) {
      refetchGetSpaceOrdersQuery()
      modalRef.current?.closed()
    }
  }, [isPatchFullfilOrderSuccess, modalRef])

  return (
    <>
      <PageWrapper>
        <Title><ArrowBackUp onClick={() => router.push(`/orders/${hubId}`)} />Order {orderId}</Title>
        <Grid container>
          <Grid xs={12} md={8} pr={4} pb={4}>

            <SectionHeader>Order Info</SectionHeader>
            <Grid container rowSpacing={4}>
              <Grid xs={12} md={6}>
                <Info>
                  <InfoTitle>Order Number</InfoTitle>
                  <InfoValue>{order?.order_sid}</InfoValue>
                </Info>
              </Grid>
              <Grid xs={12} md={6}>
                <Info>
                  <InfoTitle>Date Ordered</InfoTitle>
                  <InfoValue>{order?.created_at && new Date(order.created_at)?.toLocaleString()}</InfoValue>
                </Info>
              </Grid>
              <Grid xs={12} md={6}>
                <Info>
                  <InfoTitle>Order Status</InfoTitle>
                  <Chip label={getStatusLabel(order?.status) || ''} color={getStatusColor(order?.status)} style={{ marginTop: '0.5rem' }} />
                </Info>
              </Grid>
            </Grid>

            <Divider />

            <SectionHeader>Customer Info</SectionHeader>
            <Grid container rowSpacing={4}>
              <Grid xs={12} md={6}>
                <Info>
                  <InfoTitle>Customer</InfoTitle>
                  <InfoValue>{order?.customer?.name}</InfoValue>
                </Info>
              </Grid>
              <Grid xs={12} md={6}>
                <Info>
                  <InfoTitle>Delivery Address</InfoTitle>
                  <InfoValue>{order?.customer?.address}</InfoValue>
                </Info>
              </Grid>
              <Grid xs={12} md={6}>
                <Info>
                  <InfoTitle>Email</InfoTitle>
                  <InfoValue>{order?.customer?.email}</InfoValue>
                </Info>
              </Grid>
              <Grid xs={12} md={6}>
                <Info>
                  <InfoTitle>Phone</InfoTitle>
                  <InfoValue>{order?.customer?.telephone}</InfoValue>
                </Info>
              </Grid>
            </Grid>

            <Divider />

            <Box>
              <SectionHeader>Payment Info</SectionHeader>
              <Stack justifyContent='space-between' alignItems='center' flexDirection='row' width='100%'>
                <InfoTitle>Sub Total</InfoTitle>
                <InfoValue>{formatPrice(order?.amount)}</InfoValue>
              </Stack>

              <Stack justifyContent='space-between' alignItems='center' flexDirection='row' width='100%' pt={2}>
                <InfoTitle>Taxes</InfoTitle>
                <InfoValue>{formatPrice(0)}</InfoValue>
              </Stack>

              <Stack justifyContent='space-between' alignItems='center' flexDirection='row' width='100%' pt={2}>
                <InfoTitle>Shipping</InfoTitle>
                <InfoValue>{formatPrice(order?.shipping_cost)}</InfoValue>
              </Stack>

              <Divider style={{ margin: '1rem 0' }} />

              <Stack justifyContent='space-between' alignItems='center' flexDirection='row' width='100%'>
                <InfoTitle>Total</InfoTitle>
                <span>{formatPrice((order?.amount ?? 0) + (order?.shipping_cost ?? 0))}</span>
              </Stack>
            </Box>

          </Grid>
          <Grid xs={12} md={4}>
            <SectionHeader>Fulfillment info</SectionHeader>
            <Stack gap={3}>
              <Info>
                <InfoTitle>Fulfillment Status</InfoTitle>
                <Chip label={getStatusLabel(order?.fulfillment_status) || ''} color={getStatusColor(order?.fulfillment_status)} style={{ marginTop: '0.5rem' }} />
              </Info>
              <Info>
                <InfoTitle>Tracking Number</InfoTitle>
                <InfoValue>{order?.tracking_number || "-"}</InfoValue>
              </Info>
              <Info>
                <InfoTitle>Tracking Link</InfoTitle>
                <InfoValue>{order?.tracking_link || "-"}</InfoValue>
              </Info>
              <Info>
                <InfoTitle>Shipping Carrier</InfoTitle>
                <InfoValue>{order?.shipping_carrier || "-"}</InfoValue>
              </Info>
              <Info>
                <InfoTitle>Shipping Confirmation Email</InfoTitle>
                <InfoValue>{order?.shipping_email_sent_at || "Unsent"}</InfoValue>
              </Info>
              <Button color="blue" size='small' label='Fulfill Order' onClick={() => modalRef?.current?.opened()} />
            </Stack>
          </Grid>
        </Grid>
      </PageWrapper>

      <Modal ref={modalRef} title="Fulfill Order">
        <Stack gap={2}>
          <h4>Tracking Information</h4>
          <TextInput
            value={trackingNumber}
            label='Tracking Number'
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
          <TextInput
            value={trackingLink}
            label='Tracking Link'
            onChange={(e) => setTrackingLink(e.target.value)}
          />
          <TextInput
            value={shippingCarrier}
            label='Shipping Carrier'
            onChange={(e) => setShippingCarrier(e.target.value)}
          />
          <Checkbox
            label='Send notification email to customer'
            isChecked={sendNotificationEmail}
            onChange={() => setSendNotificationEmail(!sendNotificationEmail)}
            style={{ marginTop: '0.5rem' }}
          />
          <Button
            color="blue"
            size='small'
            label='Save'
            onClick={handleFulfillOrder}
            style={{ marginTop: '2rem' }}
            disabled={isPatchFullfilOrderLoading || !trackingNumber || !trackingLink || !shippingCarrier}
          />
        </Stack>
      </Modal>
    </>
  )
}