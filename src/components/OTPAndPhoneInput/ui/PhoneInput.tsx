"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Country = {
  name: string;
  code: string;
  dial_code: string;
  flag: string;
};

interface PhoneInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onCountryChange?: (country: Country) => void;
  className?: string;
}

export function PhoneInput({
  placeholder = "Phone number",
  value = "",
  onChange,
  onCountryChange,
  className,
}: PhoneInputProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [phoneValue, setPhoneValue] = useState(value);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);

  useEffect(() => {
    // Fetch countries from the JSON file
    fetch("/countries.json")
      .then((response) => response.json())
      .then((data) => {
        setCountries(data);
        setFilteredCountries(data);
        // Set default country (e.g., Nigeria or US)
        const defaultCountry =
          data.find((c: Country) => c.code === "NG") ||
          data.find((c: Country) => c.code === "US") ||
          data[0];
        setSelectedCountry(defaultCountry);
        if (onCountryChange) {
          onCountryChange(defaultCountry);
        }
      })
      .catch((error) => console.error("Error loading countries:", error));
  }, [onCountryChange]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = countries.filter(
        (country) =>
          country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          country.dial_code.includes(searchTerm)
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(countries);
    }
  }, [searchTerm, countries]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    if (onCountryChange) {
      onCountryChange(country);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPhoneValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "flex items-center rounded-lg border border-gray-300",
          className
        )}
      >
        {/* Country selector */}
        <div className="relative">
          <button
            type="button"
            className="flex items-center px-3 py-3 focus:outline-none"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedCountry && (
              <div className="flex items-center">
                <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
                  <img
                    src={
                      selectedCountry.flag ||
                      `https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`
                    }
                    alt={selectedCountry.name}
                    className="h-4"
                  />
                </div>
                <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
              </div>
            )}
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute left-0 top-full z-50 mt-1 max-h-60 w-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
              <div className="sticky top-0 bg-white p-2">
                <input
                  type="text"
                  placeholder="Search countries..."
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-[#2E9063] focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <ul className="py-1">
                {filteredCountries.map((country) => (
                  <li
                    key={country.code}
                    className="flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-gray-100"
                    onClick={() => handleCountrySelect(country)}
                  >
                    <div className="flex items-center">
                      <div className="mr-2 flex h-5 w-5 items-center justify-center overflow-hidden rounded-full">
                        <img
                          src={
                            country.flag ||
                            `https://flagcdn.com/w20/${country.code.toLowerCase()}.png`
                          }
                          alt={country.name}
                          className="h-3"
                        />
                      </div>
                      <span className="text-sm">{country.name}</span>
                      <span className="ml-1 text-xs text-gray-500">
                        {country.dial_code}
                      </span>
                    </div>
                    {selectedCountry?.code === country.code && (
                      <Check className="h-4 w-4 text-[#2E9063]" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Phone input */}
        <input
          type="tel"
          placeholder={
            selectedCountry
              ? `${selectedCountry.dial_code} ${placeholder}`
              : placeholder
          }
          className="w-full border-0 p-3 focus:outline-none"
          value={phoneValue}
          onChange={handlePhoneChange}
        />
      </div>
    </div>
  );
}
