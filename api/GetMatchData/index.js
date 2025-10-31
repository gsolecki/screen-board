const { app } = require('@azure/functions');
const { TableClient } = require('@azure/data-tables');

// Get connection string from environment variable
const connectionString = process.env.AzureWebJobsStorage;

app.http('GetMatchData', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'matches',
    handler: async (request, context) => {
        try {
            const tableClient = TableClient.fromConnectionString(
                connectionString,
                'kccMatches'
            );

            // Get all match results from table storage
            const entities = [];
            for await (const entity of tableClient.listEntities()) {
                entities.push({
                    division: entity.division,
                    group: entity.group,
                    matchIndex: entity.matchIndex,
                    homeScore: entity.homeScore,
                    awayScore: entity.awayScore,
                    matchPlayed: entity.matchPlayed,
                    date: entity.date,
                    time: entity.time,
                    field: entity.field,
                    lastUpdated: entity.timestamp
                });
            }

            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(entities)
            };
        } catch (error) {
            context.error('Error fetching match data:', error);
            return {
                status: 500,
                body: JSON.stringify({ error: 'Failed to fetch match data' })
            };
        }
    }
});

