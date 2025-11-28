export default function CustomUserAvatar({
  name = "John Doe",
  imageURL,
  size = 11,
}: {
  name?: string;
  imageURL?: string;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`w-11 h-11 rounded-box bg-slate-100 text-base-300 flex items-center justify-center `}
    >
      {imageURL ? (
        <img
          src={imageURL}
          alt={name}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span className="text-sm font-semibold text-green-950">{initials}</span>
      )}
    </div>
  );
}
