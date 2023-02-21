import { useRouter } from "next/dist/client/router";
import { Fragment } from "react";

// import MainNavigation from "./main-navigation";

function Layout(props) {
  console.log("props", useRouter());
  const { pathname } = useRouter();
  if (pathname.slice(1) === "" || pathname.slice(1) === "login") {
    return <main>{props.children}</main>;
  }
  return (
    <Fragment>
      <div>12312312312312</div>
      <main>{props.children}</main>
    </Fragment>
  );
}

export default Layout;
