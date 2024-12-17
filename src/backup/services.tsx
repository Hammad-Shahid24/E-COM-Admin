// import { LifebuoyIcon } from "@heroicons/react/20/solid";
// import { FC } from "react";
// import { MdOutlineLocalShipping } from "react-icons/md";
// import { IoReloadSharp } from "react-icons/io5";
// import { RiShieldKeyholeLine } from "react-icons/ri";
// import { useTranslation } from "react-i18next";

// const Services: FC = () => {
//   const { t } = useTranslation();
//   return (
//     <div className=" w-full bg-[#e4ece6] font-poppins">
//       <div className="max-w-screen-xl w-full flex justify-evenly items-start gap-4 sm:gap-0 xl:justify-between xl:items-center px-4 pt-12 pb-14 mx-auto overflow-x-auto ">
//         <div className="w-fit flex gap-4 sm:w-1/2 xl:w-full bg-blue-40  sm:gap-0  sm:flex-col gap-y-5 items-start xl:flex-row xl:justify-around xl:items-start ">
//           <ServiceItem
//             icon={
//               <MdOutlineLocalShipping className="w-9 h-9 mt-1 text-teal-900 dark:text-white mx-auto" />
//             }
//             heading={t("homepage.services.shipping")}
//             detail={t("homepage.services.shippingdetail")}
//           />
//           <ServiceItem
//             icon={
//               <LifebuoyIcon className="w-10 h-10 text-teal-900 dark:text-white mx-auto" />
//             }
//             heading={t("homepage.services.support")}
//             detail={t("homepage.services.supportdetail")}
//           />
//         </div>
//         <div className="w-fit sm:w-1/2 xl:w-full bg-blue-40 flex gap-8 sm:gap-0 sm:flex-col gap-y-5 items-start xl:flex-row xl:justify-around xl:items-start ">
//           {" "}
//           <ServiceItem
//             icon={
//               <IoReloadSharp className="w-10 h-10 text-teal-900 dark:text-white mx-auto" />
//             }
//             heading={t("homepage.services.returns")}
//             detail={t("homepage.services.returnsdetail")}
//           />
//           <ServiceItem
//             icon={
//               <RiShieldKeyholeLine className="w-10 h-10 text-teal-900 dark:text-white mx-auto" />
//             }
//             heading={t("homepage.services.payment")}
//             detail={t("homepage.services.paymentdetail")}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Services;

// interface ServiceItemProps {
//   icon: JSX.Element;
//   heading: string;
//   detail: string;
// }

// function ServiceItem({ icon, heading, detail }: ServiceItemProps) {
//   return (
//     // <div className=" flex justify-center w-fit gap-x-4 min-w-52 max-w-64 bg-red-100 sm:min-w-fit">
//     <div className=" flex justify-center gap-x-4 min-w-52 w-fit xl:max-w-64  ">
//       {icon}
//       <div className="flex flex-col items-start">
//         <h2 className="text-sm font-medium text-teal-900 dark:text-white ">
//           {heading}
//         </h2>
//         <p className="text-sm text-teal-900 dark:text-white leading-loose">
//           {detail}
//         </p>
//       </div>
//     </div>
//   );
// }
