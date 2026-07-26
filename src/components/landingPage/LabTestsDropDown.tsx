"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type TestCategory = {
  name: string;
  tests: string[];
};

export function LabTestsDropDown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories: TestCategory[] = [
    {
      name: "Women's Health",
      tests: [
        "Full Body Checkup",
        "Pre-Wedding Tests",
        "Fertility/Hormonal Tests",
        "PCOS Tests",
        "HPV DNA",
      ],
    },
    {
      name: "Sexual Health",
      tests: [
        "STI Tests",
        "Urinary Tract Infection (UTI)",
        "Erectile Dysfunction Tests",
      ],
    },
    {
      name: "COVID Test",
      tests: ["Covid PCR"],
    },
    {
      name: "General Health",
      tests: [
        "Domestic Staff Test",
        "Heart Health Screening",
        "Fever Tests",
        "Pre-Employment Tests",
      ],
    },
    {
      name: "Children's Health",
      tests: [
        "Newborn Package",
        "Toddler Package",
        "School-Aged Package",
        "Teenage Package",
      ],
    },
    {
      name: "Men's Health",
      tests: [
        "Fertility/Hormonal Tests",
        "Male Hormone Profile",
        "Erectile Dysfunction Tests",
        "Full Body Checkup",
      ],
    },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center text-[15px] font-medium text-[#2E9063] whitespace-nowrap"
        onClick={() => setIsOpen(!isOpen)}
      >
        Lab Tests{" "}
        <ChevronDown
          className={cn(
            "ml-1 h-4 w-4 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-[850px] rounded-lg bg-white p-4 shadow-lg">
          <div className="grid grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-[#2E9063] font-medium">
                  • {category.name}
                </h3>
                <ul className="space-y-1 pl-4">
                  {category.tests.map((test, testIndex) => (
                    <li
                      key={testIndex}
                      className="text-sm text-gray-700 hover:text-[#2E9063] cursor-pointer"
                    >
                      {test}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
