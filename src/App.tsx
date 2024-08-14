import 'devextreme/dist/css/dx.light.css';
import { useRoutes } from 'react-router-dom';
import CalendarScheduler from './components/Scheduler/Scheduler';

function App() {
	let element = useRoutes([
		{
			path: '/',
			element: <CalendarScheduler />,
		},
	]);
	return element;
}

export default App;
