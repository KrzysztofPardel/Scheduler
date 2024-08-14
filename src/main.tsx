import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'devextreme/dist/css/dx.light.css';

const AppLazy = lazy(() => import('./App.tsx'));
const LoadingLazy = lazy(() => import('./components/Errors/Loading.tsx'));

createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<BrowserRouter>
			<Suspense fallback={<LoadingLazy />}>
				<AppLazy />
			</Suspense>
		</BrowserRouter>
	</React.StrictMode>
);
