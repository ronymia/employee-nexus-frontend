import Image from "next/image";

// ==================== USER PROFILE CELL COMPONENT ====================
interface UserProfileCellProps {
  name: string;
  designation?: string;
  imageUrl?: string;
}

export default function UserProfileCell({
  name,
  designation,
  imageUrl,
}: UserProfileCellProps) {
  // GET INITIALS FROM NAME
  const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex items-center gap-3">
      {/* USER AVATAR */}
      <div className="relative shrink-0">
        {imageUrl ? (
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
            <Image
              src={imageUrl}
              alt={name}
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center border-2 border-primary/20">
            <span className="text-white font-semibold text-sm">
              {getInitials(name)}
            </span>
          </div>
        )}
      </div>

      {/* NAME AND DESIGNATION */}
      <div className="flex flex-col min-w-0">
        <p className="font-semibold text-gray-800 text-sm truncate">{name}</p>
        {designation && (
          <p className="text-xs text-gray-500 truncate">{designation}</p>
        )}
      </div>
    </div>
  );
}
