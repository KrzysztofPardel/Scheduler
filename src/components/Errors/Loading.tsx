import Box from '@mui/material/Box';
import CircularProgress from '@mui/joy/CircularProgress';
import Typography from '@mui/joy/Typography';
import Container from '@mui/material/Container';

const Loading = () => {
	return (
		<Container maxWidth="sm" sx={{ height: '100vh', display: 'felx', alignItems: 'center' }}>
			<Box
				sx={{
					bgcolor: '#1d72d3',
					height: '100vh',
					opacity: '0.5',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
				}}
			>
				<Typography level="h1" margin="1rem">
					Loading
				</Typography>
				<CircularProgress variant="soft" size="lg" />
			</Box>
		</Container>
	);
};

export default Loading;
