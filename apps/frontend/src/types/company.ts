export interface CompanyAdminData {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationalityId: number;
  documentNumber: string;
}

export interface CreateCompanyDto {
  name: string;
  legalName?: string;
  registrationNumber?: string;
  email: string;
  phone: string;
  websiteUrl?: string;
  logoUrl?: string;
  registerDate: string;
  languageId?: number;
  adminData: CompanyAdminData;
}

export interface Company {
  id: number;
  name: string;
  legalName?: string;
  registrationNumber?: string;
  email: string;
  phone: string;
  websiteUrl?: string;
  logoUrl?: string;
  registerDate: string;
  languageId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Language {
  id: number;
  code: string;
  name: string;
}

export interface Country {
  id: number;
  name: string;
  code: string;
}
