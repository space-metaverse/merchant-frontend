"use client"
import { useGetShippingZonesQuery, useGetSpaceQuery } from "@/api/space"
import { Button, Modal, ModalProps } from "@space-metaverse-ag/space-ui"
import { usePathname } from "next/navigation"
import { useRef, useState } from "react"
import styled from "styled-components"
import Title from "../../../components/Title"
import ShippingZone from "./ShippingZone"
import shippingDelete from "../../../public/shipping-delete.svg"
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

  const modalRef = useRef<ModalProps>(null);

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

  const onShippingZoneEdit = (id: string) => {
    console.log(id)
    setEditShippingZoneId(id)
  }

  const onShippingZoneCancelEdit = () => {
    setEditShippingZoneId(null)
  }

  const onShippingZoneEditSave = () => {
    setEditShippingZoneId(null)
  }

  const onShippingZoneDelete = (id: string) => {
    console.log(id)
    modalRef.current?.opened()
  }

  return (
    <div>
      <Title>Shipping Zones</Title>
      <CreateHeader>
        <p>SHIPPING TO</p>
        <Button label={'New Shipping Zone'} size={"medium"} color={"blue"} />
      </CreateHeader>
      <ZonesList>
        {new Array(3).fill(0).map((_, index) => (
          <ShippingZone
            id={String(index)}
            onEdit={onShippingZoneEdit}
            onCancelEdit={onShippingZoneCancelEdit}
            onEditSave={onShippingZoneEditSave}
            onDelete={onShippingZoneDelete}
            isEditing={editShippingZoneId === String(index)}
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