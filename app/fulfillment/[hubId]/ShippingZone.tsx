import { Button, Chip } from "@space-metaverse-ag/space-ui"
import { Delete, Edit } from "@space-metaverse-ag/space-ui/icons"
import styled from "styled-components"
import usaIcon from "../../../public/usa.svg"
import Image from "next/image"
import { ShippingZoneType } from "../../../api/space"

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
  background: #FAFAFC;
  padding: 1rem;
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
  type: string
  time: string
  orderMin: number
  orderMax: number
}

const ShippingRate = ({ type, time, orderMin, orderMax }: ShippingRateProps) => {
  return (
    <RateWrapper>
      <RateInfo>
        <div>
          <RateType>{type}</RateType>
          <RateTime>{time}</RateTime>
        </div>
        <div>
          <RatePrice>${orderMin} - ${orderMax}</RatePrice>
          <Chip label={'Free'} color='green' />
        </div>
      </RateInfo>
      <RateIcons>
        <Edit stroke='#71717A' />
        <Delete stroke='#71717A' />
      </RateIcons>
    </RateWrapper>
  )
}

interface ShippingZoneProps {
  id: string
  isEditing: boolean
  onEdit: (id: string) => void
  onCancelEdit: (id: string) => void
  onEditSave: (id: string) => void
  onDelete: (id: string) => void
  country: string
  rates: ShippingZoneType[]
}

export default function ShippingZone({
  id,
  isEditing,
  onEdit,
  onCancelEdit,
  onEditSave,
  onDelete,
  country,
  rates
}: ShippingZoneProps) {
  return (
    <Wrapper>
      <Header>
        <CountryWrapper>
          <Image src={usaIcon} alt='country' />
          <span>{country}</span>
        </CountryWrapper>
        <HeaderIcons>
          <Edit stroke='#71717A' onClick={() => onEdit(id)} />
          <Delete stroke='#71717A' onClick={() => onDelete(id)} />
        </HeaderIcons>
      </Header>
      <ShippingRateList>
        {
          rates.map((rate, index) => (
            <ShippingRate
              key={index}
              type={rate.rate_name}
              time='1 to 5 business days'
              orderMin={rate.order_min_value}
              orderMax={rate.order_max_value}
            />
          ))
        }
      </ShippingRateList>
      <AddRate>Add Rate</AddRate>
      {isEditing && (
        <EditActions>
          <Button label={'Cancel'} size={"small"} color={'white'} outline onClick={() => onCancelEdit(id)} />
          <Button label={'Save'} size={"medium"} color={"blue"} outline onClick={() => onEditSave(id)} />
        </EditActions>
      )}
    </Wrapper>
  )
}