"use client"
import { useGetShippingZonesQuery, useGetSpaceQuery } from "@/api/space"
import { Button } from "@space-metaverse-ag/space-ui"
import { usePathname } from "next/navigation"
import styled from "styled-components"
import Title from "../../../components/Title"
import ShippingZone from "./ShippingZone"

const CreateHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ZonesList = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-top: 2rem;
`

export default function Fullfillment() {
  const pathname = usePathname();
  const hubId = pathname?.split("/")[2];

  const {
    data: getSpaceData,
    error: getSpaceError,
    isLoading: isGetSpaceLoading
  } = useGetSpaceQuery({ hubId: String(hubId) }, { skip: !hubId })

  const {
    data: getShippingData,
    error: getShippingError,
    isLoading: isGetShippingLoading
  } = useGetShippingZonesQuery({ hubId: String(hubId) }, { skip: !hubId })

  return (
    <div>
      <Title>Shipping Zones</Title>
      <CreateHeader>
        <p>SHIPPING TO</p>
        <Button label={'New Shipping Zone'} size={"large"} color={"blue"} />
      </CreateHeader>
      <ZonesList>
        <ShippingZone />
      </ZonesList>
    </div>
  )
}