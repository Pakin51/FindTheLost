import { Route, Routes } from "react-router";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import PlaceholderPage from "./components/PlaceholderPage";
import ReportDetailPage from "./components/ReportDetailPage";
import NotFoundPage from "./components/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="reports/:id" element={<ReportDetailPage />} />
        <Route path="my-lost" element={<PlaceholderPage title="My lost" />} />
        <Route path="history" element={<PlaceholderPage title="History" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
