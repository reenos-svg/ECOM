import { memo } from "react";
import {
  AddressIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
  SupportIcon,
  TwitterIcon,
} from "../Icons/Icons";
import logo from '../Assets/Assets/logo.png';


const Footer = memo(() => {
  return (
    <div className=" bg-gray-900">
      <div className="flex flex-col md:flex-row md:gap-40 items-center gap-20">
        <div className="flex flex-col gap-8 p-8 ">
          <img src={logo} alt="" className="absolute h-32 -left-20  opacity-30"/>

          <div className="flex flex-row gap-3">
            <AddressIcon />
            <p className="text-lg text-white w-80 ">
              614 J 6th Floor B Wing B D Patel House, Naranpura, Ahmedabad,
              Ashram Road P.O, Ahmedabad 380 009, Gujarat, India.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <SupportIcon />
            <p className="text-lg text-white w-80 ">+91 9227540047</p>
          </div>
          <div className="flex flex-row gap-3">
            <MailIcon />
            <h1 className="text-lg text-white w-80 ">info@aareminsights.com</h1>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-20 md:gap-40 p-2 md:p-0">
          <div className="flex flex-col font-ubuntu gap-4">
            <h1 className=" text-xl text-white">Categories</h1>
            <span className="text-gray-400 text-lg"><a href="">Men</a></span>
            <span className="text-gray-400 text-lg"><a href="">Women</a></span>
            <span className="text-gray-400 text-lg"><a href="">Kids</a></span>
          </div>
          <div className="flex flex-col font-ubuntu gap-4">
            <h1 className=" text-xl text-white">Latest News</h1>
            <span className="text-gray-400 text-lg"><a href="">Offers & Deals</a></span>
            <span className="text-gray-400 text-lg"><a href="">Wishlist</a></span>
          </div>
          <div className="flex flex-col font-ubuntu gap-4">
            <h1 className=" text-xl text-white">Customer Support</h1>
            <span className="text-gray-400 text-lg">About Us</span>
            <span className="text-gray-400 text-lg"><a href="">Terms & Conditions</a></span>
            <span className="text-gray-400 text-lg"><a href="">Privacy Policy</a></span>
            <span className="text-gray-400 text-lg"><a href="">Help</a></span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:justify-around items-center gap-4 md:gap-0 bg-black h-16">
        <h1 className="text-lg text-white w-80 ">
          All rights reserved. &copy; 2024 aarem
        </h1>

        <div className="flex flex-row items-center gap-4">
          <a href="https://www.facebook.com/">
            <FacebookIcon />
          </a>
          <a href="https://www.linkedin.com/company/aarem-insights-private-limited/">
            <LinkedinIcon />
          </a>
          <a href="https://www.instagram.com/aareminsights__2103/">
            <InstagramIcon />
          </a>
          <a href="https://x.com/?mx=2">
            <TwitterIcon />
          </a>
        </div>
      </div>
    </div>
  );
});

export default Footer;
