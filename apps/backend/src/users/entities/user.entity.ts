export class User {
  id: string;
  email: string;
  name: string;
  image: string | null;
  isActive: boolean;
  phoneId: number | null;
  createdAt: Date;
  dateOfBirth: Date | null;
  documentNumber: string | null;
  firstName: string | null;
  gender: string | null;
  lastName: string | null;
  nationalityId: number | null;
  passportCountryId: number | null;
  passportNumber: string | null;
  updatedAt: Date;
  languageId: number | null;
  currencyId: number | null;
  emergencyPhoneId: number | null;
}
