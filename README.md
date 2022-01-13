# SvelteKit Lambda CDK Adapter

This is just an example right now and not a published package. We have a version we were using before the Januar 2022 breaking changes to SvelteKit adapters (multiple entry points and url param).

This is the work-in-progress to be able to deploy SvelteKit 1.0.0-next.218+ to AWS Lambda.

There is not an official AWS Lambda adapter so we built a custom one and wanted to share it with the Svelte community for feedback.

We import this adapter and add it to svelte.config.js and run `svelte-kit build`. The adapter will output build files to the specified "out" folder in the config. Default out location is the "build" folder in the current working directory from where you build your SvelteKit project.

It additionally create a routes.json file at `build/lambda/routes.json`. The JSON data is an object that maps API Gateway paths to the built nodejs entries.

It currently builds for a NodeJS 14 runtime in the ESBuild settings.

## CDK Deployment ##

We then run a deploy to our AWS account using our CDK stack. Here is an excerpt of our CDK code that deploys SvelteKit.

We first deploy all of the static files to an S3 Bucket. Note: `buildPath` var below is set to the absolute filepath on the local machine to the `build` folder where our adapter output our built files.

```
new BucketDeployment(this, "PrerenderedBucketDeployment", {
    sources: [Source.asset(`${buildPath}/prerendered`)],
    destinationBucket: staticBucket,
    cacheControl: [
    CacheControl.fromString("max-age=0,no-cache,no-store,must-revalidate"),
    ],
    prune: false,
    retainOnDelete: true,
});

new BucketDeployment(this, "StaticBucketDeployment", {
    sources: [Source.asset(`${buildPath}/static`)],
    destinationBucket: staticBucket,
    cacheControl: [
    CacheControl.fromString("max-age=0,no-cache,no-store,must-revalidate"),
    ],
    prune: false,
    retainOnDelete: true,
});

new BucketDeployment(this, "ClientBucketDeployment", {
    sources: [Source.asset(`${buildPath}/client`)],
    destinationBucket: staticBucket,
    cacheControl: [
    CacheControl.fromString("max-age=31536000,public,immutable"),
    ],
    prune: false,
    retainOnDelete: true,
});
```


Then we create a code asset for the build/lambda folder:
```
const lambdaCode = new lambda.AssetCode(`${buildPath}/lambda`);
```

And then we load the routes.json and loop through each entry and add a route to our API Gateway:

```
const routesToHandler = JSON.parse(
    fs.readFileSync(`${buildPath}/lambda/routes.json`).toString()
) as { [key: string]: string };
Object.entries(routesToHandler).forEach(([route, serverPath]) => {
    const handler = new lambda.Function(
        this,
        `SvelteKitHandler-${serverPath}`,
        {
            code: lambdaCode,
            handler: `${serverPath}.handler`,
            runtime: lambda.Runtime.NODEJS_14_X,
            timeout: Duration.seconds(300),
        }
    );
    api.addRoutes({
        path: route,
        methods: [gw.HttpMethod.ANY],
        integration: new HttpLambdaIntegration(
            "SvelteKitIntegration",
            handler,
            {
            payloadFormatVersion: gw.PayloadFormatVersion.VERSION_2_0,
            }
        ),
    });
});

