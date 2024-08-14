import React, { useCallback, useEffect, useState } from 'react';
import 'devextreme/dist/css/dx.light.css';
import { Scheduler, SchedulerTypes } from 'devextreme-react/scheduler';
import { Paper } from '@mui/material';
import { locale, loadMessages } from 'devextreme/localization';
import { doc, updateDoc, deleteDoc, addDoc, getDocs, query, collection } from 'firebase/firestore';
import db from '../firebase';

//Settings for the scheduler
const views: Array<'day' | 'week' | 'month'> = ['day', 'week', 'month'];

locale('pl');
loadMessages({
	pl: {
		Yes: 'Tak',
		No: 'Nie',
		Cancel: 'Odwołaj',
		Close: 'Zamknij',
		Clear: 'Wyczyść',
		Done: 'Dodaj',
		Loading: 'Ładowanie...',
		Select: 'Wybierz...',
		Search: 'Wyszukaj',
		Back: 'Wstecz',
		OK: 'OK',
		'dxScheduler-switcherDay': 'Dzień',
		'dxScheduler-switcherWeek': 'Tydzień',
		'dxScheduler-switcherMonth': 'Miesiąc',
		'dxScheduler-switcherAgenda': 'Agenda',
		'dxScheduler-allDay': 'Cały dzień',
		'dxCalendar-currentDay': 'Dzisiaj',
		'dxScheduler-editorLabelTitle': 'Temat',
		'dxScheduler-editorLabelStartDate': 'Początek',
		'dxScheduler-editorLabelEndDate': 'Koniec',
		'dxScheduler-editorLabelDescription': 'Opis',
		'dxScheduler-editorLabelRecurrence': 'Powtórz',
		'dxScheduler-recurrenceNever': 'Nigdy',
		'dxScheduler-recurrenceMinutely': 'Co minutę',
		'dxScheduler-recurrenceHourly': 'Co godzinę',
		'dxScheduler-recurrenceDaily': 'Codziennie',
		'dxScheduler-recurrenceWeekly': 'Co tydzień',
		'dxScheduler-recurrenceMonthly': 'Co miesiąc',
		'dxScheduler-recurrenceYearly': 'Co rok',
		'dxScheduler-recurrenceRepeatMinutely': 'minut(y)',
		'dxScheduler-recurrenceRepeatHourly': 'godzinę(y)',
		'dxScheduler-recurrenceRepeatDaily': 'dni',
		'dxScheduler-recurrenceRepeatWeekly': 'tydzień',
		'dxScheduler-recurrenceRepeatMonthly': 'miesiąc(e)',
		'dxScheduler-recurrenceRepeatYearly': 'lata',
		'dxScheduler-recurrenceRepeatEvery': 'Powtarzaj co',
		'dxScheduler-recurrenceRepeatOn': 'Włącz powtórki',
		'dxScheduler-recurrenceEnd': 'Wyłącz powtórki',
		'dxScheduler-recurrenceAfter': 'Powtarzaj',
		'dxScheduler-recurrenceOn': 'Zacznij',
		'dxScheduler-recurrenceRepeatOnDate': 'od dnia',
		'dxScheduler-recurrenceRepeatCount': 'razy',
	},
});

const CalendarScheduler: React.FC = () => {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [dataSource, setDataSource] = useState<any[]>([]); // Pusty stan dla dataSource

	const handlePropertyChange = useCallback((e: { name: string; value?: any }) => {
		if (e.name === 'currentDate' && e.value instanceof Date) {
			setCurrentDate(e.value);
		}
	}, []);

	const fetchEvents = async () => {
		const q = query(collection(db, 'events'));
		const querySnapshot = await getDocs(q);
		const eventsData = querySnapshot.docs.map((doc) => ({
			...doc.data(),
			id: doc.id,
			startDate: doc.data().startDate.toDate(), // Convert timestamp to Date object
			endDate: doc.data().endDate.toDate(), // Convert timestamp to Date object
		}));
		return eventsData;
	};

	useEffect(() => {
		const fetchData = async () => {
			const data = await fetchEvents();
			setDataSource(data);
		};
		fetchData();
	}, []);

	//Adding events
	const handleAppointmentAdded = async (e: SchedulerTypes.Appointment) => {
		const newEvent = {
			...e.appointmentData,
			startDate: new Date(e.appointmentData.startDate),
			endDate: new Date(e.appointmentData.endDate),
		};

		try {
			await addDoc(collection(db, 'events'), newEvent);
			console.log(newEvent);
			const data = await fetchEvents();
			setDataSource(data);
		} catch (error) {
			console.error('Nastąpił błąd w czasie dodawania wydarzenia do Firestore:', error);
		}
	};

	//Deleting event
	const handleAppointmentDeleted = async (e: SchedulerTypes.AppointmentDeletedEvent) => {
		console.log(e);
		const eventId = e.appointmentData.id;

		try {
			await deleteDoc(doc(db, 'events', eventId));
			console.log(`Element o ID ${eventId} został pomyślnie usunięty`);
			const data = await fetchEvents();
			setDataSource(data);
		} catch (error) {
			console.log('Błąd podczas usuwania wydarzenia', error);
		}
	};

	//Updating event
	const handleAppointmentUpdated = async (e: SchedulerTypes.AppointmentUpdatedEvent) => {
		console.log(e);
		const eventId = e.appointmentData.id;
		const updatedEvent = e.appointmentData;

		try {
			await updateDoc(doc(db, 'events', eventId), updatedEvent);
			console.log(`Element o ID ${eventId} został pomyślnie zaktualizowany`);
			const data = await fetchEvents();
			setDataSource(data);
		} catch (error) {
			console.log('Błąd podczas aktual wydarzenia', error);
		}
	};

	return (
		<Paper>
			<Scheduler
				id="scheduler"
				dataSource={dataSource}
				textExpr="title"
				allDayExpr="dayLong"
				recurrenceRuleExpr="recurrence"
				currentDate={currentDate}
				onOptionChanged={handlePropertyChange}
				defaultCurrentView="week"
				views={views}
				timeZone="Europe/Warsaw"
				adaptivityEnabled={true}
				onAppointmentAdded={handleAppointmentAdded}
				onAppointmentUpdated={handleAppointmentUpdated}
				onAppointmentDeleted={handleAppointmentDeleted}
			/>
		</Paper>
	);
};

export default CalendarScheduler;
