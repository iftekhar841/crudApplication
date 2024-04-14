import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserTable from './UserTable';
import LoginForm from './LoginForm';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* Specify the element or component for the root route */}
          <Route path="/" element={<LoginForm />} />
          <Route path="/users" element={<UserTable />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
