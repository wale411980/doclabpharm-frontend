export type Pharmacy = {
  id: string;
  uuid: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  about: null;
  status: "active" | "inactive";
  emailVerifiedAt: string;
  certifications: string;
  experience: string;
  profileImage: string | null;
  city: string;
  state: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  userType: string;
}

export type PharmacyOrderItem = {
  id: number
  orderId: number
  serviceType: string
  serviceId: number
  giverId: number
  quantity: number
  price: string
  status: string
  createdAt: string
  updatedAt: string
  medicine: {
    id: number
    name: string
    price: number
    userId: number
  }
};

export type PharmacyStats = {
  balance: number;
  revenueToday: number;
  availableMedicine: number;
  medicineLow: number;
}

export type PharmacyWallet = {
  id: number;
  balance: number;
  ownerId: number;
  histories: [
    {
      id: number;
      walletId: number;
      amount: number;
      type: string;
      status: string;
      reference: string;
      trxNo: null,
      description: string;
      createdAt: string;
      updatedAt: string;
    }
  ]
}

export type PharmacyWalletHistories = {
  id: number;
  walletId: number;
  amount: number;
  type: string;
  status: string;
  reference: string;
  trxNo: null,
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type UpdatePharmacy = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  certifications: string;
  experience: string;
  profile_image: string;
  address: string;
  city: string;
  worktime: string;
  state: string;

}

export type PharmacyMedicineCategory = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type AddPharmacyMedicineCategory = {
  name: string;
}

export type UpdatePharmacyMedicineCategory = {
  id: number;
  name: string;
}

export type PharmacyMedicine = {
  id: number;
  name: string;
  volume: string;
  details: string;
  userId: number;
  medicineCategoryId: number;
  type: string;
  quantity: number;
  price: number;
  status: string;
  expirationDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
}

export type AddPharmacyMedicine = {
    name: string;
    volume: string;
    details: string;
    quantity: number;
    medicineCategoryId: number;
    price: number;
    status: string;
    type: string;
    expirationDate: string;

}

export type UpdatePharmacyMedicine = {
  id: number
    name: string;
    volume: string;
    details: string;
    quantity: number;
    medicineCategoryId: number;
    price: number;
    status: string;
    type: string;
    expirationDate: string;

}

export type PharmacyOrders = {

      id: number;
      userId: number;
      orderTrx: string;
      status: string;
      totalAmount: string;
      paymentMethod: string;
      createdAt: string;
      updatedAt: string;
      totalSum: number;
      user: {
        id: string;
        firstName: string;
        lastName: string;
        profileImage: string;
        phone: string;
        address: string;
        state: string;
        city: string;
        classtype: "MydocLab\\Models\\User",
        age: null
      },
      items: [
        {
          id: number;
          orderId: number;
          serviceType: string;
          serviceId: number;
          giverId: number;
          quantity: number;
          price: string;
          status: string;
          createdAt: string;
          updatedAt: string;
          medicine: {
            id: number;
            name: string;
            price: number;
            userId: number;
          }
        }
      ]
  
}

export type PharmacyOrderDetails = {

  id: number;
  userId: number;
  orderTrx: string;
  status: string;
  totalAmount: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  totalSum: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    profileImage: string;
    address: string;
    state: string;
    city: string;
    classtype: "MydocLab\\Models\\User",
    age: null
  },
  items: [
    {
      id: number;
      orderId: number;
      serviceType: string;
      serviceId: number;
      giverId: number;
      quantity: number;
      price: string;
      status: string;
      createdAt: string;
      updatedAt: string;
      medicine: {
        id: 1,
        name: string;
        price: number;
        userId: number;
      }
    }
  ]

}
