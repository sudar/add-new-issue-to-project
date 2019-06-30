const { Toolkit } = require( 'actions-toolkit' )

// Run your GitHub Action!
Toolkit.run( async tools => {
	try {
		const { action, issue } = tools.context.payload;

		if ( action !== 'opened' ) {
			tools.exit.neutral( `Event ${action} is not supported by this action.` )
		}

		const secret = process.env.GITHUB_PRIVATE_TOKEN ? process.env.GITHUB_PRIVATE_TOKEN : process.env.GITHUB_TOKEN;

		const columnId = 4803224;
		const projectName = 'TBD';
		const columnName = 'TBD';

		const createCard = new Promise( async ( resolve, reject ) => {
			try {
				await tools.github.graphql( {
					query: `mutation {
					  addProjectCard( input: { contentId: "${issue.node_id}", projectColumnId: "${columnId}" }) {
						clientMutationId
					  }
					}`,
					headers: {
						authorization: `token ${secret}`
					}
				} );

				resolve();
			} catch ( error ) {
				reject( error );
			}
		} )

		// Wait for completion
		await Promise.all( createCard ).catch( error => tools.exit.failure( error ) );

		// Log success message
		tools.log.success(
			`Added pull request ${issue.title} to ${projectName} in ${columnName}.`
		);

	} catch ( error ) {
		tools.exit.failure( error );
	}
} ), {
	event: [ 'issues' ],
	secrets: [ 'GITHUB_TOKEN' ],
}
