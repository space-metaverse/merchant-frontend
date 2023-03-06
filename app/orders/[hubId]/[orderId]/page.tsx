"use client"
import Title from "../../../../components/Title"
import { Button, Chip } from "@space-metaverse-ag/space-ui"
import { useRouter } from "next/navigation";
import { useGetSpaceOrdersQuery } from "../../../../api/space";
import { ArrowBackUp } from "@space-metaverse-ag/space-ui/icons";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Stack } from "@mui/material";
import styled from "styled-components";
import { getStatusColor, getStatusLabel } from "../../../../lib/helpers";

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

`

const InfoTitle = styled.p`
  color: #71717A;
  font-family: 'Inter', sans-serif;
  
`

const InfoValue = styled.p`
  font-family: 'Inter', sans-serif;
  margin-top: 0.5rem;
`

const Divider = styled.hr`
  margin: 2rem 0;
  border: 0;
  border-top: 1px solid #E5E7EB;
`

export default function OrderPage({ params }: { params: { hubId: string, orderId: string } }) {
  const router = useRouter();
  const { hubId, orderId } = params

  const {
    data: getSpaceData,
    error: getSpaceError,
    isLoading: isGetSpaceLoading
  } = useGetSpaceOrdersQuery({ hubId: String(hubId) }, { skip: !hubId })

  const order = getSpaceData?.orders.find(order => order.order_sid === orderId)

  return (
    <PageWrapper>
      <Title><ArrowBackUp />Order {orderId}</Title>
      <Grid container>
        <Grid xs={12} md={8} pr={3} pb={4}>

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

        </Grid>
        <Grid xs={12} md={4}>
          <SectionHeader>Fulfillment info</SectionHeader>
          <Stack gap={3}>
            <Info>
              <InfoTitle>Fulfillment Status</InfoTitle>
              <Chip label={getStatusLabel(order?.status) || ''} color={getStatusColor(order?.status)} style={{ marginTop: '0.5rem' }} />
            </Info>
            <Info>
              <InfoTitle>Tracking Number</InfoTitle>
              <InfoValue>{order?.customer?.telephone || "-"}</InfoValue>
            </Info>
            <Info>
              <InfoTitle>Tracking Number</InfoTitle>
              <InfoValue>{order?.customer?.telephone || "-"}</InfoValue>
            </Info>
            <Info>
              <InfoTitle>Tracking Number</InfoTitle>
              <InfoValue>{order?.customer?.telephone || "-"}</InfoValue>
            </Info>
            <Info>
              <InfoTitle>Tracking Number</InfoTitle>
              <InfoValue>{order?.customer?.telephone || "-"}</InfoValue>
            </Info>
            <Button color="blue" size='small' label='Fulfill Order' />
          </Stack>
        </Grid>
      </Grid>
    </PageWrapper>
  )
}