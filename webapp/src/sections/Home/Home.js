import Image from "next/image";
import styles from "./Home.module.css";

export function Home() {
  return (
    <main className={`${styles.container}`}>
      <Image src="/logo.png" alt="Shakers logo" width={180} height={180} />
      <p>Welcome to the Shakers skeleton with NextJS & NestJS</p>
    </main>
  );
}
