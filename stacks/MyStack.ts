import { StackContext, Api, Function } from "sst/constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
// import * as lambda from "aws-cdk-lib/aws-lambda";
// const layerArn = "arn:aws:lambda:us-east-1:764866452798:layer:chrome-aws-lambda:22";



export function API({ stack }: StackContext) {
   const layerChromium = new lambda.LayerVersion(stack, "chromiumLayers", {
    code: lambda.Code.fromAsset("layers/chromium"),
  });

  const api = new Api(stack, "api", {
    routes: {
      // "GET /": "packages/functions/src/lambda.handler",
      "GET /": {
        function: {
          handler: "packages/functions/src/lambda.handler",
          timeout: 15,
          memorySize: "2 GB",
          nodejs: {
            esbuild: {
              external: ["@sparticuz/chromium"],
            },
          },
          layers: [
            layerChromium
          ],
        },
      }
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
