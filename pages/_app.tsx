import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import 'firebase/compat/firestore'
import { UserProvider } from '@auth0/nextjs-auth0'

function MyApp({ Component, pageProps }: AppProps) {
  return <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
}

export default MyApp
