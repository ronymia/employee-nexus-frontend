"use client";

export default function FieldError({ errorMessage }: { errorMessage: string }) {
  return (
    <small role="alert" className={`text-error font-medium`}>
      {errorMessage}
    </small>
  );
}
