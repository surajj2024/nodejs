const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    personalInformation: {
        fullName: {
            type: String,
            required: true
        },
        team: {
            type: String,
            required: true
        },
        profile: {
            type: String,
            required: true
        },
        employeeID: {
            type: String,
            required: true
        },
        DateOfJoin: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        birthday: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        reportsTo: {
            type: String,
            required: true
        },
        passportNumber: {
            type: String,
            required: true
        },
        PassportExpDate: {
            type: String,
            required: true
        },
        nationality: {
            type: String,
            required: true
        },
        religion: {
            type: String,
            required: true
        },
        maritalStatus: {
            type: String,
            required: true
        },
        employmentOfSpouse: {
            type: String,
            required: true
        },
        NoOfChildren: {
            type: Number,
            required: true
        }
    },
    emergencyContact: {
        primary: {
            name: {
                type: String,
                required: true
            },
            relationship: {
                type: String,
                required: true
            },
            phoneNumber: {
                type: String,
                required: true
            }
        },
        secondary: {
            name: {
                type: String,
                required: true
            },
            relationship: {
                type: String,
                required: true
            },
            phoneNumber: {
                type: String,
                required: true
            }
        }
    },
    bankInformation: {
        bankName: {
            type: String,
            required: true
        },
        bankAccountNumber: {
            type: String,
            required: true
        },
        ifscCode: {
            type: String,
            required: true
        },
        PanNo: {
            type: String,
            required: true
        }
    },
    familyInformation: {

        name: {
            type: String,
            required: true
        },
        relationship: {
            type: String,
            required: true
        },
        dob: {
            type: Date,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        maritalStatus: String,
        spouseName: String,
        numberOfChildren: Number,
        children: [{
            name: String,
            dateOfBirth: Date,
        }],
    },
    educationInformation: [{
        institution: {
            type: String,
            required: true
        },
        degree: {
            type: String,
            required: true
        },
        fieldOfStudy: {
            type: String,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },

    }],
    experience: [{
        company: {
            type: String,
            required: true
        },
        jobTitle: {
            type: String,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        responsibilities: {
            type: String,
            required: true
        },
    }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;