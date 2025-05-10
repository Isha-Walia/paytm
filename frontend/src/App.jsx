import {BrowserRouter, Routes, Route, Link} from "react-router-dom"


function App() {
 
  return (
  <div>
   <BrowserRouter>
   <Routes>
    <Route path="/signup" element={<Signup/>}></Route>
    <Route path="/signin" element={<Signin/>}></Route>
    <Route path="/dashboard" element={<Dashboard/>}></Route>
    <Route path="/send" element={<Sendmoney/>}></Route>
   </Routes>
   </BrowserRouter>
  </div>
  )
}

export default App
