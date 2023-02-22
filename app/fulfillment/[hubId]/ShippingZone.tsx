import { Button, Chip, Select } from "@space-metaverse-ag/space-ui"
import { Delete, Edit } from "@space-metaverse-ag/space-ui/icons"
import styled from "styled-components"
import usaIcon from "../../../public/usa.svg"
import Image from "next/image"
import { ShippingZoneType } from "../../../api/space"
import { useState } from "react"

const Wrapper = styled.div`
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  width: 100%;
  padding: 1.5rem 1rem;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-bottom: 2rem;
`

const HeaderIcons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`

const CountryWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`

const ShippingRateList = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-direction: column;
`

const RateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #FAFAFC;
  padding: 1rem;
`

const RateHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  width: 100%;
`

const RateInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  width: 100%;
  border-radius: 8px;
`

const RateType = styled.h4`
  color: #48484B;
`

const RateTime = styled.p`
  padding-top: 0.5rem;
  color: #71717A;
  font-weight: 400;
`

const RatePrice = styled.span`
  padding-right: 1rem;
  color: #71717A;
  font-weight: 400;
`

const RateIcons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`

const AddRate = styled.p`
  padding-top: 1rem;
  color: blue;
`

const EditActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #E5E5E5;
`

interface ShippingRateProps {
  id: number
  type: string
  time: string
  orderMin: number
  orderMax: number
  onEdit: (id: number) => void
  isEditing: boolean
  onSave: (id: number) => void
}

const ShippingRate = ({
  id,
  type,
  time,
  orderMin,
  orderMax,
  onEdit,
  isEditing,
  onSave
}: ShippingRateProps) => {
  return (
    <RateWrapper>
      <RateHeader>
        <RateInfo>
          {
            isEditing ? (
              <Select
                options={[
                  'Express (1 to 2 business days)',
                  'Express International (1 to 5 business days)',
                  'Standard (3 to 4 business days)',
                  'Standard International (6 to 12 business days)',
                  'Custom Flat Rate (no transit time)'
                ]}
                style={{ width: '16rem' }}
                value={type}
              />
            ) :
              (
                <div>
                  <RateType>{type}</RateType>
                  <RateTime>{time}</RateTime>
                </div>
              )
          }
          <div>
            <RatePrice>${orderMin} - ${orderMax}</RatePrice>
            <Chip label={'Free'} color='green' />
          </div>
        </RateInfo>
        {
          !isEditing && (
            <RateIcons>
              <Edit stroke='#71717A' onClick={() => onEdit(id)} />
              <Delete stroke='#71717A' />
            </RateIcons>
          )
        }
      </RateHeader>
      {
        isEditing && (
          <EditActions>
            <Button label={'Cancel'} size={"small"} color={'white'} outline onClick={() => onEdit(0)} />
            <Button label={'Save Changes'} size={"medium"} color={"blue"} outline onClick={() => onSave(id)} />
          </EditActions>
        )
      }
    </RateWrapper>
  )
}

interface ShippingZoneProps {
  id: string
  isEditing: boolean
  onCancelEdit: (id: string) => void
  onEditSave: (zone: ShippingZoneType) => void
  onDelete: (id: string) => void
  country: string
  rates: ShippingZoneType[]
}

export default function ShippingZone({
  id,
  isEditing,
  onCancelEdit,
  onEditSave,
  onDelete,
  country,
  rates
}: ShippingZoneProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>(country)
  const [editingRateId, setEditingRateId] = useState<number>(0)

  const handleEditSave = () => {
    const rate = rates?.find((rate) => rate.shipping_zone_id === editingRateId)
    if (rate) {
      onEditSave({
        ...rate,
        shipping_zone_id: String(rate.shipping_zone_id),
        country: selectedCountry
      })
    }
  }

  return (
    <Wrapper>
      <Header>
        {
          isEditing ? (
            <Select
              options={['USA', 'Canada', 'Rest of World']}
              style={{ width: '16rem' }}
              value={selectedCountry}
              onChange={(value) => setSelectedCountry(value)}
            />
          ) :
            (
              <CountryWrapper>
                <Image src={usaIcon} alt='country' />
                <span>{country}</span>
              </CountryWrapper>
            )
        }
        <HeaderIcons>
          <Delete stroke='#71717A' onClick={() => onDelete(id)} />
        </HeaderIcons>
      </Header>
      <ShippingRateList>
        {
          rates.map((rate) => (
            <ShippingRate
              id={Number(rate.shipping_zone_id)}
              key={rate.shipping_zone_id}
              type={rate.rate_name}
              time='1 to 5 business days'
              orderMin={rate.order_min_value}
              orderMax={rate.order_max_value}
              onEdit={(id) => setEditingRateId(id)}
              isEditing={Number(rate.shipping_zone_id) === editingRateId}
              onSave={handleEditSave}
            />
          ))
        }
      </ShippingRateList>
      <AddRate>Add Rate</AddRate>
      {isEditing && (
        <EditActions>
          <Button label={'Cancel'} size={"small"} color={'white'} outline onClick={() => onCancelEdit(id)} />
          <Button label={'Save'} size={"medium"} color={"blue"} outline onClick={handleEditSave} />
        </EditActions>
      )}
    </Wrapper>
  )
}