"use client"
import { ShippingZoneType, useDeleteShippingZoneMutation, useGetShippingZonesQuery, usePatchShippingZoneMutation, usePostShippingZoneMutation } from "@/api/space"
import { Button, Modal, ModalProps, Spinner } from "@space-metaverse-ag/space-ui"
import { usePathname } from "next/navigation"
import { useRef, useState } from "react"
import styled from "styled-components"
import Title from "../../../components/Title"
import ShippingZone from "./ShippingZone"
import shippingDelete from "../../../public/shipping.svg"
import Image from "next/image"
import { permittedCountries } from "./permittedCountries"

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

const PurpleText = styled.span`
  color: #6F3FF5;
`

export default function Fullfillment() {
  const pathname = usePathname();
  const hubId = pathname?.split("/")[2];
  const [editShippingZoneId, setEditShippingZoneId] = useState<string | null>(null);
  const [creatingShippingZone, setCreatingShippingZone] = useState<boolean>(false);
  const [modalData, setModalData] = useState<{ country: string, name?: string, shippingZoneId: string, type: 'zone' | 'rate' }>({} as any);

  const modalRef = useRef<ModalProps>(null);

  const {
    data: getShippingData,
    isLoading: getShippingLoading,
    refetch: refetchShippingZones
  } = useGetShippingZonesQuery({ hubId: String(hubId) }, { skip: !hubId })

  const [
    patchShippingZone,
    { },
  ] = usePatchShippingZoneMutation();

  const [
    deleteShippingZone,
    { },
  ] = useDeleteShippingZoneMutation();


  const onShippingZoneCancelEdit = () => {
    setEditShippingZoneId(null)
    setCreatingShippingZone(false)
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

  const onShippingZoneDelete = () => {
    groupedShippingZones[modalData?.country].forEach(async (shippingZone: ShippingZoneType) => {
      await deleteShippingZone({ shippingZoneId: shippingZone.shipping_zone_id as string })
    })
    setTimeout(() => {
      modalRef.current?.closed()
      refetchShippingZones()
    }, 2000)
  }

  const onShippingRateDelete = async () => {
    await deleteShippingZone({ shippingZoneId: modalData?.shippingZoneId as string })
    setTimeout(() => {
      modalRef.current?.closed()
      refetchShippingZones()
    }, 2000)
  }

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
              id={"new"}
              hubId={String(hubId)}
              onCancelEdit={onShippingZoneCancelEdit}
              onEditSave={onShippingZoneEditSave}
              isEditing={true}
              country={""}
              rates={[]}
              refetchShippingZones={refetchShippingZones}
              setModalData={setModalData}
              openModal={() => modalRef.current?.opened()}
            />
          )
        }
        {!getShippingLoading ? (
          Object.entries(groupedShippingZones)?.map(([country, shippingZones], index) => (
            <ShippingZone
              key={country}
              id={country}
              hubId={String(hubId)}
              onCancelEdit={onShippingZoneCancelEdit}
              onEditSave={onShippingZoneEditSave}
              isEditing={editShippingZoneId === country}
              rates={shippingZones}
              country={country}
              refetchShippingZones={refetchShippingZones}
              setModalData={setModalData}
              openModal={() => modalRef.current?.opened()}
            />
          ))
        ) : (
          <Spinner />
        )}
      </ZonesList>
      <Modal ref={modalRef} title="Are you sure?">
        <ModalContent>
          <Image src={shippingDelete} alt="shipping-delete" />
          <h2>Delete Shipping {modalData.type === 'zone' ? 'Zone' : 'Rate'}</h2>
          <p>Are you sure you want to delete <PurpleText>
            {modalData.type === 'zone' ? permittedCountries?.find(c => c.code === modalData?.country)?.label : modalData?.name + ' - ' + permittedCountries?.find(c => c.code === modalData?.country)?.label}
          </PurpleText>?</p>
          <Button
            label={'Delete'}
            size={"medium"}
            color={"red"}
            onClick={modalData.type === 'zone' ? onShippingZoneDelete : onShippingRateDelete}
            style={{ width: '100%', marginTop: '1rem' }}
          />
          <Button
            label={'Cancel'}
            size={"small"}
            color={'white'}
            outline
            onClick={() => modalRef.current?.closed()}
            style={{ width: '100%' }}
          />
        </ModalContent>
      </Modal>
    </div>
  )
}