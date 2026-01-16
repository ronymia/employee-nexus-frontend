export default function FormActionButton({
  isPending,
  cancelHandler,
}: {
  isPending: boolean;
  cancelHandler: () => void;
}) {
  return (
    <div
      className={`w-full md:w-1/2 self-end flex items-center justify-end gap-x-2 px-2`}
    >
      <button
        type="button"
        disabled={isPending}
        onClick={cancelHandler}
        className={`btn btn-outline btn-primary min-w-1/2 rounded-sm`}
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isPending}
        className={`btn btn-primary min-w-1/2 rounded-sm flex items-center justify-center gap-2 text-base-300
    ${
      isPending
        ? "opacity-50 cursor-not-allowed !bg-primary"
        : "hover:opacity-90"
    }`}
      >
        {isPending && (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        )}
        {isPending ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}
