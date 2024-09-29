import Footer from '../Footer'
import Header from '../Header'

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
