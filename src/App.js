import "./App.css";
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";

import MainPage from "./components/views/MainPage/MainPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import ErrorPage from "./components/views/ErrorPage/ErrorPage";
import LoadingPage from "./components/views/LoadingPage/LoadingPage";
import { useEffect, useState } from "react";

function App() {
	const [serverStatus, setServerStatus] = useState(null);
	
	useEffect(() => {
		axios.get(`${process.env.REACT_APP_API_URL}/`)
		.then(function(response) {
			setServerStatus(true);
		}).catch(function(error) {
			setServerStatus(false);
		});
	}, []);

	if (serverStatus === null) {
		// 비동기 요청이 아직 완료되지 않음 (로딩 페이지)
		return <LoadingPage />;
	}
	return (
		<Router>
			<Routes>
				{serverStatus ? (
					<>
						<Route path="/" element={<MainPage />} />
						<Route path="/register" element={<RegisterPage />} />
						<Route path="/login" element={<LoginPage />} />
					</>
				) : (
					<Route path="/" element={<ErrorPage />} />
				)}
			</Routes>
		</Router>
	);
}

export default App;
