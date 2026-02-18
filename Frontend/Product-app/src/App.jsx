import AddPro from "./Pages/AddPro.jsx";
import Admin from "./Pages/Adminpage.jsx";
import Login from "./Pages/Login.jsx";
import ProductDetail from "./Pages/ProductDetails.jsx";
import ProductPage from "./Pages/ProductPage.jsx";
import Reg from "./Pages/Reg.jsx";
import { Navigate, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Navigate to="/login"/>}/>
         <Route path="/reg" element={<Reg/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/productpage" element={<ProductPage/>} />
        <Route path="/productdetail/:id" element={<ProductDetail/>} />
         <Route path="/admin" element={<Admin/>} />
        <Route path="/admin/add-pro" element={<AddPro/>} />


      </Routes>
  
  );
}
