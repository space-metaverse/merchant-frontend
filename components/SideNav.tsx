import { useGetOrdersCountQuery, useGetSpaceQuery } from '../api/space';
import { Chip, SideNav as SideNavComponent, SideNavProps } from '@space-metaverse-ag/space-ui'
import { Orders, Cart, Space } from '@space-metaverse-ag/space-ui/icons'
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';

const SubTitle = styled.p`
  display: block;
  color: '#71717A'
  font-size: 0.75rem;
`

const Title = styled.h3`

`

const SideNav = () => {
  const { push } = useRouter();

  const pathname = usePathname();
  const hubId = pathname?.split("/")[2];

  const {
    data: getSpaceData,
    error: getSpaceError,
    isLoading: isGetSpaceLoading
  } = useGetSpaceQuery({ hubId: String(hubId) }, { skip: !hubId })

  const {
    data: getOrdersCountData,
    error: getOrdersCountError,
    isLoading: isGetOrdersCountLoading
  } = useGetOrdersCountQuery({ hubId: String(hubId) }, { skip: !hubId })

  const options: SideNavProps["routes"] = [
    {
      Icon: Space,
      route: hubId ? `/spaces/${hubId}` : "/spaces",
      label: hubId ? "Space Info" : "Spaces",
      disabled: false,
    },
    ...(hubId ? [
      {
        Icon: Orders,
        route: '/orders',
        label: <>Orders <Chip label={`${getOrdersCountData?.unfulfilled_order_count} Unfulfilled`} color='orange' style={{ marginLeft: '1rem' }} /> </>,
        disabled: false,
        key: 'orders'
      },
      {
        Icon: Cart,
        route: '/fulfillment',
        label: "Fulfillment Settings",
        disabled: false
      },
    ] : []
    )
  ];

  const onNavigate = (route: string) => {
    if (route === '/fulfillment') {
      push(`/fulfillment/${hubId}`);
    } else if (route === '/orders') {
      push(`/orders/${hubId}`);
    } else {
      push(route);
    }
  }

  return (
    <SideNavComponent
      title={hubId ? <div>
        <SubTitle>Spaces</SubTitle>
        <Title>{getSpaceData?.name}</Title>
      </div> : "My Spaces"}
      routes={options}
      onNavigate={onNavigate}
      goBack={hubId ? () => push('/spaces') : undefined}
    />
  )
}

export default SideNav