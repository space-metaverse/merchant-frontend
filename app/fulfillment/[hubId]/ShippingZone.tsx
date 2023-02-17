import { Chip } from "@space-metaverse-ag/space-ui"
import { Delete, Edit } from "@space-metaverse-ag/space-ui/icons"
import styled from "styled-components"
import usaIcon from "../../../public/usa.svg"
import Image from "next/image"

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

interface ShippingRateProps {
  type: string
  time: string
}

const ShippingRate = ({ type, time }: ShippingRateProps) => {
  return (
    <RateWrapper>
      <RateInfo>
        <div>
          <RateType>{type}</RateType>
          <RateTime>{time}</RateTime>
        </div>
        <div>
          <RatePrice>$100.00 and Up</RatePrice>
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

export default function ShippingZone() {
  return (
    <Wrapper>
      <Header>
        <CountryWrapper>
          <Image src={usaIcon} alt='country' />
          <span>United States</span>
        </CountryWrapper>
        <HeaderIcons>
          <Edit stroke='#71717A' />
          <Delete stroke='#71717A' />
        </HeaderIcons>
      </Header>
      <ShippingRateList>
        <ShippingRate type='Express International' time='1 to 5 business days' />
        <ShippingRate type='Standard' time='3 to 4 business days' />
      </ShippingRateList>
    </Wrapper>
  )
}