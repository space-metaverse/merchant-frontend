"use client"
import { ShippingZoneType, useGetShippingZonesQuery, useGetSpaceQuery, usePatchShippingZoneMutation, usePostShippingZoneMutation } from "@/api/space"
import { Button, Modal, ModalProps } from "@space-metaverse-ag/space-ui"
import { usePathname } from "next/navigation"
import { useRef, useState } from "react"
import styled from "styled-components"
import Title from "../../../components/Title"
import ShippingZone from "./ShippingZone"
import shippingDelete from "../../../public/shipping.svg"
import Image from "next/image"

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
  flex-direction: column;
`

const ModalContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-direction: column;
  text-align: center;
`

export default function Fullfillment() {
  const pathname = usePathname();
  const hubId = pathname?.split("/")[2];
  const [editShippingZoneId, setEditShippingZoneId] = useState<string | null>(null);
  const [creatingShippingZone, setCreatingShippingZone] = useState<boolean>(false);

  const modalRef = useRef<ModalProps>(null);

  const {
    data: getSpaceData,
    error: getSpaceError,
    isLoading: isGetSpaceLoading
  } = useGetSpaceQuery({ hubId: String(hubId) }, { skip: !hubId })

  const {
    data: getShippingData,
    error: getShippingError,
    isLoading: isGetShippingLoading,
    refetch: refetchShippingZones
  } = useGetShippingZonesQuery({ hubId: String(hubId) }, { skip: !hubId })

  const [
    postShippingZone,
    {
      data: postShippingZoneData,
      error: postShippingZoneError,
      isLoading: isPostShippingZoneLoading
    },
  ] = usePostShippingZoneMutation();

  const [
    patchShippingZone,
    {
      data: patchShippingZoneData,
      error: patchShippingZoneError,
      isLoading: isPatchShippingZoneLoading
    },
  ] = usePatchShippingZoneMutation();

  const onShippingZoneEdit = (id: string) => {
    console.log(id)
    setEditShippingZoneId(id)
  }

  const onShippingZoneCancelEdit = () => {
    setEditShippingZoneId(null)
  }

  const onShippingZoneDelete = (id: string) => {
    console.log(id)
    modalRef.current?.opened()
  }

  const onShippingZoneCreate = (shippingZone: ShippingZoneType) => {
    postShippingZone({ data: shippingZone })
  }

  const onShippingZoneEditSave = (shippingZone: ShippingZoneType) => {
    patchShippingZone({ data: shippingZone })
    setEditShippingZoneId(null)
  }

  const groupedShippingZones: Record<string, ShippingZoneType[]> = getShippingData?.data?.reduce((acc: any, shippingZone: any) => {
    if (!acc[shippingZone.country]) {
      acc[shippingZone.country] = []
    }
    acc[shippingZone.country].push(shippingZone)
    return acc
  }, {}) || {}

  return (
    <div>
      <Title>Shipping Zones ({Object.entries(groupedShippingZones)?.length})</Title>
      <CreateHeader>
        <p>SHIPPING TO</p>
        <Button
          label={'New Shipping Zone'}
          size={"medium"}
          color={"blue"}
          onClick={() => setCreatingShippingZone(true)}
        />
      </CreateHeader>
      <ZonesList>
        {
          creatingShippingZone && (
            <ShippingZone
              id={"123"}
              onCancelEdit={() => setCreatingShippingZone(false)}
              onEditSave={(zone: ShippingZoneType) => onShippingZoneCreate(zone)}
              onDelete={onShippingZoneDelete}
              isEditing={true}
              country={""}
              rates={[]}
              refetchShippingZones={refetchShippingZones}
            />
          )
        }
        {Object.entries(groupedShippingZones)?.map(([country, shippingZones], index) => (
          <ShippingZone
            key={country}
            id={country}
            onCancelEdit={onShippingZoneCancelEdit}
            onEditSave={onShippingZoneEditSave}
            onDelete={onShippingZoneDelete}
            isEditing={editShippingZoneId === country}
            rates={shippingZones}
            country={country}
            refetchShippingZones={refetchShippingZones}
          />
        ))}
      </ZonesList>
      <Modal ref={modalRef} title="Are you sure?">
        <ModalContent>
          <Image src={shippingDelete} alt="shipping-delete" />
          <h2>Delete Shipping Zone</h2>
          <p>Are you sure you want to delete from the shipping list?</p>
          <Button label={'Delete'} size={"medium"} color={"red"} />
          <Button label={'Cancel'} size={"small"} color={'white'} outline onClick={() => modalRef.current?.closed()} />
        </ModalContent>
      </Modal>
    </div>
  )
}