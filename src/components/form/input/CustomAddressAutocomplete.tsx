"use client";

import { useEffect, useRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import FieldLabel from "./components/FieldLabel";
import FieldError from "./components/FieldError";
import { getErrorMessageByPropertyName } from "@/utils/schema-validator";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

interface ICustomAddressAutocompleteProps {
  dataAuto?: string;
  name: string;
  size?: string;
  id?: string;
  placeholder?: string;
  required?: boolean;
  label?: string;
  disabled?: boolean;
  readOnly?: boolean;
  wrapperClassName?: string;
  fieldClassName?: string;
  labelClassName?: string;
  onAddressSelect?: (data: {
    address: string;
    lat: number;
    lng: number;
    country?: string;
    city?: string;
    postcode?: string;
  }) => void;
}

export default function CustomAddressAutocomplete({
  dataAuto = "",
  name,
  id,
  placeholder,
  label,
  required = false,
  disabled = false,
  readOnly = false,
  wrapperClassName,
  fieldClassName,
  labelClassName,
  onAddressSelect,
}: ICustomAddressAutocompleteProps) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const errorMessage = getErrorMessageByPropertyName(errors, name);

  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Use the places library from vis.gl
  const placesLibrary = useMapsLibrary("places");

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (!placesLibrary || !inputRef.current || autocompleteRef.current) return;

    try {
      autocompleteRef.current = new placesLibrary.Autocomplete(
        inputRef.current,
        {
          fields: [
            "formatted_address",
            "geometry",
            "address_components",
            "name",
          ],
        },
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();

        if (place && place.formatted_address) {
          setValue(name, place.formatted_address, {
            shouldValidate: true,
            shouldDirty: true,
          });

          if (place.geometry && place.geometry.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            // Extract address components
            let country = "";
            let city = "";
            let postcode = "";

            if (place.address_components) {
              place.address_components.forEach((component) => {
                const types = component.types;

                if (types.includes("country")) {
                  country = component.long_name;
                }
                if (
                  types.includes("locality") ||
                  types.includes("administrative_area_level_2")
                ) {
                  city = component.long_name;
                }
                if (types.includes("postal_code")) {
                  postcode = component.long_name;
                }
              });
            }

            if (onAddressSelect) {
              onAddressSelect({
                address: place.formatted_address,
                lat,
                lng,
                country,
                city,
                postcode,
              });
            }
          }
        }
      });
    } catch (error) {
      console.error("Error initializing Places Autocomplete:", error);
    }
  }, [placesLibrary, name, setValue, onAddressSelect]);

  // Sync initial value (if editing)
  useEffect(() => {
    if (placesLibrary && inputRef.current) {
      const initialVal = control._defaultValues?.[name];
      if (initialVal && typeof initialVal === "string") {
        inputRef.current.value = initialVal;
      }
    }
  }, [placesLibrary, control._defaultValues, name]);

  return (
    <div
      className={`${
        wrapperClassName && wrapperClassName
      } w-full flex flex-col gap-y-1.5 relative`}
    >
      {/* LABEL */}
      {label ? (
        <FieldLabel
          key={`${name}-fieldLabel`}
          htmlFor={id ? id : name}
          dataAuto={dataAuto}
          label={label}
          required={required}
          disabled={disabled}
          labelClassName={labelClassName}
        />
      ) : null}

      <div
        className={`flex flex-col gap-3 ${
          errorMessage ? "border border-error rounded-md p-1" : ""
        }`}
      >
        {/* AUTOCOMPLETE INPUT */}
        <Controller
          control={control}
          name={name}
          rules={{ required: required ? `${label} is required` : false }}
          render={({ field: { value, onChange, ...field } }) => (
            <input
              {...field}
              ref={inputRef}
              type="text"
              value={value || ""}
              onChange={(e) => {
                onChange(e.target.value);
              }}
              placeholder={placeholder || label}
              disabled={disabled || !placesLibrary}
              readOnly={readOnly}
              id={id ? id : name}
              data-auto={dataAuto}
              className={`input input-bordered w-full ${fieldClassName || ""} ${
                !placesLibrary ? "loading" : ""
              }`}
            />
          )}
        />
      </div>

      {/* ERROR MESSAGE */}
      {errorMessage ? (
        <FieldError key={`${name}-field_error`} errorMessage={errorMessage} />
      ) : null}
    </div>
  );
}
