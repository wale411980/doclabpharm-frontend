import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Pencil, Save } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useUserUpdateProfile,
  useGetUserProfile,
  useUserUpdatePassword,
} from "@/queries";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "@/hooks/useAuth";
import ImageUpload from "@/components/ImageUpload";
import { AxiosError } from "axios";

export default function UserProfile() {
  const { data: userData, isLoading } = useGetUserProfile();
  const { mutate: updateProfile } = useUserUpdateProfile();
  const { mutate: updatePassword, isPending: isPendingPassword } =
    useUserUpdatePassword();
  const { user, login } = useAuth(); // 👈 Get current user and login function

  // State for user details
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    dob: null as Date | null,
    address: "",
    profile_image: "",
    phone: "",
  });

  // State for account details
  const [accountDetails, setAccountDetails] = useState({
    accountId: "",
    accountEmail: "",
    phoneNumber: "",
  });

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);

  // State for password change modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [originalUserDetails, setOriginalUserDetails] = useState(userDetails);

  // Initialize user details from fetched data
  useEffect(() => {
    if (userData) {
      setUserDetails({
        firstName: userData.data.firstName || "",
        lastName: userData.data.lastName || "",
        email: userData.data.email || "",
        gender: userData.data.gender || "",
        dob: userDetails.dob,
        address: userData.data.address || "",
        profile_image: userData.data.profileImage || "",
        phone: userData.data.phone || "",
      });

      setAccountDetails({
        accountId: userData.data.accountId || "",
        accountEmail: userData.data.email || "",
        phoneNumber: userData.data.phone || "",
      });
    }
  }, [userData]);

  const toggleEdit = () => {
    if (!isEditing) {
      setOriginalUserDetails(userDetails);
      setIsEditing(true);
    } else {
      setUserDetails(originalUserDetails);
      setIsEditing(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle date changes
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setUserDetails((prev) => ({
        ...prev,
        dob: date,
      }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordSubmit = async () => {
    // Validate form
    const newErrors: Record<string, string> = {};

    if (!passwordData.oldPassword.trim())
      newErrors.oldPassword = "Current password is required";
    if (!passwordData.newPassword.trim())
      newErrors.newPassword = "New password is required";
    if (!passwordData.confirmPassword.trim())
      newErrors.confirmPassword = "Confirm password is required";

    // If there are errors, show them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Check minimum length for new and confirm passwords
    if (
      passwordData.newPassword.length < 8 ||
      passwordData.confirmPassword.length < 8
    ) {
      toast.error("Password must be at least 8 characters long.", {
        position: "top-right",
      });
      return;
    }

    // Check if new password and confirm password match
    if (
      passwordData.newPassword.trim() &&
      passwordData.confirmPassword.trim() &&
      passwordData.newPassword !== passwordData.confirmPassword
    ) {
      toast.error("New password and confirm password do not match.", {
        position: "top-right",
      });
      return;
    }
    updatePassword(
      {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      },
      {
        onSuccess: (updatedPassword: any) => {
          // merge updated data into existing user
          const updatedUser = { ...user, ...updatedPassword };
          // update context + localStorage
          login(updatedUser);

          toast.success("Password updated successfully!", {
            position: "top-right",
          });
        },

        onError: (error: unknown) => {
          let backendMessage = "Unknown error";

          if ((error as AxiosError)?.response?.data) {
            const axiosError = error as AxiosError<{ message: string }>;
            backendMessage =
              axiosError.response?.data?.message || backendMessage;
          }

          toast.error(`Failed to update password. ${backendMessage}`, {
            position: "top-right",
          });
        },
      }
    );
  };

  // Handle save changes
  const handleSaveChanges = () => {
    const formattedDob = userDetails.dob
      ? userDetails.dob.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]; // fallback to today if null

    // Update user details
    updateProfile(
      {
        // Provide all required User fields here
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        email: userDetails.email,
        gender: userDetails.gender,
        phone: userDetails.phone,
        dob: formattedDob,
        address: userDetails.address,
        profile_image: userDetails.profile_image,
      },
      {
        onSuccess: () => {
          window.location.href = "/user/dashboard"; // 🔁 Hard reload of the page

          toast.success("Profile updated successfully!", {
            position: "top-right",
          });
        },
        onError: (error: any) => {
          const errMsg = error?.response?.data?.message;

          toast.error("Failed to update profile. Please try again. " + errMsg, {
            position: "top-right",
          });
        },
      }
    );

    setIsEditing(false);
  };

  return (
    <div className="">
      <div className="space-y-6">
        {/* User Details Card */}
        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold text-emerald-800">
              My User Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-xs text-gray-500">
                  First name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={userDetails.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="border-gray-300"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-xs text-gray-500">
                  Last name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={userDetails.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="border-gray-300"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs text-gray-500">
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userDetails.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="border-gray-300"
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-xs text-gray-500">
                  Select Gender
                </Label>
                <Select
                  disabled={!isEditing}
                  value={userDetails.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger id="gender" className="border-gray-300">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dob" className="text-xs text-gray-500">
                  Date of Birth
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <div>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal border-gray-300 ${
                          !isEditing ? "opacity-70 pointer-events-none" : ""
                        }`}
                      >
                        {userDetails.dob instanceof Date &&
                        !isNaN(userDetails.dob.getTime())
                          ? format(userDetails.dob, "MM/dd/yyyy")
                          : "Pick a date"}
                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <DatePicker
                      selected={userDetails.dob}
                      onChange={(date: Date | null) => {
                        if (date) handleDateChange(date);
                      }}
                      showYearDropdown
                      showMonthDropdown
                      dropdownMode="select"
                      dateFormat="MM/dd/yyyy"
                      maxDate={new Date()}
                      minDate={new Date("1900-01-01")}
                      disabled={!isEditing}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      placeholderText="Pick a date"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-xs text-gray-500">
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={userDetails.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="border-gray-300"
                />
              </div>

              {/* PhoneNumber */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs text-gray-500">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={userDetails.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="border-gray-300"
                />
              </div>
            </div>

            <div className="pt-6">
              <ImageUpload
                onUploadComplete={(url: string) => {
                  setUserDetails((prev) => ({ ...prev, profile_image: url }));
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <Button
                onClick={handleSaveChanges}
                className="bg-emerald-700 hover:bg-emerald-800 text-white"
                disabled={!isEditing || isLoading}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
              <Button
                variant="outline"
                className="border-emerald-700 text-emerald-700 hover:bg-emerald-50"
                onClick={toggleEdit}
                disabled={isLoading}
              >
                <Pencil className="mr-2 h-4 w-4" />
                {isEditing ? "Cancel Edit" : "Edit Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Details Card */}
        <Card className="py-4">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-emerald-800">
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Account ID, Email, Phone */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium text-emerald-800 mb-1">
                    Account ID
                  </h3>
                  <p className="text-gray-700">{accountDetails.accountId}</p>
                </div>
                <div>
                  <h3 className="font-medium text-emerald-800 mb-1">
                    Account Email
                  </h3>
                  <p className="text-gray-700">{accountDetails.accountEmail}</p>
                </div>
                <div>
                  <h3 className="font-medium text-emerald-800 mb-1">
                    Phone Number
                  </h3>
                  <p className="text-gray-700">{accountDetails.phoneNumber}</p>
                </div>
              </div>

              <Separator />

              {/* Account Security */}
              <div>
                <h3 className="font-medium text-emerald-800 mb-4">
                  Account Security
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-gray-700 mb-2">Password</h4>
                    <Button
                      className="bg-emerald-700 hover:bg-emerald-800 text-white"
                      onClick={() => setIsPasswordModalOpen(true)}
                    >
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Password Change Modal */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-emerald-800">
              Change Password
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  name="oldPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Current Password"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.oldPassword && (
                <p className="text-sm text-red-500">{errors.oldPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Input
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-red-500">{errors.newPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <p className="text-xs text-gray-500">
              Password must be at least 8 characters
            </p>
          </div>

          <DialogFooter>
            <Button
              onClick={handlePasswordSubmit}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white"
              disabled={isPendingPassword}
            >
              {isPendingPassword ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Saving...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
