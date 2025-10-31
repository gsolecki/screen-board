const { TableClient } = require('@azure/data-tables');

// Get connection string from environment variable
const connectionString = process.env.AzureWebJobsStorage;

module.exports = async function (context, req) {
    context.log('GetMatchData function triggered');

    try {
        if (!connectionString) {
            context.log.error('AzureWebJobsStorage connection string is not configured');
            context.res = {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ error: 'Storage connection not configured' })
            };
            return;
        }

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

        context.log(`Retrieved ${entities.length} matches from storage`);

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(entities)
        };
    } catch (error) {
        context.log.error('Error fetching match data:', error);
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Failed to fetch match data',
                message: error.message
            })
        };
    }
};

