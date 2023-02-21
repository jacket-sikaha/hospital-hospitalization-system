import React from "react";
import styles from "./welcome.module.css";
import Link from "next/link";
import Image from "next/image";
function Welcome() {
  return (
    <>
      <Image
        src="/pexels-abdullah-ghatasheh-1631677.jpg"
        alt="Picture of the author"
        fill
        style={{ zIndex: -1 }}
      />
      <div className={styles.content}>
        <div
          style={{
            fontFamily:
              "Comic Sans MS,Helvetica Neue,Microsoft Yahei,-apple-system,sans-serif",
            fontSize: "4.7rem",
            fontWeight: 200,
            margin: "2rem",
          }}
        >
          SIKARA
        </div>
        <div className={styles.description}>WELCOME TO HHS SYSTEM</div>
        <Link className={styles.loginLink} href={"/login"}>
          LOGIN
        </Link>
      </div>
    </>
  );
}

export default Welcome;
