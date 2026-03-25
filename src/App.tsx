/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Layout } from "./components/layout"
import { Overview } from "./pages/overview"
import { AppsHistory } from "./pages/apps-history"
import { Analytics } from "./pages/analytics"
import { ReviewQueue } from "./pages/review-queue"
import { UpdateCenter } from "./pages/update-center"
import { SetupAgent } from "./pages/setup-agent"
import { ApkTester } from "./pages/apk-tester"
import { AdminPro } from "./pages/admin-pro"
import { GitHubRepos } from "./pages/github-repos"
import { AppManager } from "./pages/app-manager"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Overview />} />
          <Route path="setup" element={<SetupAgent />} />
          <Route path="history" element={<AppsHistory />} />
          <Route path="analytics/:id" element={<Analytics />} />
          <Route path="review" element={<ReviewQueue />} />
          <Route path="updates" element={<UpdateCenter />} />
          <Route path="apk-tester" element={<ApkTester />} />
          <Route path="github-repos" element={<GitHubRepos />} />
          <Route path="app-manager" element={<AppManager />} />
          <Route path="admin-pro" element={<AdminPro />} />
        </Route>
      </Routes>
    </Router>
  )
}
