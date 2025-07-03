export class UserRegister {
  userId?: number;
  emailId: string;
  fullName: string;
  password: string;

  constructor() {
    this.userId = 0;
    this.emailId = '';
    this.fullName = '';
    this.password = '';
  }
}

export class UserLogin {
  emailId: string;
  password: string;

  constructor() {
    this.emailId = '';
    this.password = '';
  }
}

export interface LoginResponse {
  message: string;
  result: boolean;
  data: {
    userId: number;
    emailId: string;
    token: string;
    refreshToken: string;
  };
}
export interface SignUpResponse {
  message: string;
  result: boolean;
  data: {
    userId: number;
    emailId: string;
    fullName: string,
    password: string
  };
}

export interface User {
  userId: number;
  userName: string | null;
  emailId: string;
  fullName: string;
  role: string | null;
  createdDate: string; 
  password: string;
  projectName: string;
  refreshToken: string | null;
  refreshTokenExpiryTime: string | null; 
}
export interface PaginatedUserResponse {
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  data: User[];
}
