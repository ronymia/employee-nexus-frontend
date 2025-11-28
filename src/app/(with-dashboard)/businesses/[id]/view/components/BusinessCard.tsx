import ImageUploader from "@/components/ui/uploader/ImageUploader";
import { IBusiness } from "@/types";
import dayjs from "dayjs";
import { HiOutlineMail } from "react-icons/hi";
import { HiOutlineCalendar, HiOutlinePhone } from "react-icons/hi2";

dayjs.extend(require("dayjs/plugin/advancedFormat"));

interface IBusinessViewHeaderProps {
  businessData: IBusiness;
}

export default function BusinessCard({
  businessData,
}: IBusinessViewHeaderProps) {
  // MODAL OPTIONS
  // const { modalOptions, setModalOptions } = useModalOption();
  // TOGGLE MUTATION
  const [toggleActivateBusiness, toggleResult] = [
    () => Promise.resolve(),
    { isLoading: false },
  ];
  const [uploadLogo, uploadResult] = [
    () => Promise.resolve(),
    { isLoading: false },
  ];
  const [updateBusiness, updateResult] = [
    () => Promise.resolve(),
    { isLoading: false },
  ];

  //   TOGGLE ACTIVE DE-ACTIVE

  // POPUP OPTIONS

  // HANDLE TOGGLE
  // TOGGLE FUNCTION
  const handleToggleActivate = async (row: IBusiness) => {
    // await toggleActivateBusiness(row.id)
    //   .then(() => {
    // toast.custom((t) => (
    //   <CustomToaster
    //     t={t}
    //     type={"success"}
    //     text={`Business status updated successfully!`}
    //   />
    // ));
    // });
    // .catch((error) => {
    //   errorHandler({ error: error });
    // });
  };

  // const updateFunction = async (logo) => {
  //   // update business
  //   await updateBusiness({
  //     ...formData,
  //     business: {
  //       ...formData.business,
  //       logo: logo,
  //     },
  //   }).then(() => {
  //     toast.custom((t) => (
  //       <CustomToaster
  //         t={t}
  //         type={"success"}
  //         text={`Business updated successfully!`}
  //       />
  //     ));
  //     navigate(`/business/view/${params?.businessId}?tab=business_details`);
  //   });
  //   .catch((error) => {
  //     errorHandler({ error });
  //   });
  // };
  return (
    <section
      className={`max-w-5xl flex flex-col items-center justify-center overflow-hidden`}
    >
      <div
        className={`w-full border shadow-md rounded-xl text-base-300 gap-y-5 sm:gap-x-3 py-5 px-2 md:py-8 md:px-8 bg-linear-to-tr from-primary to-primary/50 flex flex-col  sm:flex-row justify-center sm:justify-start items-center sm:items-start relative`}
      >
        {/* IMAGE */}
        <ImageUploader
          name={`Logo`}
          type="circular"
          defaultImage={businessData?.logo}
          handleGetImage={() => {}}
          isLoading={false}
        />

        {/* USER INFO */}
        <div className="flex flex-col gap-6 text-center md:text-left">
          {/* Name */}
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <h2 className="text-xl font-semibold drop-shadow text-green-950">
              {businessData?.name}
            </h2>
          </div>

          {/* User Info Grid */}
          <div className="flex  flex-wrap gap-y-3 gap-x-5 text-sm text-green-900 justify-center md:justify-start font-medium overflow-hidden">
            <div className="flex items-center gap-2 drop-shadow-sm">
              <HiOutlineCalendar className="text-lg" />
              <span>
                {dayjs(businessData?.registrationDate, "DD-MM-YYYY").format(
                  "DD MMMM YYYY"
                )}
              </span>
            </div>

            <div className="flex items-center gap-2 wrap-break-word drop-shadow-sm">
              <HiOutlineMail className="text-lg" />
              <span>{businessData?.email}</span>
            </div>

            <div className="flex items-center gap-2 drop-shadow-sm">
              <HiOutlinePhone className="text-lg" />
              <span>{businessData?.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
