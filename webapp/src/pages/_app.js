import '../styles/globals.css';
// styles required only if you are using the components
import '@shakers/ui/styles/code-highlight/styles.css'
// core styles are required for all packages
import '@shakers/ui/styles/core/styles.css'
import '@shakers/ui/styles/global.css'
import '@shakers/ui/styles/spotlight/styles.css'
import '@shakers/ui/styles/tiptap/styles.css'
import { ShakersMantineProvider } from '@shakers/ui';

export default function MyApp({ Component, pageProps }) {
  return (
    <ShakersMantineProvider>
      <div style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh"
      }}>
        <Component {...pageProps} />
      </div>
    </ShakersMantineProvider>
  );
}

