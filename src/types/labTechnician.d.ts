export type LabTechnician = {
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



export type DiagnosticService = {
        id: string;
        name: string;
        details: string;
        price: number;
        turnaround: string;
        status: string;
}

export type EditDiagnosticService = {
        name: string;
        turnaround: string;
        details: string;
        groupType: string;
        diagnosisCategoryId: number;
        price: number;
        status: string;}

export type AddDiagnosticService = {
        id: number;
    name: string;
    turnaround: string;
    details: string;
    groupType: string;
    diagnosisCategoryId: number;
    price: number;
    status: string;
}


export type LabTechnicianStats = {
        appointment: number;
        patients: number;
        totalDiagnosis: number;
}

export type LabTechnicianWallet = {
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

export type LabTechnicianWalletHistories = {
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

export type UpdateLabTechnician = {
        firstName: string;
        lastName: string;
        phoneNumber: string;
        email: string;
        certifications: string;
        experience: string;
        profile_image: string;
        address: string;
        city: string;
        state: string;
        about: string;
}

export type PatientReports = {


        id: number;
        userId: number;
        diagnosisId: number;
        doctorId: number;
        bookingId: number;
        labTechnicianId: number;
        status: "normal" | "abnormal" | "critical" | "pending"
        imageUrl: string;
        summary: string;
        createdAt: string;
        updatedAt: string;
        user: {
                id: string;
                firstName: string;
                lastName: string;
                classtype: string;
                age: null
        },
        doctor: {
                id: number;
                firstName: string;
                lastName: string;
        },
        diagnosis: {
                id: number;
                name: string;
        }


}

export type PatientReportsById = {

        id: number;
        userId: number;
        diagnosisId: number;
        doctorId: number;
        bookingId: number;
        labTechnicianId: number;
        status: string;
        imageUrl: string;
        summary: string;
        createdAt: string;
        updatedAt: string;
        user: {
                id: string;
                firstName: string;
                lastName: string;
                classtype: string;
                age: null
        },
        doctor: {
                id: number;
                firstName: string;
                lastName: string;
        },
        diagnosis: {
                id: number;
                name: string;
        }

}

export type MostRecentAppointments = {

        id: number;
        userId: number;
        diagnosisId: number;
        orderId: number;
        labTechnicianId: number;
        status: "scheduled" | "rescheduled" | "completed" | "canceled";
        date: string;
        time: string;
        createdAt: string;
        updatedAt: string;
        user: {
            id: number;
            firstName: string;
            lastName: string;
            profileImage: string;
            classtype: "MydocLab\\Models\\User",
            age: null
        },
        diagnosis: {
            id: number;
            name: string;
            categoryName: null,
            category: null
        }

}

export type GetAllPatientsLab = {
        id: number;
        userId: number;
        diagnosisId: number;
        doctorId: number;
        bookingId: number;
        labTechnicianId: number;
        status: "normal" | "abnormal" | "critical" | "pending";
        imageUrl: string;
        summary: string;
        createdAt: string;
        updatedAt: string;
        user: {
                id: string;
                uuid: string;
                firstName: string;
                lastName: string;
                gender: string;
                dob: string;
                email: string;
                phone: string;
                profileImage: string;
                status: "active" | "suspended" | "unverified" | "banned";
                emailVerifiedAt: string;
                accountId: string;
                city: string;
                state: string;
                address: string,
                createdAt: string;
                updatedAt: string;
                deletedAt: null,
                classtype: "MydocLab\\Models\\User",
                age: number;
        }
}

export type DiagnosisList = {

        id: number;
        name: string;
        details: string;
        userId: number;
        diagnosisCategoryId: number;
        turnaround: string;
        price: number;
        groupType: string;
        status: string;
        createdAt: string;
        updatedAt: string;
        deletedAt: null,
        categoryName: string;
        category: {
            id: number;
            name: string;
            createdAt: string;
            updatedAt: string;
        }

}

export type AddDiagnosisList = {

    name: string;
    turnaround: string;
    details: string;
    groupType: string; 
    diagnosisCategoryId: number;
    price: number;
    status: "active" | "inactive"; //active or inactive

}

export type GetDiagnosisCategory = {
   
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;

}

export type AddDiagnosisCategory = {
        id: number;
    name: string;
        
}

export type ReportsUpdate = {
  userId: number;
  diagnosisId: number;
  status: string;
  imageUrl: string;
  summary: string;
}

export type ReportsAdd = {
  userId: number;
  diagnosisId: number;
  bookingId: number;
  status: string;
  imageUrl: string;
  summary: string;
}
