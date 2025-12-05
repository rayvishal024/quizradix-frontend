import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage, RegisterEmailPage, OtpVerifyPage, RegisterPage } from "../../index.js";

export default function AppRoutes() {
     return (
          <BrowserRouter>
               <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    {/* Registration Flow */}
                    <Route path="/register-email" element={<RegisterEmailPage />} />
                    <Route path="/verify-otp" element={<OtpVerifyPage />} />
                    <Route path="/register" element={<RegisterPage />} />

              </Routes>
          </BrowserRouter>
   )
}