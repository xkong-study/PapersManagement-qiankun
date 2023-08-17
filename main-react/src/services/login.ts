import axios from 'axios';

export type LoginParamsType = {
  userName: string;
  password: string;
};

export type RegisterParamsType = {
  email: string;
  password: string;
  username: string;
  signature: string;
  role: string;
  status: string;
  token: string;
  avatar: string;
  registerTime: string;
  timeZone: string;
};


export async function fakeAccountLogin(params: LoginParamsType) {
  // Use the provided API endpoint and send the request with axios
  console.log(params.userName, params.password);
  const response = await axios.post('http://localhost:8000/api/auth/login', {
    email: params.userName,
    password: params.password,
  });
  console.log("Response in fakeAccountLogin: ", response.data)
  return response.data; // Return the data from the response
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function register(params: RegisterParamsType): Promise<any> {
  const currentTime = new Date().toISOString();
  const timeZone = "UTC+1";
  params.registerTime = currentTime;
  params.timeZone = timeZone;
  console.log(params);
  const response = await axios.post('http://localhost:8000/api/auth/register', {
    email: params.email,
    password: params.password,
    username: params.username,
    signature: params.signature,
    role: params.role,
    status: params.status,
    token: params.token,
    avatar: params.avatar,
    registerTime: params.registerTime,
    timeZone: params.timeZone,
  });
  return response.data;
}
