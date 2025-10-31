const { TableClient } = require('@azure/data-tables');

const connectionString = process.env.AzureWebJobsStorage;

module.exports = async function (context, req) {
    context.log('UpdateMatch function triggered');

    try {
        const matchData = req.body;

        // Validate required fields
        if (!matchData || !matchData.division || !matchData.group || matchData.matchIndex === undefined) {
            context.res = {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ error: 'Missing required fields: division, group, matchIndex' })
            };
            return;
        }

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

        // Create table if it doesn't exist
        try {
            await tableClient.createTable();
        } catch (err) {
            // Table might already exist, that's ok
            if (err.statusCode !== 409) {
                throw err;
            }
        }

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

        context.log(`Match updated: ${partitionKey}/${rowKey}`);

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ success: true, entity })
        };
    } catch (error) {
        context.log.error('Error updating match:', error);
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Failed to update match',
                message: error.message
            })
        };
    }
};
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

