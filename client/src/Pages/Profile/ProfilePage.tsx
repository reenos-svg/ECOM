import { memo } from "react";
import Profile from "../../Components/Profile/Profile";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

const ProfilePage = memo(() => {
  return (
    <div>
      <Navbar/>
      <Profile />
      <Footer/>
    </div>
  );
});

export default ProfilePage;
