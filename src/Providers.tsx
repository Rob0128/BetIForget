import { Outlet } from "react-router-dom";
import { UserDataProvider } from "./context/AuthContext";
import Layout from "./components/layout/layout";

const Providers = () => {
  return (
      <UserDataProvider>
        <Layout>
        <Outlet />
        </Layout>
      </UserDataProvider>
    );
};

export default Providers;
