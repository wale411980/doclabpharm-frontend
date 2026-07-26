export function getDashboardPath(userType: string | undefined): string {
  switch (userType?.toLowerCase()) {
    case "doctor":
      return "/doctor/dashboard";
    case "pharmacy":
      return "/pharmacy/dashboard";
    case "lab_technician":
      return "/lab_technician/dashboard";
    case "admin":
      return "/admin/dashboard";
    case "super_admin":
      return "/super-admin/dashboard";
    default:
      return "/user/dashboard";
  }
}
