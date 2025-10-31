const { app } = require('@azure/functions');
const { TableClient } = require('@azure/data-tables');

const connectionString = process.env.AzureWebJobsStorage;

app.http('UpdateMatch', {
    methods: ['POST', 'PUT'],
    authLevel: 'anonymous',
    route: 'matches',
    handler: async (request, context) => {
        try {
            const matchData = await request.json();

            // Validate required fields
            if (!matchData.division || !matchData.group || matchData.matchIndex === undefined) {
                return {
                    status: 400,
                    body: JSON.stringify({ error: 'Missing required fields: division, group, matchIndex' })
                };
            }

            const tableClient = TableClient.fromConnectionString(
                connectionString,
                'kccMatches'
            );

            // Create table if it doesn't exist
            await tableClient.createTable();

            // Use division-group-matchIndex as unique key
            const partitionKey = `${matchData.division}_${matchData.group}`;
            const rowKey = `match_${matchData.matchIndex}`;

            const entity = {
                partitionKey,
                rowKey,
                division: matchData.division,
                group: matchData.group,
                matchIndex: matchData.matchIndex,
                homeScore: matchData.homeScore || 0,
                awayScore: matchData.awayScore || 0,
                matchPlayed: matchData.matchPlayed || 'N',
                date: matchData.date || '',
                time: matchData.time || '',
                field: matchData.field || ''
            };

            // Upsert the entity (create or update)
            await tableClient.upsertEntity(entity);

            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ success: true, entity })
            };
        } catch (error) {
            context.error('Error updating match:', error);
            return {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ error: 'Failed to update match', details: error.message })
            };
        }
    }
});
{
  "name": "screen-board-api",
  "version": "1.0.0",
  "description": "Azure Functions API for Screen Board",
  "scripts": {
    "start": "func start",
    "test": "echo \"No tests yet\""
  },
  "dependencies": {
    "@azure/functions": "^4.0.0",
    "@azure/data-tables": "^13.2.2"
  },
  "devDependencies": {
    "@azure/functions-core-tools": "^4.0.5"
  }
}

