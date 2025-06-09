let newsByGenre = {
    politics: [],
    technology: [],
    entertainment: [],
};

async function fetchNews(category, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

            const response = await fetch(
                `https://newsdata.io/api/1/news?apikey=${process.env.API_KEY}&country=in&language=en&category=${category}`,
                {
                    method: "GET",
                    signal: controller.signal,
                    headers: {
                        'Accept': 'application/json',
                    }
                }
            );

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // Add category to each news item
            return (data.results || []).map(item => ({
                ...item,
                category: category
            }));
        } catch (error) {
            console.error(`Attempt ${i + 1} failed for ${category}:`, error.message);
            if (i === retries - 1) {
                console.error(`All retry attempts failed for ${category}`);
                return []; // Return empty array if all retries fail
            }
            // Wait for 2 seconds before retrying
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}

async function getPolitics() {
    const res = await fetchNews("politics");
    newsByGenre.politics = res;
}

async function getTechnology() {
    const res = await fetchNews("technology");
    newsByGenre.technology = res;
}

async function getEntertainment() {
    const res = await fetchNews("entertainment");
    newsByGenre.entertainment = res;
}

async function getAllNews() {
    try {
        const [politics, technology, entertainment] = await Promise.all([
            fetchNews("politics"),
            fetchNews("technology"),
            fetchNews("entertainment"),
        ]);

        newsByGenre = {
            politics,
            technology,
            entertainment,
        };
    } catch (error) {
        console.error("Error fetching all news:", error);
        // Keep existing news if available
        if (!newsByGenre.politics.length) newsByGenre.politics = [];
        if (!newsByGenre.technology.length) newsByGenre.technology = [];
        if (!newsByGenre.entertainment.length) newsByGenre.entertainment = [];
    }
}

function getStoredNews() {
    return newsByGenre;
}

module.exports = {
    getPolitics,
    getTechnology,
    getEntertainment,
    getAllNews,
    getStoredNews,
};

