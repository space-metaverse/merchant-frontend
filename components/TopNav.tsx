import { TopNav } from '@space-metaverse-ag/space-ui'
import { Logout as IconLogout } from '@space-metaverse-ag/space-ui/icons'
import { deleteCookie } from 'cookies-next';
import { useAppSelector } from 'redux/hooks'
import { getCookieDomain } from './Auth'

const routes = [
  {
    route: 'https://app.tryspace.com/token',
    label: 'token',
    disabled: true,
    isExternal: true
  },
  {
    route: 'https://app.tryspace.com/litepaper',
    label: 'litepaper',
    disabled: true,
    isExternal: true
  },
  {
    route: 'https://app.tryspace.com/create-space',
    label: 'builder',
    disabled: false,
    isExternal: true
  },
  {
    route: '/marketplace',
    label: 'marketplace',
    disabled: true,
    isExternal: false
  },
  {
    route: 'https://app.tryspace.com/about',
    label: 'about',
    disabled: true,
    isExternal: true
  },
  {
    route: 'https://app.tryspace.com/faq',
    label: 'faq',
    disabled: false,
    isExternal: true
  }
]

const Topnav: React.FC = () => {

  const { username } = useAppSelector((state: any) => state.account)

  const logout = async (): Promise<void> => {
    deleteCookie('immerToken', {
      domain: getCookieDomain(),
      path: '/'
    })
    deleteCookie('hubsToken', {
      domain: getCookieDomain(),
      path: '/'
    })

    location.reload()
  }

  return (
    <TopNav
      user={{
        name: username ?? '',
        avatar: '/avatar.png',
      }}
      routes={routes}
      options={[
        {
          icon: IconLogout,
          label: 'Logout',
          callback: logout,
        }
      ]}
      logoRoute="https://app.tryspace.com"
    />
  )
}

export default Topnav
