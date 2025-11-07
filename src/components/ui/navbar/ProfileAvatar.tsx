import { RxAvatar } from "react-icons/rx";
import { LuLogOut } from "react-icons/lu";
import CustomUserAvatar from "@/components/avatar/CustomUserAvatar";
import { formatText } from "@/utils/format-text.utils";
import useAppStore from "@/stores/appStore";
import Link from "next/link";

export default function ProfileAvatar() {
  const { user } = useAppStore((state) => state);
  return (
    <>
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className={`flex items-center justify-center gap-3 py-1 px-2 cursor-pointer`}
        >
          <>
            <div className={`text-right font-semibold leading-0.5`}>
              <h4 className={`text-sm text-green-950`}>
                {user?.profile?.fullName}
              </h4>
              <small className={`text-xs text-green-900`}>
                {formatText(user?.role?.name)}
              </small>
            </div>

            <CustomUserAvatar
              size={11}
              imageURL=""
              name={user?.profile?.fullName}
            />
          </>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content bg-base-200 rounded-box z-1 w-52 shadow-sm mt-3 overflow-hidden"
        >
          <li role="link" className={`hover:bg-primary hover:text-base-300`}>
            <Link
              href="/profile"
              className={`flex items-center gap-2 h-12 px-2`}
            >
              <RxAvatar className={`text-2xl`} />
              Profile
            </Link>
          </li>
          <li
            role="link"
            className={`hover:bg-primary hover:text-base-300 text-error font-medium`}
          >
            <button
              type="button"
              onClick={() => useAppStore.getState().logout()}
              className={`flex items-center gap-2 h-12 px-2`}
            >
              <LuLogOut className={`text-2xl`} /> Log out
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
