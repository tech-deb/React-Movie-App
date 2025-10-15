import { Client, Databases, ID, Query, TablesDB } from "appwrite";
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const client = new Client()
	.setEndpoint("https://cloud.appwrite.io/v1")
	.setProject(PROJECT_ID);
const database = new TablesDB(client);

export const updateSearchCount = async (searchTerm, movie) => {
	try {
		const result = await database.listRows({
			databaseId: DATABASE_ID,
			tableId: COLLECTION_ID,
			queries: [Query.equal("searchTerm", searchTerm)],
		});
		if (result.rows?.length > 0) {
			const doc = result.rows[0];
			await database.incrementRowColumn({
				databaseId: DATABASE_ID,
				tableId: COLLECTION_ID,
				rowId: doc.$id,
				column: "count",
				value: 1,
			});
		} else {
			await database.createRow({
				databaseId: DATABASE_ID,
				tableId: COLLECTION_ID,
				rowId: ID.unique(),
				data: {
					searchTerm,
					count: 1,
					movie_id: movie.id,
					poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
				},
			});
		}
	} catch (error) {
		console.error(error);
	}
};

export const getTrendingMovies = async () => {
	try {
		const result = await database.listRows({
			databaseId: DATABASE_ID,
			tableId: COLLECTION_ID,
			queries: [Query.limit(5), Query.orderDesc("count")],
		});
		return result.rows;
	} catch (error) {
		console.log(error);
	}
};
