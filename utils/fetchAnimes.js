const { default: axios } = require('axios');
const config = require('../config');

module.exports = async (fetchDay) => {
	const { data: schedule, status } = await axios.get(config.animeUrl, {
		headers: {
			Authorization: config.animeToken,
		},
	});

	if (status !== 200)
		throw new Error('Error al obtener el calendario de animes');

	const animeSchedules = schedule
		.filter((anime) => {
			const {
				status,
				episodeDate,
				donghua,
				airType,
				mediaTypes: { route },
			} = anime;
			let animeDay = new Date(episodeDate).getDay();
			return (
				status === 'Ongoing' &&
				!donghua &&
				airType === 'sub' &&
				route !== 'ona' &&
				animeDay === fetchDay
			);
		})
		.map((anime) => ({
			title: anime.title,
			status: anime.status,
			episode: anime.episodeNumber,
			totalEpisodes: anime.episodes,
			image: anime.imageVersionRoute,
			airingStatus: anime.airingStatus,
			time: anime.episodeDate.split('T')[1].split(':').slice(0, 2).join(':'),
		}));
	return animeSchedules;
};
