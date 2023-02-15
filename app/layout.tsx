"use client"
import { SideNav, SideNavProps, ThemeProvider } from '@space-metaverse-ag/space-ui'
import { Orders, Cart, Space } from '@space-metaverse-ag/space-ui/icons'
import "@space-metaverse-ag/space-ui/index.css"
import Auth from '../components/Auth'
import { Provider } from 'react-redux'
import { store } from 'redux/store'
import TopNav from '../components/TopNav'
import StyledComponentsRegistry from '../lib/registry'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { StyledTitle } from '../components/Title'

const Wrapper = styled.div`
  gap: 3rem;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  padding: 1.5rem 4rem;
  position: relative;
  margin-top: 6rem;

  @media screen and (max-width: 1024px) {
    gap: 1rem;
    padding: 0 1.25rem 2rem 1.25rem;
    margin-top: 5rem;
    flex-direction: column;

    ${StyledTitle} {
      display: none;
    }
  }
`

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

const options: SideNavProps["routes"] = [
  {
    Icon: Space,
    route: '/spaces',
    label: "My Spaces",
    disabled: false,
  },
  {
    Icon: Orders,
    route: '/orders',
    label: "My Orders",
    disabled: false,
  },
  {
    Icon: Cart,
    route: '/fulfillment',
    label: "Fulfillment Settings",
    disabled: false,
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const {
    back,
    push
  } = useRouter();

  return (
    <html lang="en">
      <head />
      <Provider store={store}>
        <StyledComponentsRegistry>
          <ThemeProvider>
            <body>
              <Auth />
              <TopNav />
              <Wrapper>
                <SideNav
                  title="Merchant Manager"
                  routes={options}
                  onNavigate={push}
                />
                <Content>
                  {children}
                </Content>
              </Wrapper>
            </body>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </Provider>
    </html>
  )
}
